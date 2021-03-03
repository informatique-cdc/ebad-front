context('Gestion Environnement', () => {
  before(function () {
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
      .addApplication({codeAppli: 'EN1', name: 'ApplicationCyEnv1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'})
      .addManagerToApplication({codeAppli: 'EN1', nameAppli: 'ApplicationCyEnv1', firstname: this.login.admin.firstname, login: this.login.admin.login})
      .addNorme({name: 'LinuxEnvCy', interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.in'})
      .addEnvironnement({applicationName: 'ApplicationCyEnv1', name: 'ProductionCy', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: 'LinuxEnvCy'});
    cy.get('.toast-body').should('contains.text', 'L\'environnement ProductionCy a bien été ajouté');
  });

  it('Delete environment', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .deleteEnvironnement({applicationName: 'ApplicationCyEnv1', environnementName: 'ProductionCy'});
    cy.get('.toast-body').should('contains.text', 'L\'environnement a été supprimé');
  });

  it('List environments', function () {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/ebad/environments?applicationId=**&page=0&size=10&sort=id,asc&name=',
    }).as('searchEnvironments');

    cy.login({login: this.login.admin.login, password: this.login.admin.password})
    .addEnvironnement({applicationName: 'ApplicationCyEnv1', name: 'ProductionCy', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: 'LinuxEnvCy'})
    .addEnvironnement({applicationName: 'ApplicationCyEnv1', name: 'QACy', host: 'myhost-qa.com', login: 'batch', homePath: '/home/batch', prefix: 'Q', norme: 'LinuxEnvCy'});


    cy.visit('http://localhost:4200');
    cy.get('#managementMenu').click();
    cy.get('#environmentMenu').click();
    cy.get("#selectApplication").select('ApplicationCyEnv1');
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

    cy.deleteEnvironnement({applicationName: 'ApplicationCyEnv1', environnementName: 'ProductionCy'});
    cy.deleteEnvironnement({applicationName: 'ApplicationCyEnv1', environnementName: 'QACy'});
    cy.de
  });


  it('Modifier un environnement', function () {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/ebad/environments?applicationId=**&page=0&size=10&sort=id,asc&name=',
    }).as('getEnvironments');

    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addEnvironnement({applicationName: 'ApplicationCyEnv1', name: 'Production', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: 'LinuxEnvCy'});

    cy.updateEnvironnement({
      applicationName: 'ApplicationCyEnv1',
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
    cy.get("#selectApplication").select('ApplicationCyEnv1');

    cy.wait('@getEnvironments');

    cy.contains('QA').parent('tr').within(() => {
      cy.get('td').eq(2).contains('mynewhost.com')
      cy.get('td').eq(3).contains('batch2')
      cy.get('td').eq(4).contains('/home/batch2')
      cy.get('td').eq(5).contains('Q')
    });

    cy.deleteEnvironnement({applicationName: 'ApplicationCyEnv1', environnementName: 'QA'});
    cy.get('.toast-body').should('contains.text', 'L\'environnement a été supprimé');

    cy.deleteApplication({codeAppli: 'EN1', name: 'ApplicationCyEnv1'});
    cy.deleteNorme({name: 'LinuxEnvCy'});

  });
});
