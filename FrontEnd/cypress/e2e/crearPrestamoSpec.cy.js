describe('Exploration of the crearPrestamo component', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:3001');
    cy.get('a.nav-link').contains('Entra').click()
    cy.get('input#username').type('prestamista')
    cy.get('input#password').type('prestamista')
    cy.get('button').contains('Login').click()
    //Debido a la dificultad de poblar la base de datos, se fuerza la URL.
    cy.visit('http://localhost:3001/crearPrestamo');
    cy.wait(500)
  })

  it('Test links using button "volver"', () => {
    cy.url().should('eq', 'http://localhost:3001/crearPrestamo')
    cy.get('img').first().click()
    cy.url().should('eq', 'http://localhost:3001/deudores')
  })

  it('Crear prestamo button disabled', () => {
    cy.get('button').contains('Crear Préstamo').should('be.disabled')
  })

  it('Crear prestamo button enabled', () => {
    cy.get('input#nombre').type('Préstamo prueba')
    cy.get('input#monto-prestamo').type('100000')
    cy.get('input#fechainicio').type('2024-11-11')
    cy.get('input#fechafin').type('2024-12-12')
    cy.get('input#interes-prestamo').type('5')
    cy.get('button').contains('Crear Préstamo').should('be.enabled')
  })

  it('Crear prestamo launchs modal', () => {
    cy.get('input#nombre').type('Préstamo prueba')
    cy.get('input#monto-prestamo').type('100000')
    cy.get('input#fechainicio').type('2024-11-11')
    cy.get('input#fechafin').type('2024-12-12')
    cy.get('input#interes-prestamo').type('5')
    cy.get('button').contains('Crear Préstamo').click()
    cy.get('div.modal-content').should('be.visible')
  })

  it('Crear pretamo modal shows correct data', () => {
    cy.get('input#nombre').type('Préstamo prueba')
    cy.get('input#monto-prestamo').type('100000')
    cy.get('input#fechainicio').type('2024-11-11')
    cy.get('input#fechafin').type('2024-12-12')
    cy.get('input#interes-prestamo').type('5')
    cy.get('button').contains('Crear Préstamo').click()
    cy.get('div.modal-content').should('be.visible')
    cy.get('div.modal-body').contains('Préstamo prueba').should('be.visible')
    cy.get('div.modal-body').contains('100000').should('be.visible')
    cy.get('div.modal-body').contains('2024-11-11').should('be.visible')
    cy.get('div.modal-body').contains('2024-12-12').should('be.visible')
    cy.get('div.modal-body').contains('5').should('be.visible')
  })

  it('Confirming creation closes the prestamo modal', () => {
    cy.get('input#nombre').type('Préstamo prueba')
    cy.get('input#monto-prestamo').type('100000')
    cy.get('input#fechainicio').type('2024-11-11')
    cy.get('input#fechafin').type('2024-12-12')
    cy.get('input#interes-prestamo').type('5')
    cy.get('button').contains('Crear Préstamo').click()
    cy.get('div.modal-content').should('be.visible')
    cy.get('button').contains('Confirmar').click()
    cy.get('div.modal-content').should('not.exist')
  })


})