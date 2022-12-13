import * as React from 'react';
import {Button, TextField, Modal} from '@mui/material';

import FormSlots from './FormSlots';

import {style} from '../utils/styles'

export default function FormDialog({isOpenDialog, onRequestCloseDialog}) {
    const handleCloseDialog = () => {
        onRequestCloseDialog();
    }
  return (
    <>
        <FormSlots/>
    </>
  );
}