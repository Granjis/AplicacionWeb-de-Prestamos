import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import messages_es from './components/local/es.json';
import messages_en from './components/local/en.json';
import { IntlProvider } from 'react-intl';

// Definir el idioma predeterminado x
const messages = {
  'es': messages_es,
  'en': messages_en
};

const language = navigator.language.split(/[-_]/)[0]; 

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <IntlProvider locale={language} messages={messages[language]}>
        <BrowserRouter>
            <App></App>
        </BrowserRouter>
    </IntlProvider>
);