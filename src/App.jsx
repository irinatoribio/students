import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/loginfolder/loginform";
import SignUpForm from "./components/signupfolder/signupform";
import Home from "./components/homefolder/home";
import UserList from "./components/userfolder/userlist";
import UserSubject from "./components/usersubject/usersubject";
import UserDetails from "./components/usersubject/userdetails";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/usersubjects" element={<UserSubject />} />
          <Route path="/details/:userId" element={<UserDetails />} />
          <Route path="/home" element={<Home />} /> {/* Protected route */}
          <Route path="/" element={<Home />} /> {/* Default route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
