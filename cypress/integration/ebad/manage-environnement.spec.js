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
    .addEnvironnement({applicationName: 'ApplicationCyEnv1', name: 'ProductionCy', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: 'Linux'})
    .addEnvironnement({applicationName: 'ApplicationCyEnv1', name: 'QACy', host: 'myhost-qa.com', login: 'batch', homePath: '/home/batch', prefix: 'Q', norme: 'Linux'});


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
  });

  //
  // it('Modifier un environnement', function () {
  //   cy.login({login: this.login.admin.login, password: this.login.admin.password})
  //     .addEnvironnement({applicationName: 'ApplicationEnv1', name: 'Production', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: 'Linux'});
  //
  //   cy.updateEnvironnement({
  //     applicationName: 'ApplicationEnv1',
  //     environnementNameToUpdate: 'Production',
  //     name: 'QA',
  //     host: 'mynewhost.com',
  //     login: 'batch2',
  //     homePath: '/home/batch2',
  //     prefix: 'Q'
  //   });
  //
  //   cy.get('#listEnvironnements table > tbody > tr').as('lines');
  //   cy.get('@lines').should('have.length', 1);
  //
  //   cy.get('@lines').eq(0).children('td').as('line1');
  //   cy.get('@line1').eq(1).children('span').should('have.text', 'QA');
  //   cy.get('@line1').eq(2).children('span').should('have.text', 'mynewhost.com');
  //   cy.get('@line1').eq(3).children('span').should('have.text', 'batch2');
  //   cy.get('@line1').eq(4).children('span').should('have.text', '/home/batch2');
  //   cy.get('@line1').eq(5).children('span').should('have.text', 'Q');
  //
  //   //On teste aussi après un changement d'écran
  //   cy.get('#applicationMenu').click();
  //   cy.get('#environnementMenu').click();
  //   cy.get("#selectApplication").select('ApplicationEnv1');
  //
  //   cy.get('#listEnvironnements table > tbody > tr').as('lines');
  //   cy.get('@lines').should('have.length', 1);
  //
  //   cy.get('@lines').eq(0).children('td').as('line1');
  //   cy.get('@line1').eq(1).children('span').should('have.text', 'QA');
  //   cy.get('@line1').eq(2).children('span').should('have.text', 'mynewhost.com');
  //   cy.get('@line1').eq(3).children('span').should('have.text', 'batch2');
  //   cy.get('@line1').eq(4).children('span').should('have.text', '/home/batch2');
  //   cy.get('@line1').eq(5).children('span').should('have.text', 'Q');
  //
  //   cy.deleteEnvironnement({applicationName: 'ApplicationEnv1', environnementName: 'QA'});
  //
  //   cy.get('p.notifier__notification-message').should(($p) => {
  //     expect($p[1]).to.have.text('L\'environnement a bien été modifiée');
  //     expect($p[2]).to.have.text('L\'environnement a été supprimée');
  //   });
  // });
});
