import React, { useState } from "react";
import "./FileUploader.css";

const FileUploaderAndPredictor = ({ setResult = () => {} }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [prediction, setPrediction] = useState("");

  // Lida com o upload do arquivo e mostra a pré-visualização
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  // Converte a imagem carregada para JPEG usando canvas
  const convertImageToJpeg = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          // Converte para JPEG com qualidade 0.92 (ajuste se necessário)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const jpegFile = new File([blob], "converted.jpg", { type: "image/jpeg" });
                resolve(jpegFile);
              } else {
                reject(new Error("Falha ao converter a imagem."));
              }
            },
            "image/jpeg",
            0.92
          );
        };
        img.onerror = (error) => reject(error);
        img.src = event.target.result;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Função para chamar a API que realiza a inferência
  const handlePredict = async () => {
    if (!file) {
      console.warn("Nenhum arquivo selecionado!");
      return;
    }

    try {
      // Converte a imagem para JPEG
      const jpegFile = await convertImageToJpeg(file);

      // Cria um objeto FormData e anexa o arquivo convertido com a key "image"
      const formData = new FormData();
      formData.append("image", jpegFile);

      // Faz a chamada para a API de inferência
      const response = await fetch("https://minha-api-29487953624.us-east1.run.app/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro: ${response.status} - ${errorText}`);
      }

      // Interpreta o resultado da API (assumindo JSON com o campo "prediction")
      const result = await response.json();
      setPrediction(result.prediction);
      if (setResult) {
        setResult(result.prediction);
      }
    } catch (error) {
      console.error("Erro na inferência:", error);
      setPrediction("Erro na inferência");
      if (setResult) {
        setResult("Erro na inferência");
      }
    }
  };

  return (
    <div className="file-uploader">
      <h2>Descubra aqui!</h2>
      <p>Selecione uma imagem para análise</p>
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
