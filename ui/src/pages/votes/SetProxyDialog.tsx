import React, { useState } from "react";
import Ledger, { CreateEvent } from "@daml/ledger";
import { useStreamQueries, useLedger, useParty } from "@daml/react";
import { ProxyRegistry } from "@daml.js/proxy-voting-0.0.1/lib/Vote";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import { CircularProgress } from "@material-ui/core";

export interface InputDialogProps<T extends {[key: string]: any }> {
  open : boolean
  title : string
  issuer : string
  onClose : () => void
  setProxy : (proxy: string) => void
}

export function SetProxyDialog<T extends { [key : string] : any }>(props : InputDialogProps<T>) {
  const [proxy, setProxy] = useState("")
  const { contracts: proxyRegistries, loading: proxiesLoading } = useStreamQueries(ProxyRegistry, () => [{issuer: props.issuer}], [props.issuer]);

  if (proxiesLoading) 
    return (
      <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )

  const proxyRegistry = proxyRegistries[0]
  if (!proxyRegistry || !proxyRegistry.payload.proxies.map.entriesArray().length)
    return (
      <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          No Proxies are available for {props.issuer}.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )


  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select below from a list of approved proxies for your {props.issuer} stock.
        </DialogContentText>
        <Select
          autoFocus
          margin="dense"
          id="proxy"
          label="proxy"
          type="text"
          value={proxy}
          onChange={(e) => setProxy(e.target.value as string)}
          required
          style={{width: 200}}
        >
          {proxyRegistry.payload.proxies.map.entriesArray().map(([p, _]) =>
            (<MenuItem key={p} value={p}>{p}</MenuItem>)
          )}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => props.setProxy(proxy)} color="primary" disabled={proxy === ""}>
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
}
