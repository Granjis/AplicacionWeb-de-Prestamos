import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DeudorInfo from './deudorInfo';
import HistorialPagos from './historialpagos';
import { Header } from './header';
import { Footer } from './footer';
import { Container, Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/deudorApp.css';

export default function DeudorApp() {
  const [deudorData, setDeudorData] = useState({
    nombrecompleto: 'Armando Casas',
    cedula: '1110450340',
    situacionLaboral: 'Empleado',
    direccion: 'Calle 123',
    fecha: '2024-01-01',
    ocupacion: 'Ingeniero',
    email: "jorge@gmail.com",
    telefono: "3143807270",
  }); // Datos del deudor

  const [prestamoData, setPrestamoData] = useState({
    nombre: 'Préstamo de Armando Casas',
    monto: 1000000,
    interes: 10,
    fechainicio: '2021-01-01',
    fechafin: '2022-01-01',
    pagado: false,
    historialpagos: [
      {
        fecha: '2021-01-01',
        capital: 50000,
        interes: 5000,
      },
      {
        fecha: '2021-02-01',
        capital: 50000,
        interes: 5000,
      },
    ],
  }); // Datos del préstamo
  
  const [historialPagos, setHistorialPagos] = useState([]); // Historial de pagos del préstamo
  const [newPayment, setNewPayment] = useState({ capital: 0, interes: 0 }); // Nuevo pago
  const [showModal, setShowModal] = useState(false); // Control del modal para agregar pagos
  const [showModalInteres, setShowModalInteres] = useState(false); // Control del modal para modificar datos
  
  const [newPrestamoData, setnewPrestamoData] = useState({
    fechainicio: '',
    fechafin: '',
    monto: 0,
    interes: 0,
    nombre: '',
    pagado:false,
    historialpagos: [],
  });

  const [showDatesError, setShowDatesError] = useState(false);
  const [interestError, setInterestError] = useState(false);

  useEffect(() => {
    // Obtener los datos del préstamo y su historial de pagos
    const token = localStorage.getItem('token');
    const prestamoId = localStorage.getItem('deudaId');
    
    if (!prestamoId || !token) {
      console.error('No hay prestamoId o token disponible');
      return;
    }

    fetch(`http://localhost:3000/prestamo/${prestamoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      setPrestamoData(data);
      setDeudorData(data.deudor);
      setHistorialPagos(data.historialpagos);
      console.log('Datos del préstamo obtenidos correctamente:', data);
    })
    .catch((error) => {
      console.error('Error al obtener los datos del préstamo:', error);
    });
  }, []);

  const actualizarDeudorData = async () => {
    const token = localStorage.getItem('token');
    const prestamoId = localStorage.getItem('deudaId');
    
    if (!prestamoId || !token) {
      console.error('Faltan credenciales o identificadores');
      return;
    }
    
    const updatedPrestamoData = {
      ...newPrestamoData,
      nombre: prestamoData.nombre,
      historialpagos: prestamoData.historialpagos
    };

    try {
      const response = await fetch(`http://localhost:3000/prestamo/${prestamoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPrestamoData),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar los datos: ${response.statusText}`);
      }

      const updatedPrestamo = await response.json();
      setPrestamoData(updatedPrestamo);
      setDeudorData(updatedPrestamo.deudor);
      setShowModalInteres(false);

      console.log('Datos actualizados correctamente:', updatedPrestamo);
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  };

  const agregarPago = async () => {
    const token = localStorage.getItem('token');
    const prestamoId = localStorage.getItem('deudaId');
    
    if (!prestamoId || !token) {
      console.error('Faltan credenciales o identificadores');
      return;
    }
    
    const nuevoPago = {
      capital: newPayment.capital,
      interes: newPayment.interes,
      fecha: new Date().toISOString().split('T')[0],
    };
    
    
    
    console.log('comienza fetch');
    try {
      const responsePago = await fetch(`http://localhost:3000/pagos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoPago),
      });

      if (!responsePago.ok) {
        throw new Error(`Error al crear el pago: ${responsePago.statusText}`);
      }

      const dataPago = await responsePago.json();
      const pagoId = dataPago.id;

      const responseAsociar = await fetch(`http://localhost:3000/prestamos/${prestamoId}/pagos/${pagoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!responseAsociar.ok) {
        throw new Error(`Error al asociar el pago: ${responseAsociar.statusText}`);
      }

      const prestamo = await responseAsociar.json();
      setHistorialPagos(prestamo.historialpagos);
      setPrestamoData({ ...prestamo });
      setShowModal(false);

      console.log('Pago agregado y asociado con éxito:', prestamo);
    } catch (error) {
      console.error('Error al agregar el pago:', error);
    }
  };

  const validateForm = () => {
    setShowDatesError(false);
    setInterestError(false);
    if (newPrestamoData.fechainicio && newPrestamoData.fechafin) {
      const startDate = new Date(newPrestamoData.fechainicio);
      const endDate = new Date(newPrestamoData.fechafin);
      if (startDate > endDate) {
        setShowDatesError(true);
        return false;
      }
    }

    if (newPrestamoData.interes < 0 || newPrestamoData.interes > 100) {
      setInterestError(true);
      return false;
    }

    return true;
  };

  return (
    <>
      <Header
        nav_links={[
          { name: <FormattedMessage id="app.Deudores" defaultMessage="Deudores" />, url: '/deudores' },
        ]}
        logged={true}
        usuario={'Jorge'}
      />
      <Container>
        <Row className="mt-4">
          <Col className="text-center" md={12}>
            {deudorData && <DeudorInfo deudor={deudorData} setShowModal={setShowModalInteres} prestamo={prestamoData} />}
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <h3><FormattedMessage id="app.recents" defaultMessage="Recents" /></h3>
            <Button className="btn-add" onClick={() => setShowModal(true)}>
              <FormattedMessage id="app.addPayment" defaultMessage="Add payment" />
            </Button>
            <HistorialPagos pagos={historialPagos} prestamo={prestamoData} />
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="app.addPayment" defaultMessage="Add Payment" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="capital">
              <Form.Label>Capital</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Enter capital" 
                value={newPayment.capital} 
                onChange={(e) => setNewPayment({ ...newPayment, capital: parseInt(e.target.value) })} 
              />
            </Form.Group>

            <Form.Group controlId="interes">
              <Form.Label>Interes</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Enter interes" 
                value={newPayment.interes} 
                onChange={(e) => setNewPayment({ ...newPayment, interes: parseInt(e.target.value) })} 
              />
            </Form.Group>

            <Button variant="primary" onClick={agregarPago}>
              Agregar Pago
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModalInteres} onHide={() => setShowModalInteres(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Información de Deudor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="fechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={newPrestamoData.fechainicio}
                onChange={(e) => setnewPrestamoData({ ...newPrestamoData, fechainicio: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group controlId="fechafin">
              <Form.Label>Fecha de Vencimiento</Form.Label>
              <Form.Control
                type="date"
                value={newPrestamoData.fechafin}
                onChange={(e) => setnewPrestamoData({ ...newPrestamoData, fechafin: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="prestado">
              <Form.Label>Monto Prestado</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Monto Prestado" 
                value={newPrestamoData.monto} 
                onChange={(e) => {
                  setnewPrestamoData({ ...newPrestamoData, monto: parseInt(e.target.value)});
                  console.log(e.target.value)
                }} 
              />
            </Form.Group>

            <Form.Group controlId="interes">
              <Form.Label>Interés</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Tasa de Interés" 
                value={newPrestamoData.interes} 
                onChange={(e) => setnewPrestamoData({ ...newPrestamoData, interes: parseInt(e.target.value) })} 
              />
              {interestError && <p style={{ color: 'red' }}>El interés debe ser entre 0 y 100.</p>}
              <Form.Text className='text-danger'>
              {showDatesError?'Start and Due Dates must be consistent.':''}
            </Form.Text>
            </Form.Group>
            <Button 
              variant="primary" 
              onClick={() => {
                if (validateForm()) {
                  actualizarDeudorData();
                }
              }}
            >
              Actualizar Datos
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
}
