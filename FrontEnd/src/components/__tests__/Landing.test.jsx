import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import Landing from '../Landing';
import messages_es from '../local/es.json';

const messages = {
  es: messages_es,
};
const language = 'es';

describe('Landing', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <IntlProvider locale={language} messages={messages[language]}>
                    <Landing />
                </IntlProvider>
            </MemoryRouter>
        );
    });

    test('renders the main heading', () => {
        const heading = screen.getByRole('heading', { level: 1, name: /Administra tus préstamos sin esfuerzo/i });
        expect(heading).toBeInTheDocument();
    });

    test('renders the CTA button in the top section', () => {
        const ctaButton = screen.getByTestId('cta-button');
        expect(ctaButton).toBeInTheDocument();
        expect(ctaButton).toHaveAttribute('href', '/signup');
    });

    test('renders the images with correct alt text', () => {
        const mainImage = screen.getByAltText('Imagen principal');
        expect(mainImage).toBeInTheDocument();
        expect(mainImage).toHaveAttribute('src', '/Imagen_landing_1.png');

        const middleImage = screen.getByAltText('Imagen media');
        expect(middleImage).toBeInTheDocument();
        expect(middleImage).toHaveAttribute('src', '/Imagen3.png');
    });

    test('renders the reasons to choose "prest" section', () => {
        const reasonsHeading = screen.getByRole('heading', { level: 2, name: /¿Por qué escoger prest?/i });
        expect(reasonsHeading).toBeInTheDocument();

        const cards = screen.getAllByRole('heading', { level: 3 });
        expect(cards).toHaveLength(2);
        expect(cards[0]).toHaveTextContent(/tienes el control de tus finanzas/i);
        expect(cards[1]).toHaveTextContent(/todo en un solo lugar y sin esfuerzo/i);
    });

    test('renders client testimonials', () => {
        const testimonialsHeading = screen.getByRole('heading', { level: 2, name: /Historias de clientes/i });
        expect(testimonialsHeading).toBeInTheDocument();

        const jeremiasTestimonial = screen.getByAltText('Jeremías Valencia');
        expect(jeremiasTestimonial).toBeInTheDocument();
        expect(jeremiasTestimonial).toHaveAttribute('alt', 'Jeremías Valencia');

        const juanTestimonial = screen.getByAltText('Juan Martínez');
        expect(juanTestimonial).toBeInTheDocument();
        expect(juanTestimonial).toHaveAttribute('alt', 'Juan Martínez');
    });

    test('renders footer and header', () => {
        expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
        expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    });
});
