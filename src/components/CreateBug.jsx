import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export const CreateBug = () => {
  const URI = "http://localhost:8000/bugs/";

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    message: "",
    severity: "success",
  });
  const [open, setOpen] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await axios.get("http://localhost:8000/users/");
      setUsers(result.data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await axios.get("http://localhost:8000/projects/");
      setProjects(result.data);
    };
    fetchProjects();
  }, []);

  const createBug = async (e) => {
    e.preventDefault();
    if (!user || !projectId || !description) {
      setAlert({
        message: "Please fill in all fields",
        severity: "error",
      });
      setOpen(true);
      return;
    }
    await axios.post(URI, {
      user: user,
      projectId: projectId,
      description: description,
    })
    .then(response => {
      setAlert({
        message: "Bug created successfully",
        severity: "success",
      });
      setOpen(true);
      setUser("");
      setProjectId("");
      setDescription("");
      navigate("/");
    })
    .catch(error => {
      setAlert({
        message: error.response.data,
        severity: "error",
      });
      setOpen(true);
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-3xl font-bold">Create</h1>
      <FormControl sx={{
        width: "50%"
      }}>
        <form onSubmit={createBug}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="User"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                sx={{ margin: "20px 5px" }}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.name}>
                    {user.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="ProjectID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                sx={{ margin: "20px 5px" }}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.id}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Bug Description"
            id="fullWidth"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ margin: "20px 0" }}
          />
          <Link
            to={"/"}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-2 rounded"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Snackbar>
        </form>
      </FormControl>
    </Box>
  );
};
