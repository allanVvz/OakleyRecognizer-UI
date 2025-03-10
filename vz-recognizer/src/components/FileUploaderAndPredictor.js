// src/components/FileUploaderAndPredictor.js
import React, { useState, useEffect } from "react";
import * as ort from "onnxruntime-web";
import "./FileUploader.css";

const FileUploaderAndPredictor = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [prediction, setPrediction] = useState("");
  const [session, setSession] = useState(null);

  // Carrega a sessão ONNX uma única vez ao montar o componente
  useEffect(() => {
    const loadSession = async () => {
      try {
        const sess = await ort.InferenceSession.create("swin_oculos_model3.onnx");
        setSession(sess);
        console.log("Sessão ONNX carregada com sucesso!");
      } catch (error) {
        console.error("Erro ao carregar a sessão ONNX:", error);
      }
    };
    loadSession();
  }, []);

  // Lida com o upload do arquivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  // Função para calcular estatísticas básicas de um array numérico
  const calcStats = (data) => {
    const n = data.length;
    let sum = 0, min = Infinity, max = -Infinity;
    for (let i = 0; i < n; i++) {
      const v = data[i];
      sum += v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const mean = sum / n;
    let varSum = 0;
    for (let i = 0; i < n; i++) {
      varSum += Math.pow(data[i] - mean, 2);
    }
    const std = Math.sqrt(varSum / n);
    return { mean, std, min, max };
  };

  // Função para converter a imagem em tensor replicando exatamente o pipeline do Python:
  // 1. Resize para 256x256,
  // 2. CenterCrop para 224x224,
  // 3. ToTensor (dividir por 255) e Normalize.
  const imageToTensor = async (img) => {
    // Configurações para suavização (para aproximar a interpolação do PIL)
    const smoothingEnabled = true;
    const smoothingQuality = "high";

    // Etapa 1: Resize para 256x256
    const resizeCanvas = document.createElement("canvas");
    resizeCanvas.width = 256;
    resizeCanvas.height = 256;
    const resizeCtx = resizeCanvas.getContext("2d");
    resizeCtx.imageSmoothingEnabled = smoothingEnabled;
    resizeCtx.imageSmoothingQuality = smoothingQuality;
    resizeCtx.drawImage(img, 0, 0, 256, 256);
    const resizedImageData = resizeCtx.getImageData(0, 0, 256, 256);
    // Converte os valores para [0,1] antes de calcular estatísticas
    const resizedPixels = Array.from(resizedImageData.data)
      .filter((_, i) => i % 4 !== 3)
      .map(v => v / 255.0);
    const statsResized = calcStats(resizedPixels);
    // Para comparar com Python (que exibe os valores em escala original), multiplique por 255:
    console.log(
      "Resized - Mean:",
      (statsResized.mean * 255).toFixed(4),
      "Std:",
      (statsResized.std * 255).toFixed(4)
    );

    // Etapa 2: CenterCrop para 224x224
    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = 224;
    cropCanvas.height = 224;
    const cropCtx = cropCanvas.getContext("2d");
    cropCtx.imageSmoothingEnabled = smoothingEnabled;
    cropCtx.imageSmoothingQuality = smoothingQuality;
    const startX = (256 - 224) / 2;
    const startY = (256 - 224) / 2;
    cropCtx.drawImage(resizeCanvas, startX, startY, 224, 224, 0, 0, 224, 224);
    const croppedImageData = cropCtx.getImageData(0, 0, 224, 224);
    const croppedPixels = Array.from(croppedImageData.data)
      .filter((_, i) => i % 4 !== 3)
      .map(v => v / 255.0);
    const statsCropped = calcStats(croppedPixels);
    console.log(
      "Cropped - Mean:",
      (statsCropped.mean * 255).toFixed(4),
      "Std:",
      (statsCropped.std * 255).toFixed(4)
    );

    // Etapa 3: ToTensor e Normalize
    // Cria um array Float32 para os 3 canais (R, G, B) no formato CHW
    const floatData = new Float32Array(3 * 224 * 224);
    const normMean = [0.485, 0.456, 0.406];
    const normStd = [0.229, 0.224, 0.225];
    // Para cada pixel (ignorando o canal alpha), converte para [0,1] e aplica a normalização:
    for (let i = 0, j = 0; i < croppedImageData.data.length; i += 4, j += 3) {
      const r = croppedImageData.data[i] / 255.0;
      const g = croppedImageData.data[i + 1] / 255.0;
      const b = croppedImageData.data[i + 2] / 255.0;
      floatData[j] = (r - normMean[0]) / normStd[0];
      floatData[j + 1] = (g - normMean[1]) / normStd[1];
      floatData[j + 2] = (b - normMean[2]) / normStd[2];
    }
    const statsNormalized = calcStats(Array.from(floatData));
    console.log(
      "Normalized - Mean:",
      statsNormalized.mean.toFixed(4),
      "Std:",
      statsNormalized.std.toFixed(4),
      "Min:",
      statsNormalized.min.toFixed(4),
      "Max:",
      statsNormalized.max.toFixed(4)
    );

    // Retorna o tensor no formato [1, 3, 224, 224]
    return new ort.Tensor("float32", floatData, [1, 3, 224, 224]);
  };

  // Função para executar a inferência usando o modelo ONNX
  const handlePredict = async () => {
    if (!file || !session) {
      console.warn("Arquivo ou sessão ainda não carregada!");
      return;
    }
    const img = new Image();
    img.src = previewUrl;
    img.onload = async () => {
      const inputTensor = await imageToTensor(img);
      console.log("Shape do tensor de entrada:", inputTensor.dims);

      const inputName = session.inputNames[0];
      const feeds = { [inputName]: inputTensor };

      const results = await session.run(feeds);
      console.log("Saída bruta do modelo ONNX:", results);

      const outputTensor = results.output;
      const outputData = outputTensor.data;
      const predictedIndex = outputData.indexOf(Math.max(...outputData));
      const classes = ["Juliet", "Radar"];
      setPrediction(classes[predictedIndex]);
    };
  };

  return (
    <div className="file-uploader">
      <h2>Upload e Análise de Imagem com ONNX</h2>
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: "300px" }} />
        </div>
      )}
      <button onClick={handlePredict} style={{ marginTop: "20px" }}>
        Analisar Imagem
      </button>
      {prediction && (
        <div className="result-box">
          <h3>Resultado: {prediction}</h3>
        </div>
      )}
    </div>
  );
};

export default FileUploaderAndPredictor;
