import React from 'react';
import glamorous from 'glamorous';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import firebase, {
  doPasswordUpdate,
  auth,
  provider,
  db,
} from '../Components/firebase.js';
import Header from '../components/header';

export default class Greeting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      password2: '',
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFirstChange = this.handleFirstChange.bind(this);
    this.handleLastChange = this.handleLastChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordChange2 = this.handlePasswordChange2.bind(this);
    this.handleGo = this.handleGo.bind(this);
  }

  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    //console.log(auth);
  }

  handleChange(input, value) {
    this.setState({ username: input.target.value });
  }

  handleFirstChange(input, value) {
    this.setState({ firstname: input.target.value });
  }

  handleLastChange(input, value) {
    this.setState({ lastname: input.target.value });
  }

  handleEmailChange(input, value) {
    this.setState({ email: input.target.value });
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  handlePasswordChange(input) {
    this.setState({ password: input.target.value });
  }

  handlePasswordChange2(input) {
    this.setState({ password2: input.target.value });
  }

  async handleGo() {
    //console.log('handel Go');

    if (this.state.password.length < 6) {
      alert('Password not long enough!');
      return;
    }

    if (this.state.password !== this.state.password2) {
      alert('Passwords do not match!');
      return;
    }
    doPasswordUpdate(this.state.password);

    this.setState({ redirect: true });
  }

  render() {
    let passwordWarning = null;

    if (this.state.password !== this.state.password2) {
      passwordWarning = <PassWarn>{'Passwords do not match!'}</PassWarn>;
    }

    if (this.state.redirect == true) {
      //console.log('REDIRECT TO LOGIN');
      return <Redirect to={'/home'} />;
    }

    return (
      <div>
        <Header />

        <TopTitle>Change Password:</TopTitle>
        <MyGrid>
          <LabelTop>New Password:</LabelTop>
          <LabelSection>
            <input
              style={{
                fontSize: 20,
                width: 200,
                height: 30,
                fontFamily: 'DINNextLTPro',
              }}
              maxLength={16}
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </LabelSection>
          <LabelTop>Confirm Password:</LabelTop>
          <LabelSection>
            <input
              style={{
                fontSize: 20,
                width: 200,
                height: 30,
                fontFamily: 'DINNextLTPro',
              }}
              maxLength={16}
              type="password"
              name="title"
              value={this.state.password2}
              onChange={this.handlePasswordChange2}
            />
          </LabelSection>
          {passwordWarning}

          <div style={{ marginLeft: 140, marginTop: 10 }}>
            <SaveButton onClick={this.handleGo}> Save Changes</SaveButton>
          </div>
        </MyGrid>
      </div>
    );
  }
}

const TopTitle = glamorous.div({
  width: '100%',
  marginTop: 20,
  textAlign: 'center',
  fontSize: 22,
  color: '#C9C9C9',
  fontFamily: 'DINNextLTPro',
});

const MyGrid = glamorous.div({
  margin: 'auto',
  marginTop: 20,
  width: 400,
  height: 220,
  backgroundColor: '#eeeeee',
  color: '#444',
  paddingTop: 10,
});

const LogoText = glamorous.div({
  color: 'white',
  fontSize: 50,
  margin: 50,
});

const LabelSection = glamorous.div({
  width: '100%',
  color: 'black',
  fontSize: 16,
  marginLeft: 100,
  fontFamily: 'DINNextLTPro',
});
const LabelTop = glamorous.div({
  width: '100%',
  color: 'black',
  fontSize: 16,
  marginTop: 20,
  marginLeft: 100,
  fontFamily: 'DINNextLTPro',
});

const PassWarn = glamorous.div({
  width: '100%',
  textAlign: 'center',
  color: 'red',
  fontSize: 16,
  marginBottom: 10,
});

const LabelLost = glamorous.div({
  width: '100%',
  textAlign: 'center',
  color: 'red',
  fontSize: 16,
  marginTop: 20,
});

const LabelText = glamorous.div({
  width: '100%',
  textAlign: 'center',
  color: 'white',
  fontSize: 16,
  marginTop: 20,
});
const SaveButton = glamorous.div({
  borderRadius: 5,
  cursor: 'pointer',
  width: 120,
  fontFamily: 'DINNextLTPro',
  textAlign: 'center',
  padding: 5,
  border: '1px solid white',
  color: 'white',
  backgroundColor: 'black',

  ':hover': {
    color: 'black',
    backgroundColor: 'white',
    border: '1px solid black',
  },
});
