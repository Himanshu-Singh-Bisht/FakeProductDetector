import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import styles from "./index.module.css";
import { TextField } from "@mui/material";
import {
  Button,
  Card,
  Container,
  Form,
  Table,
  Message,
} from "semantic-ui-react";
import QRCode from "qrcode";
import Detector from "../../ethereum/detector.js";
import web3 from "../../ethereum/web3";

import { Link } from "../../routes";
import router from "next/router";
import { Router } from "../../routes";

const arr = [1, 2, 3, 4];

export default class CompanyManager extends Component {
  static async getInitialProps(props) {
    // const companyManagerAddress = "0x990131eBd84266F8FeB5f838bE069B66aB0B701c";
    const companyManagerAddress = props.query.add;
    const companyDetails = await Detector.methods
      .getCompanyDetails(companyManagerAddress)
      .call();
    const productList = companyDetails[4];
    const product = await Promise.all(
      Array(parseInt(productList.length))
        .fill()
        .map((element, index) => {
          return Detector.methods.getProductDetails(productList[index]).call();
        })
    );
    return {
      companyId: companyDetails[0],
      companyName: companyDetails[1],
      ownerName: companyDetails[2],
      companyManager: companyManagerAddress,
      productList: companyDetails[4],
      product: product,
    };
  }

  renderCards = () => {
    const { companyId, companyName, ownerName, companyManager, productList } =
      this.props;
    const items = [
      {
        header: companyId,
        meta: "Company Id",
        description: "This is the Id of the company",
        style: { overflowWrap: "break-word" },
      },
      {
        header: companyName,
        meta: "Company Name",
        description: "Name of the company",
        style: { overflowWrap: "break-word" },
      },
      {
        header: ownerName,
        meta: "Owner Name",
        description: "Name of Company Owner",
        style: { overflowWrap: "break-word" },
      },
      {
        header: companyManager,
        meta: "Company Manager",
        description: "Address of Company Manager",
        style: { overflowWrap: "break-word" },
      },
      {
        // header:"web3.utils.fromWei(balance,'ether')",
        header: productList.length,
        meta: "Products list",
        description: "Number Of products under company",
        style: { overflowWrap: "break-word" },
      },
    ];
    return (
      <Card.Group items={items} className="purple" itemsPerRow="2" centered />
    );
  };

  constructor(props) {
    super(props);
    this.state = {
      click: false,
      imageUrl: "",
      newOwner: "",
      isSpin: false,
      isSpinSubmit: false,
      errorMessage: "",
      productName: "",
      pid: "",
    };
  }

  handleProductNameChange = async (e) => {
    var val = e.target.value;
    this.setState({
      productName: val,
    });
  };

  onSubmitProduct = async (e) => {
    e.preventDefault();
    this.setState({
      isSpinSubmit: true,
      errorMessage: "",
    });
    try {
      const accounts = await web3.eth.getAccounts();
      await Detector.methods
        .addNewProduct(this.props.companyId, this.state.productName)
        .send({
          from: accounts[0],
        });

      const cmpyDet = await Detector.methods
        .getCompanyDetails(this.props.companyManager)
        .call();
      const plist = cmpyDet[4];
      const pid = plist[plist.length - 1];
      this.setState({
        pid: pid,
      });

      console.log(this.state.pid);
      // make route to productCode and pass pid
      // const str = JSON.stringify()
      Router.pushRoute(`/company/${this.state.pid}`);
    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
    this.setState({
      isSpinSubmit: false,
    });
  };

  setNewOwner = (e) => {
    var val = e.target.value;
    this.setState({
      newOwner: val,
    });
    // console.log(this.state.newOwner);
  };

  async handleCompanyTransfer(index) {
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
      console.log(this.props.companyId);
      console.log(index, this.state.newOwner);
      await Detector.methods
        .companyTransferOwnership(
          this.props.companyId,
          index,
          this.state.newOwner
        )
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

  renderRow = () => {
    return this.props.product.map((productObj, index) => {
      //   const product = await Detector.methods.getProductDetails(productId).call();

      // const product = await Detector.methods.getProductDetails(productId).call();
      
      return (
        <Table.Row key = {index} disabled={productObj[6]}>
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
                onClick={() => this.handleCompanyTransfer(index)}
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
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Container>
        <br />
        <div>
          <h1>Company Details</h1>
        </div>
        <br />
        {this.renderCards()}
        <div
          className="buttonCenter"
          style={{ display: "flex", justifyContent: "center", margin: "1rem" }}
        >
          {/* <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                    <Button color='purple'>View Requests</Button>
                </a>
            </Link> */}
        </div>

        <Container>
          <br />
          <h2>Add New Product</h2>
          <Form
            onSubmit={this.onSubmitProduct}
            error={!!this.state.errorMessage}
          >
            <Form.Field>
              <label>Product Name</label>
              <input
                placeholder="Product Name"
                onChange={this.handleProductNameChange}
              />
            </Form.Field>
            <Message
              error
              header="Oops! There is some error"
              content={this.state.errorMessage}
            />
            {/* <Link route = {`/company/${this.state.pid}`}>
            <a> */}
            <Button type="submit" loading={this.state.isSpinSubmit} primary>
              Generate Product ID and QR Code
            </Button>
            {/* </a>
            </Link> */}
          </Form>
        </Container>

        <br />
        <br />
        <h3>Product List</h3>
        <Table>
          <Header>
            {/* <Row disabled={request.inMarket}>           */}
            <Row>
              <HeaderCell>SNo.</HeaderCell>
              <HeaderCell>Product Id</HeaderCell>
              <HeaderCell>Product Name</HeaderCell>
              <HeaderCell>New Owner Address</HeaderCell>
              <HeaderCell>Transfer Ownership</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow()}</Body>
        </Table>
        {/* <Message
                        error
                        header="Oops! There is some error"
                        content={this.state.errorMessage}
                    /> */}
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
