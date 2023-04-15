import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

export const Dashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBugs, setFilteredBugs] = useState([]);
  const [alert, setAlert] = useState({
    message: "",
    severity: "success",
  });
  const [open, setOpen] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const showSnackbar = (message, severity) => {
    setAlert({ message, severity });
    setOpen(true);
  };

  const URI = "http://localhost:8000/bugs/";

  const getAllBugs = async () => {
    try {
      const res = await axios.get(URI);
      setBugs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBug = async (id) => {
    try {
      await axios.delete(`${URI}${id}`);
      await getAllBugs();
      showSnackbar("Bug successfully eliminated.", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Can't delete the bug.", "error");
    }
  };

  useEffect(() => {
    getAllBugs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBugs(bugs);
    } else {
      const filteredBugs = bugs.filter((bug) =>
        bug.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBugs(filteredBugs);
    }
  }, [bugs, searchTerm]);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = (id) => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async (id) => {
    await deleteBug(id);
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div>
        <input
          className="border border-solid outline-none p-2 mb-4 mt-3 ml-3"
          placeholder="Search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex justify-center">
        <Link
          to="/create"
          className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2 justify-end flex"
        >
          Insert Bug
        </Link>
      </div>
      {filteredBugs.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 18, fontWeight: 10 }}>
                  Bug Description
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 18, fontWeight: 10 }}>
                  Creation Date
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 18, fontWeight: 10 }}>
                  Bug ID
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 18, fontWeight: 10 }}>
                  Project ID
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 18, fontWeight: 10 }}>
                  User
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 18, fontWeight: 10 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBugs.map((bug) => (
                <TableRow
                  key={bug.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {bug.description}
                  </TableCell>
                  <TableCell align="center">{bug.creationDate}</TableCell>
                  <TableCell align="center">{bug.id}</TableCell>
                  <TableCell align="center">{bug.projectId}</TableCell>
                  <TableCell align="center">{bug.user}</TableCell>
                  <TableCell align="center">
                    <Link
                      to={`/edit/${bug.id}`}
                      className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded mx-1"
                    >
                      Edit
                    </Link>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDeleteClick(bug.id)}
                    >
                      Delete
                    </button>
                    {showConfirmation && (
                      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
                      <div className="bg-white p-8 rounded-lg">
                        <p className="text-lg font-medium mb-4">Are you sure want to delete this?</p>
                        <div className="flex justify-end">
                          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-4" onClick={handleCancelDelete}>
                            Cancel
                          </button>
                          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleConfirmDelete(bug.id)}>
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        "no hay bugs"
      )}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        TransitionComponent={Slide}
        sx={{ mb: 2 }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};
