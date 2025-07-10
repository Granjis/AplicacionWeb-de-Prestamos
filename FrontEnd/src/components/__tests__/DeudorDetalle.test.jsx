import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import DeudorDetalle from '../DeudorDetalle';
import messages_en from '../local/en.json';

const messages = {
    'en': messages_en,
};

const language = 'en';
// Mensajes de prueba
describe('DeudorDetalle', () => {
    beforeEach(() => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'deudorId') {
                return '1'; // Valor de prueba para deudorId
            }
            return null;
        });
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'token') {
                return '123124342'; // Valor de prueba para deudorId
            }
            return null;
        });
        render(
            <MemoryRouter>
                <IntlProvider locale={language} messages={messages[language]}>
                    <DeudorDetalle />
                </IntlProvider>
            </MemoryRouter>
        );
    });

    test('Debe renderizar correctamente el componente', () => {
        expect(screen.getByText('Credits')).toBeInTheDocument();
    });

    test('Abre y cierra el modal de editar información', () => {
        fireEvent.click(screen.getByRole('button',{name:"Edit Info"}));
        expect(screen.getByRole('button',{name:"Guardar Cambios"})).toBeInTheDocument();
        fireEvent.click(screen.getByText('Cancelar'));
        expect(screen.queryByText('New Interest(%)')).not.toBeInTheDocument();
    });

    test('Actualizar la informacion por el modal',async () => {
        fireEvent.click(screen.getByRole('button',{name:"Edit Info"}));
        expect(screen.getByRole('button',{name:"Guardar Cambios"})).toBeInTheDocument();



        fireEvent.change(screen.getByLabelText("Nombre Completo"), { target: { value: 'Samuel Castillo' } });
        fireEvent.change(screen.getByLabelText("Teléfono"), { target: { value: '3211234567' } });
        fireEvent.change(screen.getByLabelText("Email"),{target:{value:'test@hotmail.com'}});
        
        fireEvent.click(screen.getByText('Guardar Cambios'));
        
        expect(screen.getByText(/Samuel Castillo/i)).toBeInTheDocument();
        expect(screen.getByText(/1110450340/i)).toBeInTheDocument();
        expect(screen.getByText(/3211234567/i)).toBeInTheDocument();
        expect(screen.getByText(/test@hotmail.com/i)).toBeInTheDocument();
        expect(screen.getByText(/Employed/i)).toBeInTheDocument();
    });

    test('Verificar boton detalle de deuda', () => {
        const btnArray = screen.getAllByRole('button',{name:'Show Details'})
        expect(btnArray.length).toBe(3)
    })
});
