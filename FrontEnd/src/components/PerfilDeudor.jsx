import { setSeconds } from 'date-fns';
import  { React, useState, useEffect } from 'react';
import { Container, Row, Col, Image, Modal, Form, Button } from 'react-bootstrap';
import './styles/DeudorDetalle.css';
import { Header } from './header';
import { Footer } from './footer';
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from 'react-intl';
function PerfilDeudor(){
    
   
    const nav_links = [
        { name: <FormattedMessage id="app.MyCredits" defaultMessage="MisCreditos" />, url: "/creditos" },
    ];
   const [perfilDeudor, setperfilDeudor] = useState({
        nombre: 'Bob',
        apellido: 'Esponja Pantalones Cuadrados',
        tipoDocumento: 'C.C.',
        numeroDocumento: '19980819',
        direccion: "Fondo de Bikini",
        telefono: "+57 3143807270",
        email: "pantalonesCuadrados@gmail.com",
        ocupacion: "Cocinero",
        puntuacion: 6.66
    });
    const [showEditModal, setShowEditModal] = useState(false);
    return(
        <div>
           <Header nav_links={nav_links} logged={true} usuario={'Jorge'} />
           <Container className='custom-container'>
                <Row>
                    <Col>
                        <Image src="/2148859448.jpg" roundedCircle className='mb-3 img-fluid' alt='imgPerfil' />
                    </Col>
                    <Col >
                        <Container>
                            <Row>
                                <h1> <FormattedMessage id="app.ProfileInfo" />   </h1>
                            </Row>
                            <br></br>
                            <br></br>
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.nombre" />:</strong> <span className='documento'>{perfilDeudor.nombre + ' ' + perfilDeudor.apellido} </span></h5>
                            </Row>
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.identificacion" />:</strong> <span className='documento'>{perfilDeudor.tipoDocumento + ' ' + perfilDeudor.numeroDocumento} </span></h5>
                            </Row>
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.direccion" />:</strong> <span className='documento'>{perfilDeudor.direccion} </span></h5>
                            </Row>
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.telefono" />:</strong> <span className='documento'>{perfilDeudor.telefono} </span></h5>
                            </Row>
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.email" />:</strong> <span className='documento'>{perfilDeudor.email} </span></h5>
                            </Row>
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.ocupacion" />:</strong> <span className='documento'>{perfilDeudor.ocupacion} </span></h5>
                            </Row>
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.puntuacion" />:</strong> <span className='documento'>{perfilDeudor.puntuacion} </span></h5>
                            </Row>
                            <Row className="d-flex flex-column align-items-center align-self-center">
                                <span className="rounded-pill">
                                    <i className="bi bi-pencil-square edit-button" style={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => { setperfilDeudor({ ...perfilDeudor }); setShowEditModal(true) }}></i>
                                </span>
                                <p>&nbsp;</p> {/* Placeholder to maintain the same height */}
                            </Row>
                        </Container>
                        <div>

                        </div>
                    </Col>
                </Row>
            </Container>
           <Footer />

           <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title><FormattedMessage id="app.editInfo" defaultMessage="Edit Information" /></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label><FormattedMessage id="resumen.nombre" defaultMessage="" /></Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={perfilDeudor.nombre}
                                onChange={(e) => setperfilDeudor({ ...perfilDeudor, nombre: e.target.value })}
                            />
                            <Form.Label><FormattedMessage id="resumen.apellido" defaultMessage="" /></Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={perfilDeudor.apellido}
                                onChange={(e) => setperfilDeudor({ ...perfilDeudor, apellido: e.target.value })}
                            />
                            <Form.Label><FormattedMessage id="resumen.identificacion" defaultMessage="" /></Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={perfilDeudor.numeroDocumento}
                                onChange={(e) => setperfilDeudor({ ...perfilDeudor, numeroDocumento: e.target.value })}
                            />
                            <Form.Label><FormattedMessage id="resumen.direccion" defaultMessage="" /></Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={perfilDeudor.direccion}
                                onChange={(e) => setperfilDeudor({ ...perfilDeudor, direccion: e.target.value })}
                            />
                            <Form.Label><FormattedMessage id="resumen.telefono" defaultMessage="" /></Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={perfilDeudor.telefono}
                                onChange={(e) => setperfilDeudor({ ...perfilDeudor, telefono: e.target.value })}
                            />
                             <Form.Label><FormattedMessage id="resumen.email" defaultMessage="" /></Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={perfilDeudor.email}
                                onChange={(e) => setperfilDeudor({ ...perfilDeudor, email: e.target.value })}
                            />
                             <Form.Label><FormattedMessage id="resumen.ocupacion" defaultMessage="" /></Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={perfilDeudor.ocupacion}
                                onChange={(e) => setperfilDeudor({ ...perfilDeudor, ocupacion: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        <FormattedMessage id="app.cancel" defaultMessage="Cancel" />
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setperfilDeudor({ ...perfilDeudor })
                        setShowEditModal(false)
                    }}>
                        <FormattedMessage id="app.save" defaultMessage="Save" />
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}export default PerfilDeudor;