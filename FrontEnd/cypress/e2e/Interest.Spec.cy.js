describe('Pruebas para HU-2', () => {

  beforeEach(()=>{
    cy.visit('http://localhost:3001');
    cy.get('a.nav-link').contains('Entra').click()
    cy.get('input#username').type('prestamista')
    cy.get('input#password').type('prestamista')
    cy.get('button').contains('Login').click()
    cy.get('a.nav-link.custom-links').contains('Consultar Deudor').click()
    cy.get('button').contains('Consultar Todos').click();
    cy.get('img').first().click()
    cy.get('a').contains('Información').click()
    cy.get('button.eye-button').first().click();
    cy.url().should('eq', 'http://localhost:3001/deudorApp')
  })

    it("Verificar que el interés se puede editar y guardar",()=>{
        cy.get('#button\\.editInfo').click();
        cy.get('#fechaInicio').type('2024-12-15');
        cy.get('#prestado').type('100000');
        cy.get('#interes').type('30');
        cy.get('#fechafin').type('2024-12-20');
        cy.get('button').contains("Actualizar Datos").click();
        cy.get('p.mb-0.value-data').should('contain.text', '30%');
    })
    it("Verificar si muestra error si el interés está fuera del rango",()=>{
      cy.get('#button\\.editInfo').click();
      cy.get('#fechaInicio').type('2024-12-15');
      cy.get('#fechafin').type('2024-12-20');
      cy.get('#prestado').type('100000');
      cy.get('#interes').type('30000');
      cy.get('button').contains("Actualizar Datos").click();
      cy.contains('El interés debe ser entre 0 y 100.').should('be.visible');
  })
});