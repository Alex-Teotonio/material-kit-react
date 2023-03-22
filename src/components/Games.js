import { useState, useContext } from 'react';
import * as XLSX from 'xlsx';
import {
  Avatar,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FileCopyOutlined, InsertDriveFile, Search } from '@mui/icons-material';


import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/styles";
import { 
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  ptBR
} from '@mui/x-data-grid';
import { LeagueContext } from '../hooks/useContextLeague';

function CustomToolbar() {
  return (
    <GridToolbar>
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <TextField
          variant="standard"
          placeholder="Pesquisar"
          fullWidth
          InputProps={{
            startAdornment: <Search />,
          }}
        />
      </GridToolbarContainer>
    </GridToolbar>
  );
}
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

  const {teamColor, currentLanguage} = useContext(LeagueContext);
  console.log(currentLanguage)
  const [sortModel, setSortModel] = useState([
    { field: 'slot', sort: 'asc' },
  ]);
  const columns = [
    { field: 'slot', headerName: 'Slot', align: 'right', width: 280,headerAlign: 'right' },
    {
      field: 'home',
      headerName: 'Casa',
      align: 'right',
      headerAlign: 'right',
      width: 300,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <Typography>{findTeams(params.row.home).name}</Typography>
            <Avatar 
            style={{ backgroundColor: `${teamColor[findTeams(params.row.home).id]}` }}
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
      width: 90,
      renderCell: () => <Typography>vs</Typography>
    },
    {
      field: 'away',
      headerName: 'Fora',
      align: 'left',
      width: 300,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar 
            src={findTeams(params.row.away).url}
            style={{ backgroundColor: `${teamColor[findTeams(params.row.away).id]}` }}
            children={<small>{findTeams(params.row.away).initials}</small>} 
            key={findTeams(params.row.away).id}
          />
          <Typography>{findTeams(params.row.away).name}</Typography>
        </Stack>
      )
    },
    { field: 'venue', headerName: 'Local', align: 'left', width: 250 }
  ];
  
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const findTeams = (publicid) => {
    const team = teams.find((t) => t.publicid === (+publicid));

    return team
  }

  const findSlots = (publicid) => {
    const slot = slots.find((t) => t.publicid === (+publicid));

    return slot.name
  }
  const rows = data.map(d => ({
    id: d.id,
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

  // Definir a altura da primeira linha do cabeçalho e deixar o texto em negrito
  // const headerRow = 1;
  // const headerStyle = { font: { bold: true } };
  // worksheet['!rows'] = [{ hpt: 40, hpx: 40 }];
  // worksheet[`A${headerRow}:E${headerRow}`].forEach((cell) => {
  //   cell.s = headerStyle;
  // });

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
  return (
    <div style={{height: '650px'}}>
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
   <Button variant="contained"  startIcon={<InsertDriveFile/>} onClick={handleExport} sx={{position: 'fixed',right: '20px', bottom: '220px'}}>Exportar para Excel</Button>
  </div>
    
  )
}
Games.propTypes = {
  data: PropTypes.array,
  slots: PropTypes.array,
  teams: PropTypes.array
}