import { React, useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Form, Button, ListGroupItem, ListGroup } from 'react-bootstrap';
import './styles/DeudorDetalle.css';
import { Header } from './header';
import { Footer } from './footer';
import { FormattedMessage } from 'react-intl';

function PerfilPrestamista() {
    const nav_links = [
        { name: <FormattedMessage id="app.Deudores" defaultMessage="Deudores" />, url: "/deudores" },
        { name: <FormattedMessage id="app.MiDinero" defaultMessage="My Money" />, url: "/midinero" },
    ];

    const [perfilPrestamista, setPerfilPrestamista] = useState(null); // Estado inicial del perfil
    const [recursos, setRecursos] = useState([]); // Estado inicial de los recursos
    const [isLoading, setIsLoading] = useState(true); // Indicador de carga
    const [showEditModal, setShowEditModal] = useState(false); // Modal para editar perfil
    const [showEditModalRecurso, setShowEditModalRecurso] = useState(false); // Modal para editar recurso
    const [prestamos, setPrestamos] = useState([]); // Estado inicial de los prestamos
    const [idPrestamo, setIdPrestamo] = useState(null); // Estado inicial de los prestamos
    const [isSaving, setIsSaving] = useState(false); // Indicador de guardado
    const [showModalAsociar, setShowModalAsociar] = useState(false); // Indicador de guardado\
    const  [listaRecursoPrestamo, setListaRecursoPrestamo] = useState(false)
    const [indexRecurso, setIndexRecurso] = useState(false)
    

    const [recurso, setRecurso] = useState({
        nombre: "",
        tipo: "",
        descripcion: "",
        valor: 100000
         }
    );
    useEffect(() => {
        const fetchPerfilPrestamista = async () => {
            const token = localStorage.getItem("token");
            const idprestamista = localStorage.getItem("prestamistaId");
            const url = `http://localhost:3000/prestamistas/${idprestamista}`;
           
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener el perfil del prestamista");
                }

                const data = await response.json();
                setPerfilPrestamista(data);
            } catch (error) {
                console.error("Error al obtener el perfil del prestamista:", error);
            } finally {
                setIsLoading(false);
            }
        };
        const fetchRecursos = async () => {
            const token = localStorage.getItem("token");
            const idprestamista = localStorage.getItem("prestamistaId");
            const url = `http://localhost:3000/prestamistas/${idprestamista}/recursos/`;

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener los recursos del prestamista");
                }

                const data = await response.json();
                setRecursos(data);
            } catch (error) {
                console.error("Error al obtener el recurso del prestamista: no deberia pasar esto uwu", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchPrestamos  = async () => {
            const token = localStorage.getItem("token");
            const idprestamista = localStorage.getItem("prestamistaId");
            const url = `http://localhost:3000/prestamistas/${idprestamista}/prestamos/`;

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener los recursos del prestamista");
                }

                const data = await response.json();
                setPrestamos(data);
            } catch (error) {
                console.error("Error al obtener el prestamo del prestamista: no deberia pasar esto uwu", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPerfilPrestamista();
        fetchRecursos();
        fetchPrestamos();
        setListaRecursoPrestamo(Array.from({ length: prestamos.length }, () => ""));
    }, []);




    if (isLoading) {
        return (
            <div>
                <Header nav_links={nav_links} logged={true} usuario={'Jorge'} />
                <Container className="custom-container">
                    <Row>
                        <Col className="text-center">
                            <p><FormattedMessage id="app.loading" defaultMessage="Loading..." /></p>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>
        );
    }

    if (!perfilPrestamista) {
        return (
            <div>
                <Header nav_links={nav_links} logged={true} usuario={'Jorge'} />
                <Container className="custom-container">
                    <Row>
                        <Col className="text-center">
                            <p><FormattedMessage id="app.noData" defaultMessage="No profile data available" /></p>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>
        );
    }

    const handleAsociar = async (recursoId, recursoNombre, index) => { // Eliminar la coma extra
        setIsSaving(true);
        const token = localStorage.getItem("token");
    
        const url = `http://localhost:3000/recursos/${recursoId}/prestamos/${idPrestamo}`;
        try {
            // Asociar
            const response = await fetch(url, {
                method: "POST", // Método para crear el recurso
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }, // Enviar los datos actualizados
            });
            const listaAux = [...listaRecursoPrestamo];

            // Modifica el valor en el índice deseado
            listaAux[index] = recursoNombre;
        
            // Actualiza el estado con el nuevo arreglo
            setListaRecursoPrestamo(listaAux);
            setShowModalAsociar(false)  
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error("Error al asociar el recurso");
            }
            console.log("Asociacion exitosa")
        } catch (error) { // El catch debe estar fuera del try
            console.error("Error al asociar:", error);
        } finally {
            setIsSaving(false); // Finaliza el indicador de guardado
        }
    };
    
    const CrerRecurso = async () => {
        setIsSaving(true);
        const token = localStorage.getItem("token");
        const idprestamista = localStorage.getItem("prestamistaId");
        const urlRecurso = `http://localhost:3000/recursos`;
        
        console.log(recurso);
        console.log(JSON.stringify(recurso));
        try {
            // Crear el recurso
            const response = await fetch(urlRecurso, {
                method: "POST", // Método para crear el recurso
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(recurso), // Enviar los datos actualizados
            });
    
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error("Error al crear el recurso");
            }
    
            // Obtener los datos del recurso creado
            const data = await response.json();
    
            // Asociar el recurso al prestamista
            const urlAsociar = `http://localhost:3000/prestamistas/${idprestamista}/recursos/${data.id}`;
            const respuesta = await fetch(urlAsociar, {
                method: "POST", // Método para asociar el recurso
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(recurso), // Enviar los datos actualizados
            });
            setRecursos([...recursos, data]);
            // Verificar si la respuesta de la asociación es exitosa
            if (!respuesta.ok) {
                throw new Error("Error al asociar el recurso");
            }
    
            // Cerrar el modal después de guardar
            setShowEditModalRecurso(false); // Cerrar el modal de edición
    
        } catch (error) {
            console.error("Error al actualizar los recursos:", error);
        } finally {
            setIsSaving(false); // Finaliza el indicador de guardado
        }
    };
    
    const handleBorrarRecurso = async (recursoId) => { // Eliminar la coma extra
            setIsSaving(true);
            console.log(recursoId)
            const token = localStorage.getItem("token");
            const idprestamista = localStorage.getItem("prestamistaId");
            const urlRecurso = `http://localhost:3000/recursos/${recursoId}`;
            const recargaUrl = `http://localhost:3000/prestamistas/${idprestamista}/recursos/`
            try {
            // Asociar el recurso al prestamista
                const urlAsociado = `http://localhost:3000/prestamistas/${idprestamista}/recursos/${recursoId}`;
                const respuesta = await fetch(urlAsociado, {
                    method: "DELETE", // Método para asociar el recurso
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                });
                // Verificar si la respuesta de la asociación es exitosa
                if (!respuesta.ok) {
                    throw new Error("Error al asociar el recurso");
                }
                const response = await fetch(urlRecurso, {
                    method: "DELETE", // Método para crear el recurso
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });
                const respuesta2 = await fetch(recargaUrl, {
                    method: "GET", // Método para asociar el recurso
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                });
                const data = await respuesta2.json();
                setRecursos(data)
                
                // Verificar si la respuesta es exitosa
                if (!response.ok) {
                    throw new Error("Error al crear el recurso");
                }    
            } catch (error) {
                console.error("Error al actualizar los recursos:", error);
            } finally {
                setIsSaving(false); // Finaliza el indicador de guardado
            }
        
        };

    return (
        <div>
            <Header nav_links={nav_links} logged={true} usuario={'Jorge'} />

            <Container className='custom-container'>
                <Row>
                    <Col>
                        <Container>
                            <Row>
                                <h4> <FormattedMessage id="app.ProfileInfo" /> </h4>
                            </Row>
                            <br />
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.nombre" />:</strong> {perfilPrestamista.nombre}</h5>
                            </Row>
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.direccion" />:</strong> {perfilPrestamista.direccion}</h5>
                            </Row>
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.telefono" />:</strong> {perfilPrestamista.telefono}</h5>
                            </Row>
                            <Row>
                                <h5> <strong><FormattedMessage id="resumen.correo" />:</strong> {perfilPrestamista.correo}</h5>
                            </Row>
                            <Row className="d-flex flex-column align-items-center align-self-center">
                                <span className="rounded-pill">
                                    <i
                                        className="bi bi-pencil-square edit-button"
                                        style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                                        onClick={() => setShowEditModal(true)}
                                    ></i>
                                </span>
                            </Row>
                        </Container>
                    </Col>

                    <Col>
    <Container>
        {/* Lista de recursos */}
        <Row>
            <h4><FormattedMessage id="app.recurso" defaultMessage="Lista de Nombres" /></h4>
            <ul>
                {recursos.map((item, index) => (
                    <Container key={index}>
                        <Row>
                            <h5> <strong><FormattedMessage id="resumen.nombre" />:</strong> {item.nombre}</h5>
                        </Row>
                        <Row>
                            <h5> <strong><FormattedMessage id="recurso.valor" />: $</strong> {item.valor}</h5>
                        </Row>
                        <Row>
                            <button 
                                onClick={() => handleBorrarRecurso(item.id)} 
                                style={{ backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "1rem" }}
                            >
                                <i className="bi bi-trash" style={{ marginRight: "0.5rem" }}></i> Borrar
                            </button>
                        </Row>
                    </Container>
                ))}
            </ul>
        </Row>
        <Row>
            <span className="rounded-pill d-inline-block" style={{ backgroundColor: "#007bff", padding: "0.5rem 1rem", color: "#fff", cursor: "pointer", fontSize: "1rem" }} onClick={() => setShowEditModalRecurso(true)}>
                <i className="bi bi-plus-circle" style={{ marginRight: "0.5rem", fontSize: "1.5rem" }}></i>                                                                     
                Agregar Recurso
            </span>
        </Row>
    </Container>
</Col>


                    <Col>
                        <Container>
                            {/* Lista de prestamos */}
                            <Row>
                                <h4><FormattedMessage id="app.prestamos" defaultMessage="Lista de Prestamos" /></h4>
                                <ul>
                                    {prestamos.map((item, index) => (
                                        <Container>
                                            <Row>
                                                <h5> <strong><FormattedMessage id="resumen.nombre" />:</strong> {item.nombre}</h5>
                                            </Row>
                                            <Row>
                                                <h5> <strong><FormattedMessage id="prestamo.monto" />:$</strong> {item.monto}</h5>
                                            </Row>
                                            <Row>
                                                <h5> <strong><FormattedMessage id="prestamo.intereses" />:</strong> {item.interes}%</h5>
                                            </Row>
                                            <Row>
                                    <span className="rounded-pill d-inline-block" style={{ backgroundColor: "#007bff", padding: "0.5rem 1rem", color: "#fff", cursor: "pointer", fontSize: "1rem" }} onClick={() =>{setIdPrestamo(item.id); setIndexRecurso(index); setShowModalAsociar(true)}}>
                                    <i className="bi bi-plus-circle" style={{ marginRight: "0.5rem", fontSize: "1.5rem" }}></i>                                                                     
                                    Asociar Recurso a Prestamo
                                    </span>
                                 </Row>
                                        </Container>
                                    ))}
                                </ul>
                            </Row>
                            
                        </Container>
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
                            <Form.Label><FormattedMessage id="resumen.nombre" defaultMessage="First Name" /></Form.Label>
                            <Form.Control
                                type="text"
                                value={perfilPrestamista.nombre}
                                onChange={(e) => setPerfilPrestamista({ ...perfilPrestamista, nombre: e.target.value })}
                            />
                            <Form.Label><FormattedMessage id="resumen.direccion" defaultMessage="Address" /></Form.Label>
                            <Form.Control
                                type="text"
                                value={perfilPrestamista.direccion}
                                onChange={(e) => setPerfilPrestamista({ ...perfilPrestamista, direccion: e.target.value })}
                            />
                            <Form.Label><FormattedMessage id="resumen.telefono" defaultMessage="Phone" /></Form.Label>
                            <Form.Control
                                type="text"
                                value={perfilPrestamista.telefono}
                                onChange={(e) => setPerfilPrestamista({ ...perfilPrestamista, telefono: e.target.value })}
                            />
                            <Form.Label><FormattedMessage id="resumen.correo" defaultMessage="Email" /></Form.Label>
                            <Form.Control
                                type="email"
                                value={perfilPrestamista.correo}
                                onChange={(e) => setPerfilPrestamista({ ...perfilPrestamista, correo: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        <FormattedMessage id="app.cancel" defaultMessage="Cancel" />
                    </Button>
                    <Button variant="primary" onClick={CrerRecurso} disabled={isSaving}>
                        {isSaving ? <FormattedMessage id="app.saving" defaultMessage="Saving..." /> : <FormattedMessage id="app.save" defaultMessage="Save" />}
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showEditModalRecurso} onHide={() => setShowEditModalRecurso(false)}>
                <Modal.Header closeButton>
                    <Modal.Title><FormattedMessage id="app.editInfo" defaultMessage="Edit Information" /></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label><FormattedMessage id="recurso.nombre" defaultMessage="First Name" /></Form.Label>
                            <Form.Control
                                type="string"
                                value={recurso.nombre}
                                onChange={(e) => setRecurso({ ...recurso, nombre: e.target.value })}
                            />
                            <Form.Label><FormattedMessage id="recurso.tipo" defaultMessage="Address" /></Form.Label>
                            <Form.Control
                                type="string"
                                value={recurso.tipo}
                                onChange={(e) => setRecurso({ ...recurso, tipo: e.target.value })}
                            />
                            <Form.Label><FormattedMessage id="recurso.descripcion" defaultMessage="Phone" /></Form.Label>
                            <Form.Control
                                type="string"
                                value={recurso.descripcion}
                                onChange={(e) => setRecurso({ ...recurso, descripcion: e.target.value })}
                            />
                            <Form.Label><FormattedMessage id="recurso.valor" defaultMessage="Email" /></Form.Label>
                            <Form.Control
                                type= "number"
                                value={recurso.valor}
                                onChange={(e) => setRecurso({ ...recurso, valor: parseFloat(e.target.value) ||  0 })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModalRecurso(false)}>
                        <FormattedMessage id="app.cancel" defaultMessage="Cancel" />
                    </Button>
                    <Button variant="primary" onClick={CrerRecurso} disabled={isSaving}>
                        {isSaving ? <FormattedMessage id="app.saving" defaultMessage="Saving..." /> : <FormattedMessage id="app.save" defaultMessage="Save" />}
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showModalAsociar} onHide={() => setShowModalAsociar(false)}>
                <Modal.Header closeButton>
                    <Modal.Title><FormattedMessage id="app.editInfo" defaultMessage="Edit Information" /></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>El Valor del recurso tiene que ser mayor al monto del prestamo</h5>
                <ListGroup>
          {recursos.map((recurso) => (
            <ListGroupItem key={recurso.id} className="d-flex justify-content-between align-items-center">
              <span>{recurso.nombre}</span>
              <Button 
                variant="primary"
                onClick={() => handleAsociar(recurso.id, recurso.name, indexRecurso)} 
             // Aquí se asocia el recurso
              >
                Asociar
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalAsociar(false)}>
                        <FormattedMessage id="app.cancel" defaultMessage="Cancel" />
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PerfilPrestamista;

