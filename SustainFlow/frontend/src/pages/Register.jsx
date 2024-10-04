import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { Select, MenuItem } from "@mui/material";
import config from "../config.js";
import { useAuth } from "../context/auth.jsx";

const defaultTheme = createTheme();

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  const { LogOut } = useAuth();

  const handlePasswordChange = (e) => {
    const input = e.target.value;
    setPasswordCheck(true);
    setPassword(input);
    if (input.length < 8) {
      setValidPassword(false);
      return;
    } else {
      setValidPassword(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setJustVerify(true);
  
    if (
      username === "" ||
      email === "" ||
      name === "" ||
      !validPassword ||
      password !== repassword ||
      role === ""
    ) {
      return;
    }
  
    setLoading(true);
    if (password === repassword) {
      await axios
        .post((config.BACKEND_API || "http://localhost:8000/api") + "/signup", { // Updated URL
          username: username,
          email: email,
          name: name,
          password: password,
          role: role,
        })
        .then((response) => {
          if (response.status === 201) {
            navigate("/login");
          }
        })
        .catch((error) => {
          setIsAlert(true);
          console.error("Error: ", error.response ? error.response.data : error.message); // Log the error
        });
    } else {
      setPassword("");
      setRePassword("");
      alert("Passwords do not match!");
    }
    setLoading(false);
  };
  
  return (
    <div className="my-glass-effect">
      <ThemeProvider theme={defaultTheme}>
        <Container
          component="main"
          maxWidth="sm"
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          <CssBaseline />
          <Box
            style={{
              backgroundColor: "#caf0f8",
              boxShadow: "0px 4px 8px #caf0f8",
            }}
            sx={{
              marginTop: 12,
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              borderRadius: "2em",
              padding: "3em",
              height: "auto",
            }}
          >
            <Avatar sx={{ m: 1 }} style={{ backgroundColor: "#25396F" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}
            >
              Create A New Account
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoFocus
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                  },
                }}
                error={justVerify && username === ""}
                helperText={
                  justVerify &&
                  (username === "" ? "This field cannot be empty." : "")
                }
                autoComplete="off"
              />
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                autoFocus
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                  },
                }}
                error={justVerify && name === ""}
                helperText={
                  justVerify && (name === "" ? "This field cannot be empty." : "")
                }
                autoComplete="off"
              />
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                  },
                }}
                error={justVerify && email === ""}
                helperText={
                  justVerify &&
                  (email === "" ? "This field cannot be empty." : "")
                }
                autoComplete="off"
              />

              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={handlePasswordChange}
                value={password}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                    color: !validPassword ? "#f44336" : "#25396F",
                  },
                }}
                error={justVerify && (!validPassword || password === "")}
                helperText={
                  justVerify &&
                  (password === ""
                    ? "This field cannot be empty."
                    : !validPassword
                    ? "The password must contain at least 8 characters."
                    : "")
                }
                autoComplete="off"
              />
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Confirm Password"
                type="password"
                onChange={(e) => {
                  setRePassword(e.target.value);
                }}
                value={repassword}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                  },
                }}
                error={justVerify && repassword === ""}
                helperText={
                  justVerify &&
                  (repassword === "" ? "This field cannot be empty." : "")
                }
                autoComplete="off"
              />

              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
                displayEmpty
                sx={{ mt: 2 }}
              >
                <MenuItem value="" disabled>
                  Select Role
                </MenuItem>
                <MenuItem value="compostAgency">Compost Agency</MenuItem>
                <MenuItem value="ngo">NGO</MenuItem>
                <MenuItem value="donor">Donor</MenuItem>
              </Select>

              {isAlert && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  An error occurred! Please try again.
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#25396F",
                  "&:hover": {
                    backgroundColor: "#102A43",
                  },
                }}
                disabled={loading}
              >
                {loading ? "Loading..." : "Sign Up"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    href="/login"
                    variant="body2"
                    sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}
                  >
                    Already have an account? Log in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
