import { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import {
  Avatar,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { FileCopyOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import { 
  DataGrid,
  ptBR
} from '@mui/x-data-grid';
import AppBar from "./AppBar";
import { LeagueContext } from '../hooks/useContextLeague';

export default function Games({data, slots, teams}) {
  const {t} = useTranslation();
  console.log(data)
  const {currentLanguage} = useContext(LeagueContext);

  const [sortModel, setSortModel] = useState([
    { field: 'slot', sort: 'asc' },
  ]);
  const columns = [
    { field: 'slot', headerName: t('headTableNameSlots'), align: 'right', width: 100,headerAlign: 'right' },
    {
      field: 'home',
      headerName: t('valueLabelHome'),
      align: 'right',
      headerAlign: 'right',
      width: 400,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <Typography>{findTeams(params.row.home).name}</Typography>
            <Avatar 
            // style={{ backgroundColor: `${teamColor[findTeams(params.row.home).id]}` }}
            src={findTeams(params.row.home).url}
            children={<small>{findTeams(params.row.home).initials}</small>} 
            key={findTeams(params.row.home).id}
          />
        </Stack>
        )
    },
    {
      field: 'vs',
      headerName: '',
      align: 'center',
      width: 80,
      renderCell: () => <Typography>vs</Typography>
    },
    {
      field: 'away',
      headerName: t('valueLabelAway'),
      align: 'left',
      width: 300,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar 
            src={findTeams(params.row.away).url}
            // style={findTeams(params.row.away).url ? {} : { backgroundColor: `${teamColor[findTeams(params.row.away).id]}` }}
            children={<small>{findTeams(params.row.away).initials}</small>} 
            key={findTeams(params.row.away).id}
          />
          <Typography>{findTeams(params.row.away).name}</Typography>
        </Stack>
      )
    },
    { field: 'venue', headerName: t('headTableVenueTeams'), align: 'left', width: 300 }
  ];
  const findTeams = (publicid) => {
    const team = teams.find((t) => t.publicid === (+publicid));
    return team
  }

  const findSlots = (publicid) => {
    const slot = slots.find((t) => t.publicid === (+publicid));
    return slot.name
  }
  const rows = data.map(d => ({
    id: `${d.id}-${uuidv4()}-${d.home}-${d.away}`,
    slot: findSlots(d.slot),
    home: d.home,
    vs: 'vs',
    away: d.away,
    venue: findTeams(d.home).venue
  }));
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

  console.log(data)
  return (
    <>
    
      <Paper elevation={3} square sx={{width: '100%'}} >
        <AppBar titleAppBar={t('labelGames')}/>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          autoPageSize
          autoHeight
          disable
          sortModel={sortModel}
          localeText={currentLanguage.value === 'ptBR' ? ptBR.components.MuiDataGrid.defaultProps.localeText : undefined}
          onSortModelChange={(model) => setSortModel(model)}
        />
      </Paper>
      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 6 }}>
        <Button variant="contained" startIcon={<FileCopyOutlined />} onClick={handleExport}>
          {t('buttonExportXls')}
        </Button>
      </Stack>
  </>
  )
}
Games.propTypes = {
  data: PropTypes.array,
  slots: PropTypes.array,
  teams: PropTypes.array,
}