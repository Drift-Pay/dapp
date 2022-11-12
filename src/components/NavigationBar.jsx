import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function NavigationBar(props) {
  const { name, info, panel } = props;
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">{name}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="#cart">Cart</Nav.Link>
              <Nav.Link href="#products">Products</Nav.Link>
              <Nav.Link href="#services">Services</Nav.Link>
              <NavDropdown title="Info" id="basic-nav-dropdown">
                <NavDropdown.Item href="#about">About</NavDropdown.Item>
                <NavDropdown.Item href="#warranty">Warranty</NavDropdown.Item>
                <NavDropdown.Item href="#contact">Contact</NavDropdown.Item>

                {info?.server?.accessTier > 0 && (
                  <div>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={(event) => {
                        event.preventDefault();
                        panel.set({
                          ...panel.get,
                          admin: !panel.get.admin,
                        });
                      }}
                    >
                      Employees Only
                    </NavDropdown.Item>
                  </div>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <ConnectButton />
        </Container>
      </Navbar>

      <hr />
      <br />
    </div>
  );
}
