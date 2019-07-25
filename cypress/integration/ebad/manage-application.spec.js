context('Gestion Application', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200')
  });

  it('Ajouter une application', () => {
    cy.login({login: 'dtrouillet', password: 'admin'})
      .addApplication({codeAppli: 'AT1', name: 'ApplicationTest1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});
    cy.get('p.notifier__notification-message').should('have.text', 'L\'application ApplicationTest1 a bien été ajoutée');
  });

  it('Supprimer une application', () => {
    cy.login({login: 'dtrouillet', password: 'admin'})
      .deleteApplication({codeAppli: 'AT1'});
    cy.get('p.notifier__notification-message').should('have.text', 'L\'application a été supprimée');
  });

  it('Lister les applications', () => {
    cy.login({login: 'dtrouillet', password: 'admin'});
    cy.addApplication({codeAppli: 'AT1', name: 'ApplicationTest1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});
    cy.addApplication({codeAppli: 'AT2', name: 'ApplicationTest2', parmPattern: 'ddMMyyyy', filePattern: 'ddMMyyyy'});

    cy.visit('http://localhost:4200');
    cy.get('#applicationMenu').click();
    cy.wait(1500);
    cy.get('#listApplications table > tbody > tr').as('lines');
    cy.get('@lines').should('have.length', 2);

    cy.get('@lines').eq(0).children('td').as('line1');
    cy.get('@line1').eq(0).children('span').should('have.text', 'AT2');
    cy.get('@line1').eq(1).children('span').should('have.text', 'ApplicationTest2');
    cy.get('@line1').eq(2).children('span').should('have.text', 'ddMMyyyy');
    cy.get('@line1').eq(3).children('span').should('have.text', 'ddMMyyyy');

    cy.get('@lines').eq(1).children('td').as('line2');
    cy.get('@line2').eq(0).children('span').should('have.text', 'AT1');
    cy.get('@line2').eq(1).children('span').should('have.text', 'ApplicationTest1');
    cy.get('@line2').eq(2).children('span').should('have.text', 'yyyyMMdd');
    cy.get('@line2').eq(3).children('span').should('have.text', 'yyyyMMdd');


    cy.deleteApplication({codeAppli: 'AT1'});
    cy.deleteApplication({codeAppli: 'AT2'});
  });

  it('Modifier une application', () => {
    cy.login({login: 'dtrouillet', password: 'admin'})
      .addApplication({codeAppli: 'AT1', name: 'ApplicationTest1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});
    cy.updateApplication({
        codeAppliToUpdate: 'AT1',
        codeAppli: 'AT2',
        name: 'ApplicationTest2',
        parmPattern: 'yyyyMMdd',
        filePattern: 'yyyyMMdd'
      });

    cy.deleteApplication({codeAppli: 'AT2'});

    cy.get('p.notifier__notification-message').should(($p) => {
      expect($p[1]).to.have.text('L\'application ApplicationTest2 a bien été modifiée');
      expect($p[2]).to.have.text('L\'application a été supprimée');
    });
  });
});
