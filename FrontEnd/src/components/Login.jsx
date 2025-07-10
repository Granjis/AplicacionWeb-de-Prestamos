import React, { useState } from "react";
import "./styles/Login.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Función para validar el formulario
    const validateForm = () => {
        if (!username || !password) {
            setErrorMessage("Por favor, completa todos los campos.");
            return false;
        }

        if (password.length < 6) {
            setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
            return false;
        }

        setErrorMessage("");
        return true;
    };

    // Función para manejar el login
    const handleLogin = async (e, userType) => {
        e.preventDefault();

        // Validar el formulario antes de enviar la solicitud
        if (!validateForm()) {
            return;
        }

        try {
            const createPrestamista = await fetch(`http://localhost:3000/prestamistas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre:"Jorge Bustamante", direccion:"Calle 18 #3-43", telefono:"3147227637", correo:"jorgebtm26@gmail.com", foto:"https://media.licdn.com/dms/image/v2/D4E03AQH3sXYnylgKlg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1732513539755?e=1738800000&v=beta&t=WnyReVAsNj6bB-VTVl9dS-Awewij5u8GPcjXcZ06auE"
                    , fondosTotales: 1000000, saldo: 500000
                 }), // Enviar userType al backend
            });

            const prestamista = await createPrestamista.json();

            localStorage.setItem("prestamistaId", prestamista.id);

            if (!createPrestamista.ok) {
                setErrorMessage(prestamista.error || "Error al iniciar sesión.");
                return;
            }
            const response = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }), // Enviar userType al backend
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || "Error al iniciar sesión.");
                return;
            }


            // Guardar token y tipo de usuario en localStorage
            localStorage.setItem("token", data.token);

            if (response.ok) {
                window.location.href = "/deudores";
            }
        } catch (error) {
            setErrorMessage("Ocurrió un error. Por favor, intenta nuevamente.");
        }
    };

    return (
        <section className="vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="img-fluid"
                            alt="Sample image"
                        />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form>
                            <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                                <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                                <button type="button" className="btn btn-primary btn-floating mx-1">
                                    <i className="bi bi-facebook"></i>
                                </button>
                                <button type="button" className="btn btn-primary btn-floating mx-1">
                                    <i className="bi bi-twitter"></i>
                                </button>
                                <button type="button" className="btn btn-primary btn-floating mx-1">
                                    <i className="bi bi-linkedin"></i>
                                </button>
                            </div>

                            <div className="divider d-flex align-items-center my-4">
                                <p className="text-center fw-bold mx-3 mb-0">Or</p>
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    id="username"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label className="form-label" htmlFor="username">Username</label>
                            </div>

                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label className="form-label" htmlFor="password">Password</label>
                            </div>

                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check mb-0">
                                    <input className="form-check-input me-2" type="checkbox" id="rememberMe" />
                                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                </div>
                                <a href="#!" className="text-body">Forgot password?</a>
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    type="button"
                                    onClick={(e) => handleLogin(e, "prestamista")}
                                    className="btn btn-primary btn-lg me-2"
                                >
                                    Login
                                </button>
                                <p className="small fw-bold mt-2 pt-1 mb-0">
                                    Don't have an account? <a href="/signup" className="link-danger">Register</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
