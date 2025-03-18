import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllSubjects,
  deleteSubjects,
  updateSubjects,
  createSubjects,
} from "../../api/subjects";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./subjects.css";

const SubjectsList = () => {
  const [formData, setFormData] = useState({
    subject_name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await getAllSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (subject = null) => {
    if (subject) {
      setSelectedSubject(subject);
      setEditedSubject(subject.subject_name);
      setEditedDescription(subject.description);
    } else {
      setSelectedSubject(null);
      setEditedSubject("");
      setEditedDescription("");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({ subject_name: "", description: "" });
    setOpen(false);
    setSelectedSubject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await createSubjects(formData);
      Swal.fire("Success!", "Subject added successfully!", "success");

      setSubjects((prevSubjects) => [...prevSubjects, response.data.subject]);

      setFormData({ subject_name: "", description: "" });
      setEditedSubject("");
      setEditedDescription("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding subject:", error.response?.data);
      Swal.fire("Error", "Failed to add subject.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      const hasChanges =
        (editedSubject?.trim() || "") !==
          (selectedSubject.subject_name || "") ||
        (editedDescription?.trim() || "") !==
          (selectedSubject.description || "");
      setIsButtonDisabled(!hasChanges);
    }
  }, [editedSubject, editedDescription, selectedSubject]);

  const handleUpdate = async () => {
    if (!selectedSubject || isButtonDisabled) return;
    try {
      await updateSubjects(selectedSubject.id, {
        subject_name: editedSubject,
        description: editedDescription,
      });
      Swal.fire("Updated!", "Subject has been updated.", "success");
      fetchSubjects();
    } catch (error) {
      console.error("Error updating subject:", error.response?.data);
      Swal.fire("Error", "Failed to update subject.", "error");
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
          await deleteSubjects(id);
          setSubjects(subjects.filter((subject) => subject.id !== id));
          Swal.fire("Deleted!", "Subject has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting subject:", error.response?.data);
          Swal.fire("Error", "Failed to delete subject.", "error");
        }
      }
    });
  };

  const handleChange = (e) => {
    const { subject, value } = e.target;

    setFormData((prev) => ({ ...prev, [subject]: value }));
  };

  return (
    <div className="subjectcontent">
      <div className="subject">
        <div className="subjecttable">
          <h1>Subjects</h1>
          {isLoading ? (
            <p>Loading subjects...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td
                        id="subjectname"
                        onClick={() => {
                          Swal.fire({
                            title: `Subject: ${subject.subject_name}`,
                            html: `Description: ${subject.description}`,
                            text: "Would you like to update or delete this user?",

                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonText: "Update",
                            denyButtonText: "Delete",
                            cancelButtonText: "Cancel",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              handleOpen(subject);
                            } else if (result.isDenied) {
                              handleDelete(subject.id);
                            }
                          });
                        }}
                        style={{ cursor: "pointer", color: "blue" }}
                      >
                        {" "}
                        {subject.subject_name}
                      </td>
                      <td>{subject.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="1">No subjects found.</td>
                    <td colSpan="1">No description found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          <Button
            className="addsubject"
            variant="contained"
            onClick={() => handleOpen()}
          >
            Add Subject/Description
          </Button>
        </div>
      </div>
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
          <Typography
            variant="h6"
            sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}
          >
            {selectedSubject ? "Edit Subject" : "Add Subject"}
          </Typography>
          <TextField
            fullWidth
            label="Subject Name"
            value={selectedSubject ? editedSubject : formData.subject}
            onChange={(e) =>
              selectedSubject
                ? setEditedSubject(e.target.value)
                : setFormData({ ...formData, subject_name: e.target.value })
            }
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            value={selectedSubject ? editedDescription : formData.description}
            onChange={(e) =>
              selectedSubject
                ? setEditedDescription(e.target.value)
                : setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
          />

          <Button
            variant="contained"
            color="purple"
            onClick={selectedSubject ? handleUpdate : handleSubmit}
            disabled={isButtonDisabled && selectedSubject}
            sx={{
              mr: 2,
              backgroundColor: isButtonDisabled ? "#ccc" : "#6A0DAD",
              fontColor: "#ffffff",
              fontFamily: "Poppins, sans-serif",
              "&:hover": {
                backgroundColor: isButtonDisabled ? "#ccc" : "#5a0c9d",
              },
            }}
          >
            {selectedSubject ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default SubjectsList;
