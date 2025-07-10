describe('Pruebas en la página de Créditos', () => {
  
  {/* Esta página ya no se encuentra en uso (Se decidió que la aplicación tuviese
    un enfoque en los prestamistas y no en los deudores). Sin embargo, sigue siendo
    accesible a través de la URL, por lo que se dejó el spec. */}
  beforeEach(() => {
    // Visita la página de créditos antes de cada prueba
    cy.visit('http://localhost:3001/creditos');
  });

  it('debe mostrar los créditos del usuario después de cargarlos', () => {
    // Simula la respuesta de la API usando intercept
    cy.intercept('GET', 'https://my.api.mockaroo.com/lista_creditos_mock.json*', {
      statusCode: 200,
      body: [
        {
          id: 1,
          usuarioId: 1,
          nombre: 'Crédito de Jorge',
          monto: 1000,
          fechaPago: '2024-12-01',
          estado: 'Activo'
        },
        {
          id: 2,
          usuarioId: 1,
          nombre: 'Crédito de Jorge 2',
          monto: 1500,
          fechaPago: '2024-12-15',
          estado: 'Activo'
        }
      ]
    }).as('getCreditos');
    
    // Espera la llamada y verifica que los créditos están visibles
    cy.wait('@getCreditos');
    cy.contains('Crédito de Jorge').should('be.visible');
    cy.contains('Crédito de Jorge 2').should('be.visible');
  });

  it('debe mostrar un mensaje si no hay créditos', () => {
    // Simula que no hay créditos
    cy.intercept('GET', 'https://my.api.mockaroo.com/lista_creditos_mock.json*', {
      statusCode: 200,
      body: []
    }).as('getCreditosEmpty');
    
    // Espera la llamada y verifica el mensaje de "sin créditos"
    cy.wait('@getCreditosEmpty');
    cy.contains('No tienes créditos registrados.').should('be.visible');
  });

  it('debe mostrar un mensaje de error si hay un fallo en la carga de los créditos', () => {
    // Simula un error en la API
    cy.intercept('GET', 'https://my.api.mockaroo.com/lista_creditos_mock.json*', {
      statusCode: 500,
    }).as('getCreditosError');
    
    // Espera la llamada y verifica el mensaje de error
    cy.wait('@getCreditosError');
    cy.contains('Error al obtener los datos del API').should('be.visible');
  });

  it('debe permitir hacer clic en un crédito y redirigir a la página de transacciones', () => {
    // Simula la respuesta de la API
    cy.intercept('GET', 'https://my.api.mockaroo.com/lista_creditos_mock.json*', {
      statusCode: 200,
      body: [
        {
          id: 1,
          usuarioId: 1,
          nombre: 'Crédito de Jorge',
          monto: 1000,
          fechaPago: '2024-12-01',
          estado: 'Activo'
        }
      ]
    }).as('getCreditos');
    
    // Espera la llamada y hace clic en el primer crédito
    cy.wait('@getCreditos');
    cy.contains('Crédito de Jorge').click();
    
    // Verifica que la URL haya cambiado y que contiene el ID del crédito
    cy.url().should('include', '/visualizar-transacciones/1');
  });

});
