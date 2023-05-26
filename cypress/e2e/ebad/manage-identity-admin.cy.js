context('Identities Administration', () => {
    before(function () {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        this.identity1Name = 'LinuxEnvCy-' + timestamp;
        this.identity2Name = 'TestCyUnix-' + timestamp;
        this.identity3Name = 'TestCyWindows-' + timestamp;
        this.identity4Name = 'TestUpCyLinux-' + timestamp;
        this.identity5Name = 'TestUpCyLinuxNew-' + timestamp;
        cy.intercept();
    });

    beforeEach(function () {
        cy.visit('http://localhost:4200', {
            onBeforeLoad(win) { // solution is here
                Object.defineProperty(win.navigator, 'languages', {
                    value: ['en-US'],
                });
            }
        });
        cy.fixture('login.json').then((login) => {
            this.login = login;
        });
    });

    it('Add identity', function () {
        cy.login({login: this.login.admin.login, password: this.login.admin.password})
            .addIdentityAdmin({name: this.identity1Name, login: 'testLogin', password: 'myPassword'})
        cy.get('.toast-body').should('contains.text', 'Identity is added with success');
    });

    it('Delete identity', function () {
        cy.login({login: this.login.admin.login, password: this.login.admin.password})
            .deleteIdentityAdmin({name: this.identity1Name});
        cy.get('.toast-body').should('contains.text', 'Identity is deleted with success');
    });

    it('List  identities', function () {
        cy.intercept();
        cy.route({
            method: 'GET',
            url: '/ebad/identities?page=0&size=*&sort=name,asc&name=TestCy',
        }).as('searchIdentitiesTest');

        cy.login({login: this.login.admin.login, password: this.login.admin.password})
            .addIdentityAdmin({
                name: this.identity2Name,
                login: 'testLogin2', password: 'myPassword'
            })
            .addIdentityAdmin({
                name: this.identity3Name,
                login: 'testLogin3', password: 'myPassword'
            });

        cy.visit('http://localhost:4200', {
            onBeforeLoad(win) { // solution is here
                Object.defineProperty(win.navigator, 'languages', {
                    value: ['en-US'],
                });
            }
        });
        cy.get('#administrationMenu').click();
        cy.get('#identityAdminMenu').click();
        cy.get('input[type="search"]').type('TestCy');
        cy.wait('@searchIdentitiesTest');

        cy.contains(this.identity2Name).parent('tr').within(() => {
            cy.get('td').eq(1).contains(this.identity2Name)
            cy.get('td').eq(2).contains('testLogin2')
        });

        cy.contains(this.identity3Name).parent('tr').within(() => {
            cy.get('td').eq(1).contains(this.identity3Name)
            cy.get('td').eq(2).contains('testLogin3')
        });

        cy.deleteIdentityAdmin({name: this.identity2Name});
        cy.deleteIdentityAdmin({name: this.identity3Name});
    });

    it('Edit identity', function () {
        cy.intercept();
        cy.route({
            method: 'GET',
            url: '/ebad/identities?page=0&size=*&sort=name,asc&name=' + this.identity5Name,
        }).as('searchIdentitiesTest');

        cy.login({login: this.login.admin.login, password: this.login.admin.password})
            .addIdentityAdmin({
                name: this.identity4Name,
                login: 'testLogin4', password: 'myPassword'
            });

        cy.visit('http://localhost:4200', {
            onBeforeLoad(win) { // solution is here
                Object.defineProperty(win.navigator, 'languages', {
                    value: ['en-US'],
                });
            }
        });
        cy.get('#administrationMenu').click();
        cy.get('#identityAdminMenu').click();

        cy.updateIdentityAdmin({
            nameToUpdate: this.identity4Name,
            name: this.identity5Name,
            login: 'testLogin5', password: 'myPassword'

        });

        cy.get('.toast-body').should('contains.text', 'Identity is updated with success');

        cy.visit('http://localhost:4200', {
            onBeforeLoad(win) { // solution is here
                Object.defineProperty(win.navigator, 'languages', {
                    value: ['en-US'],
                });
            }
        });
        cy.get('#administrationMenu').click();
        cy.get('#identityAdminMenu').click();

        cy.get('input[type="search"]').clear();
        cy.get('input[type="search"]').type(this.identity5Name);

        cy.wait('@searchIdentitiesTest');

        cy.contains(this.identity5Name).parent('tr').within(() => {
            cy.get('td').eq(1).contains(this.identity5Name)
            cy.get('td').eq(2).contains('testLogin5')
        });

        cy.deleteIdentityAdmin({name: this.identity5Name});
        cy.get('.toast-body').should('contains.text', 'Identity is deleted with success');

    });
});
