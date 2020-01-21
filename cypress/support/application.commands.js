/////////// APPLICATION ///////////////
Cypress.Commands.add("addApplication", ({codeAppli, name, parmPattern, filePattern}) => {
  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('#addApplication').click();
  cy.get('#code').type(codeAppli);
  cy.get('#name').type(name);
  cy.get("#dateParametrePattern").type(parmPattern);
  cy.get("#dateFichierPattern").type(filePattern);
  cy.get('form').submit();
});

Cypress.Commands.add("deleteApplication", ({codeAppli, name}) => {
  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(name);
  cy.get('#actionDelete-'+codeAppli).click();
  cy.get('#deleteBtn').click();
});

Cypress.Commands.add("updateApplication", ({codeAppliToUpdate,nameToUpdate, codeAppli, name, parmPattern, filePattern}) => {
  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(nameToUpdate);
  cy.get('#actionUpdate-'+codeAppliToUpdate).click();

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
});

Cypress.Commands.add("addUserToApplication",({codeAppli, login}) => {
  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('tr').contains('td > span', codeAppli).parent('td').parent('tr').within(() => {
    cy.get('button[name="actionUtilisateurs"]').click();
  });
  cy.get('#user').type('dtro');
  cy.get('button').find('(dtrouillet)').click();
  cy.get('#addUserBtn').click();
  cy.get('#closeBtn').click();
});

Cypress.Commands.add("addManagerToApplication",({codeAppli, login}) => {
  cy.get('#administrationMenu').click();
  cy.get('#applicationMenu').click();
  cy.get('tr').contains('td > span', codeAppli).parent('td').parent('tr').within(() => {
    cy.get('button[name="actionGestionnaires"]').click();
  });
  cy.get('#user').type(login.substr(0,3));
  cy.wait(1500);
  cy.get('button').contains(`(${login})`).click();
  cy.get('#addUserBtn').click();
  cy.get('#closeBtn').click();
});
