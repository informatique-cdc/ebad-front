context('Gestion Environnement', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200')
  });

  afterEach(() => {
    cy.logout();
  });

  before(() => {
    cy.visit('http://localhost:4200');
     cy.login({login: 'dtrouillet', password: 'admin'})
      .addApplication({codeAppli: 'AE1', name: 'ApplicationEnv1', parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'})
      .addManagerToApplication({codeAppli: 'AE1', login: 'dtrouillet'})
      .addNorme({name: 'Linux', interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.in'})
      .logout();
  });

  after(() => {
    cy.visit('http://localhost:4200');
    cy.login({login: 'dtrouillet', password: 'admin'})
      .deleteApplication({codeAppli: 'AE1'})
      .deleteNorme({name: 'Linux'});
  });

  it('Ajouter un environnement', () => {
    cy.login({login: 'dtrouillet', password: 'admin'})
      .addEnvironnement({applicationName: 'ApplicationEnv1', name: 'Production', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: 'Linux'});
    cy.get('p.notifier__notification-message').should('have.text', 'L\'environnement Production a bien été ajouté');
  });

  it('Supprimer un environnement', () => {
    cy.login({login: 'dtrouillet', password: 'admin'})
      .deleteEnvironnement({applicationName: 'ApplicationEnv1', environnementName: 'Production'});
    cy.get('p.notifier__notification-message').should('have.text', 'L\'environnement a été supprimé');
  });

  it('Lister les environnements', () => {
    cy.login({login: 'dtrouillet', password: 'admin'});
    cy.addEnvironnement({applicationName: 'ApplicationEnv1', name: 'Production', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: 'Linux'});
    cy.addEnvironnement({applicationName: 'ApplicationEnv1', name: 'QA', host: 'myhost-qa.com', login: 'batch', homePath: '/home/batch', prefix: 'Q', norme: 'Linux'});


    cy.visit('http://localhost:4200');
    cy.get('#environnementMenu').click();
    cy.get("#selectApplication").select('ApplicationEnv1');
    cy.wait(1500);
    cy.get('#listEnvironnements table > tbody > tr').as('lines');
    cy.get('@lines').should('have.length', 2);


    cy.get('@lines').eq(1).children('td').as('line1');
    cy.get('@line1').eq(1).children('span').should('have.text', 'QA');
    cy.get('@line1').eq(2).children('span').should('have.text', 'myhost-qa.com');
    cy.get('@line1').eq(3).children('span').should('have.text', 'batch');
    cy.get('@line1').eq(4).children('span').should('have.text', '/home/batch');
    cy.get('@line1').eq(5).children('span').should('have.text', 'Q');

    cy.get('@lines').eq(0).children('td').as('line2');
    cy.get('@line2').eq(1).children('span').should('have.text', 'Production');
    cy.get('@line2').eq(2).children('span').should('have.text', 'myhost.com');
    cy.get('@line2').eq(3).children('span').should('have.text', 'batch');
    cy.get('@line2').eq(4).children('span').should('have.text', '/home/batch');
    cy.get('@line2').eq(5).children('span').should('have.text', 'P');


    cy.deleteEnvironnement({applicationName: 'ApplicationEnv1', environnementName: 'Production'});
    cy.deleteEnvironnement({applicationName: 'ApplicationEnv1', environnementName: 'QA'});
  });

  it('Modifier un environnement', () => {
    cy.login({login: 'dtrouillet', password: 'admin'})
      .addEnvironnement({applicationName: 'ApplicationEnv1', name: 'Production', host: 'myhost.com', login: 'batch', homePath: '/home/batch', prefix: 'P', norme: 'Linux'});

    cy.updateEnvironnement({
      applicationName: 'ApplicationEnv1',
      environnementNameToUpdate: 'Production',
      name: 'QA',
      host: 'mynewhost.com',
      login: 'batch2',
      homePath: '/home/batch2',
      prefix: 'Q'
    });

    cy.get('#listEnvironnements table > tbody > tr').as('lines');
    cy.get('@lines').should('have.length', 1);

    cy.get('@lines').eq(0).children('td').as('line1');
    cy.get('@line1').eq(1).children('span').should('have.text', 'QA');
    cy.get('@line1').eq(2).children('span').should('have.text', 'mynewhost.com');
    cy.get('@line1').eq(3).children('span').should('have.text', 'batch2');
    cy.get('@line1').eq(4).children('span').should('have.text', '/home/batch2');
    cy.get('@line1').eq(5).children('span').should('have.text', 'Q');

    //On teste aussi après un changement d'écran
    cy.get('#applicationMenu').click();
    cy.get('#environnementMenu').click();
    cy.get("#selectApplication").select('ApplicationEnv1');

    cy.get('#listEnvironnements table > tbody > tr').as('lines');
    cy.get('@lines').should('have.length', 1);

    cy.get('@lines').eq(0).children('td').as('line1');
    cy.get('@line1').eq(1).children('span').should('have.text', 'QA');
    cy.get('@line1').eq(2).children('span').should('have.text', 'mynewhost.com');
    cy.get('@line1').eq(3).children('span').should('have.text', 'batch2');
    cy.get('@line1').eq(4).children('span').should('have.text', '/home/batch2');
    cy.get('@line1').eq(5).children('span').should('have.text', 'Q');

    cy.deleteEnvironnement({applicationName: 'ApplicationEnv1', environnementName: 'QA'});

    cy.get('p.notifier__notification-message').should(($p) => {
      expect($p[1]).to.have.text('L\'environnement a bien été modifiée');
      expect($p[2]).to.have.text('L\'environnement a été supprimée');
    });
  });
});
