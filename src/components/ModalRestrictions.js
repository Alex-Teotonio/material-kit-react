import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import {Button, MenuItem, Select,Stack, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next'
import Modal from '@mui/material/Modal';

import propTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({isOpen, onRequestClose}) {

  const {t} = useTranslation()
  const [valueSelect, setValueSelect] = useState(0);
  const navigate = useNavigate();


  const handleAdvance = () => {
    navigate(`/dashboard/${valueSelect}`)
  }


  const handleCancel = () => {
    onRequestClose()
  }

  const handleChange = (event) => {
    setValueSelect(event.target.value);
  };
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onRequestClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" component="h3">
          {t('titleModalRestriction')}
          </Typography>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Categoria"
          value={valueSelect}
          onChange={handleChange}
          sx={{width: '100%'}}
        >
          <MenuItem value={0}>{t('headTableCategory')}</MenuItem>
          <MenuItem value='ca1'>Ca1</MenuItem>
          <MenuItem value='ca2'>Ca2</MenuItem>
          <MenuItem value='ca3'>Ca3</MenuItem>
          <MenuItem value='ca4'>Ca4</MenuItem>
          <MenuItem value='br1'>Br1</MenuItem>
          <MenuItem value='br2'>Br2</MenuItem>
          <MenuItem value='fa2'>Fa2</MenuItem>
          <MenuItem value='se1'>Se1</MenuItem>
        </Select>
        <Stack direction="row" alignItems='center' sx={{float:'right', marginRight: '3px', marginTop: '10px'}}>
          <Button variant='outlined' onClick={handleCancel} sx={{marginRight:'5px'}}>{t('buttonCancel')}</Button>
          <Button variant='outlined' onClick={handleAdvance}>{t('buttonAdvance')}</Button>
        </Stack>
        </Box>
      </Modal>
    </div>
  );
}

BasicModal.propTypes = {
  isOpen: propTypes.bool,
  onRequestClose: propTypes.func
}