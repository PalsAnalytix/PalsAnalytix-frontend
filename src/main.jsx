import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import App from "./App.jsx";
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
        <Auth0Provider
          domain="palsanalytix.us.auth0.com"
          clientId="pSKcVPlsxvZSfMinRuVZOZrzjgBl6uop"
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}
        >
          <App />
        </Auth0Provider>
    </Provider>
  </React.StrictMode>
);