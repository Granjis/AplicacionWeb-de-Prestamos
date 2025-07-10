// CrearCliente.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from 'react-router-dom';
import messages_es from '../local/es.json';
import CrearCliente from "../CrearCliente";

const messages = {
    'es': messages_es,
};

const language = 'es';

// Función auxiliar para renderizar el componente con los proveedores necesarios
const renderWithProviders = (ui) => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({}),
        })
    );
    
    return render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                {ui}
            </IntlProvider>
        </MemoryRouter>
    );
};

describe('Componente CrearCliente', () => {
    test('1. Muestra correctamente los placeholders de los campos de entrada', () => {
        renderWithProviders(<CrearCliente />);

        const placeholders = [
            { id: 'app.placeholderName', name: 'nombre' },
            { id: 'app.placeholderID', name: 'identificacion' },
            { id: 'app.placeholderOccupation', name: 'ocupacion' },
            { id: 'app.placeholderWorkStatus', name: 'situacionLaboral' },
            { id: 'app.placeholderAddress', name: 'direccion' },
            { id: 'app.placeholderPhone', name: 'telefono' },
            { id: 'app.placeholderEmail', name: 'correo' },
        ];

        placeholders.forEach(({ id, name }) => {
            const placeholderText = messages[language][id];
            const input = screen.getByPlaceholderText(placeholderText);
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('name', name);
        });
    });

    test('2. El botón de envío muestra el texto correcto', () => {
        renderWithProviders(<CrearCliente />);

        const buttonText = messages[language]['app.registerClient'];
        const button = screen.getByRole('button', { name: buttonText });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('type', 'submit');
    });

    test('3. Muestra mensaje de error al enviar el formulario vacío', () => {
        renderWithProviders(<CrearCliente />);

        const submitButton = screen.getByRole('button', { name: messages[language]['app.registerClient'] });
        fireEvent.click(submitButton);

        const errorMessage = messages[language]['app.errorFields'];
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('4. Muestra mensaje de error cuando la identificación no es numérica', () => {
        renderWithProviders(<CrearCliente />);

        const testData = {
            nombre: 'Ana López',
            identificacion: 'ABC123', // Identificación inválida
            ocupacion: 'Abogada',
            situacionLaboral: 'Empleado',
            direccion: 'Avenida Siempre Viva 742',
            telefono: '5557654321',
            correo: 'ana@example.com',
        };

        fireEvent.change(screen.getByLabelText(messages[language]['app.fullName']), { target: { value: testData.nombre } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.idNumber']), { target: { value: testData.identificacion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.occupation']), { target: { value: testData.ocupacion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.workStatus']), { target: { value: testData.situacionLaboral } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.address']), { target: { value: testData.direccion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.phone']), { target: { value: testData.telefono } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.email']), { target: { value: testData.correo } });

        const submitButton = screen.getByRole('button', { name: messages[language]['app.registerClient'] });
        fireEvent.click(submitButton);

        const errorMessage = messages[language]['app.errorID'];
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('5. Muestra mensaje de error cuando el teléfono no es numérico', () => {
        renderWithProviders(<CrearCliente />);

        const testData = {
            nombre: 'Carlos Díaz',
            identificacion: '987654321',
            ocupacion: 'Contador',
            situacionLaboral: 'Empleado',
            direccion: 'Calle Principal 456',
            telefono: 'ABC123', // Teléfono inválido
            correo: 'carlos@example.com',
        };

        fireEvent.change(screen.getByLabelText(messages[language]['app.fullName']), { target: { value: testData.nombre } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.idNumber']), { target: { value: testData.identificacion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.occupation']), { target: { value: testData.ocupacion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.workStatus']), { target: { value: testData.situacionLaboral } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.address']), { target: { value: testData.direccion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.phone']), { target: { value: testData.telefono } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.email']), { target: { value: testData.correo } });

        const submitButton = screen.getByRole('button', { name: messages[language]['app.registerClient'] });
        fireEvent.click(submitButton);

        const errorMessage = messages[language]['app.errorPhone'];
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('6. Muestra mensaje de error cuando el correo es inválido', () => {
        renderWithProviders(<CrearCliente />);

        const testData = {
            nombre: 'Pedro Martínez',
            identificacion: '987654321',
            situacionLaboral: 'Empleado',
            ocupacion: 'Doctor',
            direccion: 'Boulevard de los Sueños Rotos 456',
            telefono: '5552345678',
            correo: 'pedro@example', // Correo inválido
        };

        fireEvent.change(screen.getByLabelText(messages[language]['app.fullName']), { target: { value: testData.nombre } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.idNumber']), { target: { value: testData.identificacion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.workStatus']), { target: { value: testData.situacionLaboral } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.occupation']), { target: { value: testData.ocupacion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.address']), { target: { value: testData.direccion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.phone']), { target: { value: testData.telefono } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.email']), { target: { value: testData.correo } });

        const submitButton = screen.getByRole('button', { name: messages[language]['app.registerClient'] });
        fireEvent.click(submitButton);

        const errorMessage = messages[language]['app.errorEmail'];
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('7. Muestra mensaje de éxito y registra los datos al enviar el formulario con datos válidos', async () => {
        const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();

        renderWithProviders(<CrearCliente />);

        const testData = {
            nombre: 'María Gómez',
            identificacion: '123456789',
            ocupacion: 'Ingeniera',
            situacionLaboral: 'Empleado',
            direccion: 'Calle de la Paz 123',
            telefono: '5559876543',
            correo: 'maria@example.com',
        };

        fireEvent.change(screen.getByLabelText(messages[language]['app.fullName']), { target: { value: testData.nombre } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.idNumber']), { target: { value: testData.identificacion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.occupation']), { target: { value: testData.ocupacion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.workStatus']), { target: { value: testData.situacionLaboral } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.address']), { target: { value: testData.direccion } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.phone']), { target: { value: testData.telefono } });
        fireEvent.change(screen.getByLabelText(messages[language]['app.email']), { target: { value: testData.correo } });

        const submitButton = screen.getByRole('button', { name: messages[language]['app.registerClient'] });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(consoleLogMock).toHaveBeenCalledWith(testData);
        });

        consoleLogMock.mockRestore();
    });
});
