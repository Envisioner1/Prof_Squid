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

export default class Greeting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      email: '',
      loggedIn: false,
      redirect: false,
    };
  }

  componentDidMount() {
    let search = window.location.search;
    console.log('Verify did mount 12!');
    console.log(search);
    let xemail = search.split('=')[1];
    console.log(xemail);
    this.setState({ email: xemail });
    this.verifyEmails();
  }

  async verifyEmails() {
    let userRef = await firebase.database().ref(`users`);

    let userValue = await userRef.once('value');

    //console.log('Get Campaign Data');
    let users = userValue.val();

    for (let bb in users) {
      if (users[bb].email === this.state.email) {
        console.log('VERIFY EMAIL SUCCESS');
        await firebase
          .database()
          .ref(`users/${bb}/emailVerified`)
          .set(true);
        console.log(this.state.email);
      }
    }
  }

  render() {
    return (
      <div>
        <MyGrid>
          <LogoText>Influencers</LogoText>

          <LabelText>Thanks! Your email has been verified!.</LabelText>
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
