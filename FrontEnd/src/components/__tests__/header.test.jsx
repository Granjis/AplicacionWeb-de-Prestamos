import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../header';
import { IntlProvider } from 'react-intl';
import messages_es from '../local/es.json';

const messages = {
    es: messages_es,
  };
const language = 'es';

describe('Header', () => {
    const mockNavLinks = [
        { name: 'Prestamista', url: '/login' },
        { name: 'Cliente', url: '/login' },
    ];

    const renderHeader = (logged = false, usuario = '') => {
        render(
            <MemoryRouter>
                <IntlProvider locale={language} messages={messages[language]}>
                    <Header nav_links={mockNavLinks} logged={logged} usuario={usuario} />
                </IntlProvider>
            </MemoryRouter>
        );
    };

    test('renders the logo', () => {
        renderHeader();
        const logo = screen.getByAltText('Logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', '/Logo_letras.png');
    });

    test('renders navigation links', () => {
        renderHeader();
        mockNavLinks.forEach(link => {
            const navLink = screen.getByRole('link', { name: link.name });
            expect(navLink).toBeInTheDocument();
            expect(navLink).toHaveAttribute('href', link.url);
        });
    });

    test('renders "Entra" and "Empieza ahora" buttons when not logged in', () => {
        renderHeader();
        const entraLink = screen.getByRole('link', { name: /entra/i });
        expect(entraLink).toBeInTheDocument();
        expect(entraLink).toHaveAttribute('href', '/login');

        const ctaButton = screen.getByTestId('cta-button');
        expect(ctaButton).toBeInTheDocument();
        expect(ctaButton).toHaveAttribute('href', '/signup');
        expect(ctaButton).toHaveTextContent('Empieza ahora');
    });

    test('renders user button when logged in', () => {
        const mockUsuario = 'Usuario Test';
        renderHeader(true, mockUsuario);

        const userButton = screen.getByRole('button', { name: mockUsuario });
        expect(userButton).toBeInTheDocument();
        expect(userButton).toHaveAttribute('href', '/perfilPrestamista');
    });

    test('does not render "Entra" and "Empieza ahora" buttons when logged in', () => {
        const mockUsuario = 'Usuario Test';
        renderHeader(true, mockUsuario);

        const entraLink = screen.queryByRole('link', { name: /entra/i });
        expect(entraLink).not.toBeInTheDocument();

        const ctaButton = screen.queryByTestId('cta-button');
        expect(ctaButton).not.toBeInTheDocument();
    });
});
