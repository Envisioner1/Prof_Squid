import React from 'react';
import glamorous from 'glamorous';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase, {
  doPasswordReset,
  auth,
  provider,
  db,
} from '../Components/firebase.js';

export default class Greeting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loggedIn: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleGo = this.handleGo.bind(this);
  }

  handleChange(input, value) {
    this.setState({ username: input.target.value });
  }

  async handleGo() {
    alert(
      'A password reset has been sent to the email associated with ' +
        this.state.username
    );

    if (this.state.username.length < 6) {
      return false;
    }

    let email = null;

    if (this.state.username.indexOf('@') > -1) {
      email = this.state.username;
    } else {
      let usernameRef = await firebase
        .database()
        .ref(`usernames/${this.state.username}`);

      let uservalue = await usernameRef.once('value');

      //console.log(uservalue);
      if (uservalue.val() != null) {
        let userRef = await firebase.database().ref(`users/${uservalue.val()}`);

        let userv = await userRef.once('value');

        email = userv.val().email;
      } else {
        return false;
      }
    }

    //console.log('EMAIL');
    //console.log(email);

    doPasswordReset(email)
      .then(() => {
        //this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        alert(error);
        //    this.setState(byPropKey('error', error));
      });
  }

  render() {
    return (
      <div>
        <MyGrid>
          <LogoText>Influencers</LogoText>
          <LabelLine />
          <LabelText>Lost your password? Fill out this form. </LabelText>
          <LabelTop>Username or Email Address:</LabelTop>

          <LabelSection>
            <input
              placeholder="username or e-mail"
              style={{
                fontSize: 14,

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
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </LabelSection>
          <LabelSection>
            <div
              style={{
                width: 170,
                textAlign: 'center',
                padding: 8,
                color: 'black',
                backgroundColor: '#F2F2F2',
                borderRadius: 6,
                cursor: 'pointer',
                fontFamily: 'DINNextLTPro',

                marginLeft: 155,
                marginTop: 25,
                fontWeight: 'bold',
              }}
              onClick={this.handleGo}>
              RECOVER PASSWORD
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
  marginTop: 200,
  width: 500,
  height: 400,
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
  marginBottom: 5,
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
  marginLeft: 133,
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
