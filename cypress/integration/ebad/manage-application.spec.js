context('Gestion Application', () => {
  before(function () {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/ebad/applications/gestion*',
    }).as('searchApplication');
  });

  beforeEach(function () {
    cy.visit('http://localhost:4200');
    cy.fixture('login.json').then((login) => {
      this.login = login;
    });
  });

  it('Ajouter une application', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addApplication({codeAppli: 'AT1', name: 'ApplicationTest1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});
    cy.get('.toast-body').should('contains.text', 'L\'application ApplicationTest1 a bien été ajoutée');
  });

  it('Supprimer une application', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .deleteApplication({codeAppli: 'AT1', name: 'ApplicationTest1'});
    cy.get('.toast-body').should('have.text', '\nL\'application a été supprimée\n');
  });

  it('Lister les applications', function () {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/ebad/applications/gestion?page=0&size=10&sort=name,asc&name=ApplicationTest',
    }).as('searchApplicationTest');

    cy.login({login: this.login.admin.login, password: this.login.admin.password});
    cy.addApplication({codeAppli: 'AT1', name: 'ApplicationTest1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});
    cy.addApplication({codeAppli: 'AT2', name: 'ApplicationTest2', parmPattern: 'ddMMyyyy', filePattern: 'ddMMyyyy'});

    cy.visit('http://localhost:4200');
    cy.get('#administrationMenu').click();
    cy.get('#applicationMenu').click();
    cy.get('input[type="search"]').type('ApplicationTest');

    cy.wait('@searchApplicationTest');

    cy.get('#listApplications > tbody > tr').not('.odd').as('lines');
    cy.get('@lines').should('have.length', 2);

    cy.get('@lines').eq(0).children('td').as('line1');
    cy.get('@line1').eq(0).should('contain.text', 'AT1');
    cy.get('@line1').eq(1).should('contain.text', 'ApplicationTest1');
    cy.get('@line1').eq(2).should('contain.text', 'yyyyMMdd');
    cy.get('@line1').eq(3).should('contain.text', 'yyyyMMdd');

    cy.get('@lines').eq(1).children('td').as('line2');
    cy.get('@line2').eq(0).should('contain.text', 'AT2');
    cy.get('@line2').eq(1).should('contain.text', 'ApplicationTest2');
    cy.get('@line2').eq(2).should('contain.text', 'ddMMyyyy');
    cy.get('@line2').eq(3).should('contain.text', 'ddMMyyyy');


    cy.deleteApplication({codeAppli: 'AT1', name: 'ApplicationTest1'});
    cy.deleteApplication({codeAppli: 'AT2', name: 'ApplicationTest2'});

  });

  it('Modifier une application', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addApplication({codeAppli: 'AT1', name: 'ApplicationTest1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});

    cy.updateApplication({
      codeAppliToUpdate: 'AT1',
      nameToUpdate: 'ApplicationTest1',
      codeAppli: 'AT2',
      name: 'ApplicationTest2',
      parmPattern: 'yyyyMMdd',
      filePattern: 'yyyyMMdd'
    });
    cy.getAttached('.toast-body').should('contains.text', 'L\'application ApplicationTest2 a bien été modifiée');

    cy.deleteApplication({codeAppli: 'AT2', name: 'ApplicationTest2'});
    cy.getAttached('.toast-body').should('contains.text', 'L\'application a été supprimée');
  });
});
