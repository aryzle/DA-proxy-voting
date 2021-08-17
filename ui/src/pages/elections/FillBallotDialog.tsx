import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";

export interface RegularField {
  label : string
  type : "text" | "number" | "date"
}

export interface SelectionField {
  label : string
  type : "selection"
  items : string[]
}

export type Field = RegularField | SelectionField

export interface InputDialogProps<T extends {[key: string]: any }> {
  open : boolean
  title : string
  electionId: string
  electionDescription: string
  onClose : () => void
  fillBallot : (vote: number) => void
}

export function FillBallotDialog<T extends { [key : string] : any }>(props : InputDialogProps<T>) {
  const [vote, setVote] = useState(0)

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill out your Ballot for Election {props.electionId} on {props.electionDescription}.
        </DialogContentText>
        <Select
          autoFocus
          margin="dense"
          id="vote"
          type="text"
          value={vote}
          onChange={(e) => setVote(e.target.value as number)}
          required
          style={{width: 200}}
        >
          <MenuItem value={1}>Yes</MenuItem>
          <MenuItem value={-1}>No</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => props.fillBallot(vote)} color="primary" disabled={vote === 0}>
          Vote
        </Button>
      </DialogActions>
    </Dialog>
  );
}
