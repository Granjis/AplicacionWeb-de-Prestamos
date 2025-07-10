describe('Exploration of the crearPrestamo component', () => {
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


    it('Añadir pago y confirmar cambio intereses y capital', () => {
      cy.get('button').contains('Añadir pago').click()
      cy.get('div.modal-content').should('be.visible')
      cy.get('input#capital').type(3000)
      cy.get('input#interes').type(1000)
      cy.get('button').contains('Agregar Pago').click()
    })

    it('Cerrar prestamo button is disabled if balance does not equals 0', () => {
      cy.get('button').contains('Cerrar Préstamo').should('not.be.enabled')
    })

    it('Descargar historial prestamo button is visible and enabled', () => {
      cy.get('button').contains('Descargar Historial').should('be.visible').should('be.enabled')
    })

    it('Descargar historial prestamo button invokes the confirmation modal', () => {
      cy.get('button').contains('Descargar Historial').click()
      cy.get('div.modal-content').should('be.visible')
      cy.get('div.modal-title.h4').should('be.visible')
    })

    it('Confirmation modal closes when cerrar button is pressed', () => {
      cy.get('button').contains('Descargar Historial').click()
      cy.get('div.modal-content').should('be.visible')
      cy.get('button.btn.buttom-general.btn-primary').contains('Cerrar').should('be.visible')
      cy.get('div.fade.modal.show').click('bottomRight')
      cy.get('div.modal-content').should('not.exist')
    })
})