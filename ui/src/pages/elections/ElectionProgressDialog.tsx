import React, { useState } from "react";
import { CreateEvent } from "@daml/ledger"
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from "@material-ui/core/DialogActions";
import { Ballot, Election } from "@daml.js/proxy-voting-0.0.1/lib/Election";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

export interface ElectionProgressDialogProps<T extends {[key: string]: any }> {
  open : boolean
  title : string
  election: CreateEvent<Election>
  onClose : () => void
}

export function ElectionProgressDialog<T extends { [key : string] : any }>(props : ElectionProgressDialogProps<T>) {

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Topic: "{props.election.payload.description}"
        </DialogContentText>
        <Timeline>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Created</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Announced</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>Ballots Issues</TimelineContent>
          </TimelineItem>
        </Timeline>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
