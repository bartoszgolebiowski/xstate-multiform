import React from "react";
import MuiBackdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

type Props = {
  open: boolean;
};

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Backdrop: React.FC<Props> = (props) => {
  const { open } = props;
  const classes = useStyles();

  return (
    <MuiBackdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </MuiBackdrop>
  );
};

export default Backdrop;
