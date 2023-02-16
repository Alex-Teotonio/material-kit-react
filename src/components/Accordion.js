import { useState } from 'react';
import { ButtonGroup, Button, Popover, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';



export default function MyGrid() {

  const [anchorEl, setAnchorEl] = useState(null);
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    },
    {
      field: 'info',
      headerName: 'Information',
      renderCell: (params) => {
  
        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };
  
        const handleClose = () => {
          setAnchorEl(null);
        };
  
        const open = Boolean(anchorEl);
  
        return (
          <div>
            <ButtonGroup>
              <Button onClick={handleClick}>Info</Button>
              <Button>Details</Button>
            </ButtonGroup>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Typography>
                <ul>
                  {params.value.map((info, index) => (
                    <li key={index}>{info}</li>
                  ))}
                </ul>
              </Typography>
            </Popover>
          </div>
        );
      },
      width: 300,
    },
  ];
  
  const rows = [
    {
      id: 1,
      name: 'Item 1',
      info: ['Info 1', 'Info 2', 'Info 3'],
    },
    {
      id: 2,
      name: 'Item 2',
      info: ['Info 4', 'Info 5', 'Info 6'],
    },
    {
      id: 3,
      name: 'Item 3',
      info: ['Info 7', 'Info 8', 'Info 9'],
    },
  ];
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
    />
  );
}
