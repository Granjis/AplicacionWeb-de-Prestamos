describe('deudores spec', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:3001');
    cy.get('a.nav-link').contains('Entra').click()
    cy.get('input#username').type('prestamista')
    cy.get('input#password').type('prestamista')
    cy.get('button').contains('Login').click()
  })

  it('La página carga correctamente', ()=>{
    cy.url().should('eq', 'http://localhost:3001/deudores')
    cy.get('h1').should('contain', 'Bienvenido, Jorge Bustamante')
    cy.get('h3').should('contain', 'Este mes has ganado')
    cy.wait(4000);
    cy.get('h3').should('contain', 'Este mes has ganado')
    cy.get('h2').should('contain', '$0')
  })
  it('La URL funciona apropiadamente', ()=>{
    cy.url().should('eq', 'http://localhost:3001/deudores')
    cy.wait(4000)
    cy.url().should('include', "/deudores")
  })
  it('Visitar crear cliente desde deudores', ()=>{
    cy.url().should('eq', 'http://localhost:3001/deudores')
    cy.wait(4000)
    cy.get('a.nav-link.custom-links').contains('Crear Deudor').click()
    cy.url().should('include', "/crearcliente")
  })
  it('Visitar consultar cliente desde deudores', ()=>{
    cy.url().should('eq', 'http://localhost:3001/deudores')
    cy.wait(4000)
    cy.get('a.nav-link.custom-links').contains('Consultar Deudor').click()
    cy.url().should('include', "/consultarcliente")
  })
  it('Buscar deudor', ()=>{
    cy.url().should('eq', 'http://localhost:3001/deudores')
    cy.wait(4000)
    cy.get('a.nav-link.custom-links').contains('Consultar Deudor').click()
    cy.get('button').contains('Consultar Todos').click();
    cy.get('img').first().click()
    cy.get('input').type('Mariana')
    cy.get('body') 
      .invoke('text') 
      .then((pageText) => {
        expect(pageText).to.include('Mariana');
      });
  })

})