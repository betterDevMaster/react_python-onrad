import React from "react";
import { Link } from "react-router-dom";

import { Container } from "./../../../components";

export const SidebarDefault = () => (
  <Container>
    <h1 className="display-4 mb-4 mt-2">Sidebar &amp; Navbar</h1>

    <p className="mb-5">
      Welcome to the <b>&quot;Dicom&quot;</b> Admin Dashboard Theme based on{" "}
      <a
        href="https://getbootstrap.com"
        className="text-primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        Bootstrap 4.x
      </a>{" "}
      version for React called&nbsp;
      <a
        href="https://reactstrap.github.io"
        className="text-primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        reactstrap
      </a>{" "}
      - easy to use React Bootstrap 4 components compatible with React 16+.
    </p>

    <section className="mb-5">
      <h6>Layouts for this framework:</h6>
      <ul className="pl-3">
        <li>
          <Link to="/layouts/navbar" className="text-primary">
            Navbar
          </Link>
        </li>
        <li>
          <Link to="/layouts/sidebar" className="text-primary">
            Sidebar
          </Link>
        </li>
        <li>
          <Link to="/layouts/sidebar-with-navbar" className="text-primary">
            Sidebar with Navbar
          </Link>
        </li>
      </ul>
    </section>
    <section className="mb-5">
      <h6>Work Orders:</h6>
      <p>
        Regarding configuration, changes under client&apos;s requirements.
        <br />
        Pleace contact us through the{" "}
        <a
          href="http://wbkom.co/contact"
          className="text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          webkom.co/contact
        </a>{" "}
        website.
      </p>
    </section>
  </Container>
);
