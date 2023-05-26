/////////// ENVIRONNEMENT ///////////////
Cypress.Commands.add("addEnvironnement", ({applicationName, name, host, identity, homePath, prefix, norme}) => {
  cy.intercept();
  cy.route({
    method: 'PUT',
    url: '/ebad/environments',
  }).as('addEnvironment');

  cy.get('#managementMenu').click();
  cy.get('#environmentMenu').click();
  cy.get("#selectApplication").select(applicationName);
  cy.get('#addEnvAction').click();
  cy.get('#name').type(name);
  cy.get('#host').type(host);
  cy.get('#identity').select(identity);
  cy.get('#homePath').type(homePath);
  cy.get('#prefix').type(prefix);
  cy.get('#norme').select(norme);
  cy.get('#addEnvironmentForm').submit();
  cy.wait('@addEnvironment');
});

Cypress.Commands.add("deleteEnvironnement", ({applicationName, environnementName}) => {
  cy.intercept();
  cy.route({
    method: 'GET',
    url: '/ebad/environments?applicationId=**&page=0&size=*&sort=id,asc&name=',
  }).as('getEnvironments');

  cy.route({
    method: 'GET',
    url: '/ebad/environments?applicationId=**&page=0&size=*&sort=id,asc&name='+environnementName,
  }).as('searchEnvironment');

  cy.route({
      method: 'DELETE',
    url: '/ebad/environments?idEnv=**',
  }).as('deleteEnvironment');


  cy.get('#managementMenu').click();
  cy.get('#environmentMenu').click();
  cy.get("#selectApplication").select(applicationName);
  cy.wait('@getEnvironments');

  cy.wait(1500);

  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(environnementName);
  cy.wait('@searchEnvironment');

  cy.get('#actionDelete-'+environnementName).click();

  cy.get('#deleteBtn').click();
  cy.wait('@deleteEnvironment');
});


Cypress.Commands.add("updateEnvironnement", ({
                                               applicationName, environnementNameToUpdate, name, host, identity, homePath, prefix, norme
                                             }) => {
  cy.intercept();
  cy.route({
    method: 'GET',
    url: '/ebad/environments?applicationId=**&page=0&size=*&sort=id,asc&name=',
  }).as('getEnvironments');

  cy.route({
    method: 'GET',
    url: '/ebad/environments?applicationId=**&page=0&size=*&sort=id,asc&name='+environnementNameToUpdate,
  }).as('searchEnvironment');

  cy.route({
    method: 'PATCH',
    url: '/ebad/environments',
  }).as('editEnvironment');

  cy.get('#managementMenu').click();
  cy.get('#environmentMenu').click();
  cy.get("#selectApplication").select(applicationName);

  cy.wait('@getEnvironments');
  cy.wait(1500);

  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(environnementNameToUpdate);
  cy.wait('@searchEnvironment');

  cy.get('#actionEdit-'+environnementNameToUpdate).click();
  if (name) {
    cy.get('#name').clear().type(name);
  }
  if (host) {
    cy.get('#host').clear().type(host);
  }
  if (identity) {
    cy.get("#identity").clear().select(identity);
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
  cy.wait('@editEnvironment');

});
