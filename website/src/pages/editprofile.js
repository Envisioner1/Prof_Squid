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
import Header from '../components/header';
import FileUploader from 'react-firebase-file-uploader';

export default class Greeting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oUsername: '',
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      userImage: null,
      password2: '',
      redirect: false,
      uid: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFirstChange = this.handleFirstChange.bind(this);
    this.handleLastChange = this.handleLastChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordChange2 = this.handlePasswordChange2.bind(this);
    this.handleGo = this.handleGo.bind(this);
    this.getUserData = this.getUserData.bind(this);

    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.gotAvatar = this.gotAvatar.bind(this);
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

  handleUploadStart() {
    this.setState({ isUploading: true, progress: 0 });
  }
  handleProgress(progress) {
    this.setState({ progress });
  }
  handleUploadError(error) {
    this.setState({ isUploading: false });
    console.error(error);
  }
  handleUploadSuccess(filename) {
    //console.log(filename);
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref('avatars')
      .child(filename)
      .getDownloadURL()
      .then(this.gotAvatar);
  }

  gotAvatar(url) {
    this.setState({ userImage: url });

    firebase
      .database()
      .ref(`users/${this.state.uid}/userImage`)
      .set(url);
  }

  async getUserData(authUser) {
    //console.log('User Id');

    //console.log(authUser.uid);

    let userRef = await firebase.database().ref(`users/${authUser.uid}`);

    let userValue = await userRef.once('value');

    //console.log('Get User Data');
    let user = userValue.val();

    //console.log(user);

    this.setState({
      userImage: user.userImage,
      uid: authUser.uid,
      oUsername: user.username,
      username: user.username,
      originalusername: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
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

  async handleImage() {
    let imageUrl = null;

    firebase
      .database()
      .ref(`users/${this.state.uid}/avatar`)
      .set(imageUrl);
  }

  async handleGo() {
    //console.log('handel Go');

    if (this.state.username.length < 6) {
      alert('Username not long enough!');
      return;
    }

    let usernameRef = await firebase
      .database()
      .ref(`usernames/${this.state.username}`);

    let uservalue = await usernameRef.once('value');

    //console.log(uservalue);
    //console.log(uservalue.val());

    if (this.state.username != this.state.oUsername) {
      if (uservalue.val() != null) {
        alert('Username already in use.');
        return false;
      }
    }

    let myUser = {
      userImage: this.state.userImage,
      email: this.state.email,
      username: this.state.username,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
    };

    //console.log(myUser);
    firebase
      .database()
      .ref(`users/${this.state.uid}`)
      .set(myUser);
    firebase
      .database()
      .ref(`usernames/${this.state.username}`)
      .set(this.state.uid);
    firebase
      .database()
      .ref(`usernames/${this.state.originalusername}`)
      .remove();

    alert('Profile Updated');
    this.setState({ redirect: true });
  }
  render() {
    if (this.state.redirect == true) {
      //console.log('REDIRECT TO LOGIN');
      return <Redirect to={'/home'} />;
    }

    let userImage = null;

    if (this.state.userImage != null) {
      userImage = (
        <img
          src={this.state.userImage}
          style={{
            border: '1px solid black',
            marginLeft: -130,
            width: 140,
            height: 140,
            borderRadius: 70,
          }}
        />
      );
    } else {
      userImage = (
        <div
          style={{
            border: '1px solid black',
            width: 140,
            height: 100,
            borderRadius: 70,
            backgroundColor: 'gray',
            paddingTop: 30,
            paddingBottom: -30,
          }}>
          Upload Photo
        </div>
      );
    }

    return (
      <div>
        <Header />
        <TopTitle>Edit Profile:</TopTitle>

        <MyGrid>
          <div
            style={{
              marginLeft: 260,
              alignItems: 'center',
              alignContent: 'center',
            }}>
            {userImage}
            <br />
            <br />
            <label
              style={{
                backgroundColor: 'steelblue',
                color: 'white',
                padding: 10,
                borderRadius: 4,
                marginLeft: -130,
                cursor: 'pointer',
              }}>
              Select your Avatar
              <FileUploader
                hidden
                name="Avatar"
                accept="image/*"
                filename={file => this.state.uid + file.name.split('.')[1]}
                storageRef={firebase.storage().ref('avatars')}
                onUploadStart={this.handleUploadStart}
                onUploadError={this.handleUploadError}
                onUploadSuccess={this.handleUploadSuccess}
                onProgress={this.handleProgress}
              />
            </label>
          </div>
          <LabelTop>Username:</LabelTop>

          <LabelSection>
            <input
              maxLength={16}
              style={{ fontFamily: 'DINNextLTPro', fontSize: 20, width: 250 }}
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </LabelSection>
          <LabelTop>First Name:</LabelTop>

          <LabelSection>
            <input
              maxLength={16}
              style={{ fontFamily: 'DINNextLTPro', fontSize: 20, width: 250 }}
              type="text"
              name="firstname"
              value={this.state.firstname}
              onChange={this.handleFirstChange}
            />
          </LabelSection>

          <LabelTop>Last Name:</LabelTop>

          <LabelSection>
            <input
              maxLength={16}
              style={{ fontFamily: 'DINNextLTPro', fontSize: 20, width: 250 }}
              type="text"
              name="lastname"
              value={this.state.lastname}
              onChange={this.handleLastChange}
            />
          </LabelSection>

          <LabelTop>Email:</LabelTop>

          <LabelSection>
            <input
              disabled
              maxLength={100}
              style={{
                backgroundColor: 'gray',
                fontSize: 20,
                width: 250,
                fontFamily: 'DINNextLTPro',
                color: 'white',
              }}
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
          </LabelSection>

          <div style={{ marginLeft: 140, marginTop: 10 }}>
            <SaveButton onClick={this.handleGo}> Save Changes</SaveButton>
          </div>
        </MyGrid>
      </div>
    );
  }
}

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

const TopTitle = glamorous.div({
  width: '100%',
  marginTop: 20,
  textAlign: 'center',
  fontSize: 22,
  color: '#C9C9C9',
  fontFamily: 'DINNextLTPro',
});
const MyGrid = glamorous.div({
  margin: 'auto',
  marginTop: 15,
  width: 400,
  height: 520,
  backgroundColor: '#eeeeee',
  color: '#000',
  paddingTop: 15,
});

const LogoText = glamorous.div({
  color: 'white',
  fontSize: 50,
  margin: 50,
});

const LabelSection = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: 'white',
  fontSize: 16,
  marginLeft: 70,
});
const LabelTop = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: 'black',
  fontSize: 16,
  fontFamily: 'DINNextLTPro',
  marginLeft: 70,

  marginTop: 20,
});

const PassWarn = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: 'red',
  fontSize: 16,
  marginBottom: 10,
});

const LabelLost = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: 'red',
  fontSize: 16,
  marginTop: 20,
});

const LabelText = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: 'white',
  fontSize: 16,
  marginTop: 20,
});
