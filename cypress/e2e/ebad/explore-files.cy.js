context('Folders Management', () => {
  before(function () {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    this.normName = 'myNorme-'+timestamp;
    this.identityName = 'myIdentity-'+timestamp;
    this.appName = 'APP0-'+timestamp;
  });

  beforeEach(function () {
    cy.visit('http://localhost:4200');
    cy.fixture('login.json').then((login) => {
      this.login = login;
    });
  });

  it('Add a folder', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addNorme({name: this.normName, interpreteur: '$1', shellFolder: 'shell', fileDate: 'date.txt'})
      .addIdentityAdmin({name: this.identityName, login: 'testLogin', password: 'myPassword'})
      .addApplication({codeAppli: 'AA0', name: this.appName, parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'})
      .addUserToApplication({codeAppli: 'AA0', nameAppli: this.appName,firstname: this.login.admin.firstname, login: this.login.admin.login})
      .addManagerToApplication({codeAppli: 'AA0', nameAppli: this.appName,firstname: this.login.admin.firstname, login: this.login.admin.login})
      .addEnvironnement({applicationName: this.appName, name:'myEnv', host:'localhost', login:'root', homePath:'/root', prefix:'P', norme: this.normName, identity: this.identityName})
      .addFolder({appliName: this.appName, envName: 'myEnv', directoryName: 'myFolder', path: 'myPath'});
    cy.get('.toast-body').should('contains.text', 'Le répertoire myFolder a bien été ajouté');
  });

  it('Show content folder', function(){
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .selectFolder({appliName: this.appName, envName: 'myEnv', directoryName: 'myFolder'});
  });

  it('Delete folder', function(){
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .deleteFolder({appliName: this.appName, envName: 'myEnv', directoryName: 'myFolder'})
      .deleteApplication({codeAppli: 'AA0', name: this.appName})
      .deleteIdentityAdmin({name: this.identityName})
      .deleteNorme({name: this.normName});
  });
});
