import {useState} from 'react';
import propTypes from 'prop-types'
import { Box, Card, Container, Button, TextField} from '@mui/material';

import api from '../services/api';

export default function FormTeams({data, onRequestCloseModal, onHandleTeams}) {

    const [name, setName] = useState(data.name);
    const [initials, setInitials] = useState(data.initials);
    const [venue, setVenue] = useState(data.venue);
    const [file, setFile] = useState(data.url);

    const handleChangeTeam = async (e) => {
      e.preventDefault();

      const {leagueId} = data;
      const {id} = data;

      const formData = new FormData()
      formData.append("name",name);
      formData.append("leagueId",leagueId);
      formData.append("venue",venue);
      formData.append("initials",initials);
      formData.append("file", file)
      
      await api.put(`/team/${id}`, formData);
      onHandleTeams();
      onRequestCloseModal();
    }

    return (
      <Container sx={{display: 'flex'}} >
        <Card sx = {{padding: '25px 25px', width:"1024px"}}>
          <Box sx={{display: 'flex', flexDirection: 'column'}} component="form" onSubmit={handleChangeTeam} >
              <TextField label="Name" value={name}  sx={{marginTop: '10px'}} onChange={(e)=> setName(e.target.value)}/>
              <TextField label="Initials" value={initials}  sx={{marginTop: '10px'}} onChange={(e)=> setInitials(e.target.value)}/>
              <TextField label="Venue" value={venue}  sx={{marginTop: '10px'}} onChange={(e)=> setVenue(e.target.value)}/>
              <Button variant="contained" component="label" sx={{marginTop: '10px'}}>Upload File
                <input
                  type="file"
                  accept='image/*'
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Button>
              <Button type="submit" sx={{marginTop: '10px'}}>Update</Button>
          </Box>
        </Card>
      </Container>           

    )
}

FormTeams.propTypes = {
  onRequestCloseModal: propTypes.func,
  data: propTypes.object.isRequired,
  onHandleTeams: propTypes.func,
}

