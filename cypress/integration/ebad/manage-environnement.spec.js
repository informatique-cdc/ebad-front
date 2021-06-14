context('Gestion Environnement', () => {
  before(function () {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    this.norm1Name = 'LinuxEnvCy-'+timestamp;
    this.app1Name = 'ApplicationTest1-'+timestamp;
    this.app2Name = 'ApplicationTest2-'+timestamp;
    cy.server();
  });

  beforeEach(function () {
    cy.visit('http://localhost:4200');
    cy.fixture('login.json').then((login) => {
      this.login = login;
    });
  });

  // before(function () {
  //   cy.fixture('login.json').then((login) => {
  //     this.login = login;
  //   });
  //
  //   cy.login({login: this.login.admin.login, password: this.login.admin.password})
  //     .addApplication({codeAppli: 'AE1', name: 'ApplicationEnv1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'})
  //     .addManagerToApplication({codeAppli: 'AE1', nameAppli: 'ApplicationEnv1', firstname: 'admin', login: 'admin'})
  //     .addNorme({name: 'Linux', interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.in'})
  //     .logout();
  // });

  // after(function () {
  //   cy.fixture('login.json').then((login) => {
  //     this.login = login;
  //   });
  //
  //   cy.login({login: this.login.admin.login, password: this.login.admin.password})
  //     .deleteApplication({codeAppli: 'AE1'})
  //     .deleteNorme({name: 'Linux'});
  // });

  it('Add environment', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addApplication({codeAppli: 'EN1', name: this.app1Name, parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'})
      .addManagerToApplication({codeAppli: 'EN1', nameAppli: this.app1Name, firstname: this.login.admin.firstname, login: this.login.admin.login})
      .addNorme({name: this.norm1Name, interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.in'})
      .addEnvironnement({applicationName: this.app1Name, name: 'ProductionCy', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: this.norm1Name});
    cy.get('.toast-body').should('contains.text', 'L\'environnement ProductionCy a bien été ajouté');
  });

  it('Delete environment', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .deleteEnvironnement({applicationName: this.app1Name, environnementName: 'ProductionCy'});
    cy.get('.toast-body').should('contains.text', 'L\'environnement a été supprimé');
  });

  it('List environments', function () {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/ebad/environments?applicationId=**&page=0&size=*&sort=id,asc&name=',
    }).as('searchEnvironments');

    cy.login({login: this.login.admin.login, password: this.login.admin.password})
    .addEnvironnement({applicationName: this.app1Name, name: 'ProductionCy', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: this.norm1Name})
    .addEnvironnement({applicationName: this.app1Name, name: 'QACy', host: 'myhost-qa.com', login: 'batch', homePath: '/home/batch', prefix: 'Q', norme: this.norm1Name});


    cy.visit('http://localhost:4200');
    cy.get('#managementMenu').click();
    cy.get('#environmentMenu').click();
    cy.get("#selectApplication").select(this.app1Name);
    cy.wait('@searchEnvironments');

    cy.contains('QACy').parent('tr').within(() => {
      cy.get('td').eq(2).contains('myhost-qa.com')
      cy.get('td').eq(3).contains('batch')
      cy.get('td').eq(4).contains('/home/batch')
      cy.get('td').eq(5).contains('Q')
    });

    cy.contains('ProductionCy').parent('tr').within(() => {
      cy.get('td').eq(2).contains('myhost.com')
      cy.get('td').eq(3).contains('batch')
      cy.get('td').eq(4).contains('/home/batch')
      cy.get('td').eq(5).contains('P')
    });

    cy.deleteEnvironnement({applicationName: this.app1Name, environnementName: 'ProductionCy'});
    cy.deleteEnvironnement({applicationName: this.app1Name, environnementName: 'QACy'});
    cy.de
  });


  it('Modifier un environnement', function () {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/ebad/environments?applicationId=**&page=0&size=*&sort=id,asc&name=',
    }).as('getEnvironments');

    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addEnvironnement({applicationName: this.app1Name, name: 'Production', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: this.norm1Name});

    cy.updateEnvironnement({
      applicationName: this.app1Name,
      environnementNameToUpdate: 'Production',
      name: 'QA',
      host: 'mynewhost.com',
      login: 'batch2',
      homePath: '/home/batch2',
      prefix: 'Q'
    });

    cy.get('.toast-body').should('contains.text', 'L\'environnement QA a bien été modifié');


    cy.visit('http://localhost:4200');
    cy.get('#managementMenu').click();
    cy.get('#environmentMenu').click();
    cy.get("#selectApplication").select(this.app1Name);

    cy.wait('@getEnvironments');

    cy.contains('QA').parent('tr').within(() => {
      cy.get('td').eq(2).contains('mynewhost.com')
      cy.get('td').eq(3).contains('batch2')
      cy.get('td').eq(4).contains('/home/batch2')
      cy.get('td').eq(5).contains('Q')
    });

    cy.deleteEnvironnement({applicationName: this.app1Name, environnementName: 'QA'});
    cy.get('.toast-body').should('contains.text', 'L\'environnement a été supprimé');

    cy.deleteApplication({codeAppli: 'EN1', name: this.app1Name});
    cy.deleteNorme({name: this.norm1Name});

  });
});
