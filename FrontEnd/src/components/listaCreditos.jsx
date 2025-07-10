import { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { FormattedMessage, useIntl } from 'react-intl'; // Importar react-intl
import "./styles/listaCreditos.css";

const user = { id: 1, email: "user@example.com" };

export default function ListaCreditos() {
    const intl = useIntl();
    const [creditosUsuario, setCreditosUsuario] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const nombre_usuario = "Jorge";

    useEffect(() => {
        const fetchCreditos = async () => {
            try {
                const response = await fetch("https://my.api.mockaroo.com/lista_creditos_mock.json?key=2a692260");
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del API");
                }
                const data = await response.json();
                const creditosFiltrados = data.filter((credito) => credito.usuarioId === user.id);
                setCreditosUsuario(creditosFiltrados);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCreditos();
    }, []);

    return (
        <>
            <Header
                nav_links={[
                    { name: intl.formatMessage({ id: 'nav.creditos' }), url: "/creditos" },
                ]} logged={true} usuario={nombre_usuario}
            />
            <Container className="lista-creditos-container">
                <Row className="justify-content-md-center">
                    <Col md={8}>
                        <h1><FormattedMessage id="misCreditos" defaultMessage="Mis Créditos" /></h1>
                        {loading ? (
                            <p><FormattedMessage id="cargandoCreditos" defaultMessage="Cargando créditos..." /></p>
                        ) : error ? (
                            <p><FormattedMessage id="errorCargarDatos" defaultMessage="Error: {error}" values={{ error }} /></p>
                        ) : (
                            <ListGroup>
                                {creditosUsuario.length > 0 ? (
                                    creditosUsuario.map((credito) => (
                                        <ListGroup.Item key={credito.id}>
                                            <Link 
                                                to={{
                                                    pathname: `/visualizar-transacciones/${credito.id}`,
                                                    state: {
                                                        nombre: credito.nombre,
                                                        monto: credito.monto,
                                                        fechaPago: credito.fechaPago,
                                                        estado: credito.estado
                                                    }
                                                }}
                                            >
                                                <div>
                                                    <strong>{credito.nombre}</strong> - ${credito.monto}
                                                </div>
                                                <div>
                                                    <FormattedMessage 
                                                        id="fechaPago" 
                                                        defaultMessage="Fecha de Pago: {fechaPago}" 
                                                        values={{ fechaPago: credito.fechaPago }} 
                                                    />
                                                </div>
                                                <div>
                                                    <FormattedMessage 
                                                        id="estado" 
                                                        defaultMessage="Estado: {estado}" 
                                                        values={{ estado: credito.estado }} 
                                                    />
                                                </div>
                                            </Link>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <p><FormattedMessage id="sinCreditos" defaultMessage="No tienes créditos registrados." /></p>
                                )}
                            </ListGroup>
                        )}
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}
