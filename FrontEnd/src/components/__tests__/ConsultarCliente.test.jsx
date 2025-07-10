// ConsultarCliente.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from 'react-router-dom';
import messages_es from '../local/es.json';
import ConsultarCliente from "../consultarCliente";

const messages = {
    'es': messages_es,
};

const language = 'es';

// Función auxiliar para renderizar el componente con los proveedores necesarios
const renderWithProviders = (ui) => {
    return render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                {ui}
            </IntlProvider>
        </MemoryRouter>
    );
};

describe('Componente ConsultarCliente', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('1. Muestra el título correctamente', () => {
        renderWithProviders(<ConsultarCliente />);
        const titulo = screen.getByText(messages[language]['consultarCliente.titulo']);
        expect(titulo).toBeInTheDocument();
    });

    test('2. Muestra los botones de "Buscar" y "Consultar Todos"', () => {
        renderWithProviders(<ConsultarCliente />);
        const botonBuscar = screen.getByRole('button', { name: messages[language]['consultarCliente.botonBuscar'] });
        const botonConsultarTodos = screen.getByRole('button', { name: messages[language]['consultarCliente.botonConsultarTodos'] });

        expect(botonBuscar).toBeInTheDocument();
        expect(botonConsultarTodos).toBeInTheDocument();
    });

    test('3. El campo de búsqueda se encuentra en el documento', () => {
        renderWithProviders(<ConsultarCliente />);
        const inputBusqueda = screen.getByPlaceholderText(messages[language]['consultarCliente.placeholder']);
        expect(inputBusqueda).toBeInTheDocument();
    });

    test('4. Muestra un mensaje de error si la búsqueda no encuentra un cliente', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue([]),
        });

        renderWithProviders(<ConsultarCliente />);
        const botonBuscar = screen.getByRole('button', { name: messages[language]['consultarCliente.botonBuscar'] });
        fireEvent.click(botonBuscar);

        await waitFor(() => {
            const mensajeError = screen.getByText((content, element) => {
                return element.textContent === messages[language]['consultarCliente.mensajeError'];
            });
            expect(mensajeError).toBeInTheDocument();
        });

        global.fetch.mockRestore();
    });

    test('5. Muestra una lista de clientes al hacer clic en "Consultar Todos"', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue([
                { nombre: 'Juan Pérez', identification: '123', telefono: '5551234567', correo: 'juan@example.com', ocupacion: 'Ingeniero' },
            ]),
        });

        renderWithProviders(<ConsultarCliente />);
        const botonConsultarTodos = screen.getByRole('button', { name: messages[language]['consultarCliente.botonConsultarTodos'] });
        fireEvent.click(botonConsultarTodos);

        await waitFor(() => {
            const tablaClientes = screen.getByRole('table');
            expect(tablaClientes).toBeInTheDocument();
        });

        global.fetch.mockRestore();
    });

    test('6. Muestra los datos del cliente cuando se encuentra uno', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue([
                { nombre: 'Juan Pérez', identification: '123', foto: 'foto.png', direccion: 'Calle Falsa 123', telefono: '5551234567', correo: 'juan@example.com', ocupacion: 'Ingeniero', historial: [] },
            ]),
        });

        renderWithProviders(<ConsultarCliente />);
        const inputBusqueda = screen.getByPlaceholderText(messages[language]['consultarCliente.placeholder']);
        fireEvent.change(inputBusqueda, { target: { value: 'Juan Pérez' } });

        const botonBuscar = screen.getByRole('button', { name: messages[language]['consultarCliente.botonBuscar'] });
        fireEvent.click(botonBuscar);

        await waitFor(() => {
            const nombreCliente = screen.getByText('Juan Pérez');
            expect(nombreCliente).toBeInTheDocument();
        });

        global.fetch.mockRestore();
    });

    test('7. No muestra la tabla de clientes si se muestra un cliente específico', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue([
                { nombre: 'Juan Pérez', identification: '123', foto: 'foto.png', direccion: 'Calle Falsa 123', telefono: '5551234567', correo: 'juan@example.com', ocupacion: 'Ingeniero', historial: [] },
            ]),
        });

        renderWithProviders(<ConsultarCliente />);
        const inputBusqueda = screen.getByPlaceholderText(messages[language]['consultarCliente.placeholder']);
        fireEvent.change(inputBusqueda, { target: { value: 'Juan Pérez' } });

        const botonBuscar = screen.getByRole('button', { name: messages[language]['consultarCliente.botonBuscar'] });
        fireEvent.click(botonBuscar);

        await waitFor(() => {
            const tablaClientes = screen.queryByRole('table');
            expect(tablaClientes).not.toBeInTheDocument();
        });

        global.fetch.mockRestore();
    });

    test('8. Muestra un mensaje de error si ocurre un problema al obtener los datos', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('API error'));

        renderWithProviders(<ConsultarCliente />);
        const botonBuscar = screen.getByRole('button', { name: messages[language]['consultarCliente.botonBuscar'] });
        fireEvent.click(botonBuscar);

        await waitFor(() => {
            const mensajeError = screen.getByText(messages[language]['consultarCliente.errorDatos']);
            expect(mensajeError).toBeInTheDocument();
        });

        global.fetch.mockRestore();
    });

    test('9. El botón de regresar al menú principal tiene el enlace correcto', () => {
        renderWithProviders(<ConsultarCliente />);
        const linkRegresar = screen.getByRole('link', { name: messages[language]['consultarCliente.volverMenu'] });
        expect(linkRegresar).toHaveAttribute('href', '/deudores');
    });
});
