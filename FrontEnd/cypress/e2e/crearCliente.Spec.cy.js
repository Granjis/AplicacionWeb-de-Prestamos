describe('Register New Client Form', () => {
    beforeEach(() => {
      // Visitar la página del formulario
      cy.visit('http://localhost:3001');
      cy.get('a.nav-link').contains('Entra').click()
      cy.get('input#username').type('prestamista')
      cy.get('input#password').type('prestamista')
      cy.get('button').contains('Login').click()
      cy.get('a.nav-link').contains('Crear Deudor').click()

    });
  
    it('should render all form fields correctly', () => {
      // Verificar que todos los campos del formulario existan
      cy.get('input#nombrecompleto').should('exist');
      cy.get('input#cedula').should('exist');
      cy.get('select#situacionLaboral').should('exist');
      cy.get('input#direccion').should('exist');
      cy.get('input#telefono').should('exist');
      cy.get('input#email').should('exist');
      cy.get('input#ocupacion').should('exist');
      cy.get('input#foto').should('exist');
      cy.get('button').contains('Guardar').should('exist');
    });
  
    it('should allow filling and submitting the form', () => {
      // Rellenar los campos del formulario
      cy.get('input#nombrecompleto').type('John Doe');
      cy.get('input#cedula').type('123456789');
      cy.get('select#situacionLaboral').select('Empleado');
      cy.get('input#direccion').type('123 Main St');
      cy.get('input#telefono').type('5551234');
      cy.get('input#email').type('jdoe@uniandes.edu.co');
      cy.get('input#ocupacion').type('Oficinista')
      cy.get('input#fechainicio').type('2024-11-11')
      cy.get('input#fechafin').type('2024-12-12')
      cy.get('input#nombrePrestamo').type('Préstamo prueba')
      cy.get('input#interes').type('15')
      cy.get('input#monto').type('100000')
      cy.get('button').contains('Guardar').click();
      // Verificar el comportamiento esperado (cambiar según tu aplicación)
      cy.get('div.alert.alert-success').contains('Cliente registrado con éxito')
    });

    it('número de teléfono erroneo', () => {
        // Rellenar los campos del formulario
        cy.get('input#nombrecompleto').type('John Doe');
        cy.get('input#cedula').type('123456789');
        cy.get('select#situacionLaboral').select('Empleado');
        cy.get('input#direccion').type('123 Main St');
        cy.get('input#telefono').type('5551-234');
        cy.get('input#email').type('jdoe@uniandes.edu.co');
        cy.get('input#ocupacion').type('Oficinista')
        cy.get('input#fechainicio').type('2024-11-11')
        cy.get('input#fechafin').type('2024-12-12')
        cy.get('input#nombrePrestamo').type('Préstamo prueba')
        cy.get('input#interes').type('15')
        cy.get('input#monto').type('100000')
        cy.get('button').contains('Guardar').click();
        // Verificar el comportamiento esperado (cambiar según tu aplicación)
        cy.get('div.alert.alert-danger').contains('El número de teléfono solo debe contener dígitos.') // Suponiendo que redirige a una página de éxito
      });

      it('Email de cliente erroneo', () => {
        // Rellenar los campos del formulario
        cy.get('input#nombrecompleto').type('John Doe');
        cy.get('input#cedula').type('123456789');
        cy.get('select#situacionLaboral').select('Empleado');
        cy.get('input#direccion').type('123 Main St');
        cy.get('input#telefono').type('5551234');
        cy.get('input#email').type('jdoeuniandes.edu.co');
        cy.get('input#ocupacion').type('Oficinista')
        cy.get('input#fechainicio').type('2024-11-11')
        cy.get('input#fechafin').type('2024-12-12')
        cy.get('input#nombrePrestamo').type('Préstamo prueba')
        cy.get('input#interes').type('15')
        cy.get('input#monto').type('100000')
        cy.get('button').contains('Guardar').click();
        cy.get('div.alert.alert-success').should('not.exist');
      });
  });
  