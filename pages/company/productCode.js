// import { style } from '@mui/system';
import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Card, Container, Image } from "semantic-ui-react";
import Detector from "../../ethereum/detector.js";
import QRCode from "qrcode";

export default class ProductCode extends Component {
  static async getInitialProps(props) {
    // const productId = "93113285189684030828287481114935413691752178477598600318490081857950099413619";
    // const {pid} = props.query;
    const pid = props.query.pid;
    // console.log(props);
    // console.log(props.query);
    // console.log(pid);
    // console.log(JSON.stringify(pid));
    // return true;
    const productDetails = await Detector.methods.getProductDetails(pid).call();
    const response = await QRCode.toDataURL(pid);
    // console.log(response);
    return {
      productId: productDetails[0],
      companyId: productDetails[1],
      companyName: productDetails[2],
      productName: productDetails[3],
      currentOwner: productDetails[4],
      ownerName: productDetails[5],
      imageUrl: response,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: "",
    };
  }

  renderCards = () => {
    const {
      productId,
      companyId,
      companyName,
      productName,
      currentOwner,
      ownerName,
    } = this.props;
    const items = [
      {
        header: productId,
        meta: "Product Id",
        description: "This is the Product Id",
        style: { overflowWrap: "break-word" },
      },
      {
        header: companyId,
        meta: "Company Id",
        description: "This is the company Id",
        style: { overflowWrap: "break-word" },
      },
      {
        header: companyName,
        meta: "Company Name",
        description: "Product belongs to this company",
      },
      {
        header: productName,
        meta: "Product Name",
        description: "This is the name under which product is present",
      },
      {
        header: currentOwner,
        meta: "Current Owner Adrress",
        description: "This is the address of the current owner of the product",
        style: { overflowWrap: "break-word" },
      },
      {
        header: ownerName,
        meta: "Current Owner Name",
        description: "Name of the current owner of the product",
      },
    ];
    return (
      <Card.Group items={items} className="purple" itemsPerRow="2" centered />
    );
  };

  render() {
    return (
      <Container>
        <br />
        <br />

        <div>
          <a href={this.props.imageUrl} download>
            <Image centered size="medium" src={this.props.imageUrl} alt="img" />
          </a>
        </div>
        <br />
        <br />
        {this.renderCards()}
      </Container>
    );
  }
}
