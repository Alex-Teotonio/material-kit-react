import {useState} from 'react';
import propTypes from 'prop-types'
import { Box, Card, Container, Button, TextField, Stack } from '@mui/material';

import api from '../services/api';
import {put} from '../services/requests'
import AvatarUpload from './AvatarUpload';

export default function FormTeams({data, onRequestCloseModal, onHandleTeams}) {
    const [name, setName] = useState(data.name);
    const [initials, setInitials] = useState(data.initials);
    const [venue, setVenue] = useState(data.venue);
    const [file, setFile] = useState(data.url);
    const [image, setImage] = useState(data.url);

    const handleChangeTeam = async (e) => {
      e.preventDefault();

      const {leagueId} = data;
      const {id} = data;


      const formData = new FormData()
      formData.append("name",name);
      formData.append("leagueId",leagueId);
      formData.append("venue",venue);
      formData.append("initials",initials);
      if(image !== data.url) formData.append("file", image);
      
      await put(`/team/${id}`, formData);
      onHandleTeams();
      onRequestCloseModal();
    }

    const handleOnChange = (event) => {

      const newImage = event.target?.files?.[0];
  
      if (newImage) {
        setImage(newImage);
      }
    };


    return (
      <Container sx={{display: 'flex'}} >
        <Card sx = {{padding: '25px 25px', width:"1024px"}}>
          <Box sx={{display: 'flex', flexDirection: 'column'}} component="form" onSubmit={handleChangeTeam} >
              <Stack direction="column">
                <AvatarUpload changeImage={(e) => handleOnChange(e)} url={data.url}/>
                <TextField label="Name" value={name}  sx={{marginTop: '10px'}} onChange={(e)=> setName(e.target.value)}/>
              </Stack>
              <TextField label="Initials" value={initials}  sx={{marginTop: '10px'}} onChange={(e)=> setInitials(e.target.value)}/>
              <TextField label="Venue" value={venue}  sx={{marginTop: '10px'}} onChange={(e)=> setVenue(e.target.value)}/>
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

