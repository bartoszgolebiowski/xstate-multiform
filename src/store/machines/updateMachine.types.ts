import { EventObject } from "xstate";
import { UserData } from "../../types";

export interface UpdateMachineContext {
  userData: UserData | null;
  error: boolean;
  errorMsg: string;
}

export enum UpdateStates {
  fetch = "fetch",
  edit = "edit",
  pending = "pending",
  done = "done",
}

export interface UpdateMachineStates {
  states: {
    [UpdateStates.fetch]: {};
    [UpdateStates.edit]: {};
    [UpdateStates.pending]: {};
    [UpdateStates.done]: {};
  };
}

export enum UpdateEvents {
  NEXT = "NEXT",
  ERROR = "ERROR",
}

type EventTypesSchema = UpdateEvents.NEXT | UpdateEvents.ERROR;

export interface UpdateMachineEvents extends EventObject {
  type: EventTypesSchema;
  userData: Partial<UserData> | null;
}
