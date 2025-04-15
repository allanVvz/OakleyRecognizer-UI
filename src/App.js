
// src/App.js
import React, { useState } from "react";
import FileUploaderAndPredictor from "./components/FileUploaderAndPredictor";
import ShopifyBuyComponent from "./components/ShopifyAdd";
import Header from "./components/Header";
import "./App.css";

function App() {
  // Define o estado para prediction e sua função atualizadora
  const [prediction, setPrediction] = useState("");

  return (
    <div className="app-container">
      <Header />
      <div className="banner"></div>
      <h1 style={{ textAlign: "center" }}>What 'Lupa' are you looking for</h1>
      {/* Passe a função setPrediction para atualizar o estado de prediction */}
      <FileUploaderAndPredictor setPrediction={setPrediction} />
      {/* Passe o valor de prediction para o componente que mostra o Shopify Buy Button */}
      <ShopifyBuyComponent prediction={prediction} />
    </div>
  );
}

export default App;
