import { React, useState, useEffect } from 'react';
import { Container, Row, Col, Image, Modal, Form, Button } from 'react-bootstrap';
import './styles/DeudorDetalle.css';
import { Header } from './header';
import { Footer } from './footer';
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from 'react-intl';

export default function DeudorDetalle() {
  const navigate = useNavigate();

  // Links de navegación
  const nav_links = [
    { name: <FormattedMessage id="app.Deudores" defaultMessage="Deudores" />, url: "/deudores" },
  ];

  const [deudor, setDeudor] = useState({
    nombrecompleto: 'Armando Casas',
    cedula: '1110450340',
    situacionLaboral: 'Empleado', 
    direccion: 'Calle 123',
    fecha: '2024-01-01',
    ocupacion: 'Ingeniero',
    email: "hola@gmail.com",
    telefono: "3143807270"
  });
  const [totalDeudas, setTotalDeudas] = useState(0);

  const [deudorEdited, setDeudorEdited] = useState(deudor);

  const [deudas, setDeudas] = useState([{
    id: 1,
    nombreDeuda: "Estudios",
    deudaTotal: 800000,
    deudaRestante: 200000
  }, {
    id: 2,
    nombreDeuda: "Carro",
    deudaTotal: 800000,
    deudaRestante: 100000
  }, {
    id: 3,
    nombreDeuda: "Casa",
    deudaTotal: 800000,
    deudaRestante: 150000
  }]);

  const [showEditModal, setShowEditModal] = useState(false);

  const setDeudorBase = () => {
    const token = localStorage.getItem('token');
    const deudorId = localStorage.getItem('deudorId');
    if (!deudorId) {
      console.error('No hay deudorId disponible');
    } else {
      if (token) {
        fetch(`http://localhost:3000/deudor/${deudorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(deudorEdited),
        })
          .catch((error) => {
            console.error('Error al actualizar:', error);
          });
      } else {
        console.error('No hay token disponible');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const deudorId = localStorage.getItem('deudorId');
    if (!deudorId) {
      console.error('No hay deudorId disponible');
    } else {
      if (token) {
        fetch(`http://localhost:3000/deudor/${deudorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setDeudor(data);
            setDeudas(data.prestamos);
            setTotalDeudas(data.deudaTotal);
          })
          .catch((error) => {
            console.error('Error al obtener los deudores:', error);
          });
      } else {
        console.error('No hay token disponible');
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeudorEdited((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setDeudor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <Header nav_links={nav_links} logged={true} usuario={'Jorge'} />
      <Container className="custom-container">
        <Row className="align-items-center">
          <Col>
            <Image src={deudor.foto} roundedCircle width={200} height={200} className="mb-3" alt='imgperfil' />
          </Col>
          <Col >
            <h4>{deudor.nombrecompleto}</h4>
            <div className='documento'>{'C.C ' + deudor.cedula}</div>
          </Col>
          <Col className='info-rapida px-0'>
            <Row>
              <Col md={1}><i className="bi bi-currency-dollar"></i></Col>
              <Col><div><FormattedMessage id="app.TotalLoan" defaultMessage="Total Loan" />: {totalDeudas} </div></Col>
            </Row>

            <Row>
              <Col md={1}><i className="bi bi-briefcase"></i></Col>
              <Col>
                <span className="Big font">
                  <FormattedMessage id="app.WorkStatus" defaultMessage="Work Status" />:
                </span>
                <span className='situacionLaboral'>
                  {deudor.situacionLaboral === "Empleado" ? <FormattedMessage id="app.Empleado" defaultMessage="Empleado" /> : <FormattedMessage id="app.Desempleado" defaultMessage="Desempleado" />}
                </span>
              </Col>
            </Row>
          </Col>
          <Col className='info-rapida px-0'>
            <Row>
              <Col md={1}><i className="bi bi-person"></i></Col>
              <Col><div><FormattedMessage id="app.Age" defaultMessage="" />: {deudor.edad} </div></Col>
            </Row>
            <Row>
              <Col md={1}><i className="bi bi-telephone"></i></Col>
              <Col><div><FormattedMessage id="app.PhoneNumber" defaultMessage="Phone number" />: {deudor.telefono} </div></Col>
            </Row>
            <Row>
              <Col md={1}><i className="bi bi-envelope"></i></Col>
              <Col><div><FormattedMessage id="app.Email" defaultMessage="Email" />: {deudor.email} </div></Col>
            </Row>
          </Col>
          <Col className="d-flex flex-column align-items-center align-self-center">
            <button className="rounded-pill" aria-label="Edit Info" onClick={() => { setDeudorEdited({ ...deudor }); setShowEditModal(true) }}>
              <i className="bi bi-pencil-square edit-button" style={{ fontSize: '1.5rem', cursor: 'pointer' }}></i>
            </button>
            <p>&nbsp;</p> {/* Placeholder to maintain the same height */}
          </Col>
        </Row>
      </Container>

      <Container className="custom-container-2">
        <span className="creditos"><FormattedMessage id="app.Credits" defaultMessage="Credits" /></span>
        {deudas.map((deuda) => {
          return <Container key={deuda.id} className="progress-container">
            <Row>
              <Col lg={11}>
                <div className="progress-details">
                  <span className='info-deuda'>{deuda.nombre}</span>
                  <span className='info-deuda'>{deuda.monto}</span>
                </div>
                <progress
                  className="custom-progress"
                  value={(totalDeudas - deuda.monto) / totalDeudas}
                  max="1"
                ></progress>
              </Col>
              <Col lg={1}>
                <button aria-label="Show Details" className="eye-button" onClick={() => {navigate('/deudorApp')
                localStorage.setItem('deudaId', deuda.id);
                }}>
                  <i className="bi bi-eye"></i>
                </button>
              </Col>
            </Row>
          </Container>
        })}
      </Container>

      {/* Modal for editing debtor */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Deudor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFullName">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="nombrecompleto"
                value={deudorEdited.nombrecompleto}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={deudorEdited.email}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={deudorEdited.telefono}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* Add other fields as needed */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={() => { setDeudorBase(); setShowEditModal(false); }}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="text-center">
        <Button className="btn buttom-general" onClick={() => navigate('/crearPrestamo')}>
          <FormattedMessage id="app.crearPrestamoBoton" />
        </Button>
      </div>
      <Footer />
      <div className="text-center">
    </div>
    </div>
  );
}
