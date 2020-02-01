context('Gestion Batch', () => {
  beforeEach(function() {
    cy.visit('http://localhost:4200');
    cy.fixture('login.json').then((login) => {
      this.login = login;
    });
  });


  it('Ajouter un batch', function() {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addApplication({codeAppli: 'AE1', name: 'ApplicationBatch1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'})
      .addManagerToApplication({codeAppli: 'AE1', nameAppli: 'ApplicationBatch1', user: this.login.admin})
      .logout()
      .login({login: this.login.admin.login, password: this.login.admin.password})
      .addNorme({name: 'Linux', interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.in'})
      .addEnvironnement({
        applicationName: 'ApplicationBatch1',
        name: 'QA',
        host: 'myhost.com',
        login: 'batch',
        homePath: '/home/batch',
        prefix: 'Q',
        norme: 'Linux'
      })
      .addEnvironnement({
        applicationName: 'ApplicationBatch1',
        name: 'Production',
        host: 'myhost.com',
        login: 'batch',
        homePath: '/home/batch',
        prefix: 'P',
        norme: 'Linux'
      }).addBatch({
        applicationName: 'ApplicationBatch1',
        name: 'batch1',
        shell: 'batch1.ksh',
        parms: '2019',
        envs: ['QA', 'Production']
      });
    cy.get('.toast-body').should('contains.text', 'Le batch batch2 a bien été ajoutée');
    cy.deleteApplication({codeAppli: 'AE1',name: 'ApplicationBatch1'});
    cy.logout();
  });
});
