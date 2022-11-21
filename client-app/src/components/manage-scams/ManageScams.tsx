import React, { useEffect } from 'react';
import Typography from "@mui/material/Typography";
import Container from '@mui/material/Container';
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { findScamList, removeScam, Scam, selectScam, updateScamStatus } from '../../store/scam.slice';
import { Link, useNavigate } from 'react-router-dom';
import { format, formatRelative, parseISO } from 'date-fns';

export default function ManageScams() {

  const state = useAppSelector(selectScam);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const rows = state.items;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  

  const handleDelete = (scam: Scam) => {
    dispatch(removeScam(scam.id));
  }

  const handleEdit = (scam: Scam) => {
    navigate(`/scams/edit/${scam.id}`)
  }

  const handleAcceptedRejected = (scam: Scam, active: boolean) => {
    const input = { approve: active };
    dispatch(updateScamStatus(scam.id, input));
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

  useEffect(() => {
    dispatch(findScamList(0, 0));
  }, [])


  return <Container sx={{ mt: 2 }}>
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Pseudonum Used</TableCell>
            <TableCell>Reported On</TableCell>
            <TableCell align="right">Approved</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => {
            return (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <Link to={`/scams/${row.id}`} style={{ color: '#d4445e' }} >
                    {row.id}                
                  </Link>
                </TableCell>
                <TableCell>
                  {row.userEmail}
                </TableCell>
                <TableCell>
                  {row.scamType}
                </TableCell>
                <TableCell>
                  {row.pseudonumUsed}
                </TableCell>
                <TableCell>
                  <Tooltip title={formatRelative(parseISO(row.createdAt), new Date())}>                
                    <span> { format( parseISO(row.createdAt), 'EEE, dd MMM yyyy') } </span>
                  </Tooltip>                  
                </TableCell>
                <TableCell align="right">
                  <Switch aria-label='active-inactive' checked={row.status == 'approved'} onChange={(_, checked) => handleAcceptedRejected(row, checked)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton aria-label="edit" onClick={() => handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(row)}>
                    <DeleteIcon />
                  </IconButton>
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