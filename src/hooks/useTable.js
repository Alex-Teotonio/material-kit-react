import {useState, useContext} from 'react';
import { filter } from 'lodash';
import USERLIST from '../_mock/user';
import { LeagueContext } from './useContextLeague';

export default function useTable() {

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterName, setFilterName] = useState('');
    const [filteredList, setFilterdList] = useState([]);
    const {leagues, saveCurrentLeague} = useContext(LeagueContext)

    const descendingComparator = (a, b, orderBy) =>  {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }
    
    const getComparator = (order, orderBy) => order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
    
    const applySortFilter = (array, comparator, query) => {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
      }
      return stabilizedThis.map((el) => el[0]);
    }

    const handleRequestSort = ( property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    const handleSelectAllClick = () => {
        if (event.target.checked) {
            const newSelecteds = USERLIST.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };


    const handleClick = (e, row) => {

        const selectedIndex = selected.indexOf(row.name);
        let newSelected = [];
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, row.name);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
        saveCurrentLeague(row)
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    const handleFilterByName = () => {
        setFilterName(event.target.value);
    };

    function createData( ){
      const filter = applySortFilter(leagues, getComparator(order, orderBy), filterName);
      setFilterdList(filter)   
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const isNotFound = filteredList.length === 0;
    return{createData,filterName, order, orderBy, handleRequestSort, page, handleSelectAllClick, handleClick, handleChangeRowsPerPage, handleChangePage, handleFilterByName, emptyRows,filteredList, isNotFound, rowsPerPage, selected}
}