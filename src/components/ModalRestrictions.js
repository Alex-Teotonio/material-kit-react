import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import {Button, MenuItem, Select,Stack, Typography} from '@mui/material';
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
          Selecione a categoria de restrição a adicionar:
          </Typography>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Categoria"
          value={valueSelect}
          onChange={handleChange}
          sx={{width: '100%'}}
        >
          <MenuItem value={0}>Categoria</MenuItem>
          <MenuItem value='ca1'>Ca1</MenuItem>
          <MenuItem value={10}>Ca2</MenuItem>
          <MenuItem value={20}>Ca3</MenuItem>
          <MenuItem value={30}>Ca4</MenuItem>
        </Select>
        <Stack direction="row" alignItems='center' sx={{float:'right', marginRight: '3px', marginTop: '10px'}}>
          <Button variant='outlined' onClick={handleCancel} sx={{marginRight:'5px'}}>Cancelar</Button>
          <Button variant='outlined' onClick={handleAdvance}>Avançar</Button>
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