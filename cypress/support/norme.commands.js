/////////// NORME ///////////////
Cypress.Commands.add("addNorme", ({name, interpreteur, shellFolder, fileDate}) => {
  cy.get('#normeMenu').click();
  cy.get('#globalAction').click();
  cy.get('#name').type(name);
  cy.get('#interpreteur').type(interpreteur);
  cy.get("#shellFolder").type(shellFolder);
  cy.get("#fileDate").type(fileDate);
  cy.get('form').submit();
});

Cypress.Commands.add("deleteNorme", ({name}) => {
  cy.get('#normeMenu').click();
  cy.wait(1500);
  cy.get('tr').contains('td > span', name).parent('td').parent('tr').within(() => {
    cy.get('button[name="actionDelete"]').click();
  });
  cy.get('#deleteBtn').click();
});

Cypress.Commands.add("updateNorme", ({nameToUpdate, name, interpreteur, shellFolder, fileDate}) => {
  cy.get('#normeMenu').click();
  cy.wait(1500);
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
