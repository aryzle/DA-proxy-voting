import React, { useState } from "react"
import Table from "@material-ui/core/Table"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableBody from "@material-ui/core/TableBody"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import AddCircle from "@material-ui/icons/AddCircle"
import Ledger, { CreateEvent } from "@daml/ledger"
import { useStreamQueries, useLedger, useParty } from "@daml/react"
import { ContractId } from "@daml/types"
import { Document as ElectionDocument, Election, ElectionResult, Ballot, FilledOutBallot } from "@daml.js/proxy-voting-0.0.1/lib/Election"
import { Issuer } from "@daml.js/proxy-voting-0.0.1/lib/UserAdmin"
import { Box, Typography } from "@material-ui/core"
import { CreateElectionDialog } from "./CreateElectionDialog"
import { ElectionAnnouncementDialog } from "./ElectionAnnouncementDialog"
import { ElectionProgressDialog } from "./ElectionProgressDialog"
import { ElectionResultDialog } from "./ElectionResultDialog"
import { FillBallotDialog } from "./FillBallotDialog"
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import HistoryIcon from '@material-ui/icons/History';
import useStyles from "./styles"

export default function Elections() {
  const classes = useStyles()
  const party = useParty()
  const ledger : Ledger = useLedger()
  const { contracts: elections, loading: electionLoading } = useStreamQueries(Election)
  const { contracts: electionResults, loading: electionResultsLoading } = useStreamQueries(ElectionResult)
  const { contracts: ballots, loading: ballotsLoading } = useStreamQueries(Ballot)
  const { contracts: filledOutBallots, loading: filledOutBallotsLoading } = useStreamQueries(FilledOutBallot)
  const { contracts: issuers, loading: issuerLoading } = useStreamQueries(Issuer)
  const issuerContract = issuers.filter(issuer => issuer.payload.issuer === party).pop()
  const isIssuer = !!issuerContract

  const [createElectionDialogOpen, setCreateElectionDialogOpen] = React.useState(false)
  const openCreateElectionDialog = () => {
    setCreateElectionDialogOpen(true)
  }
  const closeCreateElectionDialog = () => {
    setCreateElectionDialogOpen(false)
  }
  const createElection = async (id: string, date: string, description: string, files: File[]) => {
    if (!issuerContract) return
    const reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = e => {
      const file: string = typeof reader.result === "string" ? reader.result : "";
      ledger.exercise(Issuer.CreateElection, issuerContract.contractId, {id, date, description, document: { name: files[0].name, file}})
      closeCreateElectionDialog()
      openElectionAnnouncementDialog()
    }
  }

  const [electionAnnouncementDialogOpen, setElectionAnnouncementDialogOpen] = React.useState(false)
  const openElectionAnnouncementDialog = () => {
    setElectionAnnouncementDialogOpen(true)
  }
  const closeElectionAnnouncementDialog = () => {
    setElectionAnnouncementDialogOpen(false)
  }

  const issueBallots = (electionId: ContractId<Election>) => async () => {
    const [choiceReturnValue, events] = await ledger.exercise(Election.IssueBallots, electionId, {})
  }
  const collectBallots = (electionId: ContractId<Election>) => async () => {
    const [choiceReturnValue, events] = await ledger.exercise(Election.CollectBallots, electionId, {})
  }

  const [fillBallotDialogOpen, setFillBallotDialogOpen] = React.useState(false)
  const fillBallot = (ballotIds: ContractId<Ballot>[]) => async (voteNum: number) => {
    const vote = voteNum > 0 ? true : false
    for (const ballotId of ballotIds) {
      const [choiceReturnValue, events] = await ledger.exercise(Ballot.FillBallot, ballotId, {vote})
      console.log(choiceReturnValue)
      console.log(events)
    }
    closeFillBallotDialog()
  }
  const openFillBallotDialog = () => {
    setFillBallotDialogOpen(true)
  }
  const closeFillBallotDialog = () => {
    setFillBallotDialogOpen(false)
  }

  const [election, setElection] = React.useState<CreateEvent<Election>>()
  const [electionProgressDialogOpen, setElectionProgressDialogOpen] = React.useState(false)
  const openElectionProgressDialog = (e: CreateEvent<Election>) => () => {
    setElection(e)
    setElectionProgressDialogOpen(true)
  }
  const closeElectionProgressDialog = () => {
    setElectionProgressDialogOpen(false)
  }

  const [electionResult, setElectionResult] = React.useState<CreateEvent<ElectionResult>>()
  const [electionResultDialogOpen, setElectionResultDialogOpen] = React.useState(false)
  const openElectionResultDialog = (er: CreateEvent<ElectionResult>) => () => {
    setElectionResult(er)
    setElectionResultDialogOpen(true)
  }
  const closeElectionResultDialog = () => {
    setElectionResultDialogOpen(false)
  }

  const downloadFile = (doc: ElectionDocument) => () => {
    const a = document.createElement('a')
    a.href = doc.file
    a.download = doc.name
    a.click()
  }

  const renderInvestorActions = (e: CreateEvent<Election>) => {
    if (!e.payload.proxies.map.has(party) && !e.payload.investors.map.has(party))
      return

    const ballotIds = ballots.filter(b => b.payload.electionId === e.payload.id).map(b => b.contractId)
    if (!ballotIds.length)
      return

    return (
      <>
        <Button color="primary" variant="outlined" size="small" onClick={openFillBallotDialog}>Fill Ballot</Button>
        <FillBallotDialog
          open={fillBallotDialogOpen}
          title={"Fill Ballot"}
          electionId={e.payload.id}
          electionDescription={e.payload.description}
          onClose={closeFillBallotDialog}
          fillBallot={fillBallot(ballotIds)}
        />
      </>
    )
  }

  return (
    <>
      <Box display="flex">
        <Typography className={classes.header} variant="h2" component="h2">
          <AssignmentOutlinedIcon />
          Elections
        </Typography>
        {isIssuer &&
          <>
            <IconButton color="primary" onClick={openCreateElectionDialog}>
              Create Election
              <AddCircle />
            </IconButton>
            <CreateElectionDialog
              open={createElectionDialogOpen}
              title={"Create Election"}
              onClose={closeCreateElectionDialog}
              createElection={createElection}
            />
            <ElectionAnnouncementDialog title="Election Announcement" open={electionAnnouncementDialogOpen} onClose={closeElectionAnnouncementDialog} />
            { election && <ElectionProgressDialog title="Election Progress" election={election} open={electionProgressDialogOpen} onClose={closeElectionProgressDialog} />}
          </>
        }
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>ID</TableCell>
            <TableCell key={1} className={classes.tableCell}>Date</TableCell>
            <TableCell key={2} className={classes.tableCell}>Issuer</TableCell>
            <TableCell key={3} className={classes.tableCell}>Description</TableCell>
            <TableCell key={4} className={classes.tableCell}>Documents</TableCell>
            <TableCell key={5} className={classes.tableCell}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {elections.map(e => (
            <TableRow key={e.contractId} className={classes.tableRow} onClick={openElectionProgressDialog(e)}>
              <TableCell key={0} className={classes.tableCell}>{e.payload.id}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{e.payload.date}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{e.payload.issuer}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{e.payload.description}</TableCell>
              <TableCell key={4} className={classes.tableCell}>
                <Button size="small" onClick={downloadFile(e.payload.document)} endIcon={<CloudDownloadOutlinedIcon />} style={{textTransform: "none"}}>
                  {e.payload.document.name}
                </Button>
              </TableCell>
              <TableCell key={5} className={classes.tableCell}>
                {party === e.payload.admin &&
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={collectBallots(e.contractId)}>Collect Ballots</Button>
                }
                {party === e.payload.custodian && !ballots.find(b => b.payload.electionId === e.payload.id) &&
                  <Button color="primary"
                    variant="outlined"
                    size="small"
                    onClick={issueBallots(e.contractId)}
                  >
                    Issue Ballots
                  </Button>
              }
              {renderInvestorActions(e)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box display="flex" mt={5}>
        <Typography className={classes.header} variant="h2" component="h2">
          <HistoryIcon />
          Previous Elections
        </Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>ID</TableCell>
            <TableCell key={1} className={classes.tableCell}>Date</TableCell>
            <TableCell key={2} className={classes.tableCell}>Issuer</TableCell>
            <TableCell key={3} className={classes.tableCell}>Description</TableCell>
            <TableCell key={4} className={classes.tableCell}>Votes For</TableCell>
            <TableCell key={5} className={classes.tableCell}>Votes Against</TableCell>
            <TableCell key={6} className={classes.tableCell}>Absent</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {electionResults.map(er => (
            <>
              <TableRow key={er.contractId} className={classes.tableRow} onClick={openElectionResultDialog(er)} hover>
                <TableCell key={0} className={classes.tableCell}>{er.payload.id}</TableCell>
                <TableCell key={1} className={classes.tableCell}>{er.payload.date}</TableCell>
                <TableCell key={2} className={classes.tableCell}>{er.payload.issuer}</TableCell>
                <TableCell key={3} className={classes.tableCell}>{er.payload.description}</TableCell>
                <TableCell key={4} className={classes.tableCell}>{er.payload.votesFor}</TableCell>
                <TableCell key={5} className={classes.tableCell}>{er.payload.votesAgainst}</TableCell>
                <TableCell key={6} className={classes.tableCell}>{er.payload.absentee}</TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
      {electionResult && <ElectionResultDialog
        open={electionResultDialogOpen}
        title={`Election ${electionResult.payload.id} Result`}
        onClose={closeElectionResultDialog}
        election={electionResult.payload}
        filledOutBallots={filledOutBallots.filter(b => b.payload.electionId === electionResult.payload.id && b.payload.issuer === electionResult.payload.issuer && (b.payload.investor === party || !!b.payload.proxy))}
      />}
    </>
  )
}
