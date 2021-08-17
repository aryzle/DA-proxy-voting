import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import DamlLedger from "@daml/react";
import Header from "components/Header/Header";
import Sidebar from "components/Sidebar/Sidebar";
import Elections from "pages/elections";
import Votes from "pages/votes";
import { useUserState } from "context/UserContext";
import { wsBaseUrl, httpBaseUrl } from "config";
import useStyles from "./styles";

const Layout = () => {
  const classes = useStyles();
  const user = useUserState();

  if(!user.isAuthenticated){
    return null;
  } else {
    return (
      <DamlLedger party={user.party} token={user.token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
        <div className={classes.root}>
          <Header />
          <Sidebar />
          <div className={classes.content}>
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/votes" component={Votes} />
              <Route path="/app/elections" component={Elections} />
            </Switch>
          </div>
        </div>
      </DamlLedger>
    );
  }
}

export default withRouter(Layout);
