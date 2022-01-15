// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'

// export default function Home() {
import React, { Component, useRef } from "react";
import "semantic-ui-css/semantic.min.css";
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
import { TextField } from "@mui/material";
import dynamic from "next/dynamic";
import Detector from "../../ethereum/detector.js";
import web3 from "../../ethereum/web3.js";
// import RequestRow from "../components/RequestRow";

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

// import QrReader1 from 'react-qr-reader';

import { Router } from "../../routes";
import { Link } from "../../routes";

export default class User extends Component {
  static async getInitialProps(props) {
    // const userAddress = "0xdEA1192d55e4220D2a7Be64cF2C026e090DEbB72";
    const userAddress = props.query.add;
    const userDetail = await Detector.methods
      .getUserDetails(userAddress)
      .call();

    const productList = userDetail[3];
    const product = await Promise.all(
      Array(parseInt(productList.length))
        .fill()
        .map((element, index) => {
          return Detector.methods.getProductDetails(productList[index]).call();
        })
    );
    return {
      userAdd: userAddress,
      userName: userDetail[1],
      userLocation: userDetail[2],
      userProductList: userDetail[3],
      product: product,
    };
  }

  renderCards = () => {
    const { userAdd, userName, userLocation, userProductList } = this.props;
    const items = [
      {
        header: userAdd,
        meta: "User Address",
        description: "Address of the User",
        style: { overflowWrap: "break-word" },
      },
      {
        header: userName,
        meta: "User Name",
        description: "Name of the User",
      },
      {
        header: userLocation,
        meta: "User Location",
        description: "Location of the user",
      },
      {
        header: userProductList.length,
        meta: "Number of Products",
        description: "Number of the products owned by user",
      },
    ];
    return (
      <Card.Group items={items} className="purple" itemsPerRow="2" centered />
    );
  };

  constructor(props) {
    super(props);
    this.qrRef = React.createRef();
    this.state = {
      delay: 100,
      scanResultWebCam: "No result",
      scanResultFile: "No result",
      newOwner: "",
      isSpin: false,
      errorMessage: "",
      proId: "",
    };

    this.handleScanWebCam = this.handleScanWebCam.bind(this);
  }

  handleErrorWebCam = (error) => {
    console.log(error);
  };

  handleScanWebCam = (result) => {
    this.setState({
      scanResultWebCam: result,
    });
    if (
      this.state.scanResultWebCam != null &&
      this.state.scanResultWebCam.length >= 70
    ) {
      console.log(this.state.scanResultWebCam);
      Router.pushRoute(`/user/${this.state.scanResultWebCam}`);
    }
    // qrScanner.start();
  };

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

  setNewOwner = (e) => {
    var val = e.target.value;
    this.setState({
      newOwner: val,
    });
    // console.log(this.state.newOwner);
  };

  async handleUserTransfer(index) {
    // e.preventDefault();
    // await

    // console.log(this.state.newOwner);
    // e.preventDefault();
    this.setState({
      isSpin: true,
      errorMessage: "",
    });

    try {
      const accounts = await web3.eth.getAccounts();
      console.log(this.props.userAdd);
      console.log(index, this.state.newOwner);
      await Detector.methods
        .transferOwnership(index, this.props.userAdd, this.state.newOwner)
        .send({
          from: accounts[0],
        });
    } catch (error) {
      console.log(error.message);
      this.setState({
        errorMessage: error.message,
      });

      this.setState({
        isSpin: false,
      });
    }

    this.setState({
      isSpin: false,
    });
  }

  handleProductIdChange = async (e) => {
    var val = e.target.value;
    this.setState({
      proId: val,
    });
  };

  onSubmitProId = async (e) => {
    e.preventDefault();
    try {
      if (this.state.proId != null && this.state.proId >= 70) {
        Router.pushRoute(`/user/${this.state.proId}`);
      }
    } catch (error) {}
  };

  renderRow = () => {
    return this.props.product.map((productObj, index) => {
      // return arr.map((request, index) => {
      // props.userProductList
      return (
        <Table.Row key = {index}> 
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{productObj[0]}</Table.Cell>
          <Table.Cell>{productObj[3]}</Table.Cell>
          <Table.Cell>
            {
              <TextField
                label="Address of the new owner"
                onChange={this.setNewOwner}
              />
            }
          </Table.Cell>
          <Table.Cell>
            {
              <Button
                basic
                color="purple"
                onClick={() => this.handleUserTransfer(index)}
                loading={this.state.isSpin}
              >
                Transfer
              </Button>
            }
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  render() {
    const previewStyle = {
      height: 150,
      width: 300,
    };

    const { Header, Row, Cell, HeaderCell, Body } = Table;

    return (
      <Container>
        <br />
        <div>
          <h1>User Details</h1>
        </div>
        <br />
        {this.renderCards()}
        <div
          className="buttonCenter"
          style={{ display: "flex", justifyContent: "center", margin: "1rem" }}
        ></div>

        <Segment>
          <Grid columns={3} relaxed="very">
            <Grid.Column>
              <h3>Qr Code Scan by Web Cam</h3>
              <div>
                <QrReader
                  delay={300}
                  style={{ width: "100%" }}
                  onError={this.handleErrorWebCam}
                  onScan={this.handleScanWebCam}
                />
                <h3>{this.state.scanResultWebCam}</h3>
              </div>
            </Grid.Column>

            <Grid.Column>
              <h3>Qr Code Scan by image</h3>
              {/* <Button onClick={this.openImageDialog.bind(this)} primary>
                Scan Using Downloaded image
              </Button> */}
              {/* <QrReader1
                                    ref={this.qrRef}
                                    delay={300}
                                    style={{width: '100%'}}
                                    onError={this.handleErrorFile}
                                    onScan={this.handleScanFile}
                                    legacyMode
                                />  */}
              {/* <h3>{this.state.scanResultFile}</h3> */}
              <Link route='/scanImage'>
              <a>
                <Button primary>Scan Using Downloaded Image</Button>
              </a>
              </Link>
            </Grid.Column>

            <Grid.Column>
              <h3>Scan Using Product ID</h3>
              <Form onSubmit={this.onSubmitProId}>
                <Form.Field>
                  <label>Enter Product ID</label>
                  <input
                    name="productId"
                    placeholder="Enter Product ID"
                    onChange={this.handleProductIdChange}
                  />
                </Form.Field>

                <Button type="submit" primary>
                  Submit
                </Button>
              </Form>
            </Grid.Column>
          </Grid>

          {/* <Divider vertical></Divider> */}
        </Segment>

        <br />
        <br />
        <br />
        <h2>Product List</h2>
        <Table>
          <Header>
            <Row>
              <HeaderCell>SNo.</HeaderCell>
              <HeaderCell>Product Id</HeaderCell>
              <HeaderCell>Product Name</HeaderCell>
              <HeaderCell>Address Of New Owner</HeaderCell>
              <HeaderCell>Transfer Ownership</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow()}</Body>
        </Table>
        <br />
        <div>
          <h4>Found {this.props.product.length} products</h4>
          {/* <h4>Found {arr.length} requests</h4> */}
        </div>
        <br />
        <br />
      </Container>
    );
  }
}
