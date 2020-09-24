context('Gestion Application', () => {
  before(function () {
    cy.server();
    // cy.route({
    //   method: 'GET',
    //   url: '/ebad/applications/gestion*',
    // }).as('searchApplication');
  });

  beforeEach(function () {
    cy.visit('http://localhost:4200');
    cy.fixture('login.json').then((login) => {
      this.login = login;
    });
  });

  it('Add a folder', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addNorme({name: 'myNorme', interpreteur: '$1', shellFolder: 'shell', fileDate: 'date.txt'})
      .addApplication({codeAppli: 'AA0', name: 'APP0', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'})
      .addUserToApplication({codeAppli: 'AA0', nameAppli: 'APP0',firstname: this.login.admin.firstname, login: this.login.admin.login})
      .addManagerToApplication({codeAppli: 'AA0', nameAppli: 'APP0',firstname: this.login.admin.firstname, login: this.login.admin.login})
      .addEnvironnement({applicationName: 'APP0', name:'myEnv', host:'localhost', login:'root', homePath:'/root', prefix:'P', norme: 'myNorme'})
      .addFolder({appliName:'APP0', envName: 'myEnv', directoryName: 'myFolder', path: 'myPath'});
    cy.get('.toast-body').should('contains.text', 'Le répertoire myFolder a bien été ajouté');
  });

  it('Show content folder', function(){
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .selectFolder({appliName: 'APP0', envName: 'myEnv', directoryName: 'myFolder'});
  });

  it('Delete folder', function(){
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .deleteFolder({appliName: 'APP0', envName: 'myEnv', directoryName: 'myFolder'})
      .deleteApplication({codeAppli: 'AA0', name: 'APP0'})
      .deleteNorme({name: 'myNorme'});
  });

  // it('Supprimer une application', function () {
  //   cy.login({login: this.login.admin.login, password: this.login.admin.password})
  //     .deleteApplication({codeAppli: 'AT1', name: 'ApplicationTest1'});
  //   cy.get('.toast-body').should('have.text', '\nL\'application a été supprimée\n');
  // });
  //
  // it('Lister les applications', function () {
  //   cy.server();
  //   cy.route({
  //     method: 'GET',
  //     url: '/ebad/applications/gestion?page=0&size=10&sort=name,asc&name=ApplicationTest',
  //   }).as('searchApplicationTest');
  //
  //   cy.login({login: this.login.admin.login, password: this.login.admin.password});
  //   cy.addApplication({codeAppli: 'AT1', name: 'ApplicationTest1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});
  //   cy.addApplication({codeAppli: 'AT2', name: 'ApplicationTest2', parmPattern: 'ddMMyyyy', filePattern: 'ddMMyyyy'});
  //
  //   cy.visit('http://localhost:4200');
  //   cy.get('#administrationMenu').click();
  //   cy.get('#applicationMenu').click();
  //   cy.get('input[type="search"]').type('ApplicationTest');
  //
  //   cy.wait('@searchApplicationTest');
  //
  //   cy.get('#listApplications > tbody > tr').not('.odd').as('lines');
  //   cy.get('@lines').should('have.length', 2);
  //
  //   cy.get('@lines').eq(0).children('td').as('line1');
  //   cy.get('@line1').eq(0).should('contain.text', 'AT1');
  //   cy.get('@line1').eq(1).should('contain.text', 'ApplicationTest1');
  //   cy.get('@line1').eq(2).should('contain.text', 'yyyyMMdd');
  //   cy.get('@line1').eq(3).should('contain.text', 'yyyyMMdd');
  //
  //   cy.get('@lines').eq(1).children('td').as('line2');
  //   cy.get('@line2').eq(0).should('contain.text', 'AT2');
  //   cy.get('@line2').eq(1).should('contain.text', 'ApplicationTest2');
  //   cy.get('@line2').eq(2).should('contain.text', 'ddMMyyyy');
  //   cy.get('@line2').eq(3).should('contain.text', 'ddMMyyyy');
  //
  //
  //   cy.deleteApplication({codeAppli: 'AT1', name: 'ApplicationTest1'});
  //   cy.deleteApplication({codeAppli: 'AT2', name: 'ApplicationTest2'});
  //
  // });
  //
  // it('Modifier une application', function () {
  //   cy.login({login: this.login.admin.login, password: this.login.admin.password})
  //     .addApplication({codeAppli: 'AT1', name: 'ApplicationTest1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'});
  //
  //   cy.updateApplication({
  //     codeAppliToUpdate: 'AT1',
  //     nameToUpdate: 'ApplicationTest1',
  //     codeAppli: 'AT2',
  //     name: 'ApplicationTest2',
  //     parmPattern: 'yyyyMMdd',
  //     filePattern: 'yyyyMMdd'
  //   });
  //   cy.getAttached('.toast-body').should('contains.text', 'L\'application ApplicationTest2 a bien été modifiée');
  //
  //   cy.deleteApplication({codeAppli: 'AT2', name: 'ApplicationTest2'});
  //   cy.getAttached('.toast-body').should('contains.text', 'L\'application a été supprimée');
  // });
});
