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
import MailIcon from '@material-ui/icons/Mail';
import BallotIcon from '@material-ui/icons/Ballot';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export interface ElectionProgressDialogProps<T extends {[key: string]: any }> {
  open : boolean
  title : string
  election: CreateEvent<Election>
  hasBallots: boolean
  hasFilledOutBallots: boolean
  onClose : () => void
}

export function ElectionProgressDialog<T extends { [key : string] : any }>(props : ElectionProgressDialogProps<T>) {

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Topic: {props.election.payload.description}
        </DialogContentText>
        <Timeline align="alternate">
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Created</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <MailIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Announced</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color={props.hasBallots || props.hasFilledOutBallots ? "primary" : undefined}>
                <BallotIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Ballots Issued</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color={props.hasFilledOutBallots ? "primary" : undefined}>
                <HowToVoteIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Voting Started</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color={props.hasFilledOutBallots && !props.hasBallots ? "primary" : undefined}>
                <CheckCircleIcon />
              </TimelineDot>
            </TimelineSeparator>
            <TimelineContent>Voting Complete</TimelineContent>
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
