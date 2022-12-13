import { useState, useEffect, useContext } from 'react';
import {
  Button,
  Grid,
  Card,
  IconButton,
  Table,
  Stack,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
// @mui
// components
import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import Page from '../components/Page';
import SearchNotFound from '../components/SearchNotFound';
import Iconify from '../components/Iconify';
import Modal from '../components/Modal';
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import USERLIST from '../_mock/user';

import {LeagueContext} from '../hooks/useContextLeague';
import Form from '../components/FormLeague';

// sections
// ----------------------------------------------------------------------
import useTable from '../hooks/useTable';

export default function DashboardApp() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState(false);
  const [dataSelected, setDataSelected] = useState({})
  const { emptyRows, filterName, order, orderBy,isNotFound,  selected, handleClick, handleChangePage, handleChangeRowsPerPage, rowsPerPage, page} = useTable();
  const {leagues, handleLeague, deleteLeague} = useContext(LeagueContext)
  const {t} = useTranslation();

  const TABLE_HEAD = [
    { id: 'name', label: t('headTableName'), alignRight: false },
    { id: 'short', label: t('headTableShort'), alignRight: false },
    { id: 'teams', label: t('headTableNumberTeams'), alignRight: false },
    { id: 'actions', label: t('actions'), alignRight: false },
    { id: '' },
  ];


  useEffect(() => {
  },[]);

  const handleOpen = () =>  {
    setIsOpenModal(true);
  }

  const updateLeague = () => {
    handleLeague()
  }

  const handleChangeLeague = (row) => {
    setDataSelected(row)
    setIsOpenChangeModal(true)
  }

  const handleDeleteLeague = (idLeague) => {
    deleteLeague(idLeague)
  }
  const handleClose = () =>  {setIsOpenModal(false)}
  const handleCloseChangeModal = () =>  {setIsOpenChangeModal(false)}
  return (
    <Page title="Dashboard">
      <Container>
      <Modal titleModal="Edit League" descriptionModal="Edit your League" isOpen={isOpenChangeModal} onRequestClose={handleCloseChangeModal}>
        <Form onRequestClose={handleCloseChangeModal} onHandleLeague={() => {}} data={dataSelected}/>
      </Modal>
        <Stack direction="row"  justifyContent="space-between">
          <Typography variant="h4" sx={{ mb: 5 }}>
            {t('leagueDashboard')}
          </Typography>

          <Button 
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            sx={{padding:'4px', height: '40px'}}
            onClick={handleOpen}
          >
            {t('newInstaceLeague')}
          </Button>
        </Stack>
        <Modal titleModal={t('titleModalLeague')} descriptionModal= {t('descriptionModalLeague')} isOpen={isOpenModal} onRequestClose={handleClose}>
          <Form onRequestClose={handleClose} onHandleLeague={updateLeague}/>
        </Modal>
        <Grid container spacing={3} />

        <Card>
        <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                />
                <TableBody>
                  {leagues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, short, number_teams } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, row)} />
                        </TableCell>
                        <TableCell align="left">
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                        </TableCell>
                        <TableCell align="left">{short}</TableCell>
                        <TableCell align="left">{number_teams}</TableCell>

                        <TableCell align="center"> 
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <IconButton size='small' color="primary" onClick={() => handleDeleteLeague(row.id)}>
                              <DeleteOutlineOutlined/>
                            </IconButton>

                            <IconButton size='small' color="primary" onClick={() => handleChangeLeague(row)}>
                              <EditOutlined/>
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {leagues.length === 0  && isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
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
