import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import {Button, ButtonGroup, MenuItem,Paper,Select,Stack,Tooltip, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next'
import Modal from '@mui/material/Modal';

import propTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({isOpen, onRequestClose}) {
  
  const {t} = useTranslation();

  const capacityConstraintsDesc = {
    CA1: t('descriptionCA1'),
    CA2: t('descriptionCA2'),
    CA3: t('descriptionCA3'),
    CA4: t('descriptionCA4'),
  };
  
  const gameConstraintsDesc = {
    GA1: t('descriptionGA1')
  };
  
  const breakConstraintsDesc = {
    BR1: t('descriptionBR1'),
    BR2: t('descriptionBR2'),
  };
  
  const fairnessConstraintsDesc = {
    FA2: t('descriptionFA2'),
  };
  
  const separationConstraintsDesc = {
    SE1: t('descriptionSE1'),
  };
  const [valueSelect, setValueSelect] = useState(0);
  const navigate = useNavigate();


  const handleAdvance = (value) => {
    navigate(`/dashboard/${value}`)
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
        <Box sx={style} alignItems="center">
          <Typography id="modal-modal-title" sx={{color: '#1939B7', fontWeight: 'bold', marginBottom: '16px'}} component="h1" align='center'>
          {t('titleModalRestriction')}
          </Typography>

          <Paper elevation={3} square sx={{marginBottom: '20px'}}>
            <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
              <Button>Capacity Restricitions</Button>
            </ButtonGroup>
            <ButtonGroup fullWidth orientation="vertical" variant="outlined" sx={{color:"#2065D1"}}>
              <Button 
                sx={{textTransform: 'none'}}
                onClick={() => handleAdvance('ca1')}
                >`CA{capacityConstraintsDesc.CA1}`</Button>
              <Button sx={{textTransform: 'none'}} onClick={() => handleAdvance('ca2')} >{capacityConstraintsDesc.CA2}</Button>
              <Button sx={{textTransform: 'none'}} onClick={() => handleAdvance('ca3')} >{capacityConstraintsDesc.CA3}</Button>
              <Button sx={{textTransform: 'none'}} onClick={() => handleAdvance('ca4')} >{capacityConstraintsDesc.CA4}</Button>
            </ButtonGroup>
          </Paper>

          <Paper elevation={3} square sx={{marginBottom: '20px'}}>
          <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
              <Button >Game Restricition</Button>
          </ButtonGroup>
          <ButtonGroup fullWidth orientation="vertical">
            <Button onClick={() => handleAdvance('ga1')} >{gameConstraintsDesc.GA1}</Button>
          </ButtonGroup>
        </Paper>

        <Paper elevation={3} square sx={{marginBottom: '20px'}}>
          <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
              <Button>Break Restricitions</Button>
          </ButtonGroup>
          <ButtonGroup fullWidth orientation="vertical">
            <Button onClick={() => handleAdvance('br1')} >{breakConstraintsDesc.BR1}</Button>
            <Button onClick={() => handleAdvance('br2')} >{breakConstraintsDesc.BR2}</Button>
          </ButtonGroup>
        </Paper>

        <Paper elevation={3} square sx={{marginBottom: '20px'}}>
          <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
              <Button>Fairness Restricition</Button>
          </ButtonGroup>
          <ButtonGroup fullWidth orientation="vertical">
            <Button onClick={() => handleAdvance('fa2')} >{fairnessConstraintsDesc.FA2}</Button>
          </ButtonGroup>
        </Paper>

        <Paper elevation={3} square sx={{marginBottom: '20px'}}>
          <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
                <Button>Separation Restricition</Button>
            </ButtonGroup>
          <ButtonGroup fullWidth orientation="vertical">
            <Button onClick={() => handleAdvance('se1')} >{separationConstraintsDesc.SE1}</Button>
          </ButtonGroup>
        </Paper>

        {/* <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Categoria"
          value={valueSelect}
          onChange={handleChange}
          sx={{width: '100%'}}
        >
          <MenuItem value={0}>{t('headTableCategory')}</MenuItem>
            <MenuItem value='ca1'>
              <span>{capacityConstraintsDesc.CA1}</span>
            </MenuItem>
            <MenuItem value='ca2'>
              <span>{capacityConstraintsDesc.CA2}</span>
            </MenuItem>
            <MenuItem value='ca3'>
              <span>{capacityConstraintsDesc.CA3}</span>
            </MenuItem>
            <MenuItem value='ca4'>
              <span>{capacityConstraintsDesc.CA4}</span>
            </MenuItem>
            <MenuItem value='ga1'>
              <span>{gameConstraintsDesc.GA1}</span>
            </MenuItem>
            <MenuItem value='br1'>
              <span>{breakConstraintsDesc.BR1}</span>
            </MenuItem>
            <MenuItem value='br2'>
              <span>{breakConstraintsDesc.BR2}</span>
            </MenuItem>
            <MenuItem value='fa2'>
              <span>{fairnessConstraintsDesc.FA2}</span>
            </MenuItem>
            <MenuItem value='se1'>
            <Tooltip title={separationConstraintsDesc.SE1} placement="right">
            <span>{separationConstraintsDesc.SE1}</span>
            </Tooltip>
            </MenuItem>
        </Select> */} 
        {/* <Stack direction="row" alignItems='center' sx={{float:'right', marginRight: '3px', marginTop: '10px'}}>
          <Button variant='outlined' onClick={handleCancel} sx={{marginRight:'5px'}}>{t('buttonCancel')}</Button>
          <Button variant='outlined' onClick={handleAdvance}>{t('buttonAdvance')}</Button>
        </Stack> */}
        </Box>
      </Modal>
    </div>
  );
}

