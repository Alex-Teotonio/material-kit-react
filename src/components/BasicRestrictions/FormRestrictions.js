
import {useState, useEffect} from 'react'
import { makeStyles } from "@material-ui/styles";
import {Button, Card, CardContent, Divider, Grid, Stack, Slider, Typography} from '@mui/material';
import { PropTypes } from 'prop-types';
import {SaveAs, DoubleArrow} from '@mui/icons-material';
import {get} from '../../services/requests';

import Input from '../Input';
import RadioGroup from '../RadioGroup';
import AppBar from '../AppBar';
import MultipleSelectChip from '../MultSelect';

import ContainerInline from './Utilities'

const useStyle = makeStyles(() => ({
 root: {
  '& .MuiFormControl-root': {
    width: '70%',
    margin: '8px',

    '& .MuiFormLabel-root': {
      fontSize: '12px'
    }
  }
 }
}))

export default function FormRestrictions(props) {
  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);
  const [teams, setTeams] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    async function loadTeams() {
      const response = await get(`/team/${currentLeague.id}`);
      const responseSlots = await get(`/slot/${currentLeague.id}`);
      setTeams(response);
      setSlots(responseSlots)
    }
    loadTeams()
  },[])
  const {initialValues, handleChangeValues, itemsRadioType, itemsRadioMode, handleChangeMultipleValues, onHandleSubmit } = props;

  const handleInputChange = (e) => {console.log(e)

    const {name, value } = e.target;
    handleChangeValues(name, value)
    setValues({
      ...values,
      [name]: value
    })
  }

  const handleInputChangeMultSelect = (e,newTeamValue , name) => {
    setValues({
      ...values,
      [name]: newTeamValue
    });
    handleChangeMultipleValues(e,newTeamValue, name)
  }

  const handleSubmit = (e) =>  {
    e.preventDefault()
    onHandleSubmit();
  }

  const [values, setValues] = useState(initialValues);
  const classes = useStyle();
  return (
    <>
    <Card>
      <AppBar titleAppBar={`Category - ${values.typeRestriction}`} sx={{textAlign: 'center'}}/>

      <CardContent>
        <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid container  direction="row" item spacing={1} sm={12} md={6} >

                  <Stack direction='row' spacing={1}>
                    <Input value={values.max}
                      onChange={handleInputChange}
                      name="max"
                      label="Max"
                      type="number"
                    />
                    { (Boolean(values.min) || values.min >=0) && (
                      <Input value={values.min}
                        onChange={handleInputChange}
                        name="min"
                        label="Min"
                        type="number"
                      />

                    )}
                  </Stack>
                  <RadioGroup
                    name="type"
                    label="Type"
                    value={values.type}
                    onChange={handleInputChange}
                    items={itemsRadioType}
                  />

                  <RadioGroup
                    name="mode"
                    label="Mode"
                    value={values.mode}
                    onChange={handleInputChange}
                    items={itemsRadioMode}
                  />
                  <Slider
                   sx={{width:'70%' , marginLeft: '10px'}}
                   name="penalty"
                   value={values.penalty}
                   onChange={handleInputChange}
                  >
                    Penalty
                  </Slider>
              </Grid>
                {/* <Divider orientation="vertical" flexItem sx={{color:'red'}}/> */}
              <Grid item xs={6}>
                {(Boolean(values.slots)) && (
                  <ContainerInline>
                  <MultipleSelectChip 
                    dataMultSelect={slots}
                    valueMultSelect={values.slots}
                    name="slots"
                    labelMultSelect="Intervalo de tempo"
                    placeholderMultSelect=""
                    onHandleChange={handleInputChangeMultSelect}
                  />
                </ContainerInline>
                )}
                {(Boolean(values.teamsSelected)) && (
                <ContainerInline>
                  <MultipleSelectChip 
                    dataMultSelect={teams}
                    valueMultSelect={values.teamsSelected}
                    name="teamsSelected"
                    labelMultSelect="Teams"
                    placeholderMultSelect=""
                    onHandleChange={handleInputChangeMultSelect}
                  />
                </ContainerInline>
                )}     

              {(Boolean(values.teams2Selected)) && (
                <ContainerInline>
                  <MultipleSelectChip 
                    dataMultSelect={teams}
                    valueMultSelect={values.teams2Selected}
                    name="teams2Selected"
                    labelMultSelect="Teams - Gp2"
                    placeholderMultSelect=""
                    onHandleChange={handleInputChangeMultSelect}
                  />
                </ContainerInline>
                )}
              </Grid>


              <Button 
                  startIcon={<SaveAs/>}
                  sx={{
                    width: '15%',
                    marginTop: '50px',
                    bottom:'15px',
                    position: 'relative',
                    float: 'right'
                  }}
                  variant="outlined"
                  type="submit" >Salvar</Button>
            </Grid>
        </form>
      </CardContent>
    </Card>
    </>
  )
}

