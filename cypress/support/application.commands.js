/////////// APPLICATION ///////////////
Cypress.Commands.add("addApplication", ({codeAppli, name, parmPattern, filePattern}) => {
  cy.intercept('PUT', '/ebad/applications/gestion').as('addApplication');

  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('#addApplication').click();
  cy.get('#code').type(codeAppli);
  cy.get('#name').type(name);
  cy.get("#dateParametrePattern").type(parmPattern);
  cy.get("#dateFichierPattern").type(filePattern);
  cy.get('form').submit();

  cy.wait('@addApplication');
});

Cypress.Commands.add("deleteApplication", ({codeAppli, name}) => {
  cy.intercept('GET', '/ebad/applications/gestion?page=0&size=*&sort=name,asc&name='+name).as('searchApplication');
  cy.intercept('DELETE', '/ebad/applications/gestion*').as('deleteApplication');


  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(name);
  cy.wait('@searchApplication');

  cy.get('#actionDelete-' + codeAppli, { timeout: 10000 }).should('be.visible');
  cy.getSettled('#actionDelete-' + codeAppli, { retries: 2, delay: 500 }).click();

  cy.get('#deleteBtn').click();
  cy.wait('@deleteApplication');
});

Cypress.Commands.add("updateApplication", ({codeAppliToUpdate, nameToUpdate, codeAppli, name, parmPattern, filePattern}) => {
  cy.intercept('GET', '/ebad/applications/gestion?page=0&size=*&sort=name,asc&name='+nameToUpdate).as('searchApplication');
  cy.intercept('PATCH', '/ebad/applications/gestion').as('updateApplication');

  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(nameToUpdate);
  cy.wait('@searchApplication');
  cy.get('#actionUpdate-' + codeAppliToUpdate, { timeout: 10000 }).should('be.visible');
  cy.getSettled('#actionUpdate-' + codeAppliToUpdate, { retries: 2, delay: 500 }).click();

  if (codeAppli) {
    cy.get('#code').clear().type(codeAppli);
  }
  if (name) {
    cy.get('#name').clear().type(name);
  }
  if (parmPattern) {
    cy.get("#dateParametrePattern").clear().type(parmPattern);
  }
  if (filePattern) {
    cy.get("#dateFichierPattern").clear().type(filePattern);
  }
  cy.get('form').submit();
  cy.wait('@updateApplication');
});

Cypress.Commands.add("addUserToApplication", ({codeAppli, nameAppli,firstname, login}) => {
  cy.intercept('GET', '/ebad/applications/gestion?page=0&size=*&sort=name,asc&name='+nameAppli).as('searchApplication');
  cy.intercept('GET', '/ebad/users?page=0&size=20&login='+firstname).as('searchUser');
  cy.intercept('PATCH', '/ebad/users/application').as('userApplication');

  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(nameAppli);
  cy.wait('@searchApplication');

  cy.get('#actionUser-' + codeAppli, { timeout: 10000 }).should('be.visible');
  cy.getSettled('#actionUser-' + codeAppli, { retries: 2, delay: 500 }).click();

  cy.get('#user').type(firstname);
  cy.wait('@searchUser');
  cy.get('button').contains(login).click();
  cy.get('#addUserBtn').click();
  cy.wait('@userApplication');
  cy.get('#closeBtn').click();
});

Cypress.Commands.add("addManagerToApplication", ({codeAppli, nameAppli, firstname, login}) => {
  cy.intercept('GET', '/ebad/applications/gestion?page=0&size=*&sort=name,asc&name='+nameAppli).as('searchApplication');
  cy.intercept('GET', '/ebad/users?page=0&size=*&login='+firstname).as('searchUser');
  cy.intercept('PATCH', '/ebad/users/application').as('userApplication');

  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(nameAppli);
  cy.wait('@searchApplication');

  cy.get('#actionManager-' + codeAppli, { timeout: 10000 }).should('be.visible');
  cy.getSettled('#actionManager-' + codeAppli, { retries: 2, delay: 500 }).click();

  cy.get('#user').type(firstname);
  cy.wait('@searchUser');
  cy.get('button').contains(login).click();
  cy.get('#addUserBtn').click();
  cy.wait('@userApplication');
  cy.get('#closeBtn').click();
});
