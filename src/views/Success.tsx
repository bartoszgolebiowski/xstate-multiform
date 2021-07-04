import * as React from "react";
import { makeStyles } from "@material-ui/core";

type Props = {
  goBack: () => void;
};

const useStyles = makeStyles(() => ({
  success: { flex: 1, justifyContent: "center", alignItems: "center" },
}));

const Success: React.FC<Props> = (props) => {
  const { goBack } = props;
  const classes = useStyles();

  return (
    <div className={classes.success}>
      <h2>Success screen</h2>
      <button onClick={goBack}>Back</button>
    </div>
  );
};

export default Success;
