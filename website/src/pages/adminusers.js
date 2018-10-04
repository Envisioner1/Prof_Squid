import React from 'react';
import glamorous from 'glamorous';
import firebase, {
  doCreateUserWithEmailAndPassword,
  auth,
  provider,
  db,
} from '../Components/firebase.js';
import Header from '../components/headeradmin';

export default class AdminConsole extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      email: '',
      loggedIn: false,
      redirect: false,
      redirect2: false,
      potentialUsers: null,
      vendors: {},
      users: null,
    };

    this.renderUsers = this.renderUsers.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.approveUser = this.approveUser.bind(this);
    this.approveUserB = this.approveUserB.bind(this);
    this.rejectUser = this.rejectUser.bind(this);
  }

  componentDidMount() {
    this.getUserData();
  }

  async getUserData() {
    //console.log('Get Phone Users');

    let userRef = await firebase.database().ref(`users/`);
    let userValue = await userRef.once('value');

    let pRef = await firebase.database().ref(`potentialInfluencers/`);
    let pValue = await pRef.once('value');

    //console.log(userValue._value);

    //console.log('Got User lsit');
    //console.log(userValue.val());
    this.setState({
      users: userValue.val(),
      vendors: pValue.val(),
    });
  }

  async approveUser(xId) {
    //console.log('approve user');
    //console.log(xId);
    let newNode = await firebase
      .database()
      .ref(`users/${xId}/approved`)
      .set(true);

    firebase
      .database()
      .ref(`users/${xId}/postCount`)
      .set(0);
    firebase
      .database()
      .ref(`users/${xId}/reviewCount`)
      .set(0);
    firebase
      .database()
      .ref(`users/${xId}/followerCount`)
      .set(0);

    let newNode2 = await firebase
      .database()
      .ref(`users/${xId}/rejected`)
      .remove();

    let xtime = new Date().getTime();

    if (this.state.users[xId].pushToken) {
      await firebase
        .database()
        .ref('users/' + xId + '/pushNotifications/' + xtime)
        .set({
          recieverKey: this.state.users[xId].pushToken,
          title: 'Expin Account Approved!',
          userId: xId,
          xtime: xtime,
          message: 'You have been approved as an influencer for Expin',
          content: 'Succesful approval of user',
        });
    }

    this.getUserData();
  }

  async approveUserB(xId, vendorId) {
    //console.log('approve user');
    //console.log(xId);
    let newNode = await firebase
      .database()
      .ref(`users/${xId}/approved`)
      .set(true);

    await firebase
      .database()
      .ref(`users/${xId}/vendor`)
      .set(true);

    await firebase
      .database()
      .ref(`users/${xId}/vendorId`)
      .set(vendorId);
    firebase
      .database()
      .ref(`users/${xId}/postCount`)
      .set(0);
    firebase
      .database()
      .ref(`users/${xId}/reviewCount`)
      .set(0);
    firebase
      .database()
      .ref(`users/${xId}/followerCount`)
      .set(0);

    let newNode2 = await firebase
      .database()
      .ref(`users/${xId}/rejected`)
      .remove();

    this.getUserData();
  }

  async rejectUser(xId) {
    //console.log('reject user');
    //console.log(xId);
    let newNode = await firebase
      .database()
      .ref(`users/${xId}/approved`)
      .set(false);
    let newNode2 = await firebase
      .database()
      .ref(`users/${xId}/rejected`)
      .set(true);

    let xtime = new Date().getTime();

    if (this.state.users[xId].pushToken) {
      await firebase
        .database()
        .ref('users/' + xId + '/pushNotifications')
        .push({
          recieverKey: this.state.users[xId].pushToken,
          title: 'Expin Account Rejected!',
          userId: xId,
          xtime: xtime,
          message: 'You have been rejected as an influencer for Expin',
          content: 'Sorry, Rejection of user',
        });
    }

    this.getUserData();
  }

  renderUsers() {
    let potentialUsers = this.state.users;

    let rejectUser = this.rejectUser;
    let approveUser = this.approveUser;
    let approveUserB = this.approveUserB;
    let vendors = this.state.vendors;

    if (potentialUsers != null) {
      return Object.keys(this.state.users).map(function(index) {
        let user = potentialUsers[index];

        let approveButton = (
          <UserApprove
            onClick={function() {
              approveUser(index);
            }}>
            Approve User
          </UserApprove>
        );

        let vendorId = null;

        let foundVendor = false;
        for (let bb in vendors) {
          if (user.email) {
            if (user.email.toLowerCase() == vendors[bb].email.toLowerCase()) {
              foundVendor = true;
              vendorId = bb;
              break;
            }
          }
        }

        if (foundVendor == true) {
          approveButton = (
            <UserApprove
              style={{ backgroundColor: 'blue' }}
              onClick={function() {
                approveUserB(index, vendorId);
              }}>
              Approve Vendor
            </UserApprove>
          );
        }

        let rejectButton = (
          <UserReject
            onClick={function() {
              rejectUser(index);
            }}>
            Reject
          </UserReject>
        );

        let status = 'Pending';
        if (user.approved == true) {
          approveButton = null;
          status = 'Approved';
        }

        if (user.rejected == true) {
          status = 'Rejected';
        }

        let vendorStatus = 'influencer';
        if (foundVendor == true) {
          vendorStatus = 'vendor';
        }

        return (
          <UserItem>
            <UserFirst>{user.firstName}</UserFirst>
            <UserLast>{user.lastName}</UserLast>
            <UserEmail>{user.instagramName}</UserEmail>
            <UserEmail>{vendorStatus}</UserEmail>
            <UserStatus>{status}</UserStatus>
            {approveButton}
            {rejectButton}
          </UserItem>
        );
      });
    }
  }

  render() {
    let potentialUsers = this.renderUsers();

    return (
      <div>
        <Header />
        <TopTitle>Manage Event Vendors</TopTitle>

        <UserList> {potentialUsers}</UserList>
      </div>
    );
  }
}

const TopTitle = glamorous.div({
  width: '100%',
  margin: 50,
  textAlign: 'center',
  fontSize: 22,
  color: '#C9C9C9',
  fontFamily: 'DINNextLTPro',
});

const UserItem = glamorous.div({
  width: '95%',
  height: 30,
  margin: 2,
  padding: 3,
  borderBottom: '1px solid gray',
});
const UserFirst = glamorous.div({ width: 100, float: 'left' });
const UserLast = glamorous.div({ width: 100, float: 'left' });
const UserEmail = glamorous.div({ width: 150, float: 'left' });
const UserStatus = glamorous.div({
  width: 80,
  float: 'left',
  textAlign: 'center',
});
const UserApprove = glamorous.div({
  cursor: 'pointer',
  width: 130,
  float: 'right',
  backgroundColor: 'green',
  color: 'white',
  cursor: 'pointer',
  textAlign: 'center',
  marginLeft: 10,
  borderRadius: 10,
});
const UserReject = glamorous.div({
  cursor: 'pointer',
  width: 80,
  float: 'right',
  backgroundColor: 'red',
  color: 'white',
  cursor: 'pointer',
  textAlign: 'center',
  marginLeft: 10,
  borderRadius: 10,
});
const UserList = glamorous.div({
  flex: 1,
  position: 'absolute',
  left: '50%',
  top: 150,
  marginLeft: -500,
  padding: 10,
  width: 1000,
  flexDirection: 'row',
  height: 600,
  backgroundColor: 'white',
  border: '1px solid gray',
  borderRadius: 20,
});

const MyGrid = glamorous.div({
  margin: 'auto',
  width: 100,
  height: 200,
  backgroundColor: '#fff',
  color: '#444',
});
