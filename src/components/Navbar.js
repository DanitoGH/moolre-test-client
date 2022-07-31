import React from "react";
import { useLocation , Link } from "react-router-dom";
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
} from "reactstrap";

const CustomNavbar = () => {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const location = useLocation()

  return (
    <>
      <div className="section"  style={{ paddingTop: 0 }}>
        <div id="navbar">
          <div>
            <Navbar className="bg-primary" expand="lg">
              <Container>
                <div className="navbar-translate">
                  <NavbarBrand
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    Welcome To My Shop
                  </NavbarBrand>
                  <button
                    onClick={() => {
                      document.documentElement.classList.toggle("nav-open");
                      setCollapseOpen(!collapseOpen);
                    }}
                    aria-expanded={collapseOpen}
                    className="navbar-toggler"
                    type="button"
                  >
                    <span className="navbar-toggler-bar bar1"></span>
                    <span className="navbar-toggler-bar bar2"></span>
                    <span className="navbar-toggler-bar bar3"></span>
                  </button>
                </div>
                <Collapse isOpen={collapseOpen} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem className={location.pathname === "/"? "active" : ""}>
                      <Link className="nav-link" to={"/"}>
                        <i className="now-ui-icons shopping_shop"></i>
                        <p>Home</p>
                      </Link>
                    </NavItem>
                    <NavItem className={location.pathname === "/add-product"? "active" : ""}>
                       <Link className="nav-link" to={"/add-product"}>
                         <i className="now-ui-icons ui-1_simple-add"></i>
                         <p>Add Product</p>
                      </Link>
                    </NavItem>
                  </Nav>
                </Collapse>
              </Container>
            </Navbar>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomNavbar;
