import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { userSubjects, assignSubjects } from "../../api/userSubjects";
import { getAllSubjects } from "../../api/subjects";
import "./userdetail.css";
import { Details } from "@mui/icons-material";

const UserDetails = () => {
  const { userId } = useParams();

  const [selectedUser, setSelectedUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedUserSubjects, setEditedUserSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
      fetchSubjects();
    }
  }, [userId]);

  const fetchUser = async (id) => {
    try {
      const response = await userSubjects(id);
      if (response.data) {
        setSelectedUser(response.data.user);
        setEditedName(response.data.user.name);
        setEditedEmail(response.data.user.email);
        setEditedUserSubjects(response.data.user.subjects || []);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getAllSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error.response?.data);
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser?.id) return;
    try {
      const payload = {
        name: editedName,
        email: editedEmail,
        subjects: editedUserSubjects.map((sub) => sub.id),
      };
      await assignSubjects(selectedUser.id, { user: payload });
      Swal.fire("Updated!", "User has been updated.", "success");
      fetchUser(selectedUser.id);
    } catch (error) {
      Swal.fire("Error", "Failed to update user.", "error");
    }
  };

  if (!selectedUser) return <Typography>Loading user details...</Typography>;

  return (
    <div className="usercontainer">
      <div className="userbackground"></div>
      <div className="usercontent">
        <div className="userdetail">
          <Box>
            <h1>User Details</h1>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Student Name: {selectedUser.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Email: {editedEmail}
            </Typography>

            <Autocomplete
              multiple
              options={subjects}
              getOptionLabel={(option) => option.subject_name}
              value={editedUserSubjects}
              onChange={(event, newValue) => {
                const uniqueSubjects = Array.from(
                  new Set(newValue.map((sub) => sub.id))
                ).map((id) => newValue.find((sub) => sub.id === id));
                setEditedUserSubjects(uniqueSubjects);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subjects"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
              disableClearable
            />

            {editedUserSubjects.length > 0 && (
              <Box className="details">
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Assigned Subjects:
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject Name</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {editedUserSubjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell>{subject.subject_name}</TableCell>
                          <TableCell>{subject.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              fullWidth
              sx={{ mb: 2, backgroundColor: "#6A0DAD" }}
            >
              Save Changes
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
