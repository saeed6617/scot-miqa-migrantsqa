import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Icon
} from "semantic-ui-react";
import { userLogin } from "../api/login";
import { Link, Redirect } from "react-router-dom";
import Home from "./Home";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoggedIn: null
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setState({
        isLoggedIn: true
      });
    }
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleOnSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    userLogin(email, password)
      .then(loggedInUser => {
        localStorage.setItem("token", loggedInUser.token);
        //TODO change to use  isAuthenticated
        window.location.reload();
        this.setState({
          isLoggedIn: true
        });
      })
      .catch(err => {
        this.setState({
          isLoggedIn: err.status > 200 && err.status < 405 ? false : true
        });
      });
  };

  render() {
    const { email, password, isLoggedIn } = this.state;
    if (isLoggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="brown" textAlign="center">
            <Icon name="sign in" color="brown" />
            Login
          </Header>

          <Form onSubmit={this.handleOnSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleOnChange}
                value={email}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleOnChange}
                value={password}
                type="password"
              />

              <Button fluid color="brown" size="large">
                Login
              </Button>
            </Segment>
          </Form>
          {isLoggedIn === false && (
            <Message error>Please check your email/password</Message>
          )}
          <Message>
            <Link to="/forgot-password">Forgot password?</Link>
          </Message>
          <Message>
            Not registered yet? <Link to="/register">Sign up</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
