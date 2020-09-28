/////////// ENVIRONNEMENT ///////////////
Cypress.Commands.add("addEnvironnement", ({applicationName, name, host, login, homePath, prefix, norme}) => {
  cy.get('#managementMenu').click();
  cy.get('#environmentMenu').click();
  cy.get("#selectApplication").select(applicationName);
  cy.get('#addEnvAction').click();
  cy.get('#name').type(name);
  cy.get('#host').type(host);
  cy.get('#login').type(login);
  cy.get('#homePath').type(homePath);
  cy.get('#prefix').type(prefix);
  cy.get('#norme').select(norme);
  cy.get('#addEnvironmentForm').submit();
});

Cypress.Commands.add("deleteEnvironnement", ({applicationName, environnementName}) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/ebad/environments?applicationId=**&page=0&size=10&sort=id,asc&name=',
  }).as('getEnvironments');

  cy.route({
    method: 'GET',
    url: '/ebad/environments?applicationId=**&page=0&size=10&sort=id,asc&name='+environnementName,
  }).as('searchEnvironment');

  cy.route({
      method: 'DELETE',
    url: '/ebad/environments?idEnv=**',
  }).as('deleteEnvironment');


  cy.get('#managementMenu').click();
  cy.get('#environmentMenu').click();
  cy.get("#selectApplication").select(applicationName);
  cy.wait('@getEnvironments');

  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(environnementName);
  cy.wait('@searchEnvironment');

  cy.get('#actionDelete-'+environnementName).click();

  cy.get('#deleteBtn').click();
  cy.wait('@deleteEnvironment');
});


Cypress.Commands.add("updateEnvironnement", ({
                                               applicationName, environnementNameToUpdate, name, host, login, homePath, prefix, norme
                                             }) => {
  cy.get('#managementMenu').click();
  cy.get('#environmentMenu').click();
  cy.get("#selectApplication").select(applicationName);

  cy.wait(1500);
  cy.get('tr').contains('td > span', environnementNameToUpdate).parent('td').parent('tr').within(() => {
    cy.get('button[name="actionModify"]').click();
  });
  if (name) {
    cy.get('#name').clear().type(name);
  }
  if (host) {
    cy.get('#host').clear().type(host);
  }
  if (login) {
    cy.get("#login").clear().type(login);
  }
  if (homePath) {
    cy.get("#homePath").clear().type(homePath);
  }
  if (prefix) {
    cy.get("#prefix").clear().type(prefix);
  }
  if (norme) {
    cy.get("#norme").clear().select(norme);
  }
  cy.get('#addEnvironmentForm').submit();
});
