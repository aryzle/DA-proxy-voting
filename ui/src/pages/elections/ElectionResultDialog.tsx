import React, { useState } from "react";
import { CreateEvent } from "@daml/ledger"
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from "@material-ui/core/DialogActions";
import { ElectionResult } from "@daml.js/proxy-voting-0.0.1/lib/Election";
import { FilledOutBallot } from "@daml.js/proxy-voting-0.0.1/lib/Election";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { TextField } from "@material-ui/core";
import useStyles from "./styles"

export interface InputDialogProps<T extends {[key: string]: any }> {
  open : boolean
  title : string
  election: ElectionResult
  filledOutBallots: CreateEvent<FilledOutBallot>[]
  onClose : () => void
}

export function ElectionResultDialog<T extends { [key : string] : any }>(props : InputDialogProps<T>) {
  const classes = useStyles()
  const [quantity, vote] = props.filledOutBallots.reduce<[number, boolean | undefined]>((acc, ballot, i) => [acc[0]+parseInt(ballot.payload.quantity), ballot.payload.vote], [0, undefined])

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <TextField className={classes.textField} label="ID" value={props.election.id} />
          { quantity ?
            <TextField className={`${classes.textField} ${classes.marginTop}`} label="Quantity" value={quantity} /> :
            "You did not vote on this."
          }
          {!!quantity && props.filledOutBallots[0].payload.proxy &&
            <TextField className={`${classes.textField} ${classes.marginTop}`} label="Proxy" value={props.filledOutBallots[0].payload.proxy} />
          }
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
