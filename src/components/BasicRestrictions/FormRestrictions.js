
import {useState, useEffect} from 'react'
import { makeStyles } from "@material-ui/styles";
import {Box, Button, Card, CardContent, Divider, Grid, Slider, Stack} from '@mui/material';

import { PropTypes } from 'prop-types';
import {SaveAs, Send} from '@mui/icons-material';
import SliderCustom from "../Slider";
import {get} from '../../services/requests';

import Input from '../Input';
import RadioGroup from '../RadioGroup';
import RadioGroupCustomize from '../RadioGroupCustomize';
import AppBar from '../AppBar';
import MultipleSelectChip from '../MultSelect';

import ContainerInline from './Utilities'

const useStyle = makeStyles(() => ({
 root: {
  '& .MuiFormControl-root': {
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

  const {
    initialValues,
    handleChangeValues,
    itemsRadioType,
    itemsRadioMode,
    handleChangeMultipleValues,
    onHandleSubmit,
    labelButton
  } = props;


  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    async function loadTeams() {
      const response = await get(`/team/${currentLeague.id}`);
      const responseSlots = await get(`/slot/${currentLeague.id}`);
      setTeams(response);
      setSlots(responseSlots)
    }
    loadTeams()
  },[])
  const handleInputChange = (e) => {

    const {name, value } = e.target;
    handleChangeValues(name, value)
    setValues({
      ...values,
      [name]: value
    })
  }

  const handleClickSelectAll = (name) => {
    const renderValues = {'teamsSelected': teams,'teams2Selected': teams, 'slots':slots}
    const selectAll = renderValues[name]
    setValues({
      ...values,
      [name]: selectAll
    })
    handleChangeMultipleValues(null,selectAll, name)
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

  const classes = useStyle();
  return (
    <>
    <Card>
      <AppBar titleAppBar={`Category - ${values.typeRestriction}`} sx={{textAlign: 'center'}}/>

      <CardContent>
        <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container>
              <Grid container item>
                <Grid item xs={6}>
                    <Input value={values.max}
                      onChange={handleInputChange}
                      name="max"
                      disabled={!values.max && values.max !== 0}
                      label="Max"
                      type="number"
                    />
                    <Input value={values.min}
                      onChange={handleInputChange}
                      disabled={!values.min && values.min !== 0}
                      name="min"
                      label="Min"
                      type="number"
                    />
                    <Input value={values.intp}
                      onChange={handleInputChange}
                      disabled={!values.intp && values.intp !== 0}
                      name="intp"
                      label="Intp"
                      type="number"
                    />
                </Grid>
              <Grid item xs={6}>
                <ContainerInline onHandleClick={handleClickSelectAll} name="teamsSelected">
                  <MultipleSelectChip 
                    dataMultSelect={teams}
                    valueMultSelect={values.teamsSelected}
                    disabled={!values.teamsSelected}
                    name="teamsSelected"
                    labelMultSelect="Teams"
                    placeholderMultSelect=""
                    onHandleChange={handleInputChangeMultSelect}
                  />
                </ContainerInline>
              </Grid>
              </Grid>
   
            <Grid container item>              
            <Grid item xs={6}>
                  {/* <RadioGroup
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
                  /> */}
                  <Stack direction="row" divider={<Divider sx={{marginLeft: '35px', marginRight: '50px'}} orientation="vertical" flexItem />} sx={{marginTop: 2}}>
                    <RadioGroupCustomize 
                      name="type"
                      label="Type"
                      value={values.type}
                      onChange={handleInputChange}
                      items={itemsRadioType}
                    />
                    <RadioGroupCustomize
                      name="mode"
                      label="Mode"
                      value={values.mode}
                      onChange={handleInputChange}
                      items={itemsRadioMode}
                    />
                  </Stack>
                </Grid>
              <Grid item xs={6}>
                  <ContainerInline onHandleClick={handleClickSelectAll} name="slots">
                  <MultipleSelectChip 
                    dataMultSelect={slots}
                    valueMultSelect={values.slots}
                    disabled={!values.slots}
                    name="slots"
                    labelMultSelect="Intervalo de tempo"
                    placeholderMultSelect=""
                    onHandleChange={handleInputChangeMultSelect}
                  />
                </ContainerInline>
              </Grid>


            </Grid>
            <Grid container item>
              <Grid item xs={6}>
                <SliderCustom
                  name="penalty"
                  value={values.penalty}
                  onChange={handleInputChange}
                />
                {/* <Slider
                  name="penalty"
                  value={values.penalty}
                  onChange={handleInputChange}
                >
                  Penalty
                </Slider> */}
              </Grid>
              <Grid item xs={6}>
              <ContainerInline onHandleClick={handleClickSelectAll} name="teams2Selected">
                  <MultipleSelectChip 
                    dataMultSelect={teams}
                    disabled={!values.teams2Selected}
                    valueMultSelect={values.teams2Selected}
                    name="teams2Selected"
                    labelMultSelect="Teams - Gp2"
                    placeholderMultSelect=""
                    onHandleChange={handleInputChangeMultSelect}
                  />
                </ContainerInline>
              </Grid>
            </Grid>
          <Grid />
        </Grid>

        <Box sx={{ marginTop: '50px',right: '15px', float: 'right', bottom: '25px', position:'relative'}} >
          <Button 
            endIcon={<Send/>}
            variant="contained"
            type="submit" >
              {labelButton}
          </Button>
        </Box>
      </form>
    </CardContent>
  </Card>
  </>
  )
}

FormRestrictions.propTypes = {
    initialValues: PropTypes.array,
    handleChangeValues: PropTypes.func,
    itemsRadioType: PropTypes.array,
    itemsRadioMode: PropTypes.array,
    handleChangeMultipleValues:PropTypes.func,
    onHandleSubmit:PropTypes.func,
    labelButton: PropTypes.string
}

FormRestrictions.defaultProps = {
  labelButton: 'Cadastrar'
}