import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Box, Typography } from "@material-ui/core";
import { DropzoneArea } from 'material-ui-dropzone'

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
  onClose : () => void
  createElection : (id: string, date: string, description: string, files: File[]) => void
}

export function CreateElectionDialog<T extends { [key : string] : any }>(props : InputDialogProps<T>) {
  const [id, setId] = useState("")
  const [date, setDate] = useState("")
  const [desc, setDesc] = useState("")
  const [files, setFiles] = useState<File[]>([])

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create an election by setting its date and describing what is being voted on.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="id"
          label="id"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          fullWidth
          required
        />
        <TextField
            margin="dense"
            id="description"
            label="description"
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            id="date"
            label="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <Box mt={5}>
            <Typography gutterBottom>
              Upload proxy materials (e.g. proxy statement, annual report)
            </Typography>
            <DropzoneArea onChange={setFiles} filesLimit={1} showFileNames />
          </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => props.createElection(id, date, desc, files)} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
