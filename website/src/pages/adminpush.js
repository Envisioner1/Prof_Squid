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
      newMessage: '',
      newContent: '',
      pushType: 'Vendor',
      pushes: null,
    };

    this.getUserData = this.getUserData.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.handleNewContent = this.handleNewContent.bind(this);
    this.sendPush = this.sendPush.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
  }

  componentDidMount() {
    this.getUserData();
  }

  async getUserData() {
    //console.log('Get Phone Users');

    let pRef = await firebase.database().ref(`topicNotifications/`);
    let pValue = await pRef.once('value');

    this.setState({
      pushes: pValue.val(),
    });
  }

  handleRadio(vendor) {
    console.log('Handle Radio');
    console.log(vendor);

    if (vendor == true) {
      this.setState({ pushType: 'Vendor' });
    } else {
      this.setState({ pushType: 'Influencer' });
    }
    //console.log(this.state);
  }

  renderPosts() {
    let pushes = this.state.pushes;

    if (pushes != null) {
      return Object.keys(pushes).map(function(index) {
        let user = pushes[index];

        return (
          <UserItem>
            <UserFirst>{user.title}</UserFirst>
            <UserLast>{user.content}</UserLast>
          </UserItem>
        );
      });
    } else {
      return null;
    }
  }

  async sendPush() {
    console.log('send Push');

    let userRef = await firebase
      .database()
      .ref(`topicNotifications/`)
      .push({
        title: this.state.newMessage,
        content: this.state.newContent,
        xtype: this.state.pushType,
      });

    this.setState({ newMessage: '', newContent: '' });
    this.getUserData();
  }

  handleNewMessage(input, value) {
    this.setState({ newMessage: input.target.value });
    console.log(this.state);
  }

  handleNewContent(input, value) {
    this.setState({ newContent: input.target.value });
    console.log(this.state);
  }

  render() {
    let vendorChecked = this.state.pushType;
    let handleRadio = this.handleRadio;

    return (
      <div>
        <Header />
        <TopTitle>Send Push Notification</TopTitle>
        <UserList>
          <input
            placeholderTextColor="red"
            placeholder="Type your push title here"
            style={{
              fontSize: 14,
              paddingLeft: 5,

              fontFamily: 'DINNextLTProLight',
              color: 'black',
              width: 200,
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
            value={this.state.newMessage}
            onChange={this.handleNewMessage}
          />
          <br />
          <br />
          <input
            placeholderTextColor="red"
            placeholder="Type your push content here"
            style={{
              fontSize: 14,
              paddingLeft: 5,

              fontFamily: 'DINNextLTProLight',
              color: 'black',
              width: 500,
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
            value={this.state.newContent}
            onChange={this.handleNewContent}
          />
          <br />
          <br />
          <input
            type={'radio'}
            name={'Recipient'}
            onClick={function() {
              handleRadio(true);
            }}
          />{' '}
          Vendors
          <input
            type={'radio'}
            name={'Recipient'}
            onClick={function() {
              handleRadio(false);
            }}
          />{' '}
          Influencers
          <br />
          <br />
          <input type="button" value="Push" onClick={this.sendPush} />
          {this.renderPosts()}
        </UserList>
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
const UserFirst = glamorous.div({ width: 200, float: 'left' });
const UserLast = glamorous.div({ width: 400, float: 'left' });
const UserEmail = glamorous.div({ width: 200, float: 'left' });
const UserStatus = glamorous.div({
  width: 120,
  float: 'left',
  textAlign: 'center',
});
const UserApprove = glamorous.div({
  cursor: 'pointer',
  width: 150,
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
