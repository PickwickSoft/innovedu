import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Topic e2e test', () => {
  const topicPageUrl = '/topic';
  const topicPageUrlPattern = new RegExp('/topic(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const topicSample = { title: 'Personal portals AI', description: 'Profit-focused' };

  let topic: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/topics+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/topics').as('postEntityRequest');
    cy.intercept('DELETE', '/api/topics/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (topic) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/topics/${topic.id}`,
      }).then(() => {
        topic = undefined;
      });
    }
  });

  it('Topics menu should load Topics page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('topic');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Topic').should('exist');
    cy.url().should('match', topicPageUrlPattern);
  });

  describe('Topic page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(topicPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Topic page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/topic/new$'));
        cy.getEntityCreateUpdateHeading('Topic');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', topicPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/topics',
          body: topicSample,
        }).then(({ body }) => {
          topic = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/topics+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [topic],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(topicPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Topic page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('topic');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', topicPageUrlPattern);
      });

      it('edit button click should load edit Topic page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Topic');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', topicPageUrlPattern);
      });

      it('last delete button click should delete instance of Topic', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('topic').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', topicPageUrlPattern);

        topic = undefined;
      });
    });
  });

  describe('new Topic page', () => {
    beforeEach(() => {
      cy.visit(`${topicPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Topic');
    });

    it('should create an instance of Topic', () => {
      cy.get(`[data-cy="title"]`).type('digital SAS Accountability').should('have.value', 'digital SAS Accountability');

      cy.get(`[data-cy="description"]`).type('Books').should('have.value', 'Books');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        topic = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', topicPageUrlPattern);
    });
  });
});
