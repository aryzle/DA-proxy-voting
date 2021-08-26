import React, { useState } from "react";
import { CreateEvent } from "@daml/ledger"
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from "@material-ui/core/DialogActions";
import newsletter from "./Newsletter.svg"

export interface ElectionAnnouncementProps<T extends {[key: string]: any }> {
  open : boolean
  title : string
  onClose : () => void
}

export function ElectionAnnouncementDialog<T extends { [key : string] : any }>(props : ElectionAnnouncementProps<T>) {

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers>
        <img src={newsletter} alt="newsletter" />
        <DialogContentText>
          All the apprpriate parties are being notified now.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
