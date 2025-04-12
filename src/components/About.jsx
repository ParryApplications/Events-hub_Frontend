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
            All-in-one platform for discovering, sharing, and managing upcoming
            events
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="container my-5">
        <div className="row text-center">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="info-card">
              <h3>🚀 Our Mission</h3>
              <ul>
                <li className="text-start">
                  <strong className="fw-medium">Connect Communities: </strong>
                  Bring people together through shared interests and local
                  events.
                </li>
                <li className="text-start">
                  <strong className="fw-medium">Empower Organizers: </strong>
                  Give everyone the tools to promote events—big or small.
                </li>
                <li className="text-start">
                  <strong className="fw-medium">Celebrate the Unseen: </strong>
                  Highlight meaningful events that might otherwise go unnoticed.
                </li>
                <li className="text-start">
                  <strong className="fw-medium">Keep You Informed: </strong>
                  Ensure you never miss out with timely, friendly reminders.
                </li>
                <li className="text-start">
                  <strong className="fw-medium">Accessible to All: </strong>
                  Offer a simple, secure, and completely free experience.
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="info-card">
              <h3>🌟 Our Values</h3>
              <ul>
                <li className="text-start">
                  <strong className="fw-medium">Inclusivity: </strong>
                  We believe every event—big or small, mainstream or
                  niche—deserves to be seen and celebrated.
                </li>
                <li className="text-start">
                  <strong className="fw-medium">Transparency & Trust: </strong>
                  User data is handled with the utmost care, backed by strong
                  privacy measures like end-to-end encryption.
                </li>
                <li className="text-start">
                  <strong className="fw-medium">Accessibility: </strong>
                  EventsHub is free and open to all, lowering barriers to
                  connection and participation.
                </li>
                <li className="text-start">
                  <strong className="fw-medium">Reliability: </strong>
                  We&rsquo;re committed to timely updates and reminders so our
                  users never miss out.
                </li>
                <li className="text-start">
                  <strong className="fw-medium">Empowerment: </strong>
                  We aim to give individuals the tools to share meaningful
                  experiences and build stronger communities.
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="info-card">
              <h3>🌍 Our Journey</h3>
              <p>
                EventsHub began with a simple idea: to make meaningful events
                more visible, no matter their size or popularity. We noticed
                that many incredible gatherings—local meetups, community
                workshops, indie performances—often went unnoticed, simply
                because they lacked the reach of bigger events. What started as
                a passion project quickly grew into a platform designed to
                connect people through shared experiences. Along the way,
                we&rsquo;ve focused on keeping the app user-friendly, completely
                free, and inclusive—because we believe that great events should
                be accessible to everyone. Today, EventsHub continues to evolve
                with our community at the heart of everything we do. Whether
                you&rsquo;re discovering a new event, posting one of your own,
                or simply exploring what&rsquo;s happening around
                you—we&rsquo;re here to help you stay connected, inspired, and
                in the loop.
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
              href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=eventshub.parryapplications@gmail.com"
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
