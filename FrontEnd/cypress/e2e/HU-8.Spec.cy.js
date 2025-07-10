describe('Pruebas para HU-8', () => {
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
    cy.wait(1000);
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
      cy.visit('http://localhost:3001/pasarela/1',{
        onBeforeLoad(win) {
          Object.defineProperty(win.navigator, 'languages', {
            value: ['en-US'],
          });
          Object.defineProperty(win.navigator, 'language', {
            value: 'en-US',
          });
        }
      })
    });

  it("Verificar que los componentes de las opciones de pago están presentes", () => {
    cy.contains('Debit or credit card').should('be.visible');
    cy.contains('Nequi').should('be.visible');
    cy.contains('PSE').should('be.visible');
  })
  it("Verificar que abre y cierra los modales de pago", () => {
    cy.get('button[aria-label="Open Payment"]').eq(0).click();
    cy.wait(500);
    cy.get('button[aria-label="Close"]').click();
    cy.wait(500);
    cy.get('button[aria-label="Open Payment"]').eq(1).click();
    cy.wait(500);
    cy.get('button[aria-label="Close"]').click();
    cy.wait(500);
    cy.get('button[aria-label="Open Payment"]').eq(2).click();
    cy.wait(500);
    cy.get('button[aria-label="Close"]').click();
  })
  it("Validar que el modal de T. Crédito permite ingresar datos correctamente y redirige al URL esperado", () => {
    cy.get('button[aria-label="Open Payment"]').eq(0).click();
    cy.get('input[aria-label="Interest"]').clear().type('12345');
    cy.get('input[aria-label="Principal"]').clear().type('10');
    cy.get('input[aria-label="Card Number"]').clear().type('0123456789111213');
    cy.get('select[aria-label="Select Month"]').select('11');
    cy.get('select[aria-label="Select Year"]').select('2026');
    cy.get('input[aria-label="CVV"]').clear().type('123');

    cy.contains('button', 'Save').click();
    cy.url().should('match', /\/visualizar-transacciones\/\d+$/);
  })
  it("Validar que el modal de Nequi permite ingresar datos correctamente y redirige al URL esperado", () => {
    cy.get('button[aria-label="Open Payment"]').eq(1).click();
    cy.get('input[aria-label="Interest"]').clear().type('12345');
    cy.get('input[aria-label="Principal"]').clear().type('10');
    cy.get('input[aria-label="Phone Number"').clear().type('3211235678')

    cy.contains('button', 'Save').click();
    cy.url().should('match', /\/visualizar-transacciones\/\d+$/);

  })
  it("Validar que el modal de PSE permite ingresar datos correctamente y redirige al URL esperado", () => {
    cy.get('button[aria-label="Open Payment"]').eq(2).click();
    cy.get('input[aria-label="Interest"]').clear().type('12345');
    cy.get('input[aria-label="Principal"]').clear().type('10');
    cy.get('input[aria-label="Full Name"').clear().type('Alfredo Benitez')
    cy.get('input[aria-label="Phone Number"').clear().type('3211235678')
    cy.get('input[aria-label="ID"]').clear().type('1234567');

    cy.contains('button', 'Save').click();
    cy.url().should('match', /\/visualizar-transacciones\/\d+$/);
  })
  it("Validar errores en el modal de T. Credito con datos inválidos", () => {
    cy.get('button[aria-label="Open Payment"]').eq(0).click();
    // input Interest,Principal no se va a llenar
    cy.get('input[aria-label="Card Number"]').clear().type('0123456789111213');
    cy.get('select[aria-label="Select Month"]').select('11');
    cy.get('select[aria-label="Select Year"]').select('2026');
    cy.get('input[aria-label="CVV"]').clear().type('123');

    cy.contains('button', 'Save').click();
    cy.contains('All fields are not complete').should('be.visible');
  })
  it("Validar errores en el modal de Nequi con datos inválidos", () => {
    cy.get('button[aria-label="Open Payment"]').eq(1).click();
    // el input Interest no se va a llenar
    cy.get('input[aria-label="Phone Number"').clear().type('3211235678')

    cy.contains('button', 'Save').click();
    cy.contains('All fields are not complete').should('be.visible');

  })
  it("Validar errores en el modal de PSE con datos inválidos", () => {
    cy.get('button[aria-label="Open Payment"]').eq(2).click();
    // el input Interest no se va a llenar
    cy.get('input[aria-label="Full Name"').clear().type('Alfredo Benitez')
    cy.get('input[aria-label="Phone Number"').clear().type('3211235678')
    cy.get('input[aria-label="ID"]').clear().type('1234567');

    cy.contains('button', 'Save').click();
    cy.contains('All fields are not complete').should('be.visible');
  })

});