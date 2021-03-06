// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import '@cypress/code-coverage/support'
// Import commands.js using ES2015 syntax:
import './global.commands'
import './application.commands'
import './norme.commands'
import './environnement.commands'
import './batch.commands'
import './files.commands'
import './identity-admin.commands'
import './identity-environment.commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
