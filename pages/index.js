import React, { Component } from "react";
import styles from "./index.module.css";
import { TextField, Button } from "@mui/material";
import { Container, Divider, Segment, Form, Message} from "semantic-ui-react";
import Detector from "../ethereum/detector.js";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      managerId: "",
      userId: "",
      userName: "",
      userLocation: "",
      isSpin: false,
      errorMessageCmp: "",
      errorMessage : "",
      visible : false,
      visible2 : false,
      visible3 : false
    };
  }

  setManager = (value) => {
    this.setState({
      managerId: value,
    });
  };

  // company manager address
  handleSubmit = async (event) => {
    // console.log(this.state.managerId);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);

    const cmpyDetail = await Detector.methods
      .getCompanyDetails(accounts[0])
      .call();

    console.log(cmpyDetail);
    console.log(cmpyDetail[1], cmpyDetail[2]);

    this.setState({
      visible : false
    })

    if (cmpyDetail[1] != "" && cmpyDetail[2] != "") {
      Router.replaceRoute(`/cmpy/${accounts[0]}`);
      this.setState({
        errorMessageCmp: "",
        visible : false
      });
    } else {
      this.setState({
        errorMessageCmp: "Invalid Address, Can't Connect With Metamask",
        visible : true
      });
    }
  };

  setUser = (value) => {
    this.setState({
      userId: value,
    });
  };

  // user signing through metamask
  userHandleSubmit = async (event) => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    this.setState({
      errorMessage: "",
      visible2 : false
    });

    try {
      const userDetail = await Detector.methods
        .getUserDetails(accounts[0])
        .call();

      console.log(userDetail);

      if (userDetail[0] == accounts[0]) {
        Router.replaceRoute(`/${accounts[0]}`);
      }
    } catch (error) {
      this.setState({
        errorMessage: "Invalid Address, Can't Connect With Metamask",
        visible2 : true
      });
    }
  };

  setUserName = (value) => {
    this.setState({
      userName: value,
    });
  };

  setUserLocation = (value) => {
    this.setState({
      userLocation: value,
    });
  };

  userSignUp = async (e) => {
    this.setState({
      isSpin: true,
      errorMessage: "",
      visible3 : false
    });

    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);

      await Detector.methods
        .createUser(this.state.userName, this.state.userLocation)
        .send({
          from: accounts[0],
        });

      // redirect to user page

      Router.replaceRoute(`/${accounts[0]}`);
    } catch (error) {
      console.log(error.message);
      this.setState({
        errorMessageUser: "Invalid Address, Can't Connect With Metamask",
        visible3 : true
      });
    }

    this.setState({
      isSpin: false,
    });
  };


  handleDismiss = () => {
    this.setState({ visible: false })

    setTimeout(() => {
      this.setState({ visible: true })
    }, 2000)
  }

  render() {
    return (
      <Container>
        <div className={styles.title}>
          <h1>Fake Product Detector</h1>
        </div>

        <div className={styles.container}>
          <div className={styles.submain}>
            <div className={styles.details1}>
              <h2 className={styles.heading}>Enter As A Company Manager</h2>
              <br />
              <br />

              {/* <TextField className = {styles.textfield} 
                                        label="Enter Manager ID" onChange={(e) => this.setManager}/> */}
              <Form
                onSubmit={() => this.handleSubmit()}
                // error={!!this.state.errorMessageCmp}
              >
                
                <Button
                  className={styles.btn1}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Connect With Metamask
                </Button>
                {/* <Message
                  error
                  header="Oops! There is some error"
                  content={this.state.errorMessageCmp}
                /> */}
                
              </Form>

              {this.state.visible ? 
                (<div className = {styles.box}>{this.state.errorMessageCmp}</div>) : null}
            </div>
          </div>

          <div className={styles.submain}>
            <div className={styles.details1}>
              <h2 className={styles.heading}>Enter As A User</h2>

              <Segment basic textAlign="center">
                {/* <TextField className = {styles.textfield} 
                                            label="Enter User ID" onChange={(e) => this.setUser}/> */}

                <Form 
                  onSubmit={() => this.userHandleSubmit()}
                  error={!!this.state.errorMessage}
                >
                  <Button
                    type = "submit"
                    className={styles.btn2}
                    variant="contained"
                    color="primary"
                  >
                    Connect With Metamask
                  </Button>
                  
                </Form>
                {this.state.visible2 ? 
                (<div className = {styles.box}>{this.state.errorMessage}</div>) : null}

                <Divider horizontal>Or</Divider>

                <TextField
                  className={styles.textfield}
                  label="Enter User Name"
                  onChange={(e) => this.setUserName}
                />
                <TextField
                  className={styles.textfield}
                  label="Enter User Location"
                  onChange={(e) => this.setUserLocation}
                />

                <Button
                  className={styles.btn2}
                  variant="contained"
                  color="primary"
                  onClick={(e) => this.userSignUp()}
                  loading={this.state.isSpin}
                >
                  Sign Up
                </Button>
                {this.state.visible3 ? 
                (<div className = {styles.box}>{this.state.errorMessageUser}</div>) : null}
              </Segment>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}
