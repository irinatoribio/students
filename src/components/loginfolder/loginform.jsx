import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./loginform.css";
import { login } from "../../api/login";
import Swal from "sweetalert2";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = {
        email: formData.email,
        password: formData.password,
      };
      console.log("Payload sent to backend:", payload);

      try {
        const response = await login(formData);
        console.log("Login successful:", response.data);
        const token = response.data.access_token;
        localStorage.setItem("token", token);

        Swal.fire({
          icon: "success",
          title: "Logged in!",
          text: "You have successfully logged in!",
        }).then(() => {
          navigate("/userlist");
        });
      } catch (error) {
        console.error("Error fetching data:", error);

        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Authentication failed",
            text: "Invalid credentials. Please try again.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong. Please try again later.",
          });
        }
      }
    }
  };

  return (
    <div className="container">
      <div className="purplebackground"></div>
      <div className="content">
        <div className="header">
          <h1>LOG IN</h1>
          <div>Log in to your account to continue</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            <div className="input">
              <img src="/assets/user.png" alt="user" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="input">
              <img src="/assets/key.png" alt="key" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>
            <button type="submit" className="login">
              Log in
            </button>
            <div className="forgot-password">
              I forgot my password.{" "}
              <Link to="/reset-password">Click here to reset.</Link>
            </div>
            <p>
              <span>or</span>
            </p>
            <div className="google">
              <img src="/assets/google.png" alt="google" />
              <div>Log in with Google</div>
            </div>
            <div className="signup">
              <div className="submit">
                Don't have an account yet? <Link to="/signup">Sign up.</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
