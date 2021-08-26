import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ExitToApp from "@material-ui/icons/ExitToApp";
import { useUserDispatch, signOut, useUserState } from "../../context/UserContext";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useStyles from "./styles";

const Header = ({ history } : RouteComponentProps) => {
  const classes = useStyles();

  const userState = useUserState();
  const userDispatch = useUserDispatch();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.logotype}>
          Proxy Voting
        </Typography>
        <div className={classes.grow} />
        <AccountCircleIcon />
        { userState.isAuthenticated && <Typography variant="h6">{userState.party}</Typography> }
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={(event) => signOut(userDispatch, history)}
        >
          <ExitToApp className={classes.headerIcon} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(Header);