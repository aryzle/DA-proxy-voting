import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Ledger, { CreateEvent } from "@daml/ledger";
import { useStreamQueries, useLedger, useParty } from "@daml/react";
import { ContractId } from "@daml/types";
import { Vote, VoteTransfer  } from "@daml.js/proxy-voting-0.0.1/lib/Vote";
import { Proxy, IssuerApprovedProxy } from "@daml.js/proxy-voting-0.0.1/lib/UserAdmin";
import useStyles from "./styles";
import { Box, Typography } from "@material-ui/core";

export default function Report() {
  const classes = useStyles();
  const party = useParty();
  const ledger : Ledger = useLedger();
  const { contracts: votes, loading: voteLoading } = useStreamQueries(Vote);
  const { contracts: voteTranfers, loading: voteTransferLoading } = useStreamQueries(VoteTransfer)
  const { contracts: iAProxies, loading: iAProxyLoading } = useStreamQueries(IssuerApprovedProxy)

  const setProxy = (v: CreateEvent<Vote>) => async (e: React.MouseEvent<HTMLElement>) => {
    const [choiceReturnValue, events] = await ledger.exercise(Vote.Transfer, v.contractId, {newProxy: "Bob"})
    console.log(choiceReturnValue)
    console.log(events)
  }

  const removeProxy = (v: CreateEvent<Vote>) => async (e: React.MouseEvent<HTMLElement>) => {
    console.log(v)
    const [choiceReturnValue, events] = await ledger.exercise(Vote.RemoveProxy, v.contractId, {})
    console.log(choiceReturnValue)
    console.log(events)
  }

  const approveVoteTransfer = (vt: CreateEvent<VoteTransfer>) => async (e: React.MouseEvent<HTMLElement>) => {
    console.log(vt)
    const iAProxy = iAProxies.filter(({ payload }) => payload.issuer === vt.payload.issuer).pop()
    console.log(iAProxy)
    if (!iAProxy) return

    const [choiceReturnValue, events] = await ledger.exercise(IssuerApprovedProxy.AcceptVoteAsProxy, iAProxy.contractId, { transferId: vt.contractId })
    console.log(choiceReturnValue)
    console.log(events)
  }

  const denyVoteTransfer = (vt: CreateEvent<VoteTransfer>) => async (e: React.MouseEvent<HTMLElement>) => {
    console.log(vt)
    const [choiceReturnValue, events] = await ledger.exercise(VoteTransfer.DenyTransfer, vt.contractId, {})
    console.log(choiceReturnValue)
    console.log(events)
  }

  const stopVoteTransfer = (vt: CreateEvent<VoteTransfer>) => async (e: React.MouseEvent<HTMLElement>) => {
    console.log(vt)
    const [choiceReturnValue, events] = await ledger.exercise(VoteTransfer.StopTransfer, vt.contractId, {})
    console.log(choiceReturnValue)
    console.log(events)
  }

  return (
    <>
      <Box mb={5}>
        <Typography variant="h2" component="h2">
          Votes
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>Investor</TableCell>
              <TableCell key={1} className={classes.tableCell}>Issuer</TableCell>
              <TableCell key={2} className={classes.tableCell}>Symbol</TableCell>
              <TableCell key={3} className={classes.tableCell}>Number of Votes</TableCell>
              <TableCell key={4} className={classes.tableCell}>Proxy</TableCell>
              <TableCell key={5} className={classes.tableCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {votes.map(v => (
              <TableRow key={v.contractId} className={classes.tableRow}>
                <TableCell key={0} className={classes.tableCell}>{v.payload.investor}</TableCell>
                <TableCell key={1} className={classes.tableCell}>{v.payload.issuer}</TableCell>
                <TableCell key={2} className={classes.tableCell}>{v.payload.symbol}</TableCell>
                <TableCell key={3} className={classes.tableCell}>{v.payload.quantity}</TableCell>
                <TableCell key={4} className={classes.tableCell} onClick={removeProxy(v)}>{v.payload.proxy || "None"}</TableCell>
                {party === v.payload.investor && <TableCell key={5} className={classes.tableCell}>
                  <Button onClick={setProxy(v)} color="primary" variant="outlined" size="small">Set Proxy</Button>
                  {!!v.payload.proxy && <Button onClick={removeProxy(v)} color="primary" variant="outlined" size="small">Remove Proxy</Button>}
                </TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {/* only admins should see below */}
      {!!voteTranfers.length && <Box>
        <Typography variant="h2" component="h2">
          Vote Transfers
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>Investor</TableCell>
              <TableCell key={1} className={classes.tableCell}>Issuer</TableCell>
              <TableCell key={2} className={classes.tableCell}>Symbol</TableCell>
              <TableCell key={3} className={classes.tableCell}>Number of Votes</TableCell>
              <TableCell key={4} className={classes.tableCell}>Proxy</TableCell>
              <TableCell key={5} className={classes.tableCell}>New Proxy</TableCell>
              <TableCell key={6} className={classes.tableCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voteTranfers.map(vt => (
              <TableRow key={vt.contractId} className={classes.tableRow}>
                <TableCell key={0} className={classes.tableCell}>{vt.payload.investor}</TableCell>
                <TableCell key={1} className={classes.tableCell}>{vt.payload.issuer}</TableCell>
                <TableCell key={2} className={classes.tableCell}>{vt.payload.symbol}</TableCell>
                <TableCell key={3} className={classes.tableCell}>{vt.payload.quantity}</TableCell>
                <TableCell key={4} className={classes.tableCell}>{vt.payload.proxy || "None"}</TableCell>
                <TableCell key={5} className={classes.tableCell}>{vt.payload.newProxy || "None"}</TableCell>
                <TableCell key={6} className={classes.tableCell}>
                  {party === vt.payload.admin &&
                    <Button onClick={denyVoteTransfer(vt)} color="secondary" variant="outlined" size="small">Deny</Button>

                  }
                  {party === vt.payload.newProxy &&
                    <Button onClick={approveVoteTransfer(vt)} color="primary" variant="outlined" size="small">Approve</Button>
                  }
                  {party === vt.payload.investor &&
                    <Button onClick={stopVoteTransfer(vt)} color="secondary" variant="outlined" size="small">Stop</Button>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>}
    </>
  );
}