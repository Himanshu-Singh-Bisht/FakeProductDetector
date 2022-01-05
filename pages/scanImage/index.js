import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import styles from "./index.module.css";
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Segment,
  Form,
  Table,
} from "semantic-ui-react";

// const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

import QrReader1 from "react-qr-reader";

import { Router } from "../../routes";
import { Link } from "../../routes";

export default class User extends Component {
  constructor(props) {
    super(props);
    this.qrRef = React.createRef();
    this.state = {
      delay: 100,
      scanResultFile: "No result",
      errorMessage: "",
      proId: "",
    };
  }

  handleErrorFile = (error) => {
    console.log(error);
  };

  handleScanFile = (result) => {
    this.setState({
      scanResultFile: result,
    });

    if (
      this.state.scanResultFile != null &&
      this.state.scanResultFile.length >= 70
    ) {
      console.log(this.state.scanResultFile);
      Router.pushRoute(`/user/${this.state.scanResultFile}`);
    }
  };

  openImageDialog() {
    this.qrRef.current.openImageDialog();
  }

  render() {
    const previewStyle = {
      height: 150,
      width: 300,
    };

    return (
      <Container>
        <br />
        <div>
          <h1>Scan QR Code from downloaded image</h1>
        </div>
        <br />

        <div
          className="buttonCenter"
          style={{ display: "flex", justifyContent: "center", margin: "1rem" }}
        ></div>

        {/* <Segment>
          <Grid columns={1} relaxed="very">
            <Grid.Column> */}
            <div className = {styles.contain}>
              <h3 className = {styles.head}>Qr Code Scan by image</h3>
              <Button className ={styles.btn} onClick={this.openImageDialog.bind(this)} primary>
                Scan Using Downloaded image
              </Button>
              <QrReader1
                ref={this.qrRef}
                delay={300}
                style={{ width: "20%" } , {height : "20%"}}
                onError={this.handleErrorFile}
                onScan={this.handleScanFile}
                legacyMode
              />
            </div>
              {/* <h3>{this.state.scanResultFile}</h3> */}
            {/* </Grid.Column>
          </Grid> */}

          {/* <Divider vertical></Divider> */}
        {/* </Segment> */}
      </Container>
    );
  }
}
