import { useState, useEffect } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { Header } from "./header";
import { Footer } from "./footer";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from 'react-intl';
import "./styles/crearCliente.css";

export default function CrearCliente() {
    const [cliente, setCliente] = useState({
        nombrecompleto: "",
        cedula: "",
        situacionLaboral: "",
        direccion: "",
        telefono: "",
        email: "",
        ocupacion: "",
        foto: "https://img.freepik.com/foto-gratis/retrato-hombre-reir_23-2148859448.jpg?t=st=1733094543~exp=1733098143~hmac=9721362422b028f5fb3f5628fc4547ade6bc9939e3f6743d76fc94916c3afee9&w=740",
        fecha: "",  // Fecha en formato 'YYYY-MM-DD'
    });

    const [prestamo, setPrestamo] = useState({
        monto: 0,
        fechainicio: "",
        fechafin: "",
        interes: 0,
        nombre: "",
        pagado: false,
    });

    const intl = useIntl();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        setCliente(prevState => ({
            ...prevState,
            fecha: new Date().toISOString().split('T')[0]  // Solo la parte de la fecha
        }));
    }, []);

    const handleChangeDeudor = (e) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, [name]: value });
    };

    const handleChangePrestamo = (e) => {
        const { name, type, checked, value } = e.target;

        if (type === "checkbox") {
            // Si el campo es un checkbox, se actualiza el estado con el valor de 'checked' (true o false)
            setPrestamo({ ...prestamo, [name]: checked });
        } else {
            // Si no es un checkbox, simplemente actualiza el valor como antes
            setPrestamo({ ...prestamo, [name]: value });
        }
    };


    const validarDatos = () => {
        const { nombrecompleto, cedula, situacionLaboral, direccion, telefono, email, ocupacion, foto, fecha } = cliente;
        const { monto, interes, nombre, pagado, fechainicio, fechafin,  } = prestamo;

        // Validación de campos de cliente
        if (!nombrecompleto || !direccion || !telefono || !email || !ocupacion || !fecha || !cedula || !situacionLaboral) {
            setMensaje(intl.formatMessage({ id: 'app.errorFields' }));
            setError(true);
            return false;
        }

        // Validación de campos de préstamo
        if (!monto || !fechainicio || !fechafin || !interes || !nombre) {
            setMensaje(intl.formatMessage({ id: 'app.errorLoanFields' }));
            setError(true);
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMensaje(intl.formatMessage({ id: 'app.errorEmail' }));
            setError(true);
            return false;
        }

        if (!/^\d+$/.test(telefono)) {
            setMensaje(intl.formatMessage({ id: 'app.errorPhone' }));
            setError(true);
            return false;
        }

        setError(false);
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validarDatos()) {
            const clienteConId = {
                ...cliente,
                nombrecompleto: cliente.nombrecompleto.toString(),
                cedula: cliente.cedula.toString(),
                situacionLaboral: cliente.situacionLaboral.toString(),
                direccion: cliente.direccion.toString(),
                telefono: cliente.telefono.toString(),
                email: cliente.email.toString(),
                ocupacion: cliente.ocupacion.toString(),
                foto: cliente.foto.toString(),
                fecha: cliente.fecha.toString(),
            };

            const prestamoConId = {
                ...prestamo,
                nombre: prestamo.nombre.toString(),
                monto: parseInt(prestamo.monto),
                interes: parseInt(prestamo.interes),
                fechainicio: prestamo.fechainicio.toString(),
                fechafin: prestamo.fechafin.toString(),
                pagado: prestamo.pagado
            };

            try {
                const token = localStorage.getItem('token');
                const idPrestamista = localStorage.getItem('prestamistaId');
                const responseCliente = await fetch('http://localhost:3000/deudor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(clienteConId),
                });

                if (!responseCliente.ok) {
                    throw new Error('Error al crear el cliente');
                }

                const dataCliente = await responseCliente.json();
                console.log('Cliente creado con éxito:', dataCliente);

                // Ahora enviamos el préstamo asociado al cliente recién creado
                console.log('Enviando préstamo:', prestamoConId);
                const responsePrestamo = await fetch('http://localhost:3000/prestamo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(prestamoConId),
                });

                if (!responsePrestamo.ok) {
                    throw new Error('Error al crear el préstamo');
                }

                const dataPrestamo = await responsePrestamo.json();
                setMensaje(intl.formatMessage({ id: 'app.successMessage' }));
                setError(false);
                console.log('Préstamo creado con éxito:', dataPrestamo);
                const responsePrestamoDeudor = await fetch(`http://localhost:3000/deudor/${dataCliente.id}/prestamos/${dataPrestamo.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...prestamoConId,
                        clienteId: dataCliente.id,
                    }),
                });

                const dataPrestamoDeudor = await responsePrestamoDeudor.json();
                console.log('Préstamo asociado al cliente con éxito:', dataPrestamoDeudor);

                const responsePrestamistaPrestamo = await fetch(`http://localhost:3000/prestamistas/${idPrestamista}/prestamos/${dataPrestamo.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...prestamoConId,
                        clienteId: dataCliente.id,
                    }),
                });

                const dataPrestamistaPrestamo = await responsePrestamistaPrestamo.json();
                console.log('Préstamo asociado al prestamista con éxito:', dataPrestamistaPrestamo);


            } catch (err) {
                setMensaje(intl.formatMessage({ id: 'app.errorMessage' }));
                setError(true);
                console.error('Error:', err);
            }
        }
    };

    return (
        <>
            <Header
                nav_links={[
                    { name: intl.formatMessage({ id: 'nav.deudores' }), url: "/deudores" },
                    { name: intl.formatMessage({ id: 'nav.crearDeudor' }), url: "/crearcliente" },
                    { name: intl.formatMessage({ id: 'nav.consultarDeudor' }), url: "/consultarcliente" },
                ]}
                logged={true}
                usuario="Jorge"
            />
            <Container className="crear-cliente-container">
                <Row className="justify-content-md-center">
                    <Col md={10}>
                        <h1><FormattedMessage id="app.registerNewClient" /></h1>
                        <Form onSubmit={handleSubmit}>
                            {/* Formulario del Cliente */}
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="nombrecompleto">
                                        <Form.Label><FormattedMessage id="app.fullName" /></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombrecompleto"
                                            value={cliente.nombrecompleto}
                                            onChange={handleChangeDeudor}
                                            placeholder={intl.formatMessage({ id: 'app.placeholderName' })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="cedula">
                                        <Form.Label><FormattedMessage id="app.idNumber" /></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cedula"
                                            value={cliente.cedula}
                                            onChange={handleChangeDeudor}
                                            placeholder={intl.formatMessage({ id: 'app.placeholderId' })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="situacionLaboral">
                                        <Form.Label><FormattedMessage id="app.workStatus" /></Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="situacionLaboral"
                                            value={cliente.situacionLaboral}
                                            onChange={handleChangeDeudor}
                                        >
                                            <option value="">--</option>
                                            <option value="Empleado"><FormattedMessage id="app.employee" /></option>
                                            <option value="Desempleado"><FormattedMessage id="app.unemployed" /></option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="direccion">
                                        <Form.Label><FormattedMessage id="app.address" /></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="direccion"
                                            value={cliente.direccion}
                                            onChange={handleChangeDeudor}
                                            placeholder={intl.formatMessage({ id: 'app.placeholderAddress' })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="telefono">
                                        <Form.Label><FormattedMessage id="app.phone" /></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telefono"
                                            value={cliente.telefono}
                                            onChange={handleChangeDeudor}
                                            placeholder={intl.formatMessage({ id: 'app.placeholderPhone' })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="email">
                                        <Form.Label><FormattedMessage id="app.email" /></Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={cliente.email}
                                            onChange={handleChangeDeudor}
                                            placeholder={intl.formatMessage({ id: 'app.placeholderEmail' })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="ocupacion">
                                        <Form.Label><FormattedMessage id="app.occupation" /></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="ocupacion"
                                            value={cliente.ocupacion}
                                            onChange={handleChangeDeudor}
                                            placeholder={intl.formatMessage({ id: 'app.placeholderOccupation' })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="foto">
                                        <Form.Label><FormattedMessage id="app.photo" /></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="foto"
                                            onChange={handleChangeDeudor}
                                            placeholder={intl.formatMessage({ id: 'app.placeholderPhoto' })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Formulario del Prestamo */}
                            <h3><FormattedMessage id="app.loanDetails" /></h3>
                            <Row>
                                <Form.Group controlId="fechainicio">
                                    <Form.Label><FormattedMessage id="app.loanDateInit" /></Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="fechainicio"  // Cambié el name para que coincida con el estado
                                        value={prestamo.fechainicio}
                                        onChange={handleChangePrestamo}
                                    />
                                </Form.Group>

                                <Form.Group controlId="fechafin">
                                    <Form.Label><FormattedMessage id="app.loanDateEnd" /></Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="fechafin"  // Cambié el name para que coincida con el estado
                                        value={prestamo.fechafin}
                                        onChange={handleChangePrestamo}
                                    />
                                </Form.Group>

                                <Form.Group controlId="nombrePrestamo">
                                    <Form.Label><FormattedMessage id="app.loanName" /></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={prestamo.nombre}
                                        onChange={handleChangePrestamo}
                                        placeholder={intl.formatMessage({ id: 'app.placeholderLoan' })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="interes">
                                    <Form.Label><FormattedMessage id="app.loanInterest" /></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="interes"
                                        value={prestamo.interes}
                                        onChange={handleChangePrestamo}
                                        placeholder={intl.formatMessage({ id: 'app.placeholderAmount' })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="monto">
                                    <Form.Label><FormattedMessage id="app.loanAmount" /></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="monto"
                                        value={prestamo.monto}
                                        onChange={handleChangePrestamo}
                                        placeholder={intl.formatMessage({ id: 'app.placeholderAmount' })}
                                    />
                                </Form.Group>
                                
                                <Form.Group controlId="pagadoPrestamo">
                                    <Form.Label><FormattedMessage id="app.loanEnd" /></Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="pagado"  // Cambié el name para que coincida con el estado
                                        checked={prestamo.pagado || false}
                                        onChange={handleChangePrestamo}
                                        label={intl.formatMessage({ id: 'app.loanEnd' })}
                                    />
                                </Form.Group>


                            </Row>

                            {/* Mensaje de error o éxito */}
                            {mensaje && <div className={`alert alert-${error ? "danger" : "success"}`} role="alert">{mensaje}</div>}

                            <Button variant="primary" type="submit">
                                <FormattedMessage id="app.save" />
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}
