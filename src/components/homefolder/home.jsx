import React from "react";
import "./home.css";

function Home() {
  return (
    <div className="homeparentcontainer">
      <div className="homechildcontainer">
        <div className="homecontent">
          <div className="purplebackground"></div>
          <div className="content">
            <div className="welcome">
              <h2>Welcome to Express!</h2>
              We offer an assortment of quality services to build and preserve
              the public image of your brand. Our dedicated and experienced
              professionals specialize in crisis communication, content
              marketing and social media management.
              <div className="icon">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="./assets/1.png" alt="" />
                </a>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="./assets/2.png" alt="" />
                </a>
                <a href="https://www.x.com/" target="_blank" rel="noreferrer">
                  <img src="./assets/3.png" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="home">
          <div className="navi">
            <header>
              <nav>
                <ul>
                  <li>
                    <a href="home.html">Home</a>
                  </li>
                  <li>
                    <a href="about.html">About</a>
                  </li>

                  <li>
                    <a href="servicews.html">Services</a>
                  </li>
                  <li>
                    <a href="contact.html">Contact Us</a>
                  </li>
                  <li>
                    <b>
                      <a href="/signup">GET STARTED</a>
                    </b>
                  </li>
                </ul>
              </nav>
            </header>
          </div>
          <img src="../assets/design.png" alt="design" />
        </div>
      </div>
    </div>
  );
}

export default Home;
