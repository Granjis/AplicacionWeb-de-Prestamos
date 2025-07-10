import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/footer.css';

export function Footer() {
    const nav_links = [
        { name: "Soluciones", url: "/soluciones" },
        { name: "Nosotros", url: "/nosotros" },
        { name: "Recursos", url: "/Recursos" },
    ];
    const nosotros = [{ name: "La historia de prest", url: "/historia" }, { name: "Trabajadores de prest", url: "/grupo_trabajo" }]
    const social = [{ name: "TikTok", url: "https://www.tiktok.com/es/" }, { name: "Instagram", url: "https://www.instagram.com/" }, { name: "Facebook", url: "https://web.facebook.com/" }]

    const orgLinks= (mapa)=>{
        return mapa.map((link, index) => (
            <li key={index} className="nav-item">
                <a className="nav-link custom-links" href={link.url}>{link.name}</a>
            </li>
        ));
    }

    return (
        <footer className=" text-center text-lg-start footer-color">
            
            <div className="container p-4">
                {/* Sección de enlaces */}
                <img src="/Logo_letras.png" alt="Logo" width="213" height="73" className="img-fluid" style={{paddingBottom:'4rem'}} />
                <div className="row">
                    <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
                        <h5 className="text-uppercase">Enlaces</h5>
                        <ul className="list-unstyled mb-0">
                            {orgLinks(nav_links)}
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
                        <h5 className="text-uppercase">Nosotros</h5>
                        <ul className="list-unstyled mb-0">
                            {orgLinks(nosotros)}
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
                        <h5 className="text-uppercase">Redes Sociales</h5>
                        <ul>
                            {orgLinks(social)}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center p-3">
                © {new Date().getFullYear()} Prest. Todos los derechos reservados.
            </div>
        </footer>
    );
}
