/////////// BATCH ///////////////
Cypress.Commands.add("addBatch", ({applicationName, name, shell, parms, envs}) => {
  cy.get('#batchManageMenu').click();
  cy.get("#selectApplication").select(applicationName);
  cy.get('#addBatchAction').click();
  cy.get('#name').type(name);
  cy.get('#shell').type(shell);
  cy.get('#parameters').type(parms);
  cy.get('#environments').click();
  cy.get('.multiselect-item-checkbox > div').invoke('text').then((text) => {
    console.log(text)
  });

  cy.get('#addBatchForm').submit();
});

/*
Cypress.Commands.add("deleteEnvironnement", ({applicationName, environnementName}) => {
  cy.get('#environnementMenu').click();
  cy.get("#selectApplication").select(applicationName);

  cy.wait(1500);
  cy.get('tr').contains('td > span', environnementName).parent('td').parent('tr').within(() => {
    cy.get('button[name="actionDelete"]').click();
  });
  cy.get('#deleteBtn').click();
});


Cypress.Commands.add("updateEnvironnement", ({
                                               applicationName, environnementNameToUpdate, name, host, login, homePath, prefix, norme
                                             }) => {
  cy.get('#environnementMenu').click();
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
*/
