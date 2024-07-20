/// <reference types="cypress" />

import "@testing-library/cypress";
import "@testing-library/cypress/add-commands";

export const assertT = (actual: unknown, message?: string) => {
  expect(actual, message).to.be.ok;
};

export const assertF = (actual: unknown, message?: string) => {
  expect(actual, message).to.be.not.ok;
};

export const click = (element: Cypress.Chainable<JQuery<HTMLElement>>) => {
  element.click();
};

export const findByRole = (role: string, name: string) => {
  return cy.findByRole(role, { name });
};

export const findByText = (text: string) => {
  return cy.findByText(text);
};

export const setup = (url: string) => {
  return {
    screen: cy.visit(url).wait(100), // hack: wait for components to load and hydrate
  };
};
