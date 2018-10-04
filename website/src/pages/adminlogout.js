import React from 'react';
import glamorous from 'glamorous';
import Header from '../components/headeradmin';
import firebase, {
  doCreateUserWithEmailAndPassword,
  auth,
  provider,
  db,
} from '../Components/firebase.js';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
export default class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };

    this.logout = this.logout.bind(this);
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        redirect: true,
      });
    });
  }

  render() {
    if (this.state.redirect == true) {
      //console.log('REDIRECT TO LOGIN');
      return <Redirect to={'/'} />;
    }

    return (
      <div>
        <Header />

        <MyGrid>
          <LogoutText>Are you sure you want to logout?</LogoutText>

          <SaveButton
            style={{ marginLeft: 135, marginTop: 20 }}
            onClick={this.logout}>
            Logout
          </SaveButton>
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

const LogoutText = glamorous.div({
  margin: 25,
  fontFamily: 'DINNextLTPro',
  textAlign: 'center',
  fontSize: 16,
});

const MyGrid = glamorous.div({
  margin: 'auto',
  marginTop: 50,
  width: 400,
  height: 150,
  backgroundColor: '#eeeeee',
  color: '#444',
  paddingTop: 10,
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

const MyButton = glamorous.div({
  position: 'absolute',
  left: '50%',
  top: 300,
  width: 200,
  marginLeft: -100,
  fontSize: 24,
  paddingTop: 30,
  borderRadius: 25,
  height: 80,
  backgroundColor: '#fff',
  color: 'black',
  textAlign: 'center',
});
