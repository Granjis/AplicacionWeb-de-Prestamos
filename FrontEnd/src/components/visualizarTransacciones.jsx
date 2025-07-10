import { useState, useEffect } from "react";
import { Col, Container, Row, Table, Form, Alert, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom"; // Importar useParams para obtener el ID de la URL
import { Header } from "./header";
import { Footer } from "./footer";
import { FormattedMessage, useIntl } from 'react-intl'; // Importar react-intl
import "./styles/visualizarTransacciones.css";
import { useNavigate } from "react-router-dom";

export default function VisualizarTransacciones() {
    const intl = useIntl(); // Usar hook de react-intl para obtener el objeto de internacionalización
    const { id } = useParams(); // Capturar el ID del crédito desde la URL
    const [credito, setCredito] = useState(null); // Para almacenar los detalles del crédito
    const [transacciones, setTransacciones] = useState([]); // Para las transacciones del crédito
    const [filtro, setFiltro] = useState({ fecha: "", total: "", balance: "" });
    const [transaccionesFiltradas, setTransaccionesFiltradas] = useState([]); // Para guardar transacciones filtradas
    const [mostrarTodas, setMostrarTodas] = useState(true); // Estado para controlar si se muestran todas las transacciones
    const [mensajeError, setMensajeError] = useState("");
    const [loading, setLoading] = useState(true); // Estado de carga
    const nombre_usuario = "Jorge";
    const navigate = useNavigate();

    // Fetch de los detalles del crédito
    useEffect(() => {
        const fetchCredito = async () => {
            try {
                const response = await fetch("https://my.api.mockaroo.com/lista_creditos_mock.json?key=2a692260");
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del crédito");
                }
                const data = await response.json();

                // Buscar el crédito específico por su ID
                const creditoSeleccionado = data.find(c => c.id === parseInt(id));
                setCredito(creditoSeleccionado);
            } catch (error) {
                console.error(error);
                setMensajeError(intl.formatMessage({ id: 'visualizarTransacciones.errorCargarCredito', defaultMessage: 'Error al cargar los datos del crédito.' }));
            }
        };

        fetchCredito();
    }, [id, intl]);

    // Fetch de las transacciones del crédito
    useEffect(() => {
        const fetchTransacciones = async () => {
            try {
                const response = await fetch("https://my.api.mockaroo.com/transaccionesmock.json?key=2a692260");
                if (!response.ok) {
                    throw new Error("Error al obtener las transacciones");
                }
                const data = await response.json();

                // Filtrar las transacciones para el crédito seleccionado usando creditoId
                const transaccionesCredito = data.filter(t => t.creditoId === parseInt(id));
                setTransacciones(transaccionesCredito);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setMensajeError(intl.formatMessage({ id: 'visualizarTransacciones.errorCargarTransacciones', defaultMessage: 'Error al cargar las transacciones.' }));
            }
        };

        fetchTransacciones();
    }, [id, intl]);

    // Ordenar las transacciones por fecha (más recientes primero)
    const transaccionesOrdenadas = transacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Filtrar transacciones por criterios de fecha, total o balance
    const filtrarTransacciones = () => {
        let transacciones = transaccionesOrdenadas;

        if (filtro.fecha) {
            transacciones = transacciones.filter(t => t.fecha === filtro.fecha);
        }
        if (filtro.total) {
            transacciones = transacciones.filter(t => t.total === parseFloat(filtro.total));
        }
        if (filtro.balance) {
            transacciones = transacciones.filter(t => t.balance === parseFloat(filtro.balance));
        }

        if (transacciones.length === 0) {
            setMostrarTodas(false); // Ocultar la tabla si no hay transacciones filtradas
            setMensajeError(intl.formatMessage({ id: 'visualizarTransacciones.sinTransacciones', defaultMessage: 'No se encontraron transacciones con los filtros seleccionados.' }));
        } else {
            setTransaccionesFiltradas(transacciones);
            setMostrarTodas(false); // Mostrar solo las transacciones filtradas
            setMensajeError(""); // Limpiar el mensaje de error
        }
    };

    // Función para eliminar los filtros y mostrar todas las transacciones
    const eliminarFiltros = () => {
        setFiltro({ fecha: "", total: "", balance: "" }); // Resetear filtros
        setMostrarTodas(true); // Mostrar todas las transacciones nuevamente
        setMensajeError(""); // Limpiar cualquier mensaje de error
    };

    if (loading) {
        return <p><FormattedMessage id="visualizarTransacciones.cargandoTransacciones" defaultMessage="Cargando transacciones..." /></p>;
    }

    return (
        <>
            <Header
                nav_links={[
                    { name: intl.formatMessage({ id: 'nav.creditos' }), url: "/creditos" },
                ]} logged={true} usuario={nombre_usuario}
            />
            <Container className="visualizar-transacciones-container">
                <Row className="justify-content-md-center">
                    <Col md={10}>
                        {/* Mostrar toda la información del crédito seleccionado */}
                        {credito && (
                            <div>
                                <h1><FormattedMessage id="visualizarTransacciones.titulo" defaultMessage="Transacciones de {nombre}" values={{ nombre: credito.nombre }} /></h1>
                                <p><FormattedMessage id="visualizarTransacciones.monto" defaultMessage="Monto: ${monto}" values={{ monto: credito.monto }} /></p>
                                <p><FormattedMessage id="visualizarTransacciones.fechaPago" defaultMessage="Fecha de Pago: {fechaPago}" values={{ fechaPago: credito.fechaPago }} /></p>
                                <p><FormattedMessage id="visualizarTransacciones.estado" defaultMessage="Estado: {estado}" values={{ estado: credito.estado }} /></p>
                            </div>
                        )}

                        <Form className="mb-4">
                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="filtroFecha">
                                        <Form.Label><FormattedMessage id="visualizarTransacciones.filtrarFecha" defaultMessage="Filtrar por Fecha" /></Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={filtro.fecha}
                                            onChange={(e) => setFiltro({ ...filtro, fecha: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="filtroTotal">
                                        <Form.Label><FormattedMessage id="visualizarTransacciones.filtrarMonto" defaultMessage="Filtrar por Monto Total" /></Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder={intl.formatMessage({ id: 'placeholder.montoTotal', defaultMessage: 'Monto Total' })}
                                            value={filtro.total}
                                            onChange={(e) => setFiltro({ ...filtro, total: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="filtroBalance">
                                        <Form.Label><FormattedMessage id="visualizarTransacciones.filtrarBalance" defaultMessage="Filtrar por Balance" /></Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder={intl.formatMessage({ id: 'placeholder.balance', defaultMessage: 'Balance' })}
                                            value={filtro.balance}
                                            onChange={(e) => setFiltro({ ...filtro, balance: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="mt-3">
                                <Button className="me-2 boton-filtrar" onClick={filtrarTransacciones}>
                                    <FormattedMessage id="visualizarTransacciones.filtrar" defaultMessage="Filtrar" />
                                </Button>
                                <Button variant="secondary" onClick={eliminarFiltros}>
                                    <FormattedMessage id="visualizarTransacciones.eliminarFiltros" defaultMessage="Eliminar Filtros" />
                                </Button>
                                <Button variant="secondary" onClick={() =>  navigate('/pasarela/'+id)}>
                                    <FormattedMessage id="visualizarTransacciones.MakePayment" defaultMessage="Make payment" />
                                </Button>
                            </div>
                        </Form>

                        {/* Mostrar el mensaje de error si no se encontraron transacciones */}
                        {mensajeError && <Alert variant="danger">{mensajeError}</Alert>}

                        {/* Mostrar todas las transacciones o las filtradas */}
                        {mostrarTodas ? (
                            <Table striped bordered hover className="mt-4">
                                <thead>
                                    <tr>
                                        <th><FormattedMessage id="visualizarTransacciones.fecha" defaultMessage="Fecha" /></th>
                                        <th><FormattedMessage id="visualizarTransacciones.capital" defaultMessage="Capital" /></th>
                                        <th><FormattedMessage id="visualizarTransacciones.interes" defaultMessage="Interés" /></th>
                                        <th><FormattedMessage id="visualizarTransacciones.total" defaultMessage="Total" /></th>
                                        <th><FormattedMessage id="visualizarTransacciones.balance" defaultMessage="Balance" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transaccionesOrdenadas.map((transaccion, index) => (
                                        <tr key={index}>
                                            <td>{transaccion.fecha}</td>
                                            <td>{transaccion.capital}</td>
                                            <td>{transaccion.interes}</td>
                                            <td>{transaccion.total}</td>
                                            <td>{transaccion.balance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            transaccionesFiltradas.length > 0 && (
                                <Table striped bordered hover className="mt-4">
                                    <thead>
                                        <tr>
                                            <th><FormattedMessage id="visualizarTransacciones.fecha" defaultMessage="Fecha" /></th>
                                            <th><FormattedMessage id="visualizarTransacciones.capital" defaultMessage="Capital" /></th>
                                            <th><FormattedMessage id="visualizarTransacciones.interes" defaultMessage="Interés" /></th>
                                            <th><FormattedMessage id="visualizarTransacciones.total" defaultMessage="Total" /></th>
                                            <th><FormattedMessage id="visualizarTransacciones.balance" defaultMessage="Balance" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transaccionesFiltradas.map((transaccion, index) => (
                                            <tr key={index}>
                                                <td>{transaccion.fecha}</td>
                                                <td>{transaccion.capital}</td>
                                                <td>{transaccion.interes}</td>
                                                <td>{transaccion.total}</td>
                                                <td>{transaccion.balance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )
                        )}

                        {/* Botón para regresar al menú principal */}
                        <div className="mt-3 text-end buttom-regresar-container">
                            <Link to="/creditos" className="buttom-regresar">
                                <FormattedMessage id="visualizarTransacciones.volverMenu" defaultMessage="Volver al Menú Principal" />
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}
