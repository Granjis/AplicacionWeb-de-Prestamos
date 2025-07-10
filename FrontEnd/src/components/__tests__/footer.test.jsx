import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import '@testing-library/jest-dom';
import { Footer } from '../footer';
import messages_es from '../local/es.json';

const messages = {
    es: messages_es,
  };
  const language = 'es';
describe('Footer', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <IntlProvider locale={language} messages={messages[language]}>
                    <Footer />
                </IntlProvider>
            </MemoryRouter>
        );
    });

    test('renders the logo', () => {
        const logo = screen.getByAltText('Logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', '/Logo_letras.png');
        expect(logo).toHaveAttribute('width', '213');
        expect(logo).toHaveAttribute('height', '73');
    });

    test('renders the Enlaces section with correct links', () => {
        const enlacesHeading = screen.getByRole('heading', { name: /enlaces/i });
        expect(enlacesHeading).toBeInTheDocument();

        const solucionesLink = screen.getByRole('link', { name: /soluciones/i });
        expect(solucionesLink).toBeInTheDocument();
        expect(solucionesLink).toHaveAttribute('href', '/soluciones');

        const nosotrosLink = screen.getByRole('link', { name: /nosotros/i });
        expect(nosotrosLink).toBeInTheDocument();
        expect(nosotrosLink).toHaveAttribute('href', '/nosotros');

        const recursosLink = screen.getByRole('link', { name: /recursos/i });
        expect(recursosLink).toBeInTheDocument();
        expect(recursosLink).toHaveAttribute('href', '/Recursos');
    });

    test('renders the Nosotros section with correct links', () => {
        const nosotrosHeading = screen.getByRole('heading', { name: /nosotros/i });
        expect(nosotrosHeading).toBeInTheDocument();

        const historiaLink = screen.getByRole('link', { name: /la historia de prest/i });
        expect(historiaLink).toBeInTheDocument();
        expect(historiaLink).toHaveAttribute('href', '/historia');

        const trabajadoresLink = screen.getByRole('link', { name: /trabajadores de prest/i });
        expect(trabajadoresLink).toBeInTheDocument();
        expect(trabajadoresLink).toHaveAttribute('href', '/grupo_trabajo');
    });

    test('renders the Redes Sociales section with correct links', () => {
        const redesSocialesHeading = screen.getByRole('heading', { name: /redes sociales/i });
        expect(redesSocialesHeading).toBeInTheDocument();

        const tiktokLink = screen.getByRole('link', { name: /tiktok/i });
        expect(tiktokLink).toBeInTheDocument();
        expect(tiktokLink).toHaveAttribute('href', 'https://www.tiktok.com/es/');

        const instagramLink = screen.getByRole('link', { name: /instagram/i });
        expect(instagramLink).toBeInTheDocument();
        expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/');

        const facebookLink = screen.getByRole('link', { name: /facebook/i });
        expect(facebookLink).toBeInTheDocument();
        expect(facebookLink).toHaveAttribute('href', 'https://web.facebook.com/');
    });

    test('renders the footer copyright text', () => {
        const currentYear = new Date().getFullYear();
        const copyrightText = screen.getByText(`© ${currentYear} Prest. Todos los derechos reservados.`);
        expect(copyrightText).toBeInTheDocument();
    });
});
