import React, { useEffect } from "react";

/* global ShopifyBuy */

// Simplificado: carrega o SDK e monta a coleção certa conforme prediction
const ShopifyBuyComponent = ({ prediction }) => {
  useEffect(() => {
    if (!prediction) return;

    const DOMAIN = "729a54-2.myshopify.com";
    const TOKEN = "b277445e732e665d5ec88b5a38bbacc1";
    const scriptURL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    // Mapeia collections e containers
    const configs = {
      Radar: { id: "497786454311", container: "collection-component-1744679872360", options: {/* ... */} },
      Juliet:  { id: "497786421543", container: "collection-component-1744679923542", options: {/* ... */} },
      default: { id: "494683914535", container: "shopify-buy-button-container", options: {/* ... */} }
    };

    const { id, container, options } = configs[prediction] || configs.default;

    const initShopify = () => {
      const client = window.ShopifyBuy.buildClient({ domain: DOMAIN, storefrontAccessToken: TOKEN });
      window.ShopifyBuy.UI.onReady(client).then(ui => {
        ui.createComponent("collection", {
          id,
          node: document.getElementById(container),
          moneyFormat: "R%24%20%7B%7Bamount_with_comma_separator%7D%7D",
          options
        });
      });
    };

    // Injeta script ou inicializa diretamente
    if (!document.querySelector(`script[src="${scriptURL}"]`)) {
      const s = document.createElement("script");
      s.async = true;
      s.src = scriptURL;
      s.onload = initShopify;
      document.head.appendChild(s);
    } else if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      initShopify();
    }

  }, [prediction]);

  return (
    <>
      {prediction === "Radar" && <div id="collection-component-1744679872360" />}
      {prediction === "Juliet"  && <div id="collection-component-1744679923542" />}
      {prediction !== "Juliet" && prediction !== "Radar" && (
        <div id="shopify-buy-button-container" />
      )}
    </>
  );
};

export default ShopifyBuyComponent;
