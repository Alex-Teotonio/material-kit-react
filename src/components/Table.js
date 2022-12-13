import React, { useState,useEffect} from "react";
import { makeStyles } from "@material-ui/styles";
import {Card, Avatar, Container,Stack,Table, TableBody, TableCell, TableHead, TableRow,Typography, IconButton, TableContainer, TablePagination} from '@mui/material';
import {EditOutlined } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import { loadTeams} from "../services/requests";
import Scrollbar from "./Scrollbar";
import Page from "./Page";
import Loader from "./Loader";
import Modal from './Modal';
import FormTeams from "./FormTeams";

import { delay } from '../utils/formatTime'

import useTable from '../hooks/useTable';



// Icons

const useStyles = makeStyles(() => ({
  root: {
    width: "70%",
    marginTop: 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  selectTableCell: {
    width: 60
  },
  tableCell: {
    width: 130,
    height: 40
  },
  input: {
    width: 130,
    height: 40
  }
}));

export default function TableEditable() {

  const {page, rowsPerPage, handleChangePage, handleChangeRowsPerPage} = useTable();
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState();
  const [teamSelected, setTeamSelected] = useState({});
  const [teams, setTeams] = React.useState([])
  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);

  
  const {t} = useTranslation()
  const classes = useStyles();

  useEffect(
    () => {
      async function loadData() {
        const data = await loadTeams(currentLeague.id);
        setTeams(data.map(row => (
          {...row, isEditMode: false}
        )))
      }
      loadData();
    }
  ,[currentLeague.id]);
  const handleClose = async() => {
    setIsOpenModal(false)
  }
  
  const updatedTeams = async () => {
    setIsLoading(true)
    await delay(500)
    const response = await loadTeams(currentLeague.id);
    setTeams(response);
    setIsLoading(false)
  };

  const handleClickModal = (row) => {
    const leagueId = row.league_id
    const {id, name, initials, venue, url} = row;
    setTeamSelected({id, name, leagueId, initials, venue, url})
    setIsOpenModal(true)
  }
  return (
    <Page >
      <Container>
      <Card>
      <Loader isLoading={isLoading}/>
      <Modal titleModal="Teams" descriptionModal="Edit Team" isOpen={isOpenModal} onRequestClose={handleClose}>
        <FormTeams data={teamSelected} onRequestCloseModal={handleClose} onHandleTeams={updatedTeams}/>
      </Modal>
        <Scrollbar>
        <TableContainer sx={{ minWidth: 800, maxWidth: 1024 }}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell align="lcentereft">
                {t('headTableNameTeams')}
              </TableCell>
              <TableCell align="left">{t('headTableInitialsTeams')}</TableCell>
              <TableCell align="left">{t('headTableVenueTeams')}</TableCell>
              <TableCell align="left">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { teams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow key={row.id}>
                <TableCell align="left" className={classes.tableCell}>
                <Stack direction="row" alignItems="center" spacing={2}>
                   <Avatar alt={row.name} src={row.url}/>
                   <Typography variant="subtitle2" noWrap>
                    {row.name}
                  </Typography>
                  </Stack>
                </TableCell>

              <TableCell align="left" className={classes.tableCell}>
                {row.initials}
              </TableCell>

              <TableCell align="left" className={classes.tableCell}>
                {row.venue}
              </TableCell>


              <TableCell className={classes.selectTableCell} sx={{minWidth: 120}}>
                  
                <IconButton
                  aria-label="delete"
                  onClick={() => handleClickModal(row)}
                >
                  <EditOutlined color="primary" />
                </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
        </Scrollbar>

        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={teams.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        </Container>
    </Page>
  );
}