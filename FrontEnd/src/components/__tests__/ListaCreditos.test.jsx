//ListaCreditos.test.jsx

import { render, screen, waitFor } from '@testing-library/react';
import ListaCreditos from '../listaCreditos';
import { IntlProvider } from 'react-intl';
import messages from '../local/es.json';
import { MemoryRouter } from 'react-router-dom';

describe('Componente ListaCreditos', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { id: 1, usuarioId: 1, nombre: 'Crédito 1', monto: 1000, fechaPago: '2024-11-10', estado: 'Activo' },
                        { id: 2, usuarioId: 2, nombre: 'Crédito 2', monto: 2000, fechaPago: '2024-12-15', estado: 'Pendiente' },
                    ]),
            })
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('1. Renderiza mensaje de carga inicialmente', () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter>
                    <ListaCreditos />
                </MemoryRouter>
            </IntlProvider>
        );

        expect(screen.getByText(/Cargando créditos\.\.\./i)).toBeInTheDocument();
    });


    test('2. Filtra créditos para el usuario actual', async () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter>
                    <ListaCreditos />
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Crédito 1')).toBeInTheDocument();
        });

        expect(screen.queryByText('Crédito 2')).not.toBeInTheDocument();
    });

    test('3. Renderiza "No tienes créditos registrados." cuando el usuario no tiene créditos', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{ id: 2, usuarioId: 2, nombre: 'Crédito 2', monto: 2000, fechaPago: '2024-12-15', estado: 'Pendiente' }]),
            })
        );

        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter>
                    <ListaCreditos />
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/No tienes créditos registrados\./i)).toBeInTheDocument();
        });
    });

    test('4. Renderiza mensaje de error cuando la obtención de datos falla', async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API error')));

        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter>
                    <ListaCreditos />
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Error: API error/i)).toBeInTheDocument();
        });
    });

    test('5. Renderiza enlaces correctos para cada crédito', async () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter>
                    <ListaCreditos />
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            const creditLink = screen.getByText('Crédito 1').closest('a');
            expect(creditLink).toHaveAttribute('href', '/visualizar-transacciones/1');
        });
    });

    test('6. Renderiza encabezado con enlaces de navegación correctos', () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter>
                    <ListaCreditos />
                </MemoryRouter>
            </IntlProvider>
        );

        const navLink = screen.getByRole('link', { name: /Mis Créditos/i });
        expect(navLink).toHaveAttribute('href', '/creditos');
    });

    test('7. Renderiza el componente del pie de página', () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter>
                    <ListaCreditos />
                </MemoryRouter>
            </IntlProvider>
        );

        expect(screen.getByText(/©/i)).toBeInTheDocument();
    });

    test('8. Muestra detalles de crédito correctamente', async () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter>
                    <ListaCreditos />
                </MemoryRouter>
            </IntlProvider>
        );
    
        await waitFor(() => {
            expect(screen.getByText('Crédito 1')).toBeInTheDocument();
        });
    
        expect(screen.getByText((content, element) => {
            const hasText = (node) => node.textContent.includes('$1000');
            const elementHasText = hasText(element);
            const childrenDontHaveText = Array.from(element.children).every(
                (child) => !hasText(child)
            );
            return elementHasText && childrenDontHaveText;
        })).toBeInTheDocument();
    
        expect(screen.getByText(/Fecha de Pago: 2024-11-10/i)).toBeInTheDocument();
        expect(screen.getByText(/Estado: Activo/i)).toBeInTheDocument();
    });
    
    test('9. Maneja correctamente la respuesta vacía de la API', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]), // Respuesta vacía
            })
        );

        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter>
                    <ListaCreditos />
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/No tienes créditos registrados\./i)).toBeInTheDocument();
        });
    });

});