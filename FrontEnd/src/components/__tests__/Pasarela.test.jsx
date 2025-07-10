import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import Pasarela from '../Pasarela';
import messages_en from '../local/en.json';

const messages = {
    'en': messages_en,
};

const language = 'en';

describe('Pasarela', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <IntlProvider locale={language} messages={messages[language]}>
                    <Pasarela />
                </IntlProvider>
            </MemoryRouter>
        );
    })
    test("Verificar que renderizó correctamente los componentes de pago", () => {
        expect(screen.queryByText('Nequi')).toBeInTheDocument();
        expect(screen.queryByText('Debit or credit card')).toBeInTheDocument();
        expect(screen.queryByText('PSE')).toBeInTheDocument();
    })

    test("Verificar que los 3 modales abren y cierran",async () => {
        const modalBtnArray = screen.getAllByRole("button", { name: "Open Payment" });
        expect(modalBtnArray.length).toBe(3);

        for(let btn=0;btn<modalBtnArray.length;btn++){
            fireEvent.click(modalBtnArray[btn]);
            expect(screen.queryByText('Card Payment') || screen.queryByText('Nequi Payment') || screen.queryByText('PSE Payment')).toBeInTheDocument();

            // Cerrar el modal
            fireEvent.click(screen.getByText("Cancel"));
            await waitFor(() => {
                expect(screen.queryByText('Card Payment') || screen.queryByText('Nequi Payment') || screen.queryByText('PSE Payment')).not.toBeInTheDocument();
            });
        };
    });

    test('Validar la entrada correcta de datos de T. Credito', () => { // YEs
        const validCardData = {
            interest: 5000,
            principal: 50000,
            cardNumber: "4111111111111111",
            dueMonth: "5",
            dueYear: "2025",
            ccv: "123"
        };
        
        const cardArrowButton = screen.getAllByRole("button", { name: "Open Payment" })[0];
        fireEvent.click(cardArrowButton);

        // Fill out form
        fireEvent.change(screen.getByLabelText(/Interest/i), { target: { value: validCardData.interest.toString() } });
        fireEvent.change(screen.getByLabelText(/Principal/i), { target: { value: validCardData.principal.toString() } });
        fireEvent.change(screen.getByLabelText(/Card number/i), { target: { value: validCardData.cardNumber } });
        fireEvent.change(screen.getByLabelText(/CVV/i), { target: { value: validCardData.ccv } });
        
        // Select month and year
        const monthSelect = screen.getByLabelText(/Select month/i);
        fireEvent.change(monthSelect, { target: { value: validCardData.dueMonth } });
        
        const yearSelect = screen.getByLabelText(/Select year/i);
        fireEvent.change(yearSelect, { target: { value: validCardData.dueYear } });

        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);
    });
    
    test('Validar la entrada correcta de datos de Nequi', () => { //yes
        const validNequiData = {
            interest: 3000,
            principal: 30000,
            phoneNumber: "3101234567"
        };
        
        const nequiArrowButton = screen.getAllByRole("button", { name: "Open Payment" })[1];
        fireEvent.click(nequiArrowButton);

        // Fill out form
        fireEvent.change(screen.getByLabelText(/Interest/i), { target: { value: validNequiData.interest.toString() } });
        fireEvent.change(screen.getByLabelText(/Principal/i), { target: { value: validNequiData.principal.toString() } });
        fireEvent.change(screen.getByLabelText(/Phone number/i), { target: { value: validNequiData.phoneNumber } });

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
    });
     
    test('Validar la entrada correcta de datos de PSE', () => { //Yes
        const validPSEData = {
            interest: 4000,
            principal: 40000,
            fullName: "Juan Pérez",
            phoneNumber: "3209876543",
            id: "789456"
        };
        
        const pseArrowButton = screen.getAllByRole("button", { name: "Open Payment" })[2];
        fireEvent.click(pseArrowButton);

        // Fill out form
        fireEvent.change(screen.getByLabelText(/Interest/i), { target: { value: validPSEData.interest.toString() } });
        fireEvent.change(screen.getByLabelText(/Principal/i), { target: { value: validPSEData.principal.toString() } });
        fireEvent.change(screen.getByLabelText(/Full Nam/i), { target: { value: validPSEData.fullName } });
        fireEvent.change(screen.getByLabelText(/Phone number/i), { target: { value: validPSEData.phoneNumber } });
        fireEvent.change(screen.getByLabelText(/ID/i), { target: { value: validPSEData.id } });

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
    });

    test('Mostrar error para datos invalidos de T. Credito', () => { //nop
        const cardArrowButton = screen.getAllByRole("button", { name: "Open Payment" })[0];
        fireEvent.click(cardArrowButton);

        // Fill out form with invalid data
        fireEvent.change(screen.getByLabelText(/Interest/i), { target: { value: "10" } });
        fireEvent.change(screen.getByLabelText(/Principal/i), { target: { value: "1000" } });
        fireEvent.change(screen.getByLabelText(/Select Year/i), { target: { value: "2030" } });
        fireEvent.change(screen.getByLabelText(/Principal/i), { target: { value: "1000" } });
        fireEvent.change(screen.getByLabelText(/Card number/i), { target: { value: "411" } }); // Too short
        fireEvent.change(screen.getByLabelText(/CVV/i), { target: { value: "12" } }); // Too short

        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);

        // Assert error messages
        expect(screen.queryByText(/All fields are not complete/i) || screen.queryByText(/The credit card must have between 15 or 16 digits/i) || screen.queryByText(/The CCV must have 3 digits/i)).toBeInTheDocument()
    });

    test('Mostrar error para datos invalidos de Nequi', () => { //Nop
        
        
        const nequiArrowButton = screen.getAllByRole("button", { name: "Open Payment" })[1];
        fireEvent.click(nequiArrowButton);

        //Fill out form with invalid phone number
        fireEvent.change(screen.getByLabelText(/Interest/i), { target: { value: "10" } });
        fireEvent.change(screen.getByLabelText(/Principal/i), { target: { value: "1000" } });
        fireEvent.change(screen.getByLabelText(/Phone number/i), { target: { value: "310" } });

        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);

        //Assert error message
        expect(screen.queryByText(/All fields are not complete/i) || screen.queryByText(/The phone number must have 10 digits/i)).toBeInTheDocument();
    });

    test('Mostrar error para datos invalidos de PSE', () => {
        
        
        const pseArrowButton = screen.getAllByRole("button", { name: "Open Payment" })[2];
        fireEvent.click(pseArrowButton);

        // Fill out form with invalid data
        fireEvent.change(screen.getByLabelText(/Interest/i), { target: { value: "10" } });
        fireEvent.change(screen.getByLabelText(/Principal/i), { target: { value: "1000" } });
        fireEvent.change(screen.getByLabelText(/Phone number/i), { target: { value: "320" } });
        fireEvent.change(screen.getByLabelText(/ID/i), { target: { value: "12" } });

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        // Assert error messages
        expect(screen.queryByText(/All fields are not complete/i) || screen.queryByText(/The phone number must have 10 digits/i) || screen.queryByText(/The ID must be between 6-9 digits/i)).toBeInTheDocument();
        // expect(mockNavigate).not.toHaveBeenCalled();
    });
})

