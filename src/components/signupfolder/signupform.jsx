import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signupform.css";
import { create } from "../../api/signup";
import Swal from "sweetalert2";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (formData.name.length < 4) {
      newErrors.name = "Username must be at least 4 characters long";
      valid = false;
    }

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

    if (!formData.confirmpassword.trim()) {
      newErrors.confirmpassword = "Confirm Password is required";
      valid = false;
    } else if (formData.confirmpassword !== formData.password) {
      newErrors.confirmpassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      console.log("Payload sent to backend:", payload);

      try {
        const response = await create(payload);
        Swal.fire({
          icon: "success",
          title: "Signed Up!",
          text: "You have successfully signed up!",
        }).then(() => {
          navigate("/login");
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  return (
    <div className="container">
      <div className="purplebackground"></div>
      <div className="content">
        <div className="header">
          <h1>SIGN UP</h1>
          <div>Create new account</div>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="inputs">
            <div>
              <div className="input">
                <input
                  type="name"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div>
              <div className="input">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div>
              <div className="input">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
            <div>
              <div className="input">
                <input
                  type="password"
                  name="confirmpassword"
                  placeholder="Confirm Password"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmpassword && (
                <span className="error">{errors.confirmpassword}</span>
              )}
            </div>
            <button type="submit" className="submit" disabled={isLoading}>
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="haveaccount">
              Already have an account? <a href="/login">Log in here.</a>
            </div>
            <p>
              <span>or</span>
            </p>
            <div className="google">
              <a
                href="https://myaccount.google.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/assets/google.png" alt="google" />
              </a>
              <div>Log in with Google</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
