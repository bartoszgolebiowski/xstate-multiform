import * as React from "react";
import { Interpreter } from "xstate";
import { useActor } from "@xstate/react";
import { TextField, makeStyles } from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormWrapper from "../layouts/FormWrapper";
import Backdrop from "../common/Backdrop";
import {
  UserDataMachineContext,
  UserDataMachineEvents,
} from "../store/machines/userDataMachine.types";
import {
  UpdateEvents,
  UpdateMachineContext,
  UpdateMachineEvents,
  UpdateStates,
} from "../store/machines/updateMachine.types";

const FormSchema = Yup.object().shape({
  account: Yup.string()
    .required("Required")
    .matches(new RegExp(/^[0-9\s]*$/), "It should be a number"),
  creaditCardNo: Yup.string()
    .required("Required")
    .matches(new RegExp(/^[0-9\s]*$/), "It should be a number"),
  creditCardExp: Yup.string()
    .required("Required")
    .matches(new RegExp(/^[0-9\/]*$/), "It should be a number and /"),
  creditCardCvv: Yup.string()
    .required("Required")
    .length(3, "Should be 3 characters long")
    .matches(new RegExp(/^[0-9\s]*$/), "It should be a number"),
});

type Props = {
  goBack: () => void;
  service: Interpreter<UserDataMachineContext, any, UserDataMachineEvents, any>;
};

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing,
  },
}));

const FormPayment: React.FC<Props> = (props) => {
  const { goBack, service } = props;
  const classes = useStyles();
  const machine = service.children.get("FormPayment");
  const [current, send] = useActor(
    machine as Interpreter<UpdateMachineContext, any, UpdateMachineEvents>
  );

  const formik = useFormik({
    initialValues: {
      account: current.context.userData?.account ?? "",
      creaditCardNo: current.context.userData?.creaditCardNo ?? "",
      creditCardExp: current.context.userData?.creditCardExp ?? "",
      creditCardCvv: current.context.userData?.creditCardCvv ?? "",
    },
    validationSchema: FormSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      send({
        type: UpdateEvents.NEXT,
        userData: values,
      });
    },
  });

  const submitForm = () => formik.submitForm();

  const isLoading = React.useMemo(() => {
    if (
      current.matches(UpdateStates.fetch) ||
      current.matches(UpdateStates.pending)
    ) {
      return true;
    }
    return false;
  }, [current]);

  const canProceed = React.useMemo(() => {
    const errorsArray = Object.keys(formik.errors);

    if (isLoading || errorsArray.length > 0) {
      return false;
    }
    return true;
  }, [isLoading, formik.errors]);

  return (
    <FormWrapper
      title="Payment"
      nextBtnAction={submitForm}
      nextDisabled={!canProceed}
      backBtnAction={goBack}
      backDisabled={isLoading}
    >
      <>
        <TextField
          className={classes.input}
          label="Account number"
          placeholder="E.g. DE12 1234 1234 1234 1234 44"
          value={formik.values.account}
          helperText={formik.errors["account"] || "Your account number"}
          onChange={(e) => formik.setFieldValue("account", e.target.value)}
          error={Boolean(formik.errors["account"])}
          id="account"
        />
        <TextField
          className={classes.input}
          label="Credit card number"
          placeholder="1234 4567 7890 4565 2344"
          value={formik.values.creaditCardNo}
          helperText={
            formik.errors["creaditCardNo"] || "Your credit card number"
          }
          onChange={(e) =>
            formik.setFieldValue("creaditCardNo", e.target.value)
          }
          error={Boolean(formik.errors["creaditCardNo"])}
          id="creaditCardNo"
        />

        <TextField
          className={classes.input}
          label="Credit card expiration date"
          placeholder="E.g. 12/22"
          value={formik.values.creditCardExp}
          helperText={
            formik.errors["creditCardExp"] || "Your credit card expiration date"
          }
          onChange={(e) =>
            formik.setFieldValue("creditCardExp", e.target.value)
          }
          error={Boolean(formik.errors["creditCardExp"])}
          id="creditCardExp"
        />
        <TextField
          className={classes.input}
          label="CVV"
          placeholder="CVV"
          value={formik.values.creditCardCvv}
          helperText={formik.errors["creditCardCvv"] || "Your CVV"}
          onChange={(e) =>
            formik.setFieldValue("creditCardCvv", e.target.value)
          }
          error={Boolean(formik.errors["creditCardCvv"])}
          id="creditCardCvv"
        />
        <Backdrop open={isLoading} />
      </>
    </FormWrapper>
  );
};

export default FormPayment;
