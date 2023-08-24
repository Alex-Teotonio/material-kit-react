import { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/styles";
import { useParams } from 'react-router-dom';
import {useTranslation} from 'react-i18next'
import {get} from '../services/requests';
import Loader from '../components/Loader';
import Games from '../components/Games'

import {delay} from '../utils/formatTime'

export default function Result() {

  const [file, setFile] = useState([]);
  const [teams, setTeams] = useState([])
  const [slots, setSlots] = useState([]);
  const [objective, setObjective] = useState(null)

  const {id} = useParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);
  const {t} = useTranslation(); 
  useEffect(() => {
    async function getSolution(){
      try{
        setIsLoading(true);
        await delay(700)

        const path = id? `/findSolutionById/${id}`: `findSolution/${currentLeague.id}`
        
        const response = await get(path);
        const solutions = response.Games;
        console.log(solutions)
        const dataTeams = await get(`/team/${currentLeague.id}`);
        console.log(dataTeams)
        const dataSlots = await get(`/slot/${currentLeague.id}`);
        setTeams(dataTeams);
        setSlots(dataSlots)

        const newSolution = solutions.map((s) => {
          const row = s.$;
          console.log(s )
          row.id = Math.floor(Math.random() * 500)
          return row
        })
        console.log(newSolution)
        setFile(newSolution)
      } catch(e) {
        setIsLoading(false);
      } finally {
        setIsLoading(false)
      }
    }
    getSolution();
  },[]);

  console.log(file)
  console.log(currentLeague)
  return (
    <>
        { file.length > 0 && (
        <>
          <Loader isLoading={isLoading}/>
          <Games data={file} slots={slots} teams={teams} />
        </>
        )
        }
    </>
  )

}