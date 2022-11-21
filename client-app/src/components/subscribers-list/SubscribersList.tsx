import React, { useEffect } from 'react';
import Container from "@mui/material/Container";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteSubscription, getSubscriptions, selectScam } from "../../store/scam.slice";
import { Subscription } from '../../services/scam.service';


export default function SubscribersList() {

  const state = useAppSelector(selectScam);
  const dispatch = useAppDispatch();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const rows = state.subscriptions;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  

  useEffect(() => {
    // on page init call get users api
    dispatch(getSubscriptions());
  }, []);

  const handleDelete = (subscription: Subscription) => {
    dispatch(deleteSubscription(subscription.id));
  }


  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };  

  return <Container sx={{ mt: 2 }}>

    <Backdrop
      sx={{ color: '#fff', zIndex: 10 }}
      open={ state.loading }
    >
      <CircularProgress color="primary" />
    </Backdrop>


    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Registered</TableCell>
            <TableCell>FullName</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.email}
              </TableCell>
              <TableCell>
                {row.user ? <Chip label="Yes" color="success" variant="outlined" />: <Chip label="No" color="error" variant="outlined" /> }
              </TableCell>
              <TableCell>
                {row.user && row.user.fullName || 'Na'}
              </TableCell>
              <TableCell align="right">
                <IconButton aria-label="delete" onClick={() => handleDelete(row)} >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>


  </Container>
}