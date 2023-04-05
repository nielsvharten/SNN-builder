import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Network from "../model/network";

class Navigation extends Component {
  handleImportFile = () => {
    const { onChangeNetwork } = this.props;

    document.getElementById("uploadFile").click();
    document.getElementById("uploadFile").onchange = (e) => {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        onChangeNetwork(JSON.parse(e.target.result));
      };
    };
  };

  async exportWithFilePicker(content) {
    const opts = {
      types: [
        {
          description: "Spiking Neural Network",
          accept: { "application/json": [".snn"] },
        },
      ],
    };

    const handle = await window.showSaveFilePicker(opts);
    const writable = await handle.createWritable();
    await writable.write(content);
    writable.close();
  }

  exportWithoutFilePicker(content) {
    const saveNetwork = document.createElement("a");
    const blob = new Blob([content], { type: "application/json" });

    saveNetwork.href = URL.createObjectURL(blob);
    saveNetwork.download = "network.snn";
    saveNetwork.click();
    setTimeout(() => URL.revokeObjectURL(saveNetwork.href), 60000);
  }

  handleExportFile = () => {
    const content = JSON.stringify(this.props.network, null, 2);
    if (window.showSaveFilePicker) {
      this.exportWithFilePicker(content);
    } else {
      this.exportWithoutFilePicker(content);
    }
  };

  handleNewFile = () => {
    const { onChangeNetwork } = this.props;
    const network = new Network();

    onChangeNetwork(network);
  };

  render() {
    const CONFIRM_TEXT =
      "Have you saved your progress? The current network will be lost";

    return (
      <>
        <Navbar bg="dark" expand="sm" variant="dark">
          <Container>
            <Navbar.Brand href="#home">SNN-Builder</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="px-sm-3">
                <NavDropdown title="File" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    onClick={() => {
                      if (window.confirm(CONFIRM_TEXT)) {
                        this.handleNewFile();
                      }
                    }}
                  >
                    New network
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      if (window.confirm(CONFIRM_TEXT)) {
                        this.handleImportFile();
                      }
                    }}
                  >
                    Import network
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={this.handleExportFile}>
                    Export network
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav className="px-sm-3">
                <Nav.Link onClick={this.props.onShowConfig}>Config</Nav.Link>
              </Nav>
              <Nav className="px-sm-3">
                <Nav.Link onClick={() => this.props.onShowConfig}>
                  Help
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <input type="file" id="uploadFile" accept=".snn" hidden />
      </>
    );
  }
}

export default Navigation;
