import React, { useState } from "react";
import "./Header.css";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="logo surrealista.png" alt="vz" />
        </div>
        {/* botão que só aparece em mobile */}
        <button
          className="hamburger"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
        {/* menu desktop */}
        <nav className="nav-desktop">
          <ul>
          <a href="https://vzforeal.com/" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          Home
        </a>
        <a href="https://vzforeal.com/collections/all" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          Catálogo
        </a>
        <a href="https://vzforeal.com/pages/contact" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          Contato
        </a>
          </ul>
        </nav>
      </header>

      {/* sidebar mobile */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <button
          className="close-btn"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <nav className="nav-mobile">
        <ul>
        <li><a href="https://vzforeal.com/" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          Home
        </a></li>
        <li><a href="https://vzforeal.com/collections/all" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          Catálogo
        </a></li>
        <li><a href="https://vzforeal.com/pages/contact" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          Contato
        </a></li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Header;
