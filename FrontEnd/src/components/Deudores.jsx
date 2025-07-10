import React, { useEffect } from 'react';
import { Header } from './header';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './styles/Index.css';
import { Footer } from './footer';
import { FormattedMessage } from 'react-intl';
import "./styles/deudores.css";

export default function Index() {
    const [total, setTotal] = React.useState(0);
    const [prestamista, setPrestamista] = React.useState({});
    const [deudores, setDeudores] = React.useState([]);
    const [filteredDeudores, setFilteredDeudores] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");


    useEffect(() => {
        const token = localStorage.getItem('token');
        const prestamistaId = localStorage.getItem('prestamistaId');

        if (token) {

            fetch(`http://localhost:3000/prestamistas/${prestamistaId}/deudores`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message !== "El prestamista con el id proporcionado no fue encontrado") {
                        setDeudores(data.deudores);
                        setFilteredDeudores(data.deudores);
                        setTotal(data.interesesGanados);
                    }
                })
                .catch((error) => console.error('Error al obtener los deudores:', error));

            fetch(`http://localhost:3000/prestamistas/${prestamistaId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message !== "El prestamista con el id proporcionado no fue encontrado") {
                        setPrestamista(data);
                    }
                })
                .catch((error) => console.error('Error al obtener el prestamista:', error));
        }
    }, []);

    // Función para manejar el cambio en el input de búsqueda
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Filtrar deudores por nombre
        if (value) {
            const filtered = deudores.filter(deudor =>
                deudor.nombrecompleto.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredDeudores(filtered);
        } else {
            setFilteredDeudores(deudores);
        }
    };

    const handleSendId = (e, id) => {
        localStorage.setItem('deudorId', id);
    };

    const handleDeleteDeudor = (deudorId) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/deudor/${deudorId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el deudor');
                }
                // Actualizar el estado local después de eliminar el deudor
                setDeudores((prevDeudores) => prevDeudores.filter(deudor => deudor.id !== deudorId));
                setFilteredDeudores((prevFiltered) => prevFiltered.filter(deudor => deudor.id !== deudorId));
            })
            .catch((error) => console.error('Error al eliminar el deudor:', error));
    };

    const nav_links = [
        { name: "Deudores", url: "/deudores" },
        { name: "Crear Deudor", url: "/crearcliente" },
        { name: "Consultar Deudor", url: "/consultarcliente" },
    ];

    const nombre_usuario = prestamista.nombre;

    const RenderCards = ({ deudor }) => (
        <Col>
            <div className="card card-style" data-testid="deudor-card" style={{ width: "15rem", height: "25rem" }}>
                <img
                    src={deudor.foto}
                    className="card-img-top"
                    alt="imagen deudor"
                    style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <h5 className="card-title">{deudor.nombrecompleto}</h5>
                    <p className="card-text">{deudor.fecha}</p>
                    <div>
                        <a href="/infodeudor" className="btn btn-primary" onClick={(e) => handleSendId(e, deudor.id)}>
                            <FormattedMessage id="app.information" defaultMessage="Information" />
                        </a>
                        <Button
                            variant="danger"
                            className="ms-2 d-flex align-items-center gap-1"
                            onClick={() => handleDeleteDeudor(deudor.id)}
                        >
                            <i className="bi bi-trash3"></i>
                            <FormattedMessage id="app.delete" defaultMessage="Delete" />
                        </Button>

                    </div>
                </div>
            </div>
        </Col>
    );

    return (
        <div className='all'>
            <Header nav_links={nav_links} logged={true} usuario={nombre_usuario} />
            <main>
                <Container style={{ display: "grid", padding: '1rem' }}>
                    <h1 style={{ textAlign: 'left' }}><FormattedMessage id="app.welcome" defaultMessage="Welcome" />, {nombre_usuario}</h1>
                    <h3><FormattedMessage id="app.thismonth" defaultMessage="This month you have earned" /></h3>
                    <h2 style={{ color: "#004AAC" }}>${total}</h2>

                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ marginTop: '20px' }}
                    />
                </Container>
                <Container>
                    <Row style={{ padding: "50px" }}>
                        {filteredDeudores.map((deudor, index) => (
                            <RenderCards key={index} deudor={deudor} />
                        ))}
                    </Row>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
