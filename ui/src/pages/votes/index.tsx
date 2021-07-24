import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Ledger, { CreateEvent } from "@daml/ledger";
import { useStreamQueries, useLedger, useParty } from "@daml/react";
import { ContractId } from "@daml/types";
// import { Appraise, Asset, Give  } from "@daml.js/proxy-voting-0.0.1/lib/Main";
import { Vote, VoteTransfer  } from "@daml.js/proxy-voting-0.0.1/lib/Vote";
import { InputDialog, InputDialogProps } from "./InputDialog";
import useStyles from "./styles";
import { Box, Divider, Typography } from "@material-ui/core";

export default function Report() {
  const classes = useStyles();
  const party = useParty();
  const ledger : Ledger = useLedger();
  const { contracts: votes, loading: voteLoading } = useStreamQueries(Vote);
  console.log(party)
  console.log(voteLoading)
  console.log("votes", votes)
  const { contracts: voteTranfers, loading: voteTransferLoading } = useStreamQueries(VoteTransfer)
  console.log(voteTransferLoading)
  console.log("voteTranfers", voteTranfers)

  // const defaultGiveProps : InputDialogProps<Give> = {
  //   open: false,
  //   title: "Give Asset",
  //   defaultValue: { newOwner : "" },
  //   fields: {
  //     newOwner : {
  //       label: "New Owner",
  //       type: "selection",
  //       items: [ "Alice", "Bob" ] } },
  //   onClose: async function() {}
  // };

  // const [ giveProps, setGiveProps ] = useState(defaultGiveProps);
  // // One can pass the original contracts CreateEvent
  // function showGive(asset : Asset.CreateEvent) {
  //   async function onClose(state : Give | null) {
  //     setGiveProps({ ...defaultGiveProps, open: false});
  //     // if you want to use the contracts payload
  //     if (!state || asset.payload.owner === state.newOwner) return;
  //     await ledger.exercise(Asset.Give, asset.contractId, state);
  //   };
  //   setGiveProps({ ...defaultGiveProps, open: true, onClose})
  // };

  // type UserSpecifiedAppraise = Pick<Appraise, "newValue">;
  // const today = (new Date()).toISOString().slice(0,10);
  // const defaultAppraiseProps : InputDialogProps<UserSpecifiedAppraise> = {
  //   open: false,
  //   title: "Appraise Asset",
  //   defaultValue: { newValue: "0" },
  //   fields: {
  //     newValue : {
  //       label: "New Value",
  //       type: "number" }
  //     },
  //   onClose: async function() {}
  // };
  // const [ appraiseProps, setAppraiseProps ] = useState(defaultAppraiseProps);

  // // Or can pass just the ContractId of an
  // function showAppraise(assetContractId : ContractId<Asset>) {
  //   async function onClose(state : UserSpecifiedAppraise | null) {
  //     setAppraiseProps({ ...defaultAppraiseProps, open: false});
  //     if (!state) return;
  //     const withNewDateOfAppraisal = { ...state, newDateOfAppraisal:today};
  //     await ledger.exercise(Asset.Appraise, assetContractId, withNewDateOfAppraisal);
  //   };
  //   setAppraiseProps({...defaultAppraiseProps, open: true, onClose});
  // };

  // type InputFieldsForNewAsset = Omit<Asset, "issuer">;
  // const defaultNewAssetProps : InputDialogProps<InputFieldsForNewAsset> = {
  //   open: false,
  //   title: "New Asset",
  //   defaultValue: {
  //     owner: party,
  //     name: "",
  //     dateOfAppraisal: today,
  //     value: "0",
  //   },
  //   fields: {
  //     owner: {
  //       label: "Owner",
  //       type: "selection",
  //       items: [ "Alice", "Bob" ],
  //     },
  //     name: {
  //       label: "Name of Asset",
  //       type: "text"
  //     },
  //     dateOfAppraisal: {
  //       label: "Date of Appraisal",
  //       type: "date"
  //     },
  //     value: {
  //       label: "Value",
  //       type: "number"
  //     }
  //   },
  //   onClose: async function() {}
  // };
  // const [newAssetProps, setNewAssetProps] = useState(defaultNewAssetProps);
  // function showNewAsset() {
  //   async function onClose(state : InputFieldsForNewAsset | null) {
  //     setNewAssetProps({ ...defaultNewAssetProps, open: false});
  //     if (!state) return;
  //     const withIssuer = { ...state, issuer:party};
  //     await ledger.create(Asset, withIssuer);
  //   };
  //   setNewAssetProps({...defaultNewAssetProps, open: true, onClose});
  // };
  const onClick = (v: CreateEvent<Vote>) => async (e: React.MouseEvent<HTMLElement>) => {
    console.log(v)
    if (!!v.payload.proxy) {
      // remove proxy
      const [choiceReturnValue, events] = await ledger.exercise(Vote.Transfer, v.contractId, {newProxy: null})
      console.log(choiceReturnValue)
      console.log(events)
    }
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
            </TableRow>
          </TableHead>
          <TableBody>
            {votes.map(v => (
              <TableRow key={v.contractId} className={classes.tableRow}>
                <TableCell key={0} className={classes.tableCell}>{v.payload.investor}</TableCell>
                <TableCell key={1} className={classes.tableCell}>{v.payload.issuer}</TableCell>
                <TableCell key={2} className={classes.tableCell}>{v.payload.symbol}</TableCell>
                <TableCell key={3} className={classes.tableCell}>{v.payload.quantity}</TableCell>
                <TableCell key={4} className={classes.tableCell} onClick={onClick(v)}>{v.payload.proxy || "None"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
