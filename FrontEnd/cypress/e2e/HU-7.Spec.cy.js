import { waitFor } from "@testing-library/react";
import { wait } from "@testing-library/user-event/dist/utils";

describe('Pruebas para HU-7', () => {
	beforeEach(() => {
		// Acceder al componente principal
		cy.visit('http://localhost:3001/login',{
			onBeforeLoad(win) {
				Object.defineProperty(win.navigator, 'languages', {
					value: ['en-US'],
				});
				Object.defineProperty(win.navigator, 'language', {
					value: 'en-US',
				});
			}
		})
		cy.get("input[id='username']").clear().type('prestamista');
		cy.get("input[id='password']").clear().type('prestamista');
		cy.contains('button', 'Login').click();
		cy.wait(1000)
		cy.contains('a','Crear Deudor').click();
		cy.get('input[name="nombrecompleto"]').clear().type('Camilo Escobar');
		cy.get('input[name="cedula"]').clear().type('1110450340');
		cy.get('select[name="situacionLaboral"]').select('Employed');
		cy.get('input[name="direccion"]').clear().type('Calle 4 N 13-128');
		cy.get('input[name="telefono"]').clear().type('3123807270');
		cy.get('input[name="email"]').clear().type('Camilo@gmail.com');
		cy.get('input[name="ocupacion"]').clear().type('Profesor');
		cy.get('input[name="foto"]').clear().type('https://sistemas.uniandes.edu.co/images/NOTICIAS/2023/08/camilo-escobar-noticia.jpg');
		cy.get('input[name="fechainicio"]').type('2025-07-07');
		cy.get('input[name="fechafin"]').type('2025-08-08');
		cy.get('input[name="nombre"]').type('Concierto Bad Bunny');
		cy.get('input[name="interes"]').type('123450');
		cy.get('input[name="monto"]').type('32134349');
		cy.contains('button', 'Save').click();
		cy.wait(1000);
		cy.visit('http://localhost:3001/deudores',{
			onBeforeLoad(win) {
				Object.defineProperty(win.navigator, 'languages', {
					value: ['en-US'],
				});
				Object.defineProperty(win.navigator, 'language', {
					value: 'en-US',
				});
			}
		});
		cy.wait(1000);
		cy.contains('a', 'Information').click();
		cy.get('button[aria-label="Show Details"]').eq(0).click();
	});

	// afterEach(() => {
	// 	cy.clearLocalStorage();
	// 	cy.clearCookies();
	// 	cy.window().then((win) => {
	// 	  win.sessionStorage.clear();
	// 	});
	//   });


	it("Verificar que el las fechas de inicio, caducidad y la frecuencia de pago se puede editar y guardar", () => {
		cy.contains('button', 'Edit info').click();
		cy.get('#fechaInicio').type('2023-12-01');
		cy.get('#fechafin').type('2024-12-01');
		cy.get('#prestado').clear().type('123123');
		cy.get('#interes').clear().type('50');

		cy.contains('button', 'Actualizar Datos').click();
		cy.get('button[aria-label="Close"]').click();

		// Comprabar los datos
		cy.contains('2024-12-01').should('be.visible');
		cy.contains('2023-12-01').should('be.visible');
		cy.contains('123123').should('be.visible');
		cy.contains('50').should('be.visible');
	})

	it("Verificar error en fechas incoherentes de inicio y vencimiento", () => {
		cy.contains('button', 'Edit info').click();
		cy.get('#fechaInicio').type('2024-12-01');
		cy.get('#fechafin').type('2023-12-01');

		cy.contains('button', 'Actualizar Datos').click();

		cy.contains('Start and Due Dates must be consistent.').should('be.visible');
	})
});