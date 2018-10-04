import React from 'react';
import glamorous from 'glamorous';

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
      userImage: null,
      profileToggled: false,
      toggled: false,
      campaign: this.props.campaign || null,
      strategy: this.props.strategy || null,
      username: this.props.username || null,
      loggedIn: this.props.loggedIn || false,
    };

    this.toggleAttributes = this.toggleAttributes.bind(this);
    this.toggleProfileMenu = this.toggleProfileMenu.bind(this);
  }

  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    //console.log(auth);
    auth.onAuthStateChanged(authUser => {
      //console.log('auth changed');
      //console.log(authUser);

      if (authUser) {
        this.getUserData(authUser);
      }
    });
  }

  async getUserData(authUser) {
    //console.log('User Id');

    //console.log(authUser.uid);

    let userRef = await firebase.database().ref(`users/${authUser.uid}`);

    let userValue = await userRef.once('value');

    //console.log('Get User Data');
    let user = userValue.val();

    //console.log(user);

    //   this.setState({userImage:user.userImage});
  }

  toggleAttributes() {
    //console.log('Toggle Attributes');

    if (this.state.toggled == false) {
      this.setState({ toggled: true });

      this.props.attributeChanged(true);
    } else {
      this.setState({ toggled: false });

      this.props.attributeChanged(false);
    }
  }

  toggleProfileMenu() {
    //console.log('Toggle Profile Menu');

    if (this.state.profileToggled == false) {
      this.setState({ profileToggled: true });

      // this.props.attributeChanged(true)
    } else {
      this.setState({ profileToggled: false });

      //this.props.attributeChanged(false)
    }
  }

  render() {
    //  if(this.state.loggedIn==true) {

    let userImage = null;

    if (this.state.userImage != null) {
      userImage = (
        <img
          src={this.state.userImage}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      );
    } else {
      userImage = (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'gray',
          }}>
          ?
        </div>
      );
    }

    let backButton = null;

    if (this.state.campaign != null) {
      backButton = (
        <Link to="/home">
          {' '}
          <ReturnHome>
            {' '}
            <img style={{ width: 80 }} src="images/BackButton.png" />
          </ReturnHome>
        </Link>
      );
    }

    let backButton2 = null;

    if (this.state.strategy != null) {
      backButton2 = (
        <Link
          to={{
            state: { campaign: this.state.campaign },
            pathname: '/campaign',
          }}>
          {' '}
          <ReturnCampaign>
            <img style={{ width: 190 }} src="images/CampaignsButton.png" />
          </ReturnCampaign>
        </Link>
      );
    }

    let toggleAttributes = null;

    if (this.props.attributeChanged != undefined) {
      if (this.state.toggled == false) {
        toggleAttributes = (
          <AttributeLogo onClick={this.toggleAttributes}>
            <i class="fa fa-toggle-off" />
          </AttributeLogo>
        );
      } else {
        toggleAttributes = (
          <AttributeLogo onClick={this.toggleAttributes}>
            <i class="fa fa-toggle-on" />
          </AttributeLogo>
        );
      }
    }

    let myProfileImage = 'images/MyQernil.png';

    let toggleMenu = null;

    // if(this.props.attributeChanged!=undefined){

    if (this.state.profileToggled == false) {
    } else {
      myProfileImage = 'images/MyQernilRed.png';
      toggleMenu = (
        <SideBar>
          <Link style={{ textDecoration: 'none' }} to="/adminlogout">
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
      <MyHeader>
        {backButton}
        {backButton2}
        <MyHeaderLogo>
          <Link
            style={{
              color: 'black',
              textDecoration: 'none',
              fontFamily: 'cursive',
            }}
            to="/adminconsole">
            Influencers Admin
          </Link>
        </MyHeaderLogo>

        <MyMenuBar>
          <Link
            style={{ color: 'black', textDecoration: 'none' }}
            to="/adminconsole">
            {' '}
            <MenuItem>Manage Event Vendors</MenuItem>
          </Link>
          <Link
            style={{ color: 'black', textDecoration: 'none' }}
            to="/adminexperiences">
            {' '}
            <MenuItem>Manage Experiences</MenuItem>
          </Link>
          <Link
            style={{ color: 'black', textDecoration: 'none' }}
            to="/adminusers">
            {' '}
            <MenuItem>Manage Influencers</MenuItem>
          </Link>
          <Link
            style={{ color: 'black', textDecoration: 'none' }}
            to="/adminpush">
            {' '}
            <MenuItem>Manage Push</MenuItem>
          </Link>
        </MyMenuBar>
        <RightSide>{toggleAttributes}</RightSide>

        <TechnologyInc>Expin</TechnologyInc>
        {toggleMenu}
        <ProfileLogo onClick={this.toggleProfileMenu}>
          <img style={{ width: 40 }} src={myProfileImage} />
        </ProfileLogo>
      </MyHeader>
    );

    // }else{
    //     return null
    // }
  }
}

const MyHeader = glamorous.div({
  margin: 'auto',
  width: '100%',
  height: 50,
  color: '#444',
});
const MenuItem = glamorous.div({
  height: 30,
  marginTop: 10,
  display: 'inline-block',
  textAlign: 'center',
  marginRight: 20,
  fontSize: 12,
  fontFamily: 'arial',
  fontWeight: 'bold',
  ':hover': {
    color: 'red',
    textDecoration: 'underline',
  },
});

const MyHeaderLogo = glamorous.div({
  width: 500,
  textAlign: 'center',
  marginLeft: -250,
  color: 'white',
  position: 'absolute',
  left: '50%',
  fontSize: 42,
  overflow: 'hidden',
  height: 60,
});

const MyMenuBar = glamorous.div({
  width: 650,
  textAlign: 'center',
  marginLeft: -325,
  color: 'white',
  position: 'absolute',

  left: '50%',
  fontSize: 16,
  overflow: 'hidden',
  height: 60,
  top: 65,
  zIndex: 1000,
});

const RightSide = glamorous.div({
  width: 400,
  color: 'white',
  position: 'absolute',
  right: 20,
  top: 0,
  fontSize: 36,
  alignItems: 'flex-end',
  flexDirection: 'row',
  flex: 1,
  height: 50,
  alignContent: 'flex-end',
});

const AlertLogo = glamorous.div({
  width: 30,
  height: 30,
  marginTop: 10,
  paddingTop: 2,
  fontSize: 20,
  marginRight: 5,
  cursor: 'pointer',
  textAlign: 'center',
  borderRadius: 10,
  position: 'absolute',
  left: 142,
  top: 2,
  marginLeft: 10,
  ':hover': {
    color: 'white',
  },
});

const AttributeLogo = glamorous.div({
  paddingTop: 5,
  fontSize: 44,
  textAlign: 'center',
  width: 30,
  height: 30,
  left: 110,
  top: 10,
  marginTop: 0,
  marginLeft: 0,
  marginRight: 10,
  cursor: 'pointer',
  position: 'absolute',
});

const ProfileLogo = glamorous.div({
  paddingTop: 2,
  fontSize: 20,
  textAlign: 'center',
  width: 30,
  height: 30,
  cursor: 'pointer',
  borderRadius: 10,

  marginTop: 10,
  marginLeft: 10,
  right: 25,
  top: 2,
  position: 'absolute',
  ':hover': {
    color: 'white',
  },
});

const SearchButton = glamorous.div({
  width: 150,
  height: 36,
  position: 'absolute',
  top: 10,
  right: 0,
});

const ReturnHome = glamorous.div({
  position: 'absolute',
  left: 10,
  top: 10,
  width: 100,
  height: 31,

  color: 'white',
  textAlign: 'center',
  paddingTop: 5,
  cursor: 'pointer',
  fontSize: 22,
});

const AlertLabel = glamorous.div({
  position: 'absolute',
  left: 120,
  top: 53,
  width: 100,
  height: 31,
  color: 'gray',
  textAlign: 'center',
  paddingTop: 5,
  fontFamily: 'DINNextLTPro',
  cursor: 'pointer',
  fontSize: 10,
});
const ProfileLabel = glamorous.div({
  position: 'absolute',
  right: 132,
  top: 53,
  width: 100,
  height: 31,
  fontFamily: 'DINNextLTPro',
  color: 'gray',
  textAlign: 'center',
  paddingTop: 5,
  cursor: 'pointer',
  fontSize: 10,
});

const MagArrow = glamorous.div({
  right: 123,
  top: 21,
  position: 'absolute',
  width: 20,
  height: 20,
  padding: 2,
  color: 'gray',
  textAlign: 'center',
  cursor: 'pointer',
  fontSize: 20,
  zIndex: 10000,
});

const ReturnCampaign = glamorous.div({
  position: 'absolute',
  left: 110,
  top: 10,
  width: 180,

  height: 31,
  borderRadius: 10,
  paddingTop: 5,
  cursor: 'pointer',
  fontSize: 22,
});

const TechnologyInc = glamorous.div({
  position: 'fixed',
  left: 20,
  bottom: 10,
  width: 260,
  fontFamily: 'DINNextLTPro',
  color: 'gray',
  height: 31,
  borderRadius: 10,
  paddingTop: 5,
  cursor: 'pointer',
  fontSize: 16,
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

const SideBar = glamorous.div({
  right: 19,
  top: 60,
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

const IconLogo = glamorous.div({
  width: 45,
  float: 'left',
});
