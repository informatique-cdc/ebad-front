context('Applications Administration', () => {
  before(function () {
    cy.intercept();
    const currentDate = new Date();
    this.timestamp = currentDate.getTime();
    this.app1Name = 'ApplicationTest1-'+this.timestamp;
    this.app2Name = 'ApplicationTest2-'+this.timestamp;
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

  it('Add application', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addApplication({codeAppli: 'AT1', name: this.app1Name, parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});
    cy.get('.toast-body').should('contains.text', 'L\'application '+this.app1Name+' a bien été ajoutée');
  });

  it('Delete application', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .deleteApplication({codeAppli: 'AT1', name: this.app1Name});
    cy.get('.toast-body').should('have.text', '\nL\'application a été supprimée\n');
  });

  it('List applications', function () {
    cy.intercept();
    cy.route({
      method: 'GET',
      url: '/ebad/applications/gestion?page=0&size=*&sort=name,asc&name='+this.timestamp,
    }).as('searchApplicationTest');

    cy.login({login: this.login.admin.login, password: this.login.admin.password});
    cy.addApplication({codeAppli: 'AT1', name: this.app1Name, parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});
    cy.addApplication({codeAppli: 'AT2', name: this.app2Name, parmPattern: 'ddMMyyyy', filePattern: 'ddMMyyyy'});

    cy.visit('http://localhost:4200');
    cy.get('#administrationMenu').click();
    cy.get('#applicationMenu').click();
    cy.get('input[type="search"]').type(this.timestamp);

    cy.wait('@searchApplicationTest');

    cy.get('#listApplications > tbody > tr').not('.odd').as('lines');
    cy.get('@lines').should('have.length', 2);

    cy.get('@lines').eq(0).children('td').as('line1');
    cy.get('@line1').eq(1).should('contain.text', 'AT1');
    cy.get('@line1').eq(2).should('contain.text', this.app1Name);
    cy.get('@line1').eq(3).should('contain.text', 'yyyyMMdd');
    cy.get('@line1').eq(4).should('contain.text', 'yyyyMMdd');

    cy.get('@lines').eq(1).children('td').as('line2');
    cy.get('@line2').eq(1).should('contain.text', 'AT2');
    cy.get('@line2').eq(2).should('contain.text', this.app2Name);
    cy.get('@line2').eq(3).should('contain.text', 'ddMMyyyy');
    cy.get('@line2').eq(4).should('contain.text', 'ddMMyyyy');


    cy.deleteApplication({codeAppli: 'AT1', name: this.app1Name});
    cy.deleteApplication({codeAppli: 'AT2', name: this.app2Name});

  });

  it('Edit application', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addApplication({codeAppli: 'AT1', name: this.app1Name, parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});

    cy.updateApplication({
      codeAppliToUpdate: 'AT1',
      nameToUpdate: this.app1Name,
      codeAppli: 'AT2',
      name: this.app2Name,
      parmPattern: 'yyyyMMdd',
      filePattern: 'yyyyMMdd'
    });
    cy.getAttached('.toast-body').should('contains.text', 'L\'application '+this.app2Name+' a bien été modifiée');

    cy.deleteApplication({codeAppli: 'AT2', name: this.app2Name});
    cy.getAttached('.toast-body').should('contains.text', 'L\'application a été supprimée');
  });
});
