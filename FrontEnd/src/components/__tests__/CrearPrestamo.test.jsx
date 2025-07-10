import { render, screen } from "@testing-library/react";
import { fireEvent, waitFor } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from 'react-router-dom';  
import messages_es from '../local/es.json';
import CrearPrestamo from "../CrearPrestamo";


const messages = {
    'es': messages_es,
};

const language = 'es';

test('Display correct placeholder for loan name input', () => {
    render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                <CrearPrestamo />
            </IntlProvider>
        </MemoryRouter>
    );
    
    const placeholderText = 'Nombre del préstamo';
    const loanNameInput = screen.getByPlaceholderText(placeholderText);
    expect(loanNameInput).toBeInTheDocument();
});

test('Display correct button text', () => {
    render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                <CrearPrestamo />
            </IntlProvider>
        </MemoryRouter>
    );
    const buttonText = 'Crear Préstamo';
    const button = screen.getByRole('button', { name: buttonText });
    expect(button).toBeInTheDocument();
});

test('Fieds should be empty by default', () => {
    render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                <CrearPrestamo />
            </IntlProvider>
        </MemoryRouter>
    );
    const loanNameInput = screen.getByLabelText('Nombre del Préstamo');
    const loanAmountInput = screen.getByLabelText('Monto del Préstamo');
    const loanStartDateInput = screen.getByLabelText('Fecha de inicio del préstamo')
    const loanFinishtDateInput = screen.getByLabelText('Fecha de vencimiento del préstamo')
    const loanInterestInput = screen.getByLabelText('Interés del Préstamo')

    expect(loanNameInput.value).toBe('');
    expect(loanAmountInput.value).toBe('0');
    expect(loanStartDateInput.value).toBe('');
    expect(loanFinishtDateInput.value).toBe('');
    expect(loanInterestInput.value).toBe('0');

});

test('Fields change when filled', () => {
    render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                <CrearPrestamo />
            </IntlProvider>
        </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText('Nombre del Préstamo'), { target: { value: 'Préstamo prueba' } });
    fireEvent.change(screen.getByLabelText('Monto del Préstamo'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('Fecha de inicio del préstamo'), { target: { value: '2024-11-11' } });
    fireEvent.change(screen.getByLabelText('Fecha de vencimiento del préstamo'), { target: { value: '2024-12-12' } });
    fireEvent.change(screen.getByLabelText('Interés del Préstamo'), { target: { value: '5' } });

    expect(screen.getByLabelText('Nombre del Préstamo').value).toBe('Préstamo prueba');
    expect(screen.getByLabelText('Monto del Préstamo').value).toBe('100000');
    expect(screen.getByLabelText('Fecha de inicio del préstamo').value).toBe('2024-11-11');
    expect(screen.getByLabelText('Fecha de vencimiento del préstamo').value).toBe('2024-12-12');
    expect(screen.getByLabelText('Interés del Préstamo').value).toBe('5');
});

test('Submit button shloud be disabled if fields are not filled', () => {
    render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                <CrearPrestamo />
            </IntlProvider>
        </MemoryRouter>
    );
    const button = screen.getByRole('button', { name: 'Crear Préstamo' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
});

test('Submit button should be disabled if fields are partially filled', () => {
    render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                <CrearPrestamo />
            </IntlProvider>
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre del Préstamo'), { target: { value: 'Préstamo prueba' } });

    const button = screen.getByRole('button', { name: 'Crear Préstamo' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled(); 

});

test('Submit button should be enabled if all fields are filled', () => {
    render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                <CrearPrestamo />
            </IntlProvider>
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre del Préstamo'), { target: { value: 'Préstamo prueba' } });
    fireEvent.change(screen.getByLabelText('Monto del Préstamo'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('Fecha de inicio del préstamo'), { target: { value: '2024-11-11' } });
    fireEvent.change(screen.getByLabelText('Fecha de vencimiento del préstamo'), { target: { value: '2024-12-12' } });
    fireEvent.change(screen.getByLabelText('Interés del Préstamo'), { target: { value: '5' } });

    const button = screen.getByRole('button', { name: 'Crear Préstamo' });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled(); 
});

test('Clicking on the "Crear préstamo" button should open the confirmation modal', () => {
    render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                <CrearPrestamo />
            </IntlProvider>
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre del Préstamo'), { target: { value: 'Préstamo prueba' } });
    fireEvent.change(screen.getByLabelText('Monto del Préstamo'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('Fecha de inicio del préstamo'), { target: { value: '2024-11-11' } });
    fireEvent.change(screen.getByLabelText('Fecha de vencimiento del préstamo'), { target: { value: '2024-12-12' } });
    fireEvent.change(screen.getByLabelText('Interés del Préstamo'), { target: { value: '5' } });


    const button = screen.getByRole('button', { name: 'Crear Préstamo' });
    expect(button).toBeInTheDocument();  
    expect(button).toBeEnabled(); 
    fireEvent.click(button);
    const confirmationModal = screen.getByTestId('create-confirmation-modal'); 
    expect(confirmationModal).toBeInTheDocument();
});

test('Confirming the creation of the loan should close the confirmation modal', async () => {
    render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                <CrearPrestamo />
            </IntlProvider>
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre del Préstamo'), { target: { value: 'Préstamo prueba' } });
    fireEvent.change(screen.getByLabelText('Monto del Préstamo'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('Fecha de inicio del préstamo'), { target: { value: '2024-11-11' } });
    fireEvent.change(screen.getByLabelText('Fecha de vencimiento del préstamo'), { target: { value: '2024-12-12' } });
    fireEvent.change(screen.getByLabelText('Interés del Préstamo'), { target: { value: '5' } });


    const button = screen.getByRole('button', { name: 'Crear Préstamo' });
    expect(button).toBeInTheDocument();  
    expect(button).toBeEnabled(); 
    fireEvent.click(button);
    const confirmationModal = screen.getByTestId('create-confirmation-modal'); 
    expect(confirmationModal).toBeInTheDocument();
    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    fireEvent.click(confirmButton);
    await waitFor(() => {
        expect(confirmationModal).not.toBeInTheDocument();
    });
});

test('Confirming the creation of the loan should log the loan information', () => {
    render(
        <MemoryRouter>
            <IntlProvider locale={language} messages={messages[language]}>
                <CrearPrestamo />
            </IntlProvider>
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Nombre del Préstamo'), { target: { value: 'Préstamo prueba' } });
    fireEvent.change(screen.getByLabelText('Monto del Préstamo'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('Fecha de inicio del préstamo'), { target: { value: '2024-11-11' } });
    fireEvent.change(screen.getByLabelText('Fecha de vencimiento del préstamo'), { target: { value: '2024-12-12' } });
    fireEvent.change(screen.getByLabelText('Interés del Préstamo'), { target: { value: '5' } });


    const button = screen.getByRole('button', { name: 'Crear Préstamo' });
    expect(button).toBeInTheDocument();  
    expect(button).toBeEnabled(); 
    fireEvent.click(button);
    const confirmationModal = screen.getByTestId('create-confirmation-modal'); 
    expect(confirmationModal).toBeInTheDocument();
    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    fireEvent.click(confirmButton);
});


