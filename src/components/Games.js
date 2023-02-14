import { useState } from 'react';
import {Avatar,Stack,Table,TableBody, TableCell, TablePagination, TableRow, TableHead,Typography  } from '@mui/material';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  tableContainer: {
    maxWidth: "100vh",
    margin: "auto",
    marginTop: "15vh",
    height: "70vh",
    background: "#ccffff",
    borderWidth: 2,
    borderColor: "black",
    borderStyle: "solid",
    borderCollapse: 'separate'
  },
  table: {
    height: "70vh"
  },
  center: {
    textAlign: 'center'
  },
  left: {
    textAlign: 'left'
  },
  right: {
    textAlign: 'right'
  },
  tableCell: {
    border: "5px solid rgba(241,243,244,1)",
  }
}));

export default function Games({data, slots, teams}) {

  const columns = [
    {id: 'sl', name: 'Slot', align: 'right'},
    {id: 'vs', name: 'Casa', align: 'right'},
    {id: '', name: ' ', align: 'center', display: 'none'},
    {id: 'vt', name: 'Fora', align: 'left'},
    {id: 'lo', name: 'Local', align: 'left'},

  ]
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const classes = useStyles();
  const findTeams = (publicid) => {
    const team = teams.find((t) => t.publicid === (+publicid));

    return team
  }

  const findSlots = (publicid) => {
    const slot = slots.find((t) => t.publicid === (+publicid));

    return slot.name
  }
  return (
    <>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {
            columns.map((c) => <TableCell className={classes.tableCell} sx={{textAlign: c.align}} key={c.id}>{c.name}</TableCell>)
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((d) => (
            <TableRow key={d.id}>
              <TableCell className={classes.tableCell} sx={{textAlign: 'right'}}>
                <Typography>{findSlots(d.slot)}</Typography>
              </TableCell>
              <TableCell className={classes.tableCell} sx={{textAlign: 'right'}}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                  <Avatar src={findTeams(d.home).url} />
                  <Typography>{findTeams(d.home).name}</Typography>
                </Stack>
              </TableCell>
              <TableCell className={classes.tableCell} sx={{textAlign: 'center'}}>
                <Typography>vs</Typography>
              </TableCell>
              <TableCell className={classes.tableCell} sx={{textAlign: 'left'}}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar src={findTeams(d.away).url} />
                  <Typography>{findTeams(d.away).name}</Typography>
                </Stack>
              </TableCell>
                
              <TableCell className={classes.tableCell} sx={{textAlign: 'left'}} >
                <Typography>{findTeams(d.home).venue}</Typography>
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
    <TablePagination
    rowsPerPageOptions={[5, 10, 25]}
    component="div"
    count={data.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />
  </>
    
  )
}
Games.propTypes = {
  data: PropTypes.array,
  slots: PropTypes.array,
  teams: PropTypes.array
}