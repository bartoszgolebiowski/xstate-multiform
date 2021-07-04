/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { assign, Machine } from "xstate";
import { getUser } from "../../services/user";
import updateMachine from "./updateMachine";
import {
  UserDataMachineContext,
  UserDataMachineStates,
  UserDataMachineEvents,
  UserDataEvents,
  UserDataStates,
} from "./userDataMachine.types";

const userDataMachine = Machine<
  UserDataMachineContext,
  UserDataMachineStates,
  UserDataMachineEvents
>({
  id: "userDataMachine",
  initial: UserDataStates.init,
  context: {
    error: false,
    errorMsg: "",
    userData: null,
  },
  states: {
    [UserDataStates.init]: {
      on: {
        [UserDataEvents.BASIC]: {
          target: UserDataStates.basic,
          actions: assign({
            userData: (_, { userData }) => userData,
          }),
        },
      },
      invoke: {
        src: (_) => async (cb) => {
          try {
            const userData = await getUser();
            cb({ type: UserDataEvents.BASIC, userData });
          } catch (e) {
            console.log(e.message);
          }
        },
      },
    },
    [UserDataStates.basic]: {
      on: {
        [UserDataEvents.NEXT]: {
          target: UserDataStates.address,
        },
      },
      meta: {
        test: async () => {
          cy.get("#name").should("exist");
          cy.get("#surname").should("exist");
          cy.get("#email").should("exist");
          cy.get("#phone").should("exist");
        },
      },
      invoke: {
        id: "FormName",
        src: updateMachine,
        data: (ctx: UserDataMachineContext) => ctx,
        onDone: {
          target: UserDataStates.address,
          actions: assign({
            userData: (ctx, { data }) => {
              if (data && data.userData) {
                return data.userData;
              }
              return ctx.userData;
            },
          }),
        },
      },
    },
    [UserDataStates.address]: {
      on: {
        [UserDataEvents.NEXT]: {
          target: UserDataStates.payment,
        },
        [UserDataEvents.BACK]: {
          target: UserDataStates.basic,
        },
      },
      meta: {
        test: async () => {
          cy.get("#street").should("exist");
          cy.get("#city").should("exist");
          cy.get("#code").should("exist");
          cy.get("#country").should("exist");
        },
      },
      invoke: {
        id: "FormAddress",
        src: updateMachine,
        data: (ctx: UserDataMachineContext) => ctx,
        onDone: {
          target: UserDataStates.payment,
          actions: assign({
            userData: (ctx, { data }) => {
              if (data && data.userData) {
                return data.userData;
              }
              return ctx.userData;
            },
          }),
        },
      },
    },
    [UserDataStates.payment]: {
      on: {
        [UserDataEvents.NEXT]: {
          target: UserDataStates.complete,
        },
        [UserDataEvents.BACK]: {
          target: UserDataStates.address,
        },
      },
      meta: {
        test: async () => {
          cy.get("#account").should("exist");
          cy.get("#creaditCardNo").should("exist");
          cy.get("#creditCardExp").should("exist");
          cy.get("#creditCardCvv").should("exist");
        },
      },
      invoke: {
        id: "FormPayment",
        src: updateMachine,
        data: (ctx: UserDataMachineContext) => ctx,
        onDone: {
          target: UserDataStates.complete,
          actions: assign({
            userData: (ctx, { data }) => {
              if (data && data.userData) {
                return data.userData;
              }
              return ctx.userData;
            },
          }),
        },
      },
    },
    [UserDataStates.complete]: {
      on: {
        [UserDataEvents.BACK]: {
          target: UserDataStates.payment,
        },
      },
      meta: {
        test: async () => {
          cy.contains(/success screen/i).should("exist");
        },
      },
    },
  },
});

export default userDataMachine;
