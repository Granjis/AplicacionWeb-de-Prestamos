describe('Pruebas para HU-9', () => {
    beforeEach(() => {
      
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
      cy.wait(1000)

      });
  
    it('Debe cargar los datos iniciales del deudor correctamente', () => {
      
      // Validar información personal
      cy.contains('C.C').should('exist');
      cy.contains('Age:').should('exist');
      cy.contains('Email:').should('exist');
      cy.contains('Phone number:').should('exist');
      
      // Validar estado laboral
      cy.contains('Work Status:').should('exist');

    });
    it('Debe mostrar los íconos correctos en la información rápida', () => {
        cy.get('.custom-container .bi-currency-dollar').should('exist');
        cy.get('.custom-container .bi-briefcase').should('exist');
      });
  
    it('Debe permitir editar la información del deudor', () => {
      // Abrir modal de edición
      cy.get('.bi-pencil-square').click();
      cy.get('.modal-title').should('contain', 'Editar Deudor');
  
      // Editar campos del formulario
      cy.get('input').eq(0).clear().type('Nuevo Nombre');
      cy.get('input').eq(1).clear().type('nuevoemail@gmail.com');
      cy.get('input').eq(2).clear().type('3143807270');
  
      // Guardar cambios
      cy.contains('Guardar').click();
  
      // Validar cambios en el componente
      cy.contains('Nuevo Nombre').should('exist');
      cy.contains('3143807270').should('exist');
      cy.contains('nuevoemail@gmail.com').should('exist');
    });
  
    it('Debe navegar correctamente al detalle de las deudas', () => {
      // Clic en el ícono de "ojo" en una deuda
      cy.get('.bi-eye').first().click();
  
      // Verificar que la navegación sea correcta (ajusta según tu ruta específica)
      cy.url().should('include', '/deudorApp');
    });
  
    it('Debe permitir navegar a la página de creación de préstamos', () => {
      // Clic en el botón "Crear Préstamo"
      cy.contains('Create Loan').click();
  
      // Verificar navegación a la página de préstamos
      cy.url().should('include', '/crearPrestamo');
    });
  });
  