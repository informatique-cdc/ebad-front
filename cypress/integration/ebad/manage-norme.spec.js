context('Norms', () => {
  before(function () {
    cy.server();
  });

  beforeEach(function () {
    cy.visit('http://localhost:4200');
    cy.fixture('login.json').then((login) => {
      this.login = login;
    });
  });

  it('Ajouter une norme', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addNorme({name: 'TestUnix', interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.txt'});
    cy.get('.toast-body').should('contains.text', 'La norme a bien été ajoutée');
  });

  it('Supprimer une norme', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .deleteNorme({name: 'TestUnix'});
    cy.get('.toast-body').should('contains.text', 'La norme a été supprimée');
  });

  it('Lister les normes', function () {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/ebad/norms?page=0&size=10&sort=name,asc&name=TestCy',
    }).as('searchNormeTest');

    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addNorme({name: 'TestCyUnix', interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.txt'})
      .addNorme({name: 'TestCyWindows', interpreteur: 'PowerShell.exe', shellFolder: 'bat/', fileDate: 'date.data'});

    cy.visit('http://localhost:4200');
    cy.get('#administrationMenu').click();
    cy.get('#normMenu').click();
    cy.get('input[type="search"]').type('TestCy');
    cy.wait('@searchNormeTest');

    cy.contains('TestCyUnix').parent('tr').within(() => {
      cy.get('td').eq(2).contains('/bin/bash')
      cy.get('td').eq(3).contains('shell/')
      cy.get('td').eq(4).contains('date.txt')
    });

    cy.contains('TestCyWindows').parent('tr').within(() => {
      cy.get('td').eq(2).contains('PowerShell.exe')
      cy.get('td').eq(3).contains('bat/')
      cy.get('td').eq(4).contains('date.data')
    });

    cy.deleteNorme({name: 'TestCyUnix'});
    cy.deleteNorme({name: 'TestCyWindows'});
  });

  it('Modifier une norme', function () {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/ebad/norms?page=0&size=10&sort=name,asc&name=TestUpCyLinuxNew',
    }).as('searchNormeTest');

    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addNorme({name: 'TestUpCyLinux', interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.in'});

    cy.visit('http://localhost:4200');
    cy.get('#administrationMenu').click();
    cy.get('#normMenu').click();

    cy.updateNorme({
      nameToUpdate: 'TestUpCyLinux',
      name: 'TestUpCyLinuxNew',
      interpreteur: '/bin/zsh',
      shellFolder: 'zsh/',
      fileDate: 'date.bin'
    });

    cy.get('.toast-body').should('contains.text', 'La norme a bien été modifiée');


    cy.get('input[type="search"]').type('TestUpCyLinuxNew');
    cy.wait('@searchNormeTest');

    cy.contains('TestUpCyLinuxNew').parent('tr').within(() => {
      cy.get('td').eq(2).contains('/bin/zsh')
      cy.get('td').eq(3).contains('zsh/')
      cy.get('td').eq(4).contains('date.bin')
    });

    cy.deleteNorme({name: 'TestUpCyLinuxNew'});
    cy.get('.toast-body').should('contains.text', 'La norme a été supprimée');

  });
});
