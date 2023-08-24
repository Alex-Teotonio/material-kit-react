import {useEffect, useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Avatar,
    AvatarGroup,
    Chip,
    Button,
    Dialog as MuiDialog,
    Tooltip,
    Paper,
    ButtonGroup
} from '@mui/material';
import {useTranslation} from 'react-i18next'
import {DeleteOutline, AddCircle,NotInterested} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import toast from '../utils/toast';
import DataGrid from '../components/DataGrid';
import {fDateTimeSuffix} from '../utils/formatTime'

import {get,loadTeams} from '../services/requests';
import Dialog from '../components/Dialog';


import { LeagueContext } from '../hooks/useContextLeague';

import Modal from '../components/ModalRestrictions';

export default function Restrictions() {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [newSelected, setNewSelected] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const {restrictions , loadRestrictions, deleteRestriction, teamColor, setTeamColor} = useContext(LeagueContext);
    const [teams, setTeams] =  useState([]);
    const [slots, setSlots] =  useState([]);
    const currentLeagueString = localStorage.getItem('myLeague');
    const currentLeague = JSON.parse(currentLeagueString);

    const theme = useTheme()
    useEffect(() => {
        const loadData = async () => {
          try {
            await loadRestrictions();
            const dataTeams = await loadTeams(currentLeague.id);
            const slots = await get(`/slot/${currentLeague.id}`);
            const colors = dataTeams.reduce((obj, team) => {
              obj[team.id] = setTeamColor(team);
              return obj;
            }, {});
            setTeams(dataTeams);
            setSlots(slots);
          } catch (error) {
            console.error(error);
          }
        };
        loadData();
      }, []);
      
    const handleClickButton = () => {
        setIsOpenModal(true)
    }
    const handleClick = (arrayRestrictions) => {
        setNewSelected(arrayRestrictions)
    }

    const renderSlots = (params) => (
      <div>
        {params?.row?.slots?.map((slot, index) => (
          <Tooltip title={slot} key={index}>
            <Chip
              size="small"
              label={slot}
              variant={slots.length === params.row.slots?.length ? 'default' : 'outlined'}
              style={{ margin: '2px' }}
            />
          </Tooltip>
        ))}
        {slots.length === params.row.slots?.length && (
          <Chip size="small" label="Todos" style={{ margin: '2px' }} />
        )}
      </div>
    );


    
    const columns = [
        { 
            field: 'type_constraint',
            headerName: t('headTableCategory'),
            width: 80,
            align: 'center',
            headerAlign: 'center',
            disableClickEventBubbling: true
        },
        { field: 'type', headerName: t('headTableType'), width: 70, align: 'center',headerAlign: 'center' },
        { field: 'penalty', headerName: t('headTablePenalty'), width: 90 , align: 'center',headerAlign: 'center'},
        { field: 'mode', headerName: t('headTableVenueTeams'), width: 90 , align: 'center',headerAlign: 'center'},
        { field: 'min', headerName: t('labelMin'), width: 100 , align: 'center',headerAlign: 'center'},
        { field: 'max', headerName: t('labelMax'), width: 100 , align: 'center',headerAlign: 'center'},
        { field: 'breaks', headerName: t('Max Breaks'), width: 100 , align: 'center',headerAlign: 'center'},
        { 
          field: 'teams', 
          headerName: t('headTableApply'), 
          width: 290,
          align: 'center',
          headerAlign: 'center',
          renderCell: (params) => (
            <AvatarGroup max={4}>
              {params.row?.teams?.map((t) => {
                const team = teams.find((te) => te.id === t)
                return(
                <Avatar
                    sizes="20"
                    // style={{ backgroundColor: `${teamColor[team?.id]}` }}
                    src={team?.url}
                    children={<small>{team?.initials}</small>} key={team?.id}
                />
              )})}
            </AvatarGroup>
          )
        },
        { 
          field: 'teams2', 
          headerName: t('headTableNameTeams2'),
          width: 240,
          align: 'center',
          headerAlign: 'center',
          renderCell: (params) => (
            <AvatarGroup max={4}>
              {params.row?.teams2?.map((t) => {
                const team = teams.find((te) => te.id === t)
                return(
                <Avatar
                    sizes="20"
                    // style={{ backgroundColor: `${teamColor[team?.id]}` }}
                    src={team?.url}
                    children={<small>{team?.initials}</small>} key={team?.id}
                />
              )})}
            </AvatarGroup>
          )
        },
        {
          field: 'meetings',
          headerName: t('headTableMeetings'),
          width: 250,
          align: 'center',
          headerAlign: 'center',
          renderCell: (params) => (
              <div>
                {params.row.meetings?.map((meeting) => (
                  <Chip key={params.row?.id} label={meeting} color="primary" />
                ))}
              </div>
            ),
        },
        { field: 'slots', headerName: t('headTableNameSlots'), width: 300, align: 'center', headerAlign: 'center', renderCell: renderSlots },
        // { field: 'criado_em',valueFormatter: (params) => fDateTimeSuffix(params.value), headerName: t('headTableCreated'), width: 180, headerAlign: 'center', align: 'center' }
    ];

    const handleClickButtonDelete = async () => {
        try {
            setOpenDialog(false)
            await deleteRestriction(newSelected);
            toast({
                type: 'success',
                text: 'Instância deletada com sucesso!'
            })
        }catch(e) {
            toast({
                type: 'error',
                text: 'Houve um erro durante a operação'
            })
        }
    }
    const handleDeleteLeague = () => {
        handleClickButtonDelete()
    }

    const handleClose = () => {
        setIsOpenModal(false)
    }
    const handleRowClick = (params) => {
        navigate(`/dashboard/${params.row.type_constraint.toLowerCase()}/${params.row.idconstraint}`)
    }
    return (
        <>
        <Paper elevation={3} square sx={{width: '100%', padding: '5px'}} >
          <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
            <Button startIcon={<NotInterested/>}>{t('headTableRestriction')}</Button>
          </ButtonGroup>
        <Modal isOpen={isOpenModal} onRequestClose={handleClose}/>
        <Dialog 
            open={openDialog}
            title="Alerta"
            contentMessage=' A instância será excluída permanentemente.Deseja continuar?'
            onClickAgree={handleDeleteLeague}
            onClickDisagree={() => setOpenDialog(false)}
        />
            <DataGrid
                columnData={columns}
                rowsData={restrictions}
                onHandleCheckbox={handleClick}
                onHandleRowClick={handleRowClick}
            />
            { newSelected.length > 0 && (
                <>
                <Button 
                    variant="contained"
                    sx={{
                        float: 'right',
                        margin: '10px',
                        height: '30px',
                        marginTop:'20px',
                        backgroundColor: theme.palette.error.main
                    }}
                    onClick={() => setOpenDialog(true)}
                    startIcon={<DeleteOutline/>}
                >
                    {t('buttonDelete')}
                </Button>
                </>
            )}
            <Button
                endIcon={<AddCircle/>}
                variant="contained" 
                sx=
                {{
                    marginTop:'20px',
                    height: '30px',
                    float: 'right',
                    marginRight: '4px'
                }}
                onClick={handleClickButton}
                disabled={newSelected.length > 0}
            >
                {t('buttonAdd')}
            </Button>
        </Paper>
    </>

    );
}