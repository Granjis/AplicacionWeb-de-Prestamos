import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Container, Col, Row } from 'react-bootstrap';
import { Header } from './header';
import { Footer } from './footer';
import { FormattedMessage, useIntl } from 'react-intl';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/crearPrestamo.css";
import { useNavigate } from 'react-router-dom';

export default function CrearPrestamo() {
    const intl = useIntl();
    const navigate = useNavigate();

    // Links de navegación
    const nav_links = [
        { name: intl.formatMessage({ id: 'nav.deudores' }), url: "/deudores" },
        { name: intl.formatMessage({ id: 'nav.crearDeudor' }), url: "/crearcliente" },
        { name: intl.formatMessage({ id: 'nav.consultarDeudor' }), url: "/consultarcliente" },
    ];

    // Configuración del modal
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const handleCloseConfirmationFalseModal = () => setShowConfirmationModal(false);

    const handleCloseConfirmationTrueModal = async () => {
        try {
            const prestamoId = await crearPrestamo();
            if (prestamoId) {
                const deudorId = localStorage.getItem('deudorId');
                const prestamistaId = localStorage.getItem('prestamistaId');
                await asociarPrestamoADeudor(prestamoId, deudorId);
                await asociarPrestamoAPrestamista(prestamoId, prestamistaId);
                alert("El préstamo se creó y asoció correctamente.");
                navigate('/infodeudor');
            }
        } catch (error) {
            console.error("Error al crear o asociar el préstamo:", error);
        }
        setShowConfirmationModal(false);
    };

    const [prestamo, setPrestamo] = useState({
        nombre: "",
        monto: 0,
        fechainicio: "",
        fechafin: "",
        interes: 0,
        pagado: false
    });

    const [isFormValid, setIsFormValid] = useState(false);

    // Manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "monto" || name === "interes") {
            setPrestamo({
                ...prestamo,
                [name]: parseInt(value)
            });
        }else{
            setPrestamo({
                ...prestamo,
                [name]: value
            });
        }
        
    };

    // Revisar si el formulario está completamente llenado
    useEffect(() => {
        const isValid = Object.values(prestamo).every(field => {
            if (typeof field === "string") {
                return field.trim() !== ""; // Validar cadenas
            }
            return field !== null && field !== undefined; // Validar otros tipos
        });
        setIsFormValid(isValid);
    }, [prestamo]);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            setShowConfirmationModal(true);
        }
    };

    // Crear el préstamo en el servidor
    const crearPrestamo = async () => {
        const token = localStorage.getItem('token');
        const url = "http://localhost:3000/prestamo";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(prestamo)
            });

            if (!response.ok) {
                throw new Error("Error al crear el préstamo.");
            }

            const data = await response.json();
            return data.id; // Retorna el ID del préstamo creado
        } catch (error) {
            console.error("Error en la solicitud de creación del préstamo:", error);
            throw error;
        }
    };

    // Asociar el préstamo al deudor
    const asociarPrestamoADeudor = async (prestamoId, deudorId) => {
        const token = localStorage.getItem('token');
        const url = `http://localhost:3000/deudor/${deudorId}/prestamos/${prestamoId}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Error al asociar el préstamo al deudor.");
            }
        } catch (error) {
            console.error("Error en la solicitud de asociación con el deudor:", error);
            throw error;
        }
    };

    // Asociar el préstamo al prestamista
    const asociarPrestamoAPrestamista = async (prestamoId, prestamistaId) => {
        const token = localStorage.getItem('token');
        const url = `http://localhost:3000/prestamistas/${prestamistaId}/prestamos/${prestamoId}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Error al asociar el préstamo al prestamista.");
            }
        } catch (error) {
            console.error("Error en la solicitud de asociación con el prestamista:", error);
            throw error;
        }
    };

    return (
        <div className='completo'>
            <Header nav_links={nav_links} logged={true} usuario={'Jorge'} />
            <Container>
                <div className="crear-prestamo">
                    <h2><FormattedMessage id="crearPrestamo.titulo" /></h2>
                    <Row className="justify-content-md-center">
                        <Col md={10}>
                            <Form onSubmit={handleSubmit} data-testid="create-loan-form">
                                <Row>
                                    <Col>
                                        <Form.Group controlId="nombre">
                                            <Form.Label><FormattedMessage id="crearPrestamo.nombre" /></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={prestamo.nombre}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: 'crearPrestamo.placeholderNombre' })} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="monto-prestamo">
                                            <Form.Label><FormattedMessage id="crearPrestamo.monto" /></Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="monto"
                                                value={prestamo.monto}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: 'crearPrestamo.placeholderMonto' })} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="fechainicio">
                                            <Form.Label><FormattedMessage id="crearPrestamo.fechainicio" /></Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="fechainicio"
                                                value={prestamo.fechainicio}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: 'crearPrestamo.placeholderfechainicio' })} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="fechafin">
                                            <Form.Label><FormattedMessage id="crearPrestamo.fechafin" /></Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="fechafin"
                                                value={prestamo.fechafin}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: 'crearPrestamo.fechafin' })} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="interes-prestamo">
                                            <Form.Label><FormattedMessage id="crearPrestamo.interes" /></Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="interes"
                                                value={prestamo.interes}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: 'crearPrestamo.placeholderInteres' })} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="text-center">
                                    <Button
                                        className="btn buttom-general"
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={!isFormValid}>
                                        <FormattedMessage id="crearPrestamo.titulo" />
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Container>
            {/* Modal de confirmación */}
            <Modal data-testid="create-confirmation-modal" show={showConfirmationModal} onHide={handleCloseConfirmationFalseModal} dialogClassName="modal-prest" centered>
                <Modal.Header>
                    <Modal.Title dialogClassName='text-center'>
                        <FormattedMessage id="crearPrestamo.tituloConfirmacion" />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body'>
                    <p><FormattedMessage id="crearPrestamo.confirmacion" /></p>
                    <ul>
                        <li><FormattedMessage id="crearPrestamo.nombre" />: {prestamo.nombre}</li>
                        <li><FormattedMessage id="crearPrestamo.monto" />: {prestamo.monto}</li>
                        <li><FormattedMessage id="crearPrestamo.fechainicio" />: {prestamo.fechainicio}</li>
                        <li><FormattedMessage id="crearPrestamo.fechafin" />: {prestamo.fechafin}</li>
                        <li><FormattedMessage id="crearPrestamo.interes" />: {prestamo.interes}</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="btn buttom-regresar" onClick={handleCloseConfirmationTrueModal}>
                        <FormattedMessage id="crearPrestamo.aceptarConfirmacion" />
                    </Button>
                    <Button className="btn buttom-general" onClick={handleCloseConfirmationFalseModal}>
                        <FormattedMessage id="crearPrestamo.cancelarConfirmacion" />
                    </Button>
                </Modal.Footer>
            </Modal>
            <Footer />
        </div>
    );
}
