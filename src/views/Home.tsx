import * as React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h1>Form App</h1>
    </div>
  );
};

export default Home;
