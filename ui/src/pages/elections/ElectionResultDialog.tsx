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

export interface InputDialogProps<T extends {[key: string]: any }> {
  open : boolean
  title : string
  election: ElectionResult
  filledOutBallots: CreateEvent<FilledOutBallot>[]
  onClose : () => void
}

export function ElectionResultDialog<T extends { [key : string] : any }>(props : InputDialogProps<T>) {
  const [quantity, vote] = props.filledOutBallots.reduce<[number, boolean | undefined]>((acc, ballot, i) => [acc[0]+parseInt(ballot.payload.quantity), ballot.payload.vote], [0, undefined])

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Topic: "{props.election.description}"
        </DialogContentText>
        <DialogContentText>
          { quantity ?
            <div style={{display: "flex", alignItems: "center"}}>
              You voted {vote ? "in support of" : "against"} this with {quantity} votes
              {vote ? <CheckCircleIcon color="primary" fontSize="large" /> : <CancelIcon color="error" fontSize="large" />}
            </div>:
            "You did not vote on this."
          }
        </DialogContentText>
        {!!quantity && props.filledOutBallots[0].payload.proxy &&
          <DialogContentText>
            Proxy: {props.filledOutBallots[0].payload.proxy}
          </DialogContentText>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
