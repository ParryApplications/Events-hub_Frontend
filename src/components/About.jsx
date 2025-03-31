import React from "react";
import { FaEnvelope, FaLinkedin } from "react-icons/fa";

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section text-center text-white">
        <div className="container">
          <h1 className="display-4 fw-bold">Who We Are</h1>
          <p className="lead">
            Innovating solutions that drive success and empower businesses.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="container my-5">
        <div className="row text-center">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="info-card">
              <h3>🚀 Our Mission</h3>
              <p>
                To redefine possibilities through cutting-edge technology. We
                aim to build intelligent, scalable, and human-centric solutions
                that shape the future of industries and elevate user
                experiences.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="info-card">
              <h3>🌟 Our Values</h3>
              <ul className="list-unstyled">
                <li>🔹 **Innovation First:** We challenge the status quo.</li>
                <li>🔹 **People-Centric:** Technology that empowers lives.</li>
                <li>
                  🔹 **Excellence Driven:** Quality in every line of code.
                </li>
                <li>🔹 **Future Focused:** Adapting to tomorrow, today.</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="info-card">
              <h3>🌍 Our Journey</h3>
              <p>
                What started as a vision has now become a movement. From a
                passionate team of innovators to a global force driving digital
                transformation, our journey is one of resilience, evolution, and
                impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with LinkedIn & Email Buttons */}
      <section className="contact-section text-center text-white">
        <div className="container">
          <h3>Connect with Us</h3>
          <p>
            Connect with us on LinkedIn or via email for networking,
            collaborations, or inquiries.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <a
              href="https://www.linkedin.com/in/parryapplications-paras-bhatt/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-lg d-flex align-items-center gap-2"
            >
              <FaLinkedin size={24} /> LinkedIn
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=parryapplications@gmail.com"
              target="_blank"
              className="btn btn-outline-light btn-lg d-flex align-items-center gap-2"
            >
              <FaEnvelope size={24} /> Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
