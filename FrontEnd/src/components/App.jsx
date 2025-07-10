import React from "react";
import Soluciones from "./Soluciones";
import Nosotros from "./Nosotros";
import Recursos from "./Recursos";
import Signup from "./Signup"
import Login from "./Login"
import Landing from "./Landing";
import DeudorDetalle from "./DeudorDetalle";
import { Routes, Route } from "react-router-dom";
import Deudores from "./Deudores";
import DeudorApp from "./deudorApp";
import CrearCliente from "./CrearCliente";
import ConsultarCliente from "./consultarCliente";
import ListaCreditos from "./listaCreditos";
import VisualizarTransacciones from "./visualizarTransacciones";
import Pasarela from "./Pasarela";
import CrearPrestamo from "./CrearPrestamo";
import PerfilPrestamista from "./PerfilPrestamista";
import PerfilDeudor from "./PerfilDeudor";

export default function App() {
    const nav_links = [
        { url: "pasarela/:idPrestamo", component: Pasarela },
        { url: "soluciones", component: Soluciones },
        { url: "nosotros", component: Nosotros },
        { url: "recursos", component: Recursos },
        { url: "signup", component: Signup },
        { url: "login", component: Login},
        { url: "/", component: Landing },
        { url: "/infodeudor", component: DeudorDetalle },
        { url:"deudores", component: Deudores},
        { url:"deudorApp", component: DeudorApp}, 
        { url:"crearcliente", component: CrearCliente},
        { url:"consultarcliente", component: ConsultarCliente},
        { url: "creditos", component: ListaCreditos }, 
        { url: "visualizar-transacciones/:id", component: VisualizarTransacciones },
        { url: "crearPrestamo", component: CrearPrestamo},
        { url: "perfilPrestamista", component: PerfilPrestamista },
        { url: "perfilDeudor", component: PerfilDeudor },

    ];
    return (
        <Routes>
            {nav_links.map((link, index) => (
                <Route key={index} path={link.url} element={<link.component />} />
            ))}
        </Routes>
    );
}