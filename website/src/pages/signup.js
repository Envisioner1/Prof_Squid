import React from 'react';
import glamorous from 'glamorous';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import firebase, {
  doCreateUserWithEmailAndPassword,
  auth,
  provider,
  db,
} from '../Components/firebase.js';

export default class Greeting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      password2: '',
      redirect: false,
      instagramUsername: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFirstChange = this.handleFirstChange.bind(this);
    this.handleLastChange = this.handleLastChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordChange2 = this.handlePasswordChange2.bind(this);
    this.handleGo = this.handleGo.bind(this);
    this.handleInstagramId = this.handleInstagramId.bind(this);
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

  handleInstagramId(input) {
    this.setState({ instagramUsername: input.target.value });
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

    if (this.validateEmail(this.state.email) == false) {
      alert('Invalid Email');
      return;
    } else {
      //console.log('Email Ok');
    }

    doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(authUser => {
        //console.log('got user id');
        //console.log(authUser);

        let myUser = this.state;
        delete myUser.password;
        delete myUser.password2;
        delete myUser.redirect;

        //console.log(myUser);
        firebase
          .database()
          .ref(`potentialInfluencers/${authUser.uid}`)
          .set(myUser);

        this.setState({ redirect: true, user: authUser });

        alert('Account Created!');
      })
      .catch(error => {
        alert(error.message);
      });
  }

  render() {
    let passwordWarning = null;

    if (this.state.password !== this.state.password2) {
      passwordWarning = <PassWarn>{'Passwords do not match!'}</PassWarn>;
    }

    if (this.state.redirect == true) {
      //console.log('REDIRECT TO LOGIN');
      return <Redirect to={'/pending'} />;
    }

    return (
      <div>
        <MyGrid>
          <LogoText> Influencers</LogoText>
          <LabelLine />
          <LabelTop>Email:</LabelTop>

          <LabelSection>
            <input
              placeholderTextColor="red"
              placeholder="johndoe@yahoo.com"
              style={{
                fontSize: 14,
                paddingLeft: 5,

                fontFamily: 'DINNextLTProLight',
                color: 'black',
                width: 250,
                height: 30,
                background: '#000000',
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              maxLength={100}
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
          </LabelSection>

          <LabelTop>Password:</LabelTop>
          <LabelSection>
            <input
              placeholder="password"
              style={{
                fontSize: 14,
                paddingLeft: 5,

                fontFamily: 'DINNextLTProLight',
                color: 'black',
                width: 250,
                height: 30,
                background: '#000000',
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 5,
                backgroundColor: 'white',
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
              placeholder="confirmpassword"
              style={{
                fontSize: 14,
                paddingLeft: 5,

                fontFamily: 'DINNextLTProLight',
                color: 'black',
                width: 250,
                height: 30,
                background: '#000000',
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              maxLength={16}
              type="password"
              name="title"
              value={this.state.password2}
              onChange={this.handlePasswordChange2}
            />
          </LabelSection>
          {passwordWarning}

          <LabelTop>Instagram username</LabelTop>

          <LabelSection>
            @<input
              placeholder="johnsoandso"
              style={{
                fontSize: 14,
                paddingLeft: 5,

                fontFamily: 'DINNextLTProLight',
                color: 'black',
                width: 250,
                height: 30,
                background: '#000000',
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              maxLength={16}
              type="text"
              name="instagram"
              value={this.state.instagramUsername}
              onChange={this.handleInstagramId}
            />
          </LabelSection>

          <LabelTop>First Name:</LabelTop>

          <LabelSection>
            <input
              placeholder="johnsoandso"
              style={{
                fontSize: 14,
                paddingLeft: 5,

                fontFamily: 'DINNextLTProLight',
                color: 'black',
                width: 250,
                height: 30,
                background: '#000000',
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              maxLength={16}
              type="text"
              name="firstname"
              value={this.state.firstname}
              onChange={this.handleFirstChange}
            />
          </LabelSection>

          <LabelTop>Last Name:</LabelTop>

          <LabelSection>
            <input
              placeholder="doe"
              style={{
                fontSize: 14,
                paddingLeft: 5,

                fontFamily: 'DINNextLTProLight',
                color: 'black',
                width: 250,
                height: 30,
                background: '#000000',
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              maxLength={16}
              type="text"
              name="lastname"
              value={this.state.lastname}
              onChange={this.handleLastChange}
            />
          </LabelSection>

          <LabelSection style={{ textAlign: 'center', marginLeft: 100 }}>
            <div
              style={{
                width: 160,
                textAlign: 'center',
                padding: 8,
                color: 'black',
                backgroundColor: '#F2F2F2',
                borderRadius: 6,
                cursor: 'pointer',
                fontFamily: 'DINNextLTPro',

                marginLeft: 65,
                marginTop: 20,
                fontWeight: 'bold',
              }}
              onClick={this.handleGo}>
              CREATE ACCOUNT
            </div>
          </LabelSection>
          <LabelLost>
            <Link style={{ color: '#C1272D', textDecoration: 'none' }} to="/">
              Back To Login
            </Link>
          </LabelLost>
        </MyGrid>
      </div>
    );
  }
}

const MyGrid = glamorous.div({
  margin: 'auto',
  marginTop: 100,
  width: 500,
  height: 650,
  backgroundColor: '#ffffff',
  border: '1px solid #333333',
  borderRadius: 10,
  //color: '#444',
  //  paddingTop:30,
  textAlign: 'center',
});

const LogoText = glamorous.div({
  color: 'black',
  fontSize: 60,
  margin: 25,
  marginBottom: 15,
  marginTop: 15,
  fontFamily: 'cursive',
  fontWeight: 'bold',
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
  marginLeft: 210,
  marginTop: 10,
  marginBottom: 15,
  textDecoration: 'none',
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

const PassWarn = glamorous.div({
  width: '100%',
  textAlign: 'center',
  color: '#C1272D',
  fontSize: 16,
  marginBottom: 10,
  marginLeft: 0,
  fontFamily: 'DINNextLTPro',
});
