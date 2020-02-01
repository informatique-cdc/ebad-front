/////////// APPLICATION ///////////////
Cypress.Commands.add("addApplication", ({codeAppli, name, parmPattern, filePattern}) => {
  cy.server();
  cy.route({
    method: 'PUT',
    url: '/ebad/applications/gestion',
  }).as('addApplication');

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
  cy.server();
  cy.route({
    method: 'GET',
    url: '/ebad/applications/gestion?page=0&size=10&sort=name,asc&name='+name,
  }).as('searchApplication');
  cy.route({
    method: 'DELETE',
    url: '/ebad/applications/gestion*',
  }).as('deleteApplication');

  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(name);
  cy.wait('@searchApplication');

  cy.get('#actionDelete-' + codeAppli).click();
  cy.get('#deleteBtn').click();
  cy.wait('@deleteApplication');
});

Cypress.Commands.add("updateApplication", ({codeAppliToUpdate, nameToUpdate, codeAppli, name, parmPattern, filePattern}) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/ebad/applications/gestion*',
  }).as('searchApplication');
  cy.route({
    method: 'PATCH',
    url: '/ebad/applications/gestion',
  }).as('updateApplication');

  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(nameToUpdate);
  cy.wait('@searchApplication');

  cy.get('#actionUpdate-' + codeAppliToUpdate).click();

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
  cy.server();
  cy.route({
    method: 'GET',
    url: '/ebad/applications/gestion*',
  }).as('searchApplication');

  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(nameAppli);
  cy.wait('@searchApplication');

  cy.get('#actionUser-' + codeAppli).click();
  cy.get('#user').type(firstname);
  cy.get('button').find('('+login+')').click();
  cy.get('#addUserBtn').click();
  cy.get('#closeBtn').click();
});

Cypress.Commands.add("addManagerToApplication", ({codeAppli, nameAppli,user}) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/ebad/applications/gestion*',
  }).as('searchApplication');

  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(nameAppli);
  cy.wait('@searchApplication');

  cy.get('#actionManager-' + codeAppli).click();
  cy.get('#user').type(user.firstname);
  cy.get('[ng-reflect-result="'+user.firstname+' '+user.lastname+' ('+user.login+')"]').click();
  cy.get('#addUserBtn').click();
  cy.get('#closeBtn').click();
});
