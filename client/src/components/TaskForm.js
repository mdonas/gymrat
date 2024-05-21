import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function TaskForm() {
  const [task, setTask] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost/2000/ejercicios", {
      method: "POST",
      body: JSON.stringify(task),
    });

    const data = await res.json();
    console.log(data);
  };

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={3} sm={6} md={4} lg={3} xl={2}>
        <Card
          sx={{ mt: 5 }}
          style={{ backgroundColor: "#1e272e", padding: "1rem" }}
        >
          <Typography variant="5" textAlign={"center"} color={"white"}>
            Create a Task
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="filled"
                label="Write ur title"
                sx={{ display: "block", margin: ".5rem 0" }}
                onChange={handleChange}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              ></TextField>

              <TextField
                variant="filled"
                label="Write the desc"
                multiline
                sx={{ display: "block", margin: ".5rem 0" }}
                onChange={handleChange}
                rows={4}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              ></TextField>

              <Button variant="contained" type="submit">
                Save
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
