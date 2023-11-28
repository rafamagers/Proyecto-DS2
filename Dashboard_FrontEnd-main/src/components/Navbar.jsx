import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const NavBar = () => {
  const routes = [
    ["Registrar", "/"],
    ["Consultar", "/consult"],
    ["Log", "/log"],
  ];
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <NavLink to="/" className="navbar-brand">
            Dashboard
          </NavLink>

          <Nav className="me-auto">
            {routes.map(([title, url]) => (
              <NavLink to={url} key={title} className="nav-link">
                {title}
              </NavLink>
            ))}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
