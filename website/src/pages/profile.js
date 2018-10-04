import React from 'react';
import glamorous from 'glamorous';
import Header from '../components/header';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class EditProfile extends React.Component {
  render() {
    return (
      <div>
        <Header />

        <div style={{ textAlign: 'center', color: 'white' }}>
          {' '}
          <h3>Edit Profile</h3>
        </div>
        <MyGrid>
          <Link to="/editprofile">
            {' '}
            <ProfileItem>Edit Profile</ProfileItem>
          </Link>
          <Link to="/changepassword">
            {' '}
            <ProfileItem>Change Password</ProfileItem>
          </Link>
          <Link to="/logout">
            {' '}
            <ProfileItem>Log out</ProfileItem>
          </Link>
        </MyGrid>
      </div>
    );
  }
}

const MyGrid = glamorous.div({
  margin: 'auto',
  width: 400,
  height: 200,

  color: '#444',
});

const ProfileItem = glamorous.div({
  margin: 10,
  width: '100%',
  textAlign: 'center',
  paddingTop: 20,
  fontSize: 36,
  height: 80,
  backgroundColor: '#fff',
  color: '#000',
  borderRadius: 15,
});
