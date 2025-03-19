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
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [editedName, setEditedName] = useState("");
  const [editedSubject, setEditedSubject] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUserSubjects, setEditedUserSubjects] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [editedEmail, setEditedEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });

  useEffect(() => {
    const apiCalls = async () => {
      await fetchUserSubjects();
      await fetchSubjects();
    };

    apiCalls();
  }, []);

  const fetchUserSubjects = async () => {
    try {
      const response = await getUsersSubjects();
      if (response.data && response.data.user) {
        setUserSubjects(response.data.user);
      } else {
        setUserSubjects([]);
      }
    } catch (error) {
      console.error(`Error fetching subjects for user:`, error);
      setUserSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsButtonDisabled(!editedUserSubjects || editedUserSubjects.length === 0);
  }, [editedUserSubjects]);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setErrors({ name: "", email: "" });
    setEditedSubject("");
    setEditedDescription("");
    setEditedUserSubjects(user.subjects);
    setOpen(true);
  };
  const fetchSubjects = async () => {
    try {
      const response = await getAllSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error.response?.data);
    }
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
      editedEmail.trim() !== selectedUser?.email ||
      (Array.isArray(editedUserSubjects) && editedUserSubjects.length > 0);

    const isValid = validateInputs() && hasChanges;
    setIsButtonDisabled(!isValid);
  }, [editedName, editedEmail, selectedUser]);

  const handleUpdate = async () => {
    if (!selectedUser || !selectedUser.id) {
      Swal.fire("Error", "User not found.", "error");
      return;
    }

    try {
      const payload = {
        name: editedName,
        email: editedEmail,
        subjects: editedUserSubjects.map((subject) => subject.id),
      };

      console.log("payload", payload);
      const response = await assignSubjects(selectedUser.id, {
        user: payload,
      });

      if (response.status === 200) {
        Swal.fire("Updated!", "User has been updated.", "success");
        fetchUserSubjects(); // Refresh data
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update user.",
        "error"
      );
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
          setUserSubjects((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
          );

          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error.response?.data);
          Swal.fire("Error", "Failed to delete user.", "error");
        }
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setEditedName("");
    setEditedEmail("");
    setEditedUserSubjects([]);
    setErrors({ email: "" });
  };

  const handleAddSubject = async (userId) => {
    if (!userId) {
      Swal.fire("Error", "Please select a user first.", "error");
      return;
    }

    const { value: subjectName } = await Swal.fire({
      title: "Add Subject",
      input: "text",
      inputLabel: "Enter subject name",
      showCancelButton: true,
      confirmButtonText: "Add",
    });

    if (subjectName) {
      try {
        await assignSubjects(userId, subjectName);
        Swal.fire("Success", "Subject added successfully!", "success");
        fetchUserSubjects();
      } catch (error) {
        Swal.fire("Error", "Failed to add subject.", "error");
      }
    }
  };

  return (
    <div className="usercontainer">
      <div className="userbackground"></div>
      <div className="usercontent">
        <div className="user">
          <div className="usertable">
            <h1>Users Profile</h1>
            <table>
              <thead>
                <tr colSpan="2" style={{ textAlign: "center" }}>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(userSubjects) && userSubjects.length > 0 ? (
                  userSubjects.map((user) => (
                    <tr key={user.id}>
                      <td
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => {
                          Swal.fire({
                            title: `Manage User: ${user.name}`,
                            text: "Would you like to update (assign subject(s)), delete this user, or view details?",
                            icon: "question",
                            showDenyButton: true,
                            showCancelButton: true,
                            showConfirmButton: true,
                            confirmButtonText: "Update",
                            denyButtonText: "Delete",
                            cancelButtonText: "Cancel",
                            showCloseButton: true,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showLoaderOnConfirm: true,
                            showLoaderOnDeny: true,
                            showLoaderOnCancel: true,
                            preConfirm: () => handleOpen(user),
                            preDeny: () => handleDelete(user.id),
                            html: `<button id="viewDetails" class="swal2-confirm swal2-styled" 
          style="background-color: #007bff; margin: 0 5px;">User Details</button>`,
                            didOpen: () => {
                              const cancelButton =
                                document.querySelector(".swal2-cancel");
                              if (cancelButton) {
                                cancelButton.insertAdjacentElement(
                                  "beforebegin",
                                  document.getElementById("viewDetails")
                                );
                              }
                              document
                                .getElementById("viewDetails")
                                .addEventListener("click", () => {
                                  window.location.href = `/details/${user.id}`;
                                });
                            },
                          });
                        }}
                      >
                        {user.name}
                      </td>
                      <td>{user.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No user found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* MUI Modal */}
      {selectedUser && ( // added condition to prevent rendering when there's no selected user
        <Modal open={open} onClose={handleClose}>
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
                top: 5, // Adjust positioning
                right: 5,
                width: 20, // Reduce button size
                height: 20,
                borderRadius: "90%",
                backgroundColor: "#f0f0f0",
                "& svg": {
                  fontSize: "14px", // Reduce actual icon size
                },
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6">
              Edit User: {selectedUser?.name}
            </Typography>

            <TextField
              fullWidth
              label="Name"
              value={editedName} // Changed from editedUserSubjects
              onChange={(e) => setEditedName(e.target.value)}
              sx={{ mb: 2 }}
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
            <Autocomplete
              multiple
              options={subjects}
              getOptionLabel={(option) => option.subject_name}
              value={editedUserSubjects}
              onChange={(event, newValue) => {
                setEditedUserSubjects(newValue);
              }} // keep it simple
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subjects"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
              clearIcon={null} // ❌ Removes the clear (X) icon
              disableClearable
              slotProps={{
                popupIndicator: {
                  sx: {
                    transform: "scale(0.8)", // Shrink the dropdown button
                    width: "24px", // Adjust width
                    height: "24px", // Adjust height
                  },
                },
              }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={isButtonDisabled}
              sx={{
                mr: 2,
                backgroundColor: isButtonDisabled ? "#ccc" : "#6A0DAD",
                fontFamily: "Poppins, sans-serif",
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
