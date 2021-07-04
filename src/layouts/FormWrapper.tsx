import * as React from "react";
import { makeStyles } from "@material-ui/core";

interface Props {
  backBtnAction: () => void;
  nextBtnAction: () => void;
  children: React.ReactChild;
  title: string;
  backDisabled?: boolean;
  nextDisabled?: boolean;
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
  },
  title: {
    paddingHorizontal: theme.spacing,
    paddingTop: theme.spacing,
  },
  top: {
    flex: 20,
    width: "100%",
    paddingHorizontal: theme.spacing,
  },
  bottom: {
    flex: 2,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    paddingBottom: 20,
  },
  form: {
    marginTop: theme.spacing,
  },
  next: {
    alignSelf: "flex-end",
  },
  prev: {
    alignSelf: "flex-start",
  },
}));

const FormWrapper = (props: Props) => {
  const {
    backBtnAction,
    nextBtnAction,
    children,
    title,
    backDisabled,
    nextDisabled,
  } = props;
  const classes = useStyles();

  return (
    <section className={classes.container}>
      <h2 className={classes.title}>{title}</h2>
      <div className={classes.top}>
        <div className={classes.form}>{children}</div>
      </div>
      <div className={classes.bottom}>
        <button
          className={classes.next}
          onClick={backBtnAction}
          disabled={backDisabled}
        >
          Back
        </button>
        <button
          className={classes.next}
          onClick={nextBtnAction}
          disabled={nextDisabled}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default FormWrapper;
