// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/////////// GENERAL ///////////////
Cypress.Commands.add("login", ({login, password}) => {
  // cy.visit('/#/login');
  cy.get('input[id="username"]').type(login);
  cy.get('input[id="password"]').type(password);
  cy.get('form').submit();
});

Cypress.Commands.add("logout", () => {
  // cy.visit('/#/login');
  cy.get('#settingsMenu').click();
  cy.get('#logoutHeader').click();
});

Cypress.Commands.add("getAttached", selector => {
  const getElement = typeof selector === "function" ? selector : $d => $d.find(selector);
  let $el = null;
  return cy.document().should($d => {
    $el = getElement(Cypress.$($d));
    expect(Cypress.dom.isDetached($el)).to.be.false;
  }).then(() => cy.wrap($el));
});
