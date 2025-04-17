import React from "react";
import FileUploaderAndPredictor from "./components/FileUploaderAndPredictor";
import Header from "./components/Header";
import "./App.css"; // Certifique-se de que os estilos estão importados

function App() {
  return (
    <div className="app-container">
      <Header/>
      <div className="banner"></div>
      <h1 style={{ textAlign: "center" }}>What 'Lupa' are you looking for</h1>
      <FileUploaderAndPredictor />
    </div>
  );
}

export default App;
