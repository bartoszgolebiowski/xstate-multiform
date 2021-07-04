/// <reference types="cypress" />

import { createModel } from "@xstate/test";
import userDataMachine from "../../src/store/machines/userDataMachine";
import { UserDataEvents } from "../../src/store/machines/userDataMachine.types";

const testModel = createModel(userDataMachine, {
  events: {
    "done.invoke.FormName": {
      exec: (_, arg) => {},
    },
    "done.invoke.FormAddress": {
      exec: (_, arg) => {},
    },
    "done.invoke.FormPayment": {
      exec: (_, arg) => {},
    },
    [UserDataEvents.NEXT]: {
      exec: () => {
        cy.get("#email").then((el) => {
          cy.get("#name").type("test");
          cy.get("#surname").type("test");
          cy.get("#email").type("test@test.com");
          cy.get("#phone").type("111222333");
          cy.findByRole("button", { name: /next/i }).click();
        });
        cy.get("#email").then((el) => {
          cy.get("#street").type("streettest");
          cy.get("#city").type("test");
          cy.get("#code").type("123");
          cy.get("#country").type("test");
          cy.findByRole("button", { name: /next/i }).click();
        });
        cy.get("#account").then((el) => {
          cy.get("#account").type("666");
          cy.get("#creaditCardNo").type("123");
          cy.get("#creditCardExp").type("123");
          cy.get("#creditCardCvv").type("111");
          cy.findByRole("button", { name: /next/i }).click();
        });
      },
    },
    [UserDataEvents.BACK]: {
      exec: () => {
        cy.findByRole("button", { name: /back/i }).click();
      },
    },
  },
});

const itVisitsAndRunsPathTests = (url: string) => (path: any) =>
  it(path.description, function () {
    cy.visit(url).then(path.test);
  });

const itTests = itVisitsAndRunsPathTests(
  //@ts-ignore
  `http://localhost:${process.env.PORT || "8080"}`
);

context("Feedback App", () => {
  const testPlans = testModel.getSimplePathPlans();
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach(itTests);
    });
  });
});
