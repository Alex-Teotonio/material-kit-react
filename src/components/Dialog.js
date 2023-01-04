import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import propTypes from 'prop-types'

export default function AlertDialog({open ,title,contentMessage, onClickAgree, onClickDisagree}) {

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClickDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {contentMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickDisagree}>Cancelar</Button>
          <Button onClick={onClickAgree} autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

AlertDialog.propTypes = {
  open: propTypes.bool,
  title: propTypes.string,
  contentMessage: propTypes.string,
  onClickAgree: propTypes.func,
  onClickDisagree: propTypes.func

}