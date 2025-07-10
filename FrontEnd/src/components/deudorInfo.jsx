import React from 'react';
import './styles/deudorInfo.css';  // Agrega un archivo CSS para estilos personalizados
import { Row, Col, Image } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';  // Importar FormattedMessage de react-intl
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeudorInfo = ({ deudor, setShowModal, prestamo }) => {

  let estado = "Activa";

  //Renderizado condicional del botón de paz y salvo.
  const renderBalance = () => {
    return (
      <Button className="btn buttom-general" disabled={getBalance() > 0} onClick={() => setShowConfirmationModal(true)}>
        <FormattedMessage id="pazSalvo.tituloBotonCierre" />
      </Button>
    );
  };

  const getBalance = () =>{
    const totalPagado=prestamo.historialpagos.reduce((acc, pago) => acc + (pago.capital || 0), 0);
    return prestamo.monto-totalPagado;
  }

  const totalInterest = () => {
    const interest = prestamo.monto * (prestamo.interes / 100);
    return Math.round(interest); // Redondea al número entero más cercano
  };
  
  //Configuración del Modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const handleCloseConfirmationModal = () => setShowConfirmationModal(false);

  //Boton de generación
  const handleGenerate = () => {
    console.log('Paz y salvo generado correctamente');
    console.log('Enviando correo de confirmación al deudor...');

    prestamo.pagado=true;

    fetch(`http://localhost:3000/prestamo/${prestamo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(prestamo)
    }).then(response => response.json()).then(data => {
      console.log(data);
    })

    setShowConfirmationModal(false);
  };

  
  if(prestamo.pagado){
    estado = "Pagada";
  } 

  const language = navigator.language.split(/[-_]/)[0]; 

  // Convertir fechas a formato YYYY-MM-DD
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <>
      <Row className="align-items-start">
        <Col xs={12} md={3}>
          <Image src={deudor.foto} roundedCircle width={200} height={200} className="mb-3" alt='imgperfil' />
        </Col>
        <Col xs={12} md={2}>
          <Row className="my-3">
            <h4 className="mb-0"><FormattedMessage id="app.name" defaultMessage="Name" /></h4>
            <p className="mb-0 value-data">{deudor.nombrecompleto}</p>
          </Row>
          <Row className="my-3">
            <h4 className="mt-2 mb-0"><FormattedMessage id="app.startDate" defaultMessage="Start date" /></h4>
            <p className="mb-0 value-data">
              {formatDate(prestamo.fechainicio)}  {/* Formatear la fecha de inicio */}
            </p>
          </Row>
          
          <Row className="my-3">
            <h4 className="mt-2 mb-0"><FormattedMessage id="app.dueDate" defaultMessage="Due date" /></h4>
            <p className="mb-0 value-data">
              {formatDate(prestamo.fechafin)}  {/* Formatear la fecha de fin */}
            </p>
            {renderBalance({prestamo})}
          </Row>
        </Col>
        <Col xs={12} md={2}>
          <Row className="my-3">
            <h4 className="mb-0"><FormattedMessage id="app.capital" defaultMessage="Capital" /></h4>
            <p className="mb-0 value-data">$ {prestamo.monto}</p>
          </Row>
          <Row className="my-3">
            <h4 className="mb-0"><FormattedMessage id="app.balance" defaultMessage="Balance Total" /></h4>
            <p className="mb-0 value-data">$ {getBalance()}</p>
          </Row>
          <Row className="my-3">
            <h4 className="mb-0"><FormattedMessage id="app.interestRate" defaultMessage="Interest Rate" /></h4>
            <p className="mb-0 value-data">{prestamo.interes}%</p>
          </Row>
          <Row className="my-3">
            <h4 className="mb-0"><FormattedMessage id="app.totalInterest" defaultMessage="Total Interest" /></h4>
            <p className="mb-0 value-data">$ {totalInterest()}</p>
          </Row>
        </Col>
        <Col xs={12} md={3}>
          <Row className="my-3">
            <h4 className="mb-0"><FormattedMessage id="app.paymentFrequency" defaultMessage="Frecuencia de Pago" /></h4>
            <p className="text-primary mb-0 value-data"  data-testid="interest-value">Mensual</p> {/*//TODO traducir*/}
          </Row>
          <Row className="my-3">
            <h4 className="mb-0"><FormattedMessage id="app.debtState" defaultMessage="Estado de la Deuda" /></h4>
            <p className="text-primary mb-0 value-data">{estado}</p> {/*//TODO traducir*/}
          </Row>
        </Col>
        <Col xs={12} md={"auto"}>
          {/* Botón para modificar el interés */}
          <Button id='button.editInfo' className="mt-3 btn-add" style={{display:'flex'}} onClick={() => setShowModal(true)}>
              <i className="bi bi-pencil-square"></i>&nbsp;
              <FormattedMessage id="app.editInfo" defaultMessage="Edit" /> {}
            </Button>
        </Col>
      </Row>

      {/* Modal para generación de paz y salvo*/}
      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal} centered>
        <Modal.Header closeButton >
          <Modal.Title><FormattedMessage id="pazSalvo.titulo" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className="btn buttom-general" onClick={handleGenerate}>
          <FormattedMessage id="pazSalvo.tituloBotonGenera" />
          </Button>
          <p><FormattedMessage id="pazSalvo.mensaje" /></p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeudorInfo;
