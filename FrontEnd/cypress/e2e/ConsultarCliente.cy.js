describe('Consultar Cliente', () => {
  // Antes de cada prueba, visitamos la página
  beforeEach(() => {
    cy.visit('http://localhost:3001');
    cy.get('a.nav-link').contains('Entra').click()
    cy.get('input#username').type('prestamista')
    cy.get('input#password').type('prestamista')
    cy.get('button').contains('Login').click()
    cy.get('a.nav-link').contains('Consultar Deudor').click()
  });

  it('Debe cargar la página correctamente', () => {
    cy.contains('Consultar Cliente'); // Verifica que el título esté presente
    cy.get('input#criterio').should('exist'); // Verifica que el campo de búsqueda esté presente
    cy.get('button').contains('Buscar Cliente').should('exist'); // Verifica que el botón de búsqueda esté presente
  });

  it('Debe mostrar un error cuando no se encuentra el cliente', () => {
    // Simula una búsqueda con un criterio inexistente
    cy.get('input#criterio').type('11111111111111111');
    cy.get('button').contains('Buscar Cliente').click();

    // Verifica que el mensaje de error se muestra
    cy.get('.alert-danger').should('be.visible')
      .and('contain.text', 'Cliente no encontrado. Por favor, verifica los datos ingresados.');
  });

  it('Debe mostrar los detalles de un cliente cuando se encuentra', () => {
    // Simula la búsqueda de un cliente válido
    cy.get('input#criterio').type('5151541541');
    cy.get('button').contains('Buscar Cliente').click();

    // Verifica que la información del cliente se muestra en la tabla
    cy.get('table').should('exist');
    cy.get('tbody').find('tr').should('have.length', 7); // Asegura que hay 7 campos
    cy.contains('5151541541'); // Verifica que el nombre del cliente esté en la tabla
  });

  it('Debe mostrar todos los clientes cuando se presiona el botón "Consultar Todos"', () => {
    cy.get('button').contains('Consultar Todos').click();

    // Verifica que se muestren todos los clientes en la tabla
    cy.get('table').should('exist');
    cy.get('tbody').find('tr').should('have.length.greaterThan', 0); // Verifica que hay más de un cliente
  });

  it('Debe permitir regresar al menú de deudores', () => {
    cy.get('a').contains('Volver al Menú Principal').should('have.attr', 'href', '/deudores');
  });

  it('Debe mostrar la tabla de clientes cuando no se está buscando un cliente específico', () => {
    // Simula la búsqueda de todos los clientes
    cy.get('button').contains('Consultar Todos').click();

    // Verifica que la tabla con todos los clientes se muestra correctamente
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length.greaterThan', 0); // Verifica que hay más de un cliente en la tabla
  });

  it('Debe limpiar la búsqueda al presionar "Consultar Todos"', () => {
    // Simula la búsqueda de un cliente
    cy.get('input#criterio').type('5151541541');
    cy.get('button').contains('Buscar Cliente').click();

    // Verifica que se muestra el cliente
    cy.contains('5151541541');

    // Ahora simula la búsqueda de todos los clientes
    cy.get('button').contains('Consultar Todos').click();

    // Verifica que la tabla de todos los clientes se muestra
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length.greaterThan', 0); // Verifica que hay más de un cliente en la tabla
  });
});
