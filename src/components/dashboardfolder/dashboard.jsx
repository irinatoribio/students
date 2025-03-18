import React from "react";
import "./dashboard.css";

function Dashboard() {
  return (
    <div className="dashboardcontainer">
      <div className="dashboardcontent">
        <div className="dashboardheader">
          <img src="" alt="" />
        </div>
        <div className="dashboardbody">
          <div className="dashboard">
            <h2>Your Services</h2>
            <ul>
              <li>Crisis Communication</li>
              <li>Content Marketing</li>
              <li>Social Media Management</li>
            </ul>
          </div>
          <div className="dashboard">
            <h2>Your Progress</h2>
            <div className="progress">
              <div className="progress-bar" style={{ width: "75%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
