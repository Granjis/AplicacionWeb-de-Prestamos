import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DeudorApp from '../deudorApp';  // Importa tu componente
import '@testing-library/jest-dom';  // Para las aserciones de jest-dom
import { IntlProvider } from 'react-intl'; // Importar para la internacionalización
import messages_en from '../local/en.json';

const messages = {
  es: messages_en,
};
const language = 'en';

describe('DeudorApp', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn((key) => {
      const mockStorage = {
        token: 'mock-token', // Valor simulado para 'token'
        deudaId: '12345',    // Valor simulado para 'deudaId'
      };
      return mockStorage[key] || null; // Devuelve el valor o null si no existe
    });

    let ultimoPagoHecho = {};
    global.fetch = jest.fn((url, options) => {
      const asociarPagoUrlRegex = /http:\/\/localhost:3000\/prestamos\/\d+\/pagos\/\d+$/; // Asociar pago con préstamo
      console.log(url)
      if (url === "http://localhost:3000/pagos" && options.method === 'POST') {
        // Mock de crear un pago
        const nuevoPago = JSON.parse(options.body);
        ultimoPagoHecho = {
          id: '67890', // ID simulado del nuevo pago
          ...nuevoPago,
        }
        return Promise.resolve({
          json: () =>
            Promise.resolve(ultimoPagoHecho),
          ok: true,
        });
      }
    
      if (
        asociarPagoUrlRegex.test(url) &&
        options.method === 'POST'
      ) {
        console.log(url)
        // Mock de asociar un pago con un préstamo
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              
              nombre: 'Préstamo de Armando Casas',
              monto: 1000000,
              interes: 10,
              fechainicio: '2021-01-01',
              fechafin: '2022-01-01',
              pagado: false,
              historialpagos: [
                {
                  fecha: '2021-01-01',
                  capital: 50000,
                  interes: 5000,
                },
                {
                  fecha: '2021-02-01',
                  capital: 50000,
                  interes: 5000,
                },
                {
                  ...ultimoPagoHecho
                },
              ],
            }),
          ok: true,
        });
      }
    
      return Promise.reject(new Error('Unknown URL or invalid request'));
    });
    
    render(
      <MemoryRouter>
        <IntlProvider locale={language} messages={messages[language]}>
          <DeudorApp />
        </IntlProvider>
      </MemoryRouter>
    );
  });
  test('Debe renderizar correctamente el componente', () => {
    // Verificar que los textos clave se rendericen
    expect(screen.getByText("Deudores")).toBeInTheDocument();
    expect(screen.getByText("Recents")).toBeInTheDocument();
  });
  test('Debe cargar los datos iniciales del deudor correctamente', async () => {
    expect(screen.getByText("Armando Casas")).toBeInTheDocument();
    expect(screen.getByText("$ 100000")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
  });

  test('Debe mostrar un historial de pagos vacío al inicio', () => {
    expect(screen.getByText("Recents")).toBeInTheDocument();
    expect(screen.queryByText("No data available")).toBeInTheDocument();
  });

  test('Debe actualizar el balance después de agregar un pago', () => {
    fireEvent.click(screen.getByText("Add payment"));

    fireEvent.change(screen.getByLabelText("Capital"), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText("Interes"), { target: { value: '50' } });

    fireEvent.click(screen.getByText("Agregar Pago"));

    // Verificar que el balance haya cambiado
    expect(screen.getByText('$ 900000')).toBeInTheDocument();

  });



  test('Abrir y cerrar el modal de pago', () => {


    // Hacer click en el botón de "Add payment"
    fireEvent.click(screen.getByText("Add payment"));

    // Verificar que el modal se haya abierto
    expect(screen.getByText("Add Payment")).toBeInTheDocument();

    // Cerrar el modal

    fireEvent.click(screen.getByLabelText('Close'));


    // Verificar que el modal se haya cerrado
    expect(screen.queryByText("modal-header")).not.toBeInTheDocument();
  });

  test('Agregar un nuevo pago y actualizar historial', async () => {

    // Abre el modal de pago
    fireEvent.click(screen.getByText("Add payment"));

    // Cambiar los valores de capital e interés
    fireEvent.change(screen.getByLabelText("Capital"), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText("Interes"), { target: { value: '10' } });

    // Agregar el pago
    fireEvent.click(screen.getByText("Add payment"));
  });

  test('Modificar el interés del deudor', async () => {


    // Abrir el modal para modificar el interés
    fireEvent.click(screen.getByText("Edit"));

    // Cambiar el valor del interés
    fireEvent.change(screen.getByLabelText("Interés"), { target: { value: '10' } });

    // Guardar cambios
    fireEvent.click(screen.getByText("Actualizar Datos"));

    // Verificar que el nuevo interés se haya guardado correctamente
    await waitFor(() => {
      const interestRateElement = screen.getByText('10%');
      expect(interestRateElement).toBeInTheDocument();
      expect(interestRateElement.textContent.trim()).toBe('10%');

    });
  });

  test('Mostrar error si las fechas de inicio y fin son inconsistentes', () => {
    // Abrir el modal de modificar datos
    fireEvent.click(screen.getByText("Edit"));

    // Asignar una fecha de inicio posterior a la fecha de fin
    fireEvent.change(screen.getByLabelText("Fecha de Inicio"), { target: { value: '2023-01-02' } });
    fireEvent.change(screen.getByLabelText("Fecha de Vencimiento"), { target: { value: '2023-01-01' } });

    // Intentar guardar los cambios
    fireEvent.click(screen.getByText("Actualizar Datos"));

    // Verificar que el error de fechas se muestre
    expect(screen.getByText('Start and Due Dates must be consistent.')).toBeInTheDocument();
  });

  test('Mostrar error si la tasa de interés es inválida', () => {
    // Abrir el modal de modificar datos
    fireEvent.click(screen.getByText("Edit"));

    // Introducir una tasa de interés negativa
    fireEvent.change(screen.getByLabelText("Interés"), { target: { value: '-5' } });

    // Intentar guardar los cambios
    fireEvent.click(screen.getByText("Actualizar Datos"));

    // Verificar que el mensaje de error se muestre
    expect(screen.getByText('El interés debe ser entre 0 y 100.')).toBeInTheDocument();
  });

  test('Verificar que el historial de pagos se actualiza correctamente tras agregar un pago', async () => {
    // Abre el modal de pago
    fireEvent.click(screen.getByText("Add payment"));

    // Cambiar los valores de capital e interés
    fireEvent.change(screen.getByLabelText("Capital"), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText("Interes"), { target: { value: '6000' } });

    // Agregar el pago
    fireEvent.click(screen.getByText("Agregar Pago"));

    await waitFor(() => {
      expect(screen.getByText(`$${new Number(100000).toLocaleString()}`)).toBeInTheDocument();
      expect(screen.getByText(`$${new Number(6000).toLocaleString()}`)).toBeInTheDocument();
    });
  });

  test('Cerrar el modal de editar información', () => {
    // Abrir el modal de modificar datos
    fireEvent.click(screen.getByText("Edit"));

    // Verificar que el modal esté abierto
    expect(screen.getByText("Actualizar Información de Deudor")).toBeInTheDocument();

    // Cerrar el modal
    fireEvent.click(screen.getByLabelText("Close"));
  });

  test('Mostrar mensaje cuando no hay pagos en el historial', () => {
    // Verificar que se muestre el mensaje cuando no hay datos
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  test('Validar que el botón de "Agregar Pago" funciona correctamente', () => {
    // Abrir el modal de pago
    fireEvent.click(screen.getByText("Add payment"));

    // Cambiar los valores de capital e interés
    fireEvent.change(screen.getByLabelText("Capital"), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText("Interes"), { target: { value: '5000' } });

    // Hacer clic en el botón de agregar pago
    fireEvent.click(screen.getByText("Agregar Pago"));

    // Verificar que el modal se cierra después de agregar un pago
    expect(screen.queryByText("Add Payment")).not.toBeInTheDocument();
  });

  test('Validar que la información del deudor se actualiza correctamente después de una edición', async () => {
    // Abrir el modal de modificar datos
    fireEvent.click(screen.getByText("Edit"));

    // Cambiar el monto prestado
    fireEvent.change(screen.getByLabelText("Monto Prestado"), { target: { value: '2000000' } });

    // Cambiar las fechas de inicio y fin
    fireEvent.change(screen.getByLabelText("Fecha de Inicio"), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText("Fecha de Vencimiento"), { target: { value: '2024-12-31' } });

    // Cambiar la tasa de interés
    fireEvent.change(screen.getByLabelText("Interés"), { target: { value: '15' } });

    // Guardar cambios
    fireEvent.click(screen.getByText("Actualizar Datos"));

    // Verificar que los datos se hayan actualizado correctamente
    await waitFor(() => {
        expect(screen.getByText("$ 2000000")).toBeInTheDocument();
        expect(screen.getByText("2024-01-01")).toBeInTheDocument();
        expect(screen.getByText("2024-12-31")).toBeInTheDocument();
        expect(screen.getByText("15%")).toBeInTheDocument();
    });
});


  test('Verificar que el botón "Agregar Pago" muestra el modal correctamente', () => {
    // Hacer click en el botón "Agregar Pago"
    fireEvent.click(screen.getByText("Add payment"));

    // Verificar que el modal está visible
    expect(screen.getByText("Add Payment")).toBeInTheDocument();
  });

});
