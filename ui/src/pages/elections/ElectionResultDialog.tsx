import React, { useState } from "react";
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
  filledOutBallot: FilledOutBallot | undefined
  onClose : () => void
}

export function ElectionResultDialog<T extends { [key : string] : any }>(props : InputDialogProps<T>) {
  const [vote, setVote] = useState(0)

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Topic: "{props.election.description}"
        </DialogContentText>
        <DialogContentText>
          { props.filledOutBallot?.quantity ?
            <div style={{display: "flex", alignItems: "center"}}>
              You voted {props.filledOutBallot?.vote ? "in support of" : "against"} this with {props.filledOutBallot.quantity.toString()} votes
              {props.filledOutBallot?.vote ? <CheckCircleIcon color="primary" fontSize="large" /> : <CancelIcon color="error" fontSize="large" />}
            </div>:
            "You did not vote on this."
          }
        </DialogContentText>
        {props.filledOutBallot?.proxy &&
          <DialogContentText>
            Proxy: {props.filledOutBallot.proxy}
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
