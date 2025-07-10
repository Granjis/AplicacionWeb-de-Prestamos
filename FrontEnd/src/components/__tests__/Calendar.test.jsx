import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Calendar from '../Calendar';  // Importa tu componente
import '@testing-library/jest-dom';  // Para las aserciones de jest-dom
import { IntlProvider } from 'react-intl'; // Importar para la internacionalización
import messages_en from '../local/en.json';
import { useState } from 'react';

const messages = {
    en: messages_en,
  };
const language = 'en';
  
describe('Calendar Component', () => {
    let dateStatic = new Date(2024, 0, 1)
    const mockOnChange = jest.fn();
    let TestWrapper;
    beforeEach(() => {
        TestWrapper=()=>{
            const [date, setDate] = useState(dateStatic);
            return(
            <MemoryRouter>
                <IntlProvider locale={language} messages={messages[language]}>
                    <Calendar onChange={(newDate)=>{setDate(newDate);mockOnChange(newDate)}} defaultValue={date}/>
                </IntlProvider>
            </MemoryRouter>
            );
        };

        render(<TestWrapper/>);
    });

  test('renders the component correctly', () => {
    // Verifica que el botón principal se renderiza
    const button = screen.getByRole('button', { name: "Select a date"});
    expect(button).toBeInTheDocument();

    // Verifica que se muestra la fecha inicial
    expect(button.textContent).toContain(dateStatic.toLocaleDateString(language,{day: 'numeric',month: 'long',year: 'numeric'})); // Cambiar según el idioma.
  });

  test('opens and closes the calendar picker', () => {
    const toggleButton = screen.getByRole('button', { name: "Select a date" });

    // Abre el calendario
    fireEvent.click(toggleButton);
    const calendarRoot = screen.getByTestId('calendar-dropdown');
    expect(calendarRoot).toBeVisible();

    // Cierra el calendario
    fireEvent.click(toggleButton);
    expect(calendarRoot).not.toBeVisible();
  });

  test('selects a date and calls onChange', () => {
    const selectedDate = new Date(2024, 0, 15)
    // Abre el calendario
    const toggleButton = screen.getByRole('button', { name: "Select a date" });
    fireEvent.click(toggleButton);

    // Selecciona un día
    const dayButton = screen.getByText('15');
    fireEvent.click(dayButton);
    
    // Verifica que el día seleccionado cambia
    // screen.getByText('asdd')
    expect(toggleButton.textContent).toContain(selectedDate.toLocaleDateString(language,{day: 'numeric',month: 'long',year: 'numeric'})); // Cambiar según el idioma.

    // Verifica que se llame al método onChange con la nueva fecha
    expect(mockOnChange).toHaveBeenCalledWith(selectedDate);
  });

  test('navigates between months', () => {
    // Abre el calendario      
    fireEvent.click(screen.getByRole('button', { name: "Select a date" }));

    // Navega al mes siguiente y verifica
    fireEvent.click(screen.getByRole('button', { name: "Next" }));
    expect(screen.getByText("February 2024")).toBeInTheDocument();
    
    // Navega al mes anterior y verifica
    fireEvent.click(screen.getByRole('button', { name: "Before" }));
    expect(screen.getByText("January 2024")).toBeInTheDocument();
    });

  test('navigates to the previous year', () => {
    // Abre el calendario
    const toggleButton = screen.getByRole('button', { name: "Select a date" });
    fireEvent.click(toggleButton);

    // Navega al mes anterior (diciembre del año anterior)
    fireEvent.click(screen.getByRole('button', { name:"Before" }));

    // Verifica que se muestra diciembre de 2023
    expect(screen.getByText("December 2023")).toBeInTheDocument();
  });
});

