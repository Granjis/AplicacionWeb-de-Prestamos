// VisualizarTransacciones.test.jsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import VisualizarTransacciones from '../visualizarTransacciones';
import { IntlProvider } from 'react-intl';
import messages from '../local/es.json';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('Componente VisualizarTransacciones', () => {
    beforeEach(() => {
        global.fetch = jest.fn((url) =>
            Promise.resolve({
                ok: true,
                json: () =>
                    url.includes('lista_creditos_mock')
                        ? Promise.resolve([{ id: 1, nombre: 'Crédito 1', monto: 1000, fechaPago: '2024-11-10', estado: 'Activo' }])
                        : Promise.resolve([{ creditoId: 1, fecha: '2024-11-15', capital: 500, interes: 50, total: 550, balance: 450 }]),
            })
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('1. Muestra mensaje de carga inicialmente', () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter initialEntries={['/visualizar-transacciones/1']}>
                    <Routes>
                        <Route path="/visualizar-transacciones/:id" element={<VisualizarTransacciones />} />
                    </Routes>
                </MemoryRouter>
            </IntlProvider>
        );
        expect(screen.getByText(/Cargando transacciones.../i)).toBeInTheDocument();
    });

    test('2. Muestra detalles de la transacción después de la carga', async () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter initialEntries={['/visualizar-transacciones/1']}>
                    <Routes>
                        <Route path="/visualizar-transacciones/:id" element={<VisualizarTransacciones />} />
                    </Routes>
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Crédito 1/i)).toBeInTheDocument();
            expect(screen.getByText(/\$1000/i)).toBeInTheDocument();
            expect(screen.getByText(/2024-11-15/i)).toBeInTheDocument();
        });
    });

    test('3. Muestra "No se encontraron transacciones" al filtrar sin resultados', async () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter initialEntries={['/visualizar-transacciones/1']}>
                    <Routes>
                        <Route path="/visualizar-transacciones/:id" element={<VisualizarTransacciones />} />
                    </Routes>
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Crédito 1/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Filtrar por Fecha/i), { target: { value: '2023-01-01' } });
        fireEvent.click(screen.getByRole('button', { name: /^Filtrar$/i }));

        await waitFor(() => {
            expect(screen.getByText(/No se encontraron transacciones/i)).toBeInTheDocument();
        });
    });

    test('4. Muestra botón "Volver al Menú Principal"', async () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter initialEntries={['/visualizar-transacciones/1']}>
                    <Routes>
                        <Route path="/visualizar-transacciones/:id" element={<VisualizarTransacciones />} />
                    </Routes>
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Volver al Menú Principal/i)).toBeInTheDocument();
        });
    });

    test('5. Muestra encabezados de la tabla de transacciones correctamente', async () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter initialEntries={['/visualizar-transacciones/1']}>
                    <Routes>
                        <Route path="/visualizar-transacciones/:id" element={<VisualizarTransacciones />} />
                    </Routes>
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('columnheader', { name: /Fecha/i })).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: /Capital/i })).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: /Interés/i })).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: /Total/i })).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: /Balance/i })).toBeInTheDocument();
        });
    });

    test('6. Muestra botón "Realizar Pago"', async () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter initialEntries={['/visualizar-transacciones/1']}>
                    <Routes>
                        <Route path="/visualizar-transacciones/:id" element={<VisualizarTransacciones />} />
                    </Routes>
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Realizar Pago/i })).toBeInTheDocument();
        });
    });

    test('7. Limpia filtros y muestra todas las transacciones', async () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter initialEntries={['/visualizar-transacciones/1']}>
                    <Routes>
                        <Route path="/visualizar-transacciones/:id" element={<VisualizarTransacciones />} />
                    </Routes>
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Crédito 1/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Filtrar por Fecha/i), { target: { value: '2023-01-01' } });
        fireEvent.click(screen.getByRole('button', { name: /^Filtrar$/i }));

        await waitFor(() => {
            expect(screen.getByText(/No se encontraron transacciones/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Eliminar Filtros/i }));

        await waitFor(() => {
            expect(screen.getByText(/2024-11-15/i)).toBeInTheDocument();
        });
    });

    test('8. Muestra información correcta del crédito', async () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <MemoryRouter initialEntries={['/visualizar-transacciones/1']}>
                    <Routes>
                        <Route path="/visualizar-transacciones/:id" element={<VisualizarTransacciones />} />
                    </Routes>
                </MemoryRouter>
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Crédito 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Monto: \$1000/i)).toBeInTheDocument();
            expect(screen.getByText(/Fecha de Pago: 2024-11-10/i)).toBeInTheDocument();
            expect(screen.getByText(/Estado: Activo/i)).toBeInTheDocument();
        });
    });
});
