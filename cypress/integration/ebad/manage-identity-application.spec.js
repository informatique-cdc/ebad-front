context('Identities Management', () => {
    before(function () {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        this.identity1Name = 'LinuxEnvCy-' + timestamp;
        this.identity2Name = 'TestCyUnix-' + timestamp;
        this.identity3Name = 'TestCyWindows-' + timestamp;
        this.identity4Name = 'TestUpCyLinux-' + timestamp;
        this.identity5Name = 'TestUpCyLinuxNew-' + timestamp;
        this.app1Name = 'myApp-'+timestamp;
        cy.server();
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

    it('Ajouter une identité', function () {
        cy.login({login: this.login.admin.login, password: this.login.admin.password})
            .addApplication({codeAppli: 'EN1', name: this.app1Name, parmPattern: 'yyyyMMdd', filePattern: 'yyyyMMdd'})
            .addManagerToApplication({codeAppli: 'EN1', nameAppli: this.app1Name, firstname: this.login.admin.firstname, login: this.login.admin.login})
            .addIdentityManage({applicationName: this.app1Name, name: this.identity1Name, login: 'testLogin', password: 'myPassword'})
        cy.get('.toast-body').should('contains.text', 'Identity is added with success');
    });

    it('Supprimer une identities', function () {
        cy.login({login: this.login.admin.login, password: this.login.admin.password})
            .deleteIdentityManage({applicationName: this.app1Name, name: this.identity1Name});
        cy.get('.toast-body').should('contains.text', 'Identity is deleted with success');
    });

    it('Lister les identités', function () {
        cy.server();
        cy.route({
            method: 'GET',
            url: '/ebad/identities?applicationId=*&page=0&size=*&sort=name,asc&name=TestCy',
        }).as('searchIdentitiesTest');

        cy.login({login: this.login.admin.login, password: this.login.admin.password})
            .addIdentityManage({
                applicationName: this.app1Name,
                name: this.identity2Name,
                login: 'testLogin2', password: 'myPassword'
            })
            .addIdentityManage({
                applicationName: this.app1Name,
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
        cy.get('#managementMenu').click();
        cy.get('#identityManageMenu').click();

        cy.route({
            method: 'GET',
            url: '/ebad/identities?applicationId=*&page=0&size=*&sort=name,asc&name='
        }).as('selectApplication1');
        cy.get("#selectApplication").select(this.app1Name);
        cy.wait('@selectApplication1');
        cy.getSettled('input[type="search"]', { retries: 2, delay: 500 }).type('TestCy');
        cy.wait('@searchIdentitiesTest');

        cy.contains(this.identity2Name).parent('tr').within(() => {
            cy.get('td').eq(1).contains(this.identity2Name)
            cy.get('td').eq(2).contains('testLogin2')
        });

        cy.contains(this.identity3Name).parent('tr').within(() => {
            cy.get('td').eq(1).contains(this.identity3Name)
            cy.get('td').eq(2).contains('testLogin3')
        });

        cy.deleteIdentityManage({applicationName: this.app1Name, name: this.identity2Name});
        cy.deleteIdentityManage({applicationName: this.app1Name, name: this.identity3Name});
    });

    it('Modifier une identities', function () {
        cy.server();
        cy.route({
            method: 'GET',
            url: '/ebad/identities?applicationId=*&page=0&size=*&sort=name,asc&name=' + this.identity5Name,
        }).as('searchIdentitiesTest');

        cy.login({login: this.login.admin.login, password: this.login.admin.password})
            .addIdentityManage({
                applicationName: this.app1Name,
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

        cy.updateIdentityManage({
            applicationName: this.app1Name,
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
        cy.get('#managementMenu').click();
        cy.get('#identityManageMenu').click();

        cy.route({
            method: 'GET',
            url: '/ebad/identities?applicationId=*&page=0&size=*&sort=name,asc&name='
        }).as('selectApplication2');
        cy.get("#selectApplication").select(this.app1Name);
        cy.wait('@selectApplication2');

        cy.getSettled('input[type="search"]', { retries: 2, delay: 500 }).clear();
        cy.getSettled('input[type="search"]', { retries: 2, delay: 500 }).type(this.identity5Name);

        cy.wait('@searchIdentitiesTest');

        cy.contains(this.identity5Name).parent('tr').within(() => {
            cy.get('td').eq(1).contains(this.identity5Name)
            cy.get('td').eq(2).contains('testLogin5')
        });

        cy.deleteIdentityManage({applicationName: this.app1Name, name: this.identity5Name});
        cy.get('.toast-body').should('contains.text', 'Identity is deleted with success');
        cy.deleteApplication({codeAppli: 'EN1', name: this.app1Name});

    });
});
