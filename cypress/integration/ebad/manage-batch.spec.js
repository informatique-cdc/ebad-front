context('Gestion Batch', () => {
  const loginAdmin = 'admin2';
  beforeEach(() => {
    cy.visit('http://localhost:4200')
  });

  afterEach(() => {
    cy.logout();
  });

  before(() => {
    cy.visit('http://localhost:4200');
    cy.login({login: loginAdmin, password: 'admin'})
      .addApplication({codeAppli: 'AE1', name: 'ApplicationBatch1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'})
      .addManagerToApplication({codeAppli: 'AE1', login: 'dtrouillet'})
      .logout()
      .login({login: loginAdmin, password: 'admin'})
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
      })
      .logout();
  });

  after(() => {
    cy.visit('http://localhost:4200');
    cy.login({login: loginAdmin, password: 'admin'})
      .deleteApplication({codeAppli: 'AE1'})
      .deleteNorme({name: 'Linux'});
  });

  xit('Ajouter un batch', () => {
    cy.login({login: loginAdmin, password: 'admin'})
      .addBatch({
        applicationName: 'ApplicationBatch1',
        name: 'batch1',
        shell: 'batch1.ksh',
        parms: '2019',
        envs: ['QA', 'Production']
      });
    cy.get('p.notifier__notification-message').should('have.text', 'Le batch batch2 a bien été ajoutée');
  });

  xit('Supprimer une application', () => {
    cy.login({login: loginAdmin, password: 'admin'})
      .deleteApplication({codeAppli: 'AT1'});
    cy.get('p.notifier__notification-message').should('have.text', 'L\'application a été supprimée');
  });

  xit('Lister les applications', () => {
    cy.login({login: loginAdmin, password: 'admin'});
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

  xit('Modifier une application', () => {
    cy.login({login: loginAdmin, password: 'admin'})
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
