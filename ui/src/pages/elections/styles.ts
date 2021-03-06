import { makeStyles, createStyles } from "@material-ui/styles";

export default makeStyles((theme : any) => createStyles({
  header: {
    flexGrow: 1,
    padding: 6
  },
  tableCell: {
    verticalAlign: "center",
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: "0.75rem"
  },
  tableCellButton: {
    verticalAlign: "center",
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: "0.75rem"
  },
  tableRow: {
    height: "auto"
  },
  textField: {
    fontSize: "0.75rem",
    width: "51%",
  },
  textFieldUnderline: {
    "&:before": {
      borderBottomColor: theme.palette.primary.light,
    },
    "&:after": {
      borderBottomColor: theme.palette.primary.main,
    },
    "&:hover:before": {
      borderBottomColor: `${theme.palette.primary.light} !important`,
    },
  },
  choiceButton: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  marginTop: {
    marginTop: 16,
  }
}));
