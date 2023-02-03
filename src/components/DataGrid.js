import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import propTypes from 'prop-types';

export default function DataTable({columnData, rowsData, onHandleCheckbox, onHandleClickSelected, onHandleRowClick}) {

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rowsData}
        columns={columnData}
        pageSize={10}
        rowsPerPageOptions={[10]}
        autoPageSize
        disableSelectionOnClick
        onRowClick={onHandleRowClick}
        onSelectionModelChange={(ids) => {
          onHandleCheckbox(ids)
          onHandleClickSelected()
        }}
        checkboxSelection
      />
    </div>
  );
}

DataTable.propTypes = {
  columnData: propTypes.object,
  rowsData: propTypes.object,
  onHandleCheckbox: propTypes.func,
  onHandleClickSelected: propTypes.func,
  onHandleRowClick: propTypes.func
}

DataTable.defaultProps = {
  onHandleClickSelected: () => {}
}