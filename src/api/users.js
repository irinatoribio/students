const token = localStorage.getItem("token"); // Retrieve the token from storage

fetch("http://127.0.0.1:8000/api/user", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log("User data:", data);
  })
  .catch((error) => {
    console.error("Error fetching user data:", error);
  });
