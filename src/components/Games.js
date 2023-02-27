import { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Avatar,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableHead,
  Typography
} from '@mui/material';

import {SaveAlt as SaveAltIcon } from '@mui/icons-material'
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
    height: "50vh"
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
  },

  exportButton: {
    float: 'right',
    marginTop: '16px'
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

  const exportToExcel = (data, slots, teams) => {
    const worksheet = buildWorksheet(data, slots, teams);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelBuffer, 'table.xlsx');
  }
  
const buildWorksheet = (data) => {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Slot', 'Casa', '', 'Fora', 'Local'],
    ...data.map(d => [
      findSlots(d.slot),
      findTeams(d.home).name,
      'vs',
      findTeams(d.away).name,
      findTeams(d.home).venue,
    ]),
  ], {cellDates: false, sheetFormat: {baseColWidth: 20}});

  // Definir a altura da primeira linha do cabeçalho e deixar o texto em negrito
  const headerRow = 1;
  const headerStyle = { font: { bold: true } };
  worksheet['!rows'] = [{ hpt: 40, hpx: 40 }];
  worksheet[`A${headerRow}:E${headerRow}`].forEach((cell) => {
    cell.s = headerStyle;
  });

  // Inserir as imagens na planilha
  data.forEach((d, rowIndex) => {
    const homeTeam = findTeams(d.home);
    const img = new Image();
    img.src = homeTeam.url;
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const cellRef = XLSX.utils.encode_cell({r: rowIndex+1, c: 1}); // célula da coluna "Casa"
      XLSX.utils.sheet_add_image(worksheet, canvas, {tl: {col: 1, row: rowIndex+1}, br: {col: 2, row: rowIndex+2}}); // insere a imagem na planilha
      worksheet[cellRef].s = {alignment: {vertical: 'center', horizontal: 'left'}}; // alinha o texto à esquerda e centraliza verticalmente
    }
  });
  return worksheet;
}

  const saveAsExcelFile = (buffer, fileName) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleExport = () => {
    exportToExcel(data)
  }

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
   <Button
    variant="contained"
    startIcon={<SaveAltIcon />}
    onClick={handleExport}
    className={classes.exportButton}
  >
    Exportar para Excel
  </Button>
  </>
    
  )
}
Games.propTypes = {
  data: PropTypes.array,
  slots: PropTypes.array,
  teams: PropTypes.array
}