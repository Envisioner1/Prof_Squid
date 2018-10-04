import React from 'react';
import glamorous from 'glamorous';

var FontAwesome = require('react-fontawesome');

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase, {
  doCreateUserWithEmailAndPassword,
  auth,
  provider,
  db,
} from '../Components/firebase.js';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    //console.log('Constructed Header');
    //console.log(props);

    this.state = {
      toggled: false,
    };

    this.openTopMenu = this.openTopMenu.bind(this);
  }
  componentWillMount() {}

  openTopMenu() {
    //console.log('Toggle Attributes');

    if (this.state.toggled == false) {
      this.setState({ toggled: true });
    } else {
      this.setState({ toggled: false });
    }
  }

  render() {
    //  if(this.state.loggedIn==true) {

    let toggleMenu = null;

    // if(this.props.attributeChanged!=undefined){

    if (this.state.toggled == false) {
    } else {
      toggleMenu = (
        <SideBar>
          <Link style={{ textDecoration: 'none' }} to="/logout">
            {' '}
            <ProfileItem>
              <IconLogo>
                <i
                  style={{ color: '#C1272D', marginRight: 10, marginLeft: 10 }}
                  class="fa fa-chevron-right"
                />
              </IconLogo>Log out
            </ProfileItem>
          </Link>
        </SideBar>
      );
    }

    // }

    return (
      <MySideBar>
        <MenuItem onClick={this.openTopMenu}>
          <FontAwesome name="bars" />
        </MenuItem>
        <MenuItem onClick={this.gotoInfluencers}>
          <FontAwesome name="users" />
        </MenuItem>
        <Link style={{ color: '#C1272D', textDecoration: 'none' }} to="/home">
          {' '}
          <MenuItem onClick={this.gotoExperiences}>
            <FontAwesome name="instagram" />
          </MenuItem>
        </Link>
        <MenuItem onClick={this.gotoRocket}>
          <FontAwesome name="rocket" />
        </MenuItem>
        <MenuItem onClick={this.gotoTrophy}>
          <FontAwesome name="trophy" />
        </MenuItem>
        <MenuItem onClick={this.gotoAnalytics}>
          <FontAwesome name="thermometer-half" />
        </MenuItem>
        <MenuItem onClick={this.gotoSettings}>
          <FontAwesome name="gears" />
        </MenuItem>
        {toggleMenu}
      </MySideBar>
    );

    // }else{
    //     return null
    // }
  }
}

const IconLogo = glamorous.div({
  width: 45,
  float: 'left',
});
const ProfileItem = glamorous.div({
  margin: 5,
  width: '90%',
  padding: 5,
  fontSize: 16,
  fontFamily: 'DINNextLTPro',
  color: 'black',
  borderRadius: 5,
  ':hover': {
    color: 'white',
    backgroundColor: 'gray',
  },
});

const MySideBar = glamorous.div({
  position: 'fixed',
  left: 0,
  top: 0,
  width: 40,
  height: '100%',
  paddingTop: 10,
  backgroundColor: 'gray',
});

const MenuItem = glamorous.div({
  cursor: 'pointer',
  width: 40,
  height: 40,
  textAlign: 'center',
  color: 'white',
});

const SideBar = glamorous.div({
  left: 40,
  top: 5,
  position: 'absolute',
  width: 238,
  height: 40,
  borderRadius: 10,
  padding: 5,
  backgroundColor: '#ffffff',
  color: '#000000',
  border: '1px solid lightgray',
  borderRadius: 3,
  zIndex: 1000,
});
