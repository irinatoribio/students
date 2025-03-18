import React, { useEffect, useState } from "react";
import {
  getUsersSubjects,
  assignSubjects,
  removeSubjects,
} from "../../api/userSubjects";
import { getAllSubjects } from "../../api/subjects";
import Swal from "sweetalert2";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CrossTable = () => {
  const [userSubjects, setUserSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subjects: [],
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userResponse, subjectResponse] = await Promise.all([
        getUsersSubjects(),
        getAllSubjects(),
      ]);
      setUserSubjects(userResponse.data.user || []);
      setSubjects(subjectResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateInputs();
  }, [formData]);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      subjects: user.subjects,
    });
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", subjects: [] });
    setErrors({});
  };

  const validateInputs = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (!nameRegex.test(formData.name))
      newErrors.name = "Only letters and spaces allowed";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";

    setErrors(newErrors);
    setIsButtonDisabled(Object.keys(newErrors).length > 0);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      await assignSubjects(selectedUser.id, {
        user: { ...formData, subjects: formData.subjects.map((s) => s.id) },
      });
      Swal.fire("Updated!", "User has been updated.", "success");
      fetchData();
      handleClose();
    } catch (error) {
      Swal.fire("Error", "Failed to update user.", "error");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeSubjects(userId);
          setUserSubjects((prev) => prev.filter((user) => user.id !== userId));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete user.", "error");
          console.error("Delete error:", error);
        }
      }
    });
  };

  return (
    <div className="usercontainer">
      <div className="userbackground"></div>
      <div className="usercontent">
        <div className="user">
          <div className="usertable">
            <h1>Data</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {userSubjects.length > 0 ? (
                    userSubjects.map((user) => (
                      <tr key={user.id}>
                        <td
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={() =>
                            Swal.fire({
                              title: `Manage User: ${user.name}`,
                              text: "Update, delete, or view details?",
                              icon: "question",
                              showDenyButton: true,
                              showCancelButton: true,
                              confirmButtonText: "Update",
                              denyButtonText: "Delete",
                              cancelButtonText: "Cancel",
                              preConfirm: () => handleOpen(user),
                              preDeny: () => handleDelete(user.id),
                            })
                          }
                        >
                          {user.name}
                        </td>
                        <td>{user.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selectedUser && (
        <Modal open={isModalOpen} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 5,
                right: 5,
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6">Edit User: {formData.name}</Typography>

            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              sx={{ mb: 3 }}
              error={!!errors.email}
              helperText={errors.email}
            />

            <Autocomplete
              multiple
              options={subjects}
              getOptionLabel={(option) => option.subject_name}
              value={formData.subjects}
              onChange={(event, newValue) =>
                setFormData({ ...formData, subjects: newValue })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subjects"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={isButtonDisabled}
              sx={{
                backgroundColor: isButtonDisabled ? "#ccc" : "#6A0DAD",
                "&:hover": {
                  backgroundColor: isButtonDisabled ? "#ccc" : "#5a0c9d",
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default CrossTable;
