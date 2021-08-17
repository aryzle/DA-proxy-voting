import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from "@material-ui/core/DialogActions";
import { ElectionResult } from "@daml.js/proxy-voting-0.0.1/lib/Election";
import { FilledOutBallot } from "@daml.js/proxy-voting-0.0.1/lib/Election";

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
          Results for Election {props.election.id} on "{props.election.description}".
        </DialogContentText>
        <DialogContentText>
          { props.filledOutBallot?.quantity ?
            `You voted ${props.filledOutBallot?.vote ? "in support of" : "against"} this with ${props.filledOutBallot.quantity.toString()} votes.` :
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
