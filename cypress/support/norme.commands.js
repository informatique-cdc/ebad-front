/////////// NORME ///////////////
Cypress.Commands.add("addNorme", ({name, interpreteur, shellFolder, fileDate}) => {
  cy.intercept();
  cy.route({
    method: 'PUT',
    url: '/ebad/norms'
  }).as('addNorm');
  cy.get('#administrationMenu').click();
  cy.get('#normMenu').click();
  cy.get('#addNormAction').click();
  cy.get('#name').type(name);
  cy.get('#interpreteur').type(interpreteur);
  cy.get("#shellFolder").type(shellFolder);
  cy.get("#fileDate").type(fileDate);
  cy.get('form').submit();
  cy.wait('@addNorm');
});

Cypress.Commands.add("deleteNorme", ({name}) => {
  cy.intercept();
  cy.route({
    method: 'GET',
    url: '/ebad/norms?page=0&size=*&sort=name,asc&name='+name,
  }).as('searchNorme');

  cy.route({
    method: 'DELETE',
    url: '/ebad/norms/**'
  }).as('deleteNorm');

  cy.get('#administrationMenu').click();
  cy.get('#normMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(name);
  cy.wait('@searchNorme');

  cy.get('#actionDelete-' + name, { timeout: 10000 }).should('be.visible');
  cy.getSettled('#actionDelete-' + name, { retries: 2, delay: 500 }).click();

  cy.get('#deleteBtn').click();
  cy.wait('@deleteNorm');
});

Cypress.Commands.add("updateNorme", ({nameToUpdate, name, interpreteur, shellFolder, fileDate}) => {
  cy.intercept();
  cy.route({
    method: 'GET',
    url: '/ebad/norms?page=0&size=*&sort=name,asc&name='+nameToUpdate,
  }).as('searchNorme');
  cy.route({
    method: 'PATCH',
    url: '/ebad/norms'
  }).as('updateNorm');

  cy.get('#administrationMenu').click();
  cy.get('#normMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(nameToUpdate);
  cy.wait('@searchNorme');
  cy.getSettled('#actionEdit-' + nameToUpdate, { retries: 2, delay: 500 }).click();


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
  cy.wait('@updateNorm');

});
