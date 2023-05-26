/////////// FOLDER ///////////////
Cypress.Commands.add("selectFolder", ({appliName, envName, directoryName}) => {
  cy.intercept('GET', '/ebad/applications?page=0&size=*0&sort=name,asc').as('getApplications');
  cy.intercept('GET', '/ebad/environments?applicationId=**&page=0&size=*0&sort=name,asc').as('getEnvironments');
  cy.intercept('GET', '/ebad/directories/env/**').as('getDirectories');

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
  cy.intercept('GET', '/ebad/applications/write?page=0&size=*0&sort=name,asc').as('getApplications');
  cy.intercept('GET', '/ebad/environments?applicationId=**&page=0&size=*0&sort=name,asc').as('getEnvironments');
  cy.intercept('PUT', '/ebad/directories').as('addFolder');

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
  cy.intercept('GET', '/ebad/applications/write?page=0&size=*0&sort=name,asc').as('getApplications');
  cy.intercept('GET', '/ebad/environments?applicationId=**&page=0&size=*0&sort=name,asc').as('getEnvironments');
  cy.intercept('GET', '/ebad/directories/env/**').as('getDirectories');
  cy.intercept('POST', '/ebad/directories/delete').as('deleteFolder');
  cy.intercept('GET', '/ebad/directories/env/**?page=0&size=*&sort=id,asc&name='+directoryName).as('searchFolder');

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
