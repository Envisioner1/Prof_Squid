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
    };

    this.renderUsers = this.renderUsers.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.approveUser = this.approveUser.bind(this);
    this.rejectUser = this.rejectUser.bind(this);
  }

  componentDidMount() {
    this.getUserData();
  }

  async getUserData() {
    //console.log('Get Potential Users');

    let userRef = await firebase.database().ref(`potentialInfluencers`);
    let userValue = await userRef.once('value');

    //console.log('Got User lsit');
    //console.log(userValue.val());
    this.setState({
      potentialUsers: userValue.val(),
    });
  }

  async approveUser(xId) {
    //console.log('approve user');
    //console.log(xId);
    let newNode = await firebase
      .database()
      .ref(`potentialInfluencers/${xId}/approved`)
      .set(true);
    let newNode2 = await firebase
      .database()
      .ref(`potentialInfluencers/${xId}/rejected`)
      .remove();

    this.getUserData();
  }

  async rejectUser(xId) {
    //console.log('reject user');
    //console.log(xId);
    let newNode = await firebase
      .database()
      .ref(`potentialInfluencers/${xId}/approved`)
      .set(false);
    let newNode2 = await firebase
      .database()
      .ref(`potentialInfluencers/${xId}/rejected`)
      .set(true);
    this.getUserData();
  }

  renderUsers() {
    let potentialUsers = this.state.potentialUsers;

    let rejectUser = this.rejectUser;
    let approveUser = this.approveUser;

    if (potentialUsers != null) {
      return Object.keys(this.state.potentialUsers).map(function(index) {
        let user = potentialUsers[index];

        let approveButton = (
          <UserApprove
            onClick={function() {
              approveUser(index);
            }}>
            Approve
          </UserApprove>
        );
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

        let xname = user.instagramUsername;

        if (xname == undefined) {
          xname = '----';
        }

        return (
          <UserItem>
            <UserFirst>{user.firstname}</UserFirst>
            <UserLast>{user.lastname}</UserLast>
            <UserEmail>{user.email}</UserEmail>
            <UserInsta>{xname}</UserInsta>
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
        <TopTitle>Manage Influencers</TopTitle>

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
const UserFirst = glamorous.div({ width: 120, float: 'left' });
const UserLast = glamorous.div({ width: 120, float: 'left' });
const UserEmail = glamorous.div({ width: 200, float: 'left' });
const UserInsta = glamorous.div({ width: 50, float: 'left' });
const UserStatus = glamorous.div({
  width: 120,
  float: 'left',
  textAlign: 'center',
});
const UserApprove = glamorous.div({
  cursor: 'pointer',
  width: 100,
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
  width: 100,
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
