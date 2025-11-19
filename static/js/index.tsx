import React from "react";
import ReactDOM from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App.tsx";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <PrimeReactProvider
      value={{
        unstyled: true,
        pt: Tailwind,
      }}>
      <App />
    </PrimeReactProvider>
);

reportWebVitals();
