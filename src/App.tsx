import * as React from "react";
import { useMachine } from "@xstate/react";
import userDataMachine from "./store/machines/userDataMachine";
import {
  UserDataEvents,
  UserDataStates,
} from "./store/machines/userDataMachine.types";
import Home from "./views/Home";
import FormAddress from "./views/FormAddress";
import FormName from "./views/FormName";
import FormPayment from "./views/FormPayment";
import Success from "./views/Success";

const App = () => {
  const [current, send, service] = useMachine(userDataMachine);

  const goBack = React.useCallback(() => {
    send(UserDataEvents.BACK);
  }, [send]);

  return (
    <>
      {current.matches(UserDataStates.init) ? <Home /> : null}
      {current.matches(UserDataStates.basic) ? (
        <FormName goBack={goBack} service={service} />
      ) : null}
      {current.matches(UserDataStates.address) ? (
        <FormAddress goBack={goBack} service={service} />
      ) : null}
      {current.matches(UserDataStates.payment) ? (
        <FormPayment goBack={goBack} service={service} />
      ) : null}
      {current.matches(UserDataStates.complete) ? (
        <Success goBack={goBack} />
      ) : null}
    </>
  );
};

export default App;
