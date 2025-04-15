// ShopifyBuyComponent.jsx
import React, { useEffect } from "react";

/* global ShopifyBuy */

const ShopifyBuyComponent = ({ prediction }) => {
  useEffect(() => {
    const scriptURL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    // Função para inicializar o Shopify Buy Button
    const ShopifyBuyInit = () => {
      if (window.ShopifyBuy && window.ShopifyBuy.UI) {
        const client = window.ShopifyBuy.buildClient({
          domain: "729a54-2.myshopify.com",
          storefrontAccessToken: "b277445e732e665d5ec88b5a38bbacc1",
        });

        window.ShopifyBuy.UI.onReady(client).then((ui) => {
          ui.createComponent("collection", {
            id: "494683914535",
            // Utiliza um container único para o botão
            node: document.getElementById("shopify-buy-button-container"),
            moneyFormat: "R%24 %7B%7Bamount_with_comma_separator%7D%7D",
            options: {
              product: {
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "calc(33.33333% - 30px)",
                      "margin-left": "30px",
                      "margin-bottom": "50px",
                      "width": "calc(33.33333% - 30px)",
                    },
                    img: {
                      height: "calc(100% - 15px)",
                      position: "absolute",
                      left: "0",
                      right: "0",
                      top: "0",
                    },
                    imgWrapper: {
                      "padding-top": "calc(75% + 15px)",
                      position: "relative",
                      height: "0",
                    },
                  },
                  button: {
                    ":hover": { "background-color": "#4716ac" },
                    "background-color": "#2a0d65",
                    ":focus": { "background-color": "#4716ac" },
                    "border-radius": "6px",
                  },
                },
                buttonDestination: "modal",
                contents: { options: false },
                text: { button: "View product" },
              },
              // Outras configurações para productSet, modalProduct, modal, cart, toggle...
              // (mantém as opções conforme sua implementação atual)
            },
          });
        });
      }
    };

    // Função para carregar o script se ainda não estiver presente
    const loadScript = () => {
      if (!document.querySelector(`script[src="${scriptURL}"]`)) {
        const script = document.createElement("script");
        script.async = true;
        script.src = scriptURL;
        script.onload = ShopifyBuyInit;
        document.head.appendChild(script);
      } else {
        ShopifyBuyInit();
      }
    };

    loadScript();
  }, []);

  return (
    <div>
      {/* Container único para o Shopify Buy Button */}
      <div id="shopify-buy-button-container"></div>

      {/* Renderização condicional baseada na variável "prediction" */}
      {prediction && (
        <div
          className="inference-snippet"
          style={{ border: "1px solid #2a0d65", padding: "1rem", marginTop: "20px" }}
        >
          {prediction === "Juliet" ? (
            <>
              <h2>Resposta: Juliet</h2>
              <p>Aqui está o snippet específico para Juliet.</p>
            </>
          ) : prediction === "Radar" ? (
            <>
              <h2>Resposta: Radar</h2>
              <p>Aqui está o snippet específico para Radar.</p>
            </>
          ) : (
            <>
              <h2>Resposta: Outro</h2>
              <p>Conteúdo para resposta: {prediction}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopifyBuyComponent;
