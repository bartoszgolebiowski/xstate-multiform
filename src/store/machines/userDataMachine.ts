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
        [UserDataEvents.ADDRESS]: {
          target: UserDataStates.address,
          actions: assign({
            userData: (_, { userData }) => userData,
          }),
        },
        [UserDataEvents.PAYMENT]: {
          target: UserDataStates.payment,
          actions: assign({
            userData: (_, { userData }) => userData,
          }),
        },
      },
      invoke: {
        src: (_) => async (cb) => {
          try {
            const userData = await getUser();

            const {
              name,
              surname,
              email,
              phone,
              street,
              city,
              code,
              country,
              account,
              creaditCardNo,
              creditCardExp,
              creditCardCvv,
            } = userData;

            switch (null) {
              case name && surname && email && phone:
                cb({ type: UserDataEvents.BASIC, userData });
                break;
              case street && city && code && country:
                cb({ type: UserDataEvents.ADDRESS, userData });
                break;
              case account && creaditCardNo && creditCardExp && creditCardCvv:
                cb({ type: UserDataEvents.PAYMENT, userData });
                break;
              default:
                cb({ type: UserDataEvents.BASIC, userData });
                break;
            }
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
      invoke: {
        id: "FormName",
        src: updateMachine,
        data: (ctx: UserDataMachineContext) => ctx,
        onDone: {
          target: UserDataStates.address,
          actions: assign({
            userData: (_, { data }) => data?.userData ?? null,
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
      invoke: {
        id: "FormAddress",
        src: updateMachine,
        data: (ctx: UserDataMachineContext) => ctx,
        onDone: {
          target: UserDataStates.payment,
          actions: assign({
            userData: (_, { data }) => data?.userData ?? null,
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
      invoke: {
        id: "FormPayment",
        src: updateMachine,
        data: (ctx: UserDataMachineContext) => ctx,
        onDone: {
          target: UserDataStates.complete,
          actions: assign({
            userData: (_, { data }) => data?.userData ?? null,
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
    },
  },
});

export default userDataMachine;
