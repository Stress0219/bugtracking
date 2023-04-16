import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

const URI = 'http://localhost:8000/bugs/'
const UsersURI = "http://localhost:8000/users/";
  const ProjectsURI = "http://localhost:8000/projects/";

export const EditBug = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [description, setDescription] = useState("")    
    const [projectId, setProjectId] = useState("")    
    const [user, setUser] = useState("")    
    const navigate = useNavigate()
    const {id} = useParams()

    useEffect(() => {
        const fetchUsers = async () => {
          const result = await axios.get(UsersURI);
          setUsers(result.data);
        };
        fetchUsers();
      }, []);
    
      useEffect(() => {
        const fetchProjects = async () => {
          const result = await axios.get(ProjectsURI);
          setProjects(result.data);
        };
        fetchProjects();
      }, []);


    const update = async (e) => {
        e.preventDefault()
        await axios.put(URI+id, {
            description: description,
            projectId: projectId,
            user:user
        })
        navigate('/')
    }

    useEffect(() => {
        getBugById()
      }, [])


      const getBugById = async () => {
        const res = await axios.get(URI + id);
        const data = res.data;
        const bug = data[0];
        setDescription(bug.description || "");
        setProjectId(bug.projectId || "");
        setUser(bug.user || "");
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
        <h1 className="text-3xl font-bold">Update</h1>
        <FormControl sx={{
          width: "50%"
        }}>
          <form onSubmit={ update }>
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
          </form>
        </FormControl>
      </Box>
    );
  };