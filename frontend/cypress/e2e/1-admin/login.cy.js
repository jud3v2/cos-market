describe('Admin Login', () => {
        beforeEach(() => {
                cy.visit('http://localhost:5173/admin/login');
        });

        it("Un faux compte ne peut pas ce connecter à l'administration", () => {
                cy.get('input[type="email"]').should('exist').type('admin@admin.com');
                cy.get('input[type="password"]').should('exist').type('admin');
                cy.get('button[type="submit"]').should('exist').click();
                cy.get('p').should('exist').should('have.text', 'Credentials does not match');
        });

        it("Un compte client ne peut pas ce connecter à l'administration", () => {
                cy.get('input[type="email"]').should('exist').type('judikaelbellance@test.com');
                cy.get('input[type="password"]').should('exist').type('judikael');
                cy.get('button[type="submit"]').should('exist').click();
                cy.get('p').should('exist').should('have.text', 'Access denied. Only administrator can access to this panel.');
        });

        it("L'administrateur peut ce connecter à sont dashboard", () => {
                // Enter email
                cy.get('input[type="email"]').should('exist').type('judikaelbellance@icloud.com');
                cy.get('input[type="password"]').should('exist').type('judikael');
                cy.get('button[type="submit"]').should('exist').click();
                cy.url().should('eq', 'http://localhost:5173/admin-panel');
                cy.get('a[href="/admin/clients"]').should('exist').should('have.text', 'Clients');
                cy.get('a[href="/admin/products"]').should('exist').should('have.text', 'Produits');
                cy.get('h1').should('exist').should('have.text', 'Admin Panel');
        });
});
