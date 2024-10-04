import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const columns = [
  { id: "username", label: "User Name", minWidth: 170 },
  { id: "reward", label: "Reward", minWidth: 100 },
  { id: "point", label: "Points", minWidth: 100 },
  { id: "fDate", label: "Date", minWidth: 170, align: "right" },
];

const History = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const createData = (data) => {
    return data.map(item => {
      const dateObject = new Date(item.createdAt);
      const day = String(dateObject.getDate()).padStart(2, "0");
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const year = dateObject.getFullYear();
      return {
        username: item.sender,
        reward: item.reward.name,
        point: item.reward.point,
        fDate: `${day}/${month}/${year}`
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        };
        const response = await axios.get(`${config.BACKEND_API}/agency/history`, { headers });
        const rowsData = createData(response.data.history);
        setData(rowsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      {data.length > 0 ? (
        <div>
          <Paper sx={{ width: "80%", overflow: "hidden", margin: "auto", marginTop: "3%", marginBottom: "10%" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.username}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return <TableCell key={column.id} align={column.align}>{value}</TableCell>;
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 50, 100]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default History;
