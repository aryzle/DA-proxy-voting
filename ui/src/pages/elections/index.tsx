import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddCircle from "@material-ui/icons/AddCircle";
import Ledger, { CreateEvent } from "@daml/ledger";
import { useStreamQueries, useLedger, useParty } from "@daml/react";
import { ContractId } from "@daml/types";
import { Election } from "@daml.js/proxy-voting-0.0.1/lib/Election";
import { Issuer } from "@daml.js/proxy-voting-0.0.1/lib/UserAdmin";
import { Box, Typography } from "@material-ui/core";
import { CreateElectionDialog } from "./CreateElectionDialog"
import useStyles from "./styles";

export default function Report() {
  const classes = useStyles();
  const party = useParty();
  const ledger : Ledger = useLedger();
  const { contracts: elections, loading: electionLoading } = useStreamQueries(Election);
  const { contracts: issuers, loading: issuerLoading } = useStreamQueries(Issuer);
  const issuerContract = issuers.filter(issuer => issuer.payload.issuer === party).pop()
  const isIssuer = !!issuerContract

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const createElection = async (id: string, date: string, description: string) => {
    if (!issuerContract) return

    const [choiceReturnValue, events] = await ledger.exercise(Issuer.CreateElection, issuerContract.contractId, {id, date, description})
    console.log(choiceReturnValue)
    console.log(events)
    handleClose()
  }

  return (
    <>
      <Box mb={5}>
        <Box display="flex">
          <Typography className={classes.header} variant="h2" component="h2">
            Elections
          </Typography>
          {isIssuer &&
            <>
              <IconButton color="primary" onClick={handleClickOpen}>
                Create Election
                <AddCircle />
              </IconButton>
              <CreateElectionDialog open={open} title={"Create Election"} onClose={handleClose} createElection={createElection} />
            </>
          }
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>Date</TableCell>
              <TableCell key={1} className={classes.tableCell}>Issuer</TableCell>
              <TableCell key={2} className={classes.tableCell}>Description</TableCell>
              <TableCell key={3} className={classes.tableCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {elections.map(v => (
              <TableRow key={v.contractId} className={classes.tableRow}>
                <TableCell key={0} className={classes.tableCell}>{v.payload.date}</TableCell>
                <TableCell key={1} className={classes.tableCell}>{v.payload.issuer}</TableCell>
                <TableCell key={2} className={classes.tableCell}>{v.payload.description}</TableCell>
                {party === v.payload.issuer &&
                  <TableCell key={5} className={classes.tableCell}>
                    <Button color="primary" variant="outlined" size="small">Collect Ballots</Button>
                  </TableCell>
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
