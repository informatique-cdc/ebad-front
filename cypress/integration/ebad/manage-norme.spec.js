context('Gestion Norme', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200')
  });

  it('Ajouter une norme', () => {
    cy.login({login: 'dtrouillet', password: 'admin'})
      .addNorme({name: 'Linux', interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.in'});
    cy.get('p.notifier__notification-message').should('have.text', 'La norme a bien été ajoutée');
  });

  it('Supprimer une norme', () => {
    cy.login({login: 'dtrouillet', password: 'admin'})
      .deleteNorme({name: 'Linux'});
    cy.get('p.notifier__notification-message').should('have.text', 'La norme a été supprimée');
  });

  it('Lister les normes', () => {
    cy.login({login: 'dtrouillet', password: 'admin'});
    cy.addNorme({name: 'Linux', interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.in'});
    cy.addNorme({name: 'Windows', interpreteur: 'PowerShell.exe', shellFolder: 'bat/', fileDate: 'date.data'});

    cy.visit('http://localhost:4200');
    cy.get('#normeMenu').click();
    cy.wait(1500);
    cy.get('#listNormes table > tbody > tr').as('lines');
    cy.get('@lines').should('have.length', 2);

    cy.get('@lines').eq(0).children('td').as('line1');
    cy.get('@line1').eq(1).children('span').should('have.text', 'Linux');
    cy.get('@line1').eq(2).children('span').should('have.text', '/bin/bash');
    cy.get('@line1').eq(3).children('span').should('have.text', 'shell/');
    cy.get('@line1').eq(4).children('span').should('have.text', 'date.in');

    cy.get('@lines').eq(1).children('td').as('line2');
    cy.get('@line2').eq(1).children('span').should('have.text', 'Windows');
    cy.get('@line2').eq(2).children('span').should('have.text', 'PowerShell.exe');
    cy.get('@line2').eq(3).children('span').should('have.text', 'bat/');
    cy.get('@line2').eq(4).children('span').should('have.text', 'date.data');


    cy.deleteNorme({name: 'Linux'});
    cy.deleteNorme({name: 'Windows'});
  });

  it('Modifier une norme', () => {
    cy.login({login: 'dtrouillet', password: 'admin'})
      .addNorme({name: 'Linux', interpreteur: '/bin/bash', shellFolder: 'shell/', fileDate: 'date.in'});

    cy.updateNorme({
      nameToUpdate: 'Linux',
      name: 'Unix',
      interpreteur: '/bin/zsh',
      shellFolder: 'zsh/',
      fileDate: 'date.bin'
    });

    cy.get('#listNormes table > tbody > tr').as('lines');
    cy.get('@lines').should('have.length', 1);

    cy.get('@lines').eq(0).children('td').as('line1');
    cy.get('@line1').eq(1).children('span').should('have.text', 'Unix');
    cy.get('@line1').eq(2).children('span').should('have.text', '/bin/zsh');
    cy.get('@line1').eq(3).children('span').should('have.text', 'zsh/');
    cy.get('@line1').eq(4).children('span').should('have.text', 'date.bin');

    cy.deleteNorme({name: 'Unix'});

    cy.get('p.notifier__notification-message').should(($p) => {
      expect($p[1]).to.have.text('La norme a bien été modifiée');
      expect($p[2]).to.have.text('La norme a été supprimée');
    });
  });
});
