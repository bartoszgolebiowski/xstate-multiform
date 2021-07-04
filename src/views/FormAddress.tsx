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
  street: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  code: Yup.string()
    .required("Required")
    .matches(
      new RegExp(/^[0-9\s-]*$/),
      "Only numbers, spaces and - are allowed"
    ),
  country: Yup.string().required("Required"),
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

const FormAddress: React.FC<Props> = (props) => {
  const { goBack, service } = props;
  const classes = useStyles();
  const machine = service.children.get("FormAddress");
  const [current, send] = useActor(
    machine as Interpreter<UpdateMachineContext, any, UpdateMachineEvents>
  );

  const formik = useFormik({
    initialValues: {
      street: current.context.userData?.street ?? "",
      city: current.context.userData?.city ?? "",
      code: current.context.userData?.code ?? "",
      country: current.context.userData?.country ?? "",
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
      title="Address"
      nextBtnAction={submitForm}
      nextDisabled={!canProceed}
      backBtnAction={goBack}
      backDisabled={isLoading}
    >
      <>
        <TextField
          className={classes.input}
          label="Street"
          placeholder="18th Dev Avenue"
          value={formik.values.street}
          helperText={formik.errors["street"] || "Your street"}
          onChange={(e) => formik.setFieldValue("street", e.target.value)}
          error={Boolean(formik.errors["street"])}
          id="street"
        />
        <TextField
          className={classes.input}
          label="City"
          placeholder="South Dev City"
          value={formik.values.city}
          helperText={formik.errors["city"] || "Your city"}
          onChange={(e) => formik.setFieldValue("city", e.target.value)}
          error={Boolean(formik.errors["city"])}
          id="city"
        />
        <TextField
          className={classes.input}
          label="Code"
          placeholder="25-898"
          value={formik.values.code}
          helperText={formik.errors["code"] || "You code"}
          onChange={(e) => formik.setFieldValue("code", e.target.value)}
          error={Boolean(formik.errors["code"])}
          id="code"
        />
        <TextField
          className={classes.input}
          label="Country"
          placeholder="Devland"
          value={formik.values.country}
          helperText={formik.errors["country"] || "You country"}
          onChange={(e) => formik.setFieldValue("country", e.target.value)}
          error={Boolean(formik.errors["country"])}
          id="country"
        />
        <Backdrop open={isLoading} />
      </>
    </FormWrapper>
  );
};

export default FormAddress;
