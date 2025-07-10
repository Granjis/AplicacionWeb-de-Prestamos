import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import Deudores from '../Deudores';
import messages_es from '../local/es.json';
import userEvent from '@testing-library/user-event';

const messages = {
  es: messages_es,
};
const language = 'es';

describe('Deudores Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            deudores: [
              { id: 1, nombrecompleto: 'Deudor 1', fecha: '2024-01-01' },
              { id: 2, nombrecompleto: 'Deudor 2', fecha: '2024-01-02' },
              { id: 3, nombrecompleto: 'Deudor 3', fecha: '2024-01-03' },
              { id: 4, nombrecompleto: 'Deudor 4', fecha: '2024-01-04' },
              { id: 5, nombrecompleto: 'Deudor 5', fecha: '2024-01-05' },
            ],
            interesesGanados: 1500,
          }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Debe renderizar correctamente el componente', async () => {
    render(
      <MemoryRouter>
        <IntlProvider locale={language} messages={messages[language]}>
          <Deudores />
        </IntlProvider>
      </MemoryRouter>
    );

    // Verificar encabezado
    expect(screen.getByText('Bienvenido, Jorge')).toBeInTheDocument();
    expect(screen.getByText('Este mes has ganado')).toBeInTheDocument();

    // Verificar que se muestra el total
    await waitFor(() => {
      expect(screen.getByText('$1500')).toBeInTheDocument();
    });
  });

  test('Debe filtrar deudores correctamente', async () => {
    render(
      <MemoryRouter>
        <IntlProvider locale={language} messages={messages[language]}>
          <Deudores />
        </IntlProvider>
      </MemoryRouter>
    );

    // Esperar a que las tarjetas se carguen
    await waitFor(() => {
      expect(screen.getAllByTestId('deudor-card').length).toBe(5);
    });

    // Buscar "Deudor 3"
    const searchInput = screen.getByPlaceholderText('Buscar por nombre');
    await userEvent.type(searchInput, 'Deudor 3');

    // Verificar que solo aparece "Deudor 3"
    await waitFor(() => {
      expect(screen.getByText('Deudor 3')).toBeInTheDocument();
      expect(screen.queryByText('Deudor 1')).not.toBeInTheDocument();
    });
  });

  test('Deben crearse las tarjetas correctamente', async () => {
    render(
      <MemoryRouter>
        <IntlProvider locale={language} messages={messages[language]}>
          <Deudores />
        </IntlProvider>
      </MemoryRouter>
    );

    // Verificar que se renderizan 5 tarjetas
    const cards = await screen.findAllByTestId('deudor-card');
    expect(cards.length).toBe(5);

    // Verificar contenido de las tarjetas
    cards.forEach((card, index) => {
      expect(card).toHaveTextContent(`Deudor ${index + 1}`);
      expect(card).toHaveTextContent(`2024-01-0${index + 1}`);
    });
  });

  test('Cada tarjeta tiene un botón accesible para información', async () => {
    render(
      <MemoryRouter>
        <IntlProvider locale={language} messages={messages[language]}>
          <Deudores />
        </IntlProvider>
      </MemoryRouter>
    );

    const buttons = await screen.findAllByRole('link', { name: /Información/i });
    expect(buttons.length).toBe(5);

    // Verificar que el botón guarda el id del deudor en localStorage
    userEvent.click(buttons[0]);
    expect(localStorage.getItem('deudorId')).toBe('1');
  });

  test('Debe coincidir con el snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <IntlProvider locale={language} messages={messages[language]}>
          <Deudores />
        </IntlProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
