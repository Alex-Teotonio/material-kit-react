import {useContext, useState} from 'react';
import propTypes from 'prop-types'
import { Box, Card, Container, Button, TextField, Stack } from '@mui/material';
import { t } from 'i18next';
import {put} from '../services/requests'
import AvatarUpload from './AvatarUpload';
import {LeagueContext} from '../hooks/useContextLeague'

export default function FormTeams({data, onRequestCloseModal, onHandleTeams}) {
    const [name, setName] = useState(data.name);
    const [initials, setInitials] = useState(data.initials);
    const [venue, setVenue] = useState(data.venue);
    const [image, setImage] = useState(data.url);

    const {setValueStatusSolution} = useContext(LeagueContext)

    const handleChangeTeam = async (e) => {
      try{
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
        setValueStatusSolution('outdated')
      } catch(e) {
        console.log(e)
      }

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
                <TextField label={t('headTableName')} value={name}  sx={{marginTop: '10px'}} onChange={(e)=> setName(e.target.value)}/>
              </Stack>
              <TextField label={t('headTableInitialsTeams')} value={initials}  sx={{marginTop: '10px'}} onChange={(e)=> setInitials(e.target.value)}/>
              <TextField label={t('headTableVenueTeams')} value={venue}  sx={{marginTop: '10px'}} onChange={(e)=> setVenue(e.target.value)}/>
              <Button type="submit" sx={{marginTop: '10px'}}>{t('buttonSave')}</Button>
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

