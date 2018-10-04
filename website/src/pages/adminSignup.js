import React from 'react';
import glamorous from 'glamorous';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import firebase, {
  doSignInWithEmailAndPassword,
  doCreateUserWithEmailAndPassword,
  auth,
  provider,
  db,
} from '../Components/firebase.js';

//./fonts/DINNextLTPro-Regular.otf

export default class Greeting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      email: '',
      loggedIn: false,
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleGo = this.handleGo.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged(authUser => {
      //console.log('auth changed');
      //console.log(authUser);

      if (authUser) {
        this.setState({ redirect: true });
      }
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  handleChange(input, value) {
    this.setState({ email: input.target.value });
  }

  handlePasswordChange(input) {
    this.setState({ password: input.target.value });
  }

  async handleGo() {
    let email = null;

    if (this.state.email != 'admin@influencers.ae') {
      alert('Invalid Email');
      return false;
    }

    if (this.state.email.indexOf('@') > -1) {
      email = this.state.email;
      if (this.validateEmail(email) == false) {
        alert('Invalid Email');
        return;
      }
    }

    //console.log('EMAIL');
    //console.log(email);

    doSignInWithEmailAndPassword(email, this.state.password)
      .then(() => {
        this.setState({ redirect: true });
      })
      .catch(error => {
        alert(error.message);
      });
  }

  render() {
    if (this.state.redirect == true) {
      //console.log('REDIRECT TO LOGIN');
      return <Redirect to={'/adminconsole'} />;
    }

    return (
      <div>
        <LabelAdmin>
          <Link style={{ color: '#FFFFFF', textDecoration: 'none' }} to="/">
            User Portal
          </Link>
        </LabelAdmin>

        <MyGrid>
          <LogoText> Influencers</LogoText>

          <LabelText>Administrator Login</LabelText>
          <LabelTop>Email Or Username</LabelTop>

          <LabelSection>
            <input
              placeholder="type your username"
              style={{
                color: 'black',
                fontSize: 14,
                paddingLeft: 5,
                fontFamily: 'DINNextLTProLight',
                width: 250,
                height: 30,
                background: '#ffffff',
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 5,
              }}
              type="text"
              name="username"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </LabelSection>
          <LabelTop>Password</LabelTop>
          <LabelSection>
            <input
              placeholder="type your password"
              style={{
                fontSize: 14,

                fontFamily: 'DINNextLTProLight',
                color: 'black',
                width: 250,
                height: 30,
                background: '#ffffff',
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 5,
              }}
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </LabelSection>

          <LabelSection style={{ textAlign: 'center', marginLeft: 100 }}>
            <div
              style={{
                width: 120,
                textAlign: 'center',
                padding: 8,
                color: 'white',
                backgroundColor: 'red',
                borderRadius: 6,
                cursor: 'pointer',
                fontFamily: 'DINNextLTPro',

                marginLeft: 85,
                marginTop: 25,
                fontWeight: 'bold',
              }}
              onClick={this.handleGo}>
              ADMIN LOG IN
            </div>
          </LabelSection>
        </MyGrid>
      </div>
    );
  }
}

const MyGrid = glamorous.div({
  margin: 'auto',
  marginTop: 200,
  width: 500,
  height: 450,
  backgroundColor: '#ffffff',
  border: '1px solid #333333',
  borderRadius: 3,
  //color: '#444',
  //  paddingTop:30,
  textAlign: 'center',
});

const LogoText = glamorous.div({
  color: 'black',
  fontSize: 60,
  margin: 25,
  marginBottom: 15,
  marginTop: 25,
  fontFamily: 'cursive',
  fontWeight: 'bold',
});

const LabelAdmin = glamorous.div({
  width: 100,
  textAlign: 'center',
  color: 'black',
  fontSize: 16,
  position: 'absolute',
  right: 10,
  fontFamily: 'DINNextLTPro',
  top: 10,
});
const LabelSection = glamorous.div({
  width: '100%',
  textAlign: 'center',
  color: 'black',
  fontSize: 16,
});
const LabelTop = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: 'black',
  marginTop: 20,
  fontFamily: 'DINNextLTPro',
  fontWeight: 'bold',
  fontSize: 12,
  letterSpacing: 0.24,
  marginBottom: 3,
  marginLeft: 125,
});

const LabelLost = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: '#C1272D',
  fontSize: 14,
  fontFamily: 'DINNextLTPro',
  marginLeft: 125,
  marginTop: 3,
  marginBottom: 5,
});

const LabelText = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: 'black',
  fontSize: 14,
  marginTop: 20,
  fontFamily: 'DINNextLTPro',
  marginLeft: 150,
  marginBottom: 40,
});

const LabelLine = glamorous.div({
  width: 150,
  height: 2,
  backgroundColor: '#EEEEEE',
  marginLeft: '175',
});
