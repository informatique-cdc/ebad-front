/////////// IDENTITY ADMIN///////////////
Cypress.Commands.add("addIdentityAdmin", ({name, login, password, privatekey, privatekeyPath, passphrase}) => {
  cy.intercept('PUT', '/ebad/identities').as('saveIdentity');
  cy.get('#administrationMenu').click();
  cy.get('#identityAdminMenu').click();
  cy.get('#addIdentityAction').click();
  cy.get('#name').type(name);
  cy.get('#login').type(login);
  if (password) {
    cy.get("#password").type(password);
  }
  if (privatekey) {
    cy.get("#privatekey").type(privatekey);
  }
  if (passphrase) {
    cy.get("#passphrase").type(passphrase);
  }
  if (privatekeyPath) {
    cy.get("#privatekeyPath").type(privatekeyPath);
  }
  cy.get('form').submit();
  cy.wait('@saveIdentity');
});

Cypress.Commands.add("deleteIdentityAdmin", ({name}) => {
  cy.intercept('GET', '/ebad/identities?page=0&size=*&sort=name,asc&name='+name).as('searchIdentity');
  cy.intercept('DELETE', '/ebad/identities/**').as('deleteIdentity');

  cy.get('#administrationMenu').click();
  cy.get('#identityAdminMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(name);
  cy.wait('@searchIdentity');

  cy.get('#actionDelete-' + name, { timeout: 10000 }).should('be.visible');
  cy.getSettled('#actionDelete-' + name, { retries: 2, delay: 500 }).click();

  cy.get('#deleteBtn').click();
  cy.wait('@deleteIdentity');
});

Cypress.Commands.add("updateIdentityAdmin", ({nameToUpdate, name, login, password, privatekey, privatekeyPath, passphrase}) => {
  cy.intercept('GET', '/ebad/identities?page=0&size=*&sort=name,asc&name='+nameToUpdate).as('searchIdentities');
  cy.intercept('PATCH', '/ebad/identities').as('updateIdentities');

  cy.get('#administrationMenu').click();
  cy.get('#identityAdminMenu').click();
  cy.get('input[type="search"]').clear();
  cy.get('input[type="search"]').type(nameToUpdate);
  cy.wait('@searchIdentities');
  cy.get('#actionEdit-' + nameToUpdate, { timeout: 10000 }).should('be.visible');
  cy.getSettled('#actionEdit-' + nameToUpdate, { retries: 2, delay: 500 }).click();


  if (name) {
    cy.get('input[id=name]').clear();
    cy.get('input[id=name]').type(name)
  }
  if (login) {
    cy.get('#login').clear().type(login);
  }
  if (password) {
    cy.get("#password").clear().type(password);
  }
  if (privatekey) {
    cy.get("#privatekey").clear().type(privatekey);
  }
  if (privatekeyPath) {
    cy.get("#privatekeyPath").clear().type(privatekeyPath);
  }
  if (passphrase) {
    cy.get("#passphrase").clear().type(passphrase);
  }
  cy.get('form').submit();
  cy.wait('@updateIdentities');

});
