import { useState } from "react";
import { Col, Container, Row, Form, Button, Alert, Table } from "react-bootstrap";
import { Header } from "./header";
import { Footer } from "./footer";
import { Link } from "react-router-dom";
import { useIntl, FormattedMessage } from 'react-intl';
import "./styles/consultarCliente.css";

export default function ConsultarCliente() {
    const intl = useIntl();
    const [criterio, setCriterio] = useState("");
    const [cliente, setCliente] = useState(null);
    const [todosClientes, setTodosClientes] = useState([]);
    const [mensajeError, setMensajeError] = useState("");
    const nombre_usuario = "Jorge";
    const token = localStorage.getItem('token');
    localStorage.setItem('prestamistaId', 1);
    const prestamistaId = localStorage.getItem('prestamistaId');

    // Función para obtener un cliente específico desde el API
    const buscarCliente = async () => {
        if(token){
            try {
                const response = await fetch(`http://localhost:3000/prestamistas/${prestamistaId}/deudores`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },});
                var data = await response.json();
                data = data.deudores;
                const clienteEncontrado = data.find(
                    c => c.nombrecompleto === criterio || c.cedula.toString() === criterio
                );
    
                if (clienteEncontrado) {
                    setCliente(clienteEncontrado);
                    setMensajeError("");
                    setTodosClientes([]); // Limpia la tabla de todos los clientes cuando se encuentra uno
                } else {
                    setCliente(null);
                    setMensajeError(intl.formatMessage({ id: 'consultarCliente.mensajeError' }));
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
                setMensajeError(intl.formatMessage({ id: 'consultarCliente.errorDatos' }));
            }
        };
        }
        

    // Función para obtener todos los clientes desde el API
    const consultarTodos = async () => {
        try {
            const response = await fetch(`http://localhost:3000/prestamistas/${prestamistaId}/deudores`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },});
            const data = await response.json();
            setTodosClientes(data.deudores);
            console.log(data.deudores);
            setCliente(null);  // Limpia la selección de un solo cliente
            setMensajeError("");
        } catch (error) {
            console.error("Error fetching data: ", error);
            setMensajeError(intl.formatMessage({ id: 'consultarCliente.errorDatos' }));
        }
    };

    return (
        <>
            <Header
                nav_links={[
                    { name: intl.formatMessage({ id: 'nav.deudores' }), url: "/deudores" },
                    { name: intl.formatMessage({ id: 'nav.crearDeudor' }), url: "/crearcliente" },
                    { name: intl.formatMessage({ id: 'nav.consultarDeudor' }), url: "/consultarcliente" },
                ]} logged={true} usuario={nombre_usuario}
            />
            <Container className="consultar-cliente-container">
                <Row className="justify-content-md-center">
                    <Col md={8}>
                        <h1><FormattedMessage id="consultarCliente.titulo" /></h1>
                        <Form>
                            <Form.Group controlId="criterio">
                                <Form.Label>
                                    <FormattedMessage id="consultarCliente.buscarPor" />
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={intl.formatMessage({ id: 'consultarCliente.placeholder' })}
                                    value={criterio}
                                    onChange={(e) => setCriterio(e.target.value)}
                                />
                            </Form.Group>
                            <Button className="btn buttom-general mt-3" onClick={buscarCliente}>
                                <FormattedMessage id="consultarCliente.botonBuscar" />
                            </Button>
                            <Button className="btn btn-secondary mt-3 ms-3" onClick={consultarTodos}>
                                <FormattedMessage id="consultarCliente.botonConsultarTodos" />
                            </Button>
                        </Form>

                        {mensajeError && (
                            <Alert variant="danger" className="mt-3">
                                {mensajeError}
                            </Alert>
                        )}

                        {/* Mostrar información de un solo cliente si se encuentra */}
                        {cliente && (
                            <>
                                <div className="mt-4 text-center">
                                    <img src={cliente.foto} alt={cliente.nombre} className="img-cliente" />
                                </div>

                                <div className="table-responsive" tabIndex="0" aria-label={intl.formatMessage({ id: 'consultarCliente.tablaCliente' })}>
                                    <Table striped bordered hover className="mt-4">
                                        <thead>
                                            <tr>
                                                <th><FormattedMessage id="consultarCliente.campo" /></th>
                                                <th><FormattedMessage id="consultarCliente.informacion" /></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><FormattedMessage id="consultarCliente.nombre" /></td>
                                                <td>{cliente.nombrecompleto}</td>
                                            </tr>
                                            <tr>
                                                <td><FormattedMessage id="consultarCliente.identificacion" /></td>
                                                <td>{cliente.cedula}</td>
                                            </tr>
                                            <tr>
                                                <td><FormattedMessage id="consultarCliente.direccion" /></td>
                                                <td>{cliente.direccion}</td>
                                            </tr>
                                            <tr>
                                                <td><FormattedMessage id="consultarCliente.telefono" /></td>
                                                <td>{cliente.telefono}</td>
                                            </tr>
                                            <tr>
                                                <td><FormattedMessage id="consultarCliente.correo" /></td>
                                                <td>{cliente.email}</td>
                                            </tr>
                                            <tr>
                                                <td><FormattedMessage id="consultarCliente.ocupacion" /></td>
                                                <td>{cliente.ocupacion}</td>
                                            </tr>
                                            <tr>
                                                <td><FormattedMessage id="consultarCliente.historialPrestamos" /></td>
                                                <td>
                                                    {cliente.prestamos.map((prestamo, index) => (
                                                        <div key={index}>
                                                            {prestamo.nombre}: {prestamo.pagado ? "Pagado" : "Pendiente"}
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {/* Mostrar todos los clientes si se ha consultado a todos y no se está mostrando un cliente específico */}
                        {!cliente && todosClientes.length > 0 && (
                            <div className="table-responsive" tabIndex="0" aria-label={intl.formatMessage({ id: 'consultarCliente.tablaClientes' })}>
                                <Table striped bordered hover className="mt-4">
                                    <thead>
                                        <tr>
                                            <th><FormattedMessage id="consultarCliente.nombre" /></th>
                                            <th><FormattedMessage id="consultarCliente.identificacion" /></th>
                                            <th><FormattedMessage id="consultarCliente.telefono" /></th>
                                            <th><FormattedMessage id="consultarCliente.correo" /></th>
                                            <th><FormattedMessage id="consultarCliente.ocupacion" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {todosClientes.map((cliente, index) => (
                                            <tr key={index}>
                                                <td>{cliente.nombrecompleto}</td>
                                                <td>{cliente.cedula}</td>
                                                <td>{cliente.telefono}</td>
                                                <td>{cliente.email}</td>
                                                <td>{cliente.ocupacion}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {/* Botón para regresar al menú principal */}
                        <div className="mt-3 text-end buttom-regresar-container">
                            <Link to="/deudores" className="btn buttom-regresar">
                                <FormattedMessage id="consultarCliente.volverMenu" />
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}
