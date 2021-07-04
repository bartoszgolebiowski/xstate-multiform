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

type Props = {
  goBack: () => void;
  service: Interpreter<UserDataMachineContext, any, UserDataMachineEvents, any>;
};

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing,
  },
}));

const FormSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  surname: Yup.string().required("Required"),
  email: Yup.string().required("Required").email("Should be an e-mail"),
  phone: Yup.string()
    .required("Required")
    .matches(new RegExp(/^[0-9\s]*$/), "Only numbers and spaces allowed"),
});

const FormName: React.FC<Props> = (props) => {
  const { goBack, service } = props;
  const classes = useStyles();
  const machine = service.children.get("FormName");
  const [current, send] = useActor(
    machine as Interpreter<UpdateMachineContext, any, UpdateMachineEvents>
  );

  const formik = useFormik({
    initialValues: {
      name: current.context.userData?.name ?? "",
      surname: current.context.userData?.surname ?? "",
      email: current.context.userData?.email ?? "",
      phone: current.context.userData?.phone ?? "",
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

  const submitForm = () => formik.submitForm();

  return (
    <FormWrapper
      title="Name and contact"
      nextBtnAction={submitForm}
      nextDisabled={!canProceed}
      backBtnAction={goBack}
      backDisabled={isLoading}
    >
      <>
        <TextField
          className={classes.input}
          label="First name"
          placeholder="John"
          value={formik.values.name}
          helperText={formik.errors["name"] || "Your first name"}
          onChange={(e) => formik.setFieldValue("name", e.target.value)}
          error={Boolean(formik.errors["name"])}
          id="name"
        />
        <TextField
          className={classes.input}
          label="Last name"
          placeholder="Doe"
          value={formik.values.surname}
          helperText={formik.errors["surname"] || "Your last name"}
          onChange={(e) => formik.setFieldValue("surname", e.target.value)}
          error={Boolean(formik.errors["surname"])}
          id="surname"
        />
        <TextField
          className={classes.input}
          label="E-mail"
          placeholder="mail@mail.com"
          value={formik.values.email}
          helperText={formik.errors["email"] || "You e-mail address"}
          onChange={(e) => formik.setFieldValue("email", e.target.value)}
          error={Boolean(formik.errors["email"])}
          id="email"
        />
        <TextField
          className={classes.input}
          label="Phone"
          placeholder="123 123 123"
          value={formik.values.phone}
          helperText={formik.errors["phone"] || "Your phone number"}
          onChange={(e) => formik.setFieldValue("phone", e.target.value)}
          error={Boolean(formik.errors["phone"])}
          id="phone"
        />
        <Backdrop open={isLoading} />
      </>
    </FormWrapper>
  );
};

export default FormName;
