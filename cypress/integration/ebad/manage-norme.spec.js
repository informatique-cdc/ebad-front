context('Norms', () => {
  before(function () {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    this.norm1Name = 'LinuxEnvCy-'+timestamp;
    this.norm2Name = 'TestCyUnix-'+timestamp;
    this.norm3Name = 'TestCyWindows-'+timestamp;
    this.norm4Name = 'TestUpCyLinux-'+timestamp;
    this.norm5Name = 'TestUpCyLinuxNew-'+timestamp;
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
      .addNorme({name: this.norm1Name, interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.txt'});
    cy.get('.toast-body').should('contains.text', 'La norme a bien été ajoutée');
  });

  it('Supprimer une norme', function () {
    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .deleteNorme({name: this.norm1Name});
    cy.get('.toast-body').should('contains.text', 'La norme a été supprimée');
  });

  it('Lister les normes', function () {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/ebad/norms?page=0&size=*&sort=name,asc&name=TestCy',
    }).as('searchNormeTest');

    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addNorme({name: this.norm2Name, interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.txt'})
      .addNorme({name: this.norm3Name, interpreteur: 'PowerShell.exe', shellFolder: 'bat/', fileDate: 'date.data'});

    cy.visit('http://localhost:4200');
    cy.get('#administrationMenu').click();
    cy.get('#normMenu').click();
    cy.get('input[type="search"]').type('TestCy');
    cy.wait('@searchNormeTest');

    cy.contains(this.norm2Name).parent('tr').within(() => {
      cy.get('td').eq(2).contains('/bin/bash')
      cy.get('td').eq(3).contains('shell/')
      cy.get('td').eq(4).contains('date.txt')
    });

    cy.contains(this.norm3Name).parent('tr').within(() => {
      cy.get('td').eq(2).contains('PowerShell.exe')
      cy.get('td').eq(3).contains('bat/')
      cy.get('td').eq(4).contains('date.data')
    });

    cy.deleteNorme({name: this.norm2Name});
    cy.deleteNorme({name: this.norm3Name});
  });

  it('Modifier une norme', function () {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/ebad/norms?page=0&size=*&sort=name,asc&name='+this.norm5Name,
    }).as('searchNormeTest');

    cy.login({login: this.login.admin.login, password: this.login.admin.password})
      .addNorme({name: this.norm4Name, interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.in'});

    cy.visit('http://localhost:4200');
    cy.get('#administrationMenu').click();
    cy.get('#normMenu').click();

    cy.updateNorme({
      nameToUpdate: this.norm4Name,
      name: this.norm5Name,
      interpreteur: '/bin/zsh',
      shellFolder: 'zsh/',
      fileDate: 'date.bin'
    });

    cy.get('.toast-body').should('contains.text', 'La norme a bien été modifiée');

    cy.visit('http://localhost:4200');
    cy.get('#administrationMenu').click();
    cy.get('#normMenu').click();

    cy.get('input[type="search"]').clear();
    cy.get('input[type="search"]').type(this.norm5Name);

    cy.wait('@searchNormeTest');

    cy.contains(this.norm5Name).parent('tr').within(() => {
      cy.get('td').eq(2).contains('/bin/zsh')
      cy.get('td').eq(3).contains('zsh/')
      cy.get('td').eq(4).contains('date.bin')
    });

    cy.deleteNorme({name: this.norm5Name});
    cy.get('.toast-body').should('contains.text', 'La norme a été supprimée');

  });
});
