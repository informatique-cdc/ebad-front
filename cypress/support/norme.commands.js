/////////// NORME ///////////////
Cypress.Commands.add("addNorme", ({name, interpreteur, shellFolder, fileDate}) => {
  cy.get('#administrationMenu').click();
  cy.get('#normMenu').click();
  cy.get('#addNormAction').click();
  cy.get('#name').type(name);
  cy.get('#interpreteur').type(interpreteur);
  cy.get("#shellFolder").type(shellFolder);
  cy.get("#fileDate").type(fileDate);
  cy.get('form').submit();
});

Cypress.Commands.add("deleteNorme", ({name}) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/ebad/norms?page=0&size=10&sort=name,asc&name='+name,
  }).as('searchNorme');

  cy.get('#administrationMenu').click();
  cy.get('#normMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(name);
  cy.wait('@searchNorme');

  cy.get('#actionDelete-'+name).click();
  cy.get('#deleteBtn').click();
});

Cypress.Commands.add("updateNorme", ({nameToUpdate, name, interpreteur, shellFolder, fileDate}) => {
  cy.get('#administrationMenu').click();
  cy.get('#normMenu').click();
  cy.get('tr').contains('td > span', nameToUpdate).parent('td').parent('tr').within(() => {
    cy.get('button[name="actionModify"]').click();
  });
  if (name) {
    cy.get('#name').clear().type(name);
  }
  if (interpreteur) {
    cy.get('#interpreteur').clear().type(interpreteur);
  }
  if (shellFolder) {
    cy.get("#shellFolder").clear().type(shellFolder);
  }
  if (fileDate) {
    cy.get("#fileDate").clear().type(fileDate);
  }
  cy.get('form').submit();
});
