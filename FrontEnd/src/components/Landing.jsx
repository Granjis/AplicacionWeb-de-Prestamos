import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Header } from "./header";
import { Footer } from "./footer";
import "./styles/landing.css";

export default function Landing() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <header>
                <Header />
            </header>
            <main className="flex-grow-1">
                <section className="landing-top py-5">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={6} className="text-center text-lg-start mb-4 mb-lg-0">
                                <h1 className="display-4 fw-bold mb-3">Administra tus préstamos sin esfuerzo</h1>
                                <p className="lead mb-4">Olvídate de las hojas de cálculo, y dile hola a una plataforma que administre tus préstamos en un solo lugar</p>
                                <Button as={Link} to="/signup" variant="primary" className="button-empieza-landing" size="lg">Empieza ahora</Button>
                            </Col>
                            <Col lg={6}>
                                <img src="/Imagen_landing_1.png" alt="Imagen principal" className="img-fluid" />
                            </Col>
                        </Row>
                    </Container>
                </section>

                <section className="py-5">
                    <Container className="my-5 container-medio">
                        <Row className="align-items-center justify-content-center seccion-medio">
                            <Col lg={6} className="text-center text-lg-start mb-4 mb-lg-0">
                                <h2 className="display-5 fw-bold mb-3">Manejador de préstamos</h2>
                                <p className="lead mb-4">Toma el control de tus finanzas, y administra sin esfuerzo toda la información de tus deudores</p>
                                <Button as={Link} to="/signup" variant="light" size="lg" className="button-media-landing">Ingresa</Button>
                            </Col>
                            <Col lg={6} className="text-center">
                                <img src="/Imagen3.png" alt="Imagen media" className="img-fluid" />
                            </Col>
                        </Row>
                    </Container>
                </section>

                <section className="bg-light py-5">
                    <Container>
                        <h2 className="display-5 fw-bold text-center mb-5">¿Por qué escoger prest?</h2>
                        <Row className="g-4">
                            <Col md={6}>
                                <Card className="h-100 carta-izquierda carta text-white rounded-4">
                                    <Card.Body className="d-flex flex-column">
                                        <h3 className="card-title fw-bold mb-3">Con <span className="fw-bolder">prest</span> tienes el control de tus finanzas</h3>
                                        <p className="card-text mb-4">Dile adiós a las hojas de cálculo sin orden, ahora tendrás control sobre lo que prestas</p>
                                        <Button as={Link} to="/signup" variant="light" className="button-media-landing mt-auto align-self-center">Ingresa</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="h-100 carta-derecha carta text-white rounded-4">
                                    <Card.Body className="d-flex flex-column">
                                        <h3 className="card-title fw-bold mb-3">Todo en un solo <span className="fw-bolder">lugar</span> y sin esfuerzo</h3>
                                        <p className="card-text mb-4">Dile adiós a las hojas de cálculo sin orden, ahora tendrás control sobre lo que prestas</p>
                                        <Button as={Link} to="/signup" variant="light" className="button-media-landing mt-auto align-self-center">Ingresa</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>

                <section className="py-5">
                    <Container>
                        <h2 className="display-5 fw-bold text-center mb-5">Historias de clientes</h2>
                        <Row className="g-4">
                            <Col md={6}>
                                <Card className="h-100 shadow-lg rounded-4">
                                    <Card.Body className="text-center">
                                        <img src="https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm90byUyMGRlJTIwcGVyZmlsfGVufDB8fDB8fHww" alt="Jeremías Valencia" className="img-fluid mb-4 rounded-circle" style={{width: '200px', height: '200px', objectFit: 'cover'}} />
                                        <h4 className="mt-3 text-dark">Jeremías Valencia, 36 años, Fresno Tolima</h4>
                                        <p className="text-dark">Dile adiós a las hojas de cálculo sin orden, ahora tendrás control sobre lo que prestas</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="h-100 shadow-lg rounded-4">
                                    <Card.Body className="text-center">
                                        <img src="https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Juan Martínez" className="img-fluid mb-4 rounded-circle" style={{width: '200px', height: '200px', objectFit: 'cover'}} />
                                        <h4 className="mt-3 text-dark">Juan Martínez, 38 años, Bogotá DC.</h4>
                                        <p className="text-dark">Juan Martínez se quedó sin trabajo, ahora es un "gota a gota" no usurero.</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </main>
            <Footer />
        </div>
    );
}