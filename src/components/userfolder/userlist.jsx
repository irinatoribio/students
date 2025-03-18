import React, { useEffect, useState } from "react";
import "./userlist.css";
import { getAllUsers, deleteUser, updateUser } from "../../api/signup";
import Swal from "sweetalert2";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SubjectsList from "../subjects/subjects";

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (user) => {
    setSelectedUser(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setErrors({ name: "", email: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const validateInputs = () => {
    let newErrors = { name: "", email: "" };
    let isValid = true;

    if (!editedName.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!editedName.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (!nameRegex.test(editedName)) {
      newErrors.name = "Name should contain only letters and spaces";
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editedEmail.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(editedEmail)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    setErrors(newErrors);
    setIsButtonDisabled(!isValid);
    return isValid;
  };

  useEffect(() => {
    validateInputs();
  }, [editedName, editedEmail]);

  useEffect(() => {
    const hasChanges =
      editedName.trim() !== selectedUser?.name ||
      editedEmail.trim() !== selectedUser?.email;
    const isValid = validateInputs() && hasChanges;
    setIsButtonDisabled(!isValid);
  }, [editedName, editedEmail, selectedUser]);

  const handleUpdate = async () => {
    if (!selectedUser || isButtonDisabled) return;

    try {
      await updateUser(selectedUser.id, {
        name: editedName,
        email: editedEmail,
      });
      Swal.fire("Updated!", "User has been updated.", "success");
      fetchUsers();
    } catch (error) {
      Swal.fire("Error", "Failed to update user.", "error");
    }
    handleClose();
  };

  const handleDelete = async (id) => {
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
          await deleteUser(id);
          setUsers(users.filter((user) => user.id !== id));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error.response?.data);
          Swal.fire("Error", "Failed to delete user.", "error");
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
            <h1>Users Profile</h1>
            {loading ? (
              <p>
                <span>Loading users...</span>
              </p>
            ) : users.length > 0 ? (
              <table>
                <thead>
                  <tr colSpan="2" style={{ textAlign: "center" }}>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td
                        id="username"
                        onClick={() => {
                          Swal.fire({
                            title: `Manage User: ${user.name}`,
                            text: "Would you like to update or delete this user?",
                            icon: "question",
                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonText: "Update",
                            denyButtonText: "Delete",
                            cancelButtonText: "Cancel",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              handleOpen(user);
                            } else if (result.isDenied) {
                              handleDelete(user.id);
                            }
                          });
                        }}
                        style={{ cursor: "pointer", color: "blue" }}
                      >
                        {user.name}
                      </td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>
                <span>No users found.</span>
              </p>
            )}
          </div>
          <div className="subjecttable">
            <SubjectsList />
          </div>
        </div>
      </div>
      {/* MUI Modal */}
      <Modal open={open} onClose={() => {}}>
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
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit User: {selectedUser?.name}
          </Typography>
          <TextField
            fullWidth
            label="Name"
            value={editedName}
            onChange={(e) => {
              setEditedName(e.target.value);
              validateInputs();
            }}
            sx={{ mb: 2 }}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            label="Email"
            value={editedEmail}
            onChange={(e) => {
              setEditedEmail(e.target.value);
              validateInputs();
            }}
            sx={{ mb: 3 }}
            error={!!errors.email}
            helperText={errors.email}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={isButtonDisabled}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
export default UserProfile;
