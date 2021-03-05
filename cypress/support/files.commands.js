/////////// FOLDER ///////////////
Cypress.Commands.add("selectFolder", ({appliName, envName, directoryName}) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/ebad/applications?page=0&size=*0',
  }).as('getApplications');

  cy.route({
    method: 'GET',
    url: '/ebad/environments?applicationId=**&page=0&size=*0&sort=name,asc',
  }).as('getEnvironments');

  cy.route({
    method: 'GET',
    url: '/ebad/directories/env/**',
  }).as('getDirectories');

  cy.get('#functionMenu').click();
  cy.get('#functionFolderMenu').click();
  cy.wait('@getApplications');

  cy.get('#selectApplication').select(appliName);
  cy.wait('@getEnvironments');

  cy.get('#selectEnvironnement').select(envName);
  cy.wait('@getDirectories');

  cy.get("#selectDirectory").type(directoryName);

});

Cypress.Commands.add("addFolder", ({appliName, envName, directoryName, path}) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/ebad/applications/write?page=0&size=*0',
  }).as('getApplications');

  cy.route({
    method: 'GET',
    url: '/ebad/environments?applicationId=**&page=0&size=*0&sort=name,asc',
  }).as('getEnvironments');

  cy.route({
    method: 'PUT',
    url: '/ebad/directories',
  }).as('addFolder');

  cy.get('#managementMenu').click();
  cy.get('#folderManageMenu').click();
  cy.wait('@getApplications');

  cy.get('#selectApplication').select(appliName);
  cy.wait('@getEnvironments');

  cy.get('#selectEnvironnement').select(envName);

  cy.get('#addFolder').click();
  cy.get('#name').type(directoryName)
  cy.get('#path').type(path)
  cy.get('#addDirectoryForm').submit();

  cy.wait('@addFolder');
});

Cypress.Commands.add("deleteFolder", ({appliName, envName, directoryName}) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/ebad/applications/write?page=0&size=*0',
  }).as('getApplications');

  cy.route({
    method: 'GET',
    url: '/ebad/environments?applicationId=**&page=0&size=*0&sort=name,asc',
  }).as('getEnvironments');

  cy.route({
    method: 'GET',
    url: '/ebad/directories/env/**',
  }).as('getDirectories');

  cy.route({
    method: 'POST',
    url: '/ebad/directories/delete',
  }).as('deleteFolder');

  cy.route({
    method: 'GET',
    url: '/ebad/directories/env/**?page=0&size=*&sort=id,asc&name='+directoryName,
  }).as('searchFolder');

  cy.get('#managementMenu').click();
  cy.get('#folderManageMenu').click();
  cy.wait('@getApplications');

  cy.get('#selectApplication').select(appliName);
  cy.wait('@getEnvironments');

  cy.get('#selectEnvironnement').select(envName);
  cy.wait('@getDirectories');

  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(directoryName);
  cy.wait('@searchFolder');

  cy.get('#actionDelete-' + directoryName).click();
  cy.get('#deleteBtn').click();
  cy.wait('@deleteFolder');
});
