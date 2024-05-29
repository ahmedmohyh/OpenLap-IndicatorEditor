import React from 'react';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function ModalMessage(props) {
  // Props
  const {
    openDialog=false,
    setOpenDialog,
    dialogTitle,
    dialogPrimaryContext,
    dialogSecondaryContext,
    primaryAction,
    primaryButton,
    secondaryAction,
    secondaryButton,
    tertiaryAction,
    tertiaryButton,
    disableOnClose
  } = props;

  return (
    <Dialog
      open={openDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={disableOnClose ? "" : () => setOpenDialog(!openDialog)}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>
        <Grid container direction="column">
          <Typography variant="h6"><b>{dialogTitle}</b></Typography>
        </Grid>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Box> {dialogPrimaryContext} </Box>
        </DialogContentText>
        <DialogContentText>
          <Box> {dialogSecondaryContext} </Box>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={tertiaryAction} size="large" color="inherit">
          {tertiaryButton}
        </Button>
        {secondaryButton ? <Button variant='outlined' onClick={secondaryAction}>
          {secondaryButton}
        </Button> : ""}
        {primaryButton === "error" || primaryButton === "remove" || primaryButton === "delete" || primaryButton === "reset" ? (
          <Button variant='contained' onClick={primaryAction}>
            {primaryButton}
          </Button>
        ) : <Button variant='contained' onClick={primaryAction} color="primary">
          {primaryButton}
        </Button>
        }
      </DialogActions>
    </Dialog>
  )
}

