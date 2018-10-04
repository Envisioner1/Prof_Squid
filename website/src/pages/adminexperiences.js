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
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      userImage: null,
      loaded: false,
      password2: '',
      redirect: false,
      campaigns: null,
      uid: 0,
      newCampaign: false,
      newTitle: '',

      currentPage: 0,
      newDesc: '',
      redirect: false,
      selectedCampaign: null,
    };
    this.deleteExp = this.deleteExp.bind(this);

    this.getUserData = this.getUserData.bind(this);
    this.renderExperiences = this.renderExperiences.bind(this);
  }

  async getUserData() {
    //console.log('User Id');

    //console.log(this.state.authUser.uid);

    let userRef = await firebase.database().ref(`experiences`);

    let userValue = await userRef.once('value');

    //console.log('Get Campaign Data');
    let experiences = userValue.val();

    userRef = await firebase.database().ref(`approved`);

    userValue = await userRef.once('value');

    //console.log('Get Campaign Data');
    let approved = userValue.val();

    //console.log(experiences);
    this.setState({
      loaded: true,
      experiences: experiences,
      approved: approved,
    });
  }

  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    //console.log(auth);
    auth.onAuthStateChanged(authUser => {
      //console.log('auth changed');
      //console.log(authUser);

      if (authUser) {
        this.setState({ authUser: authUser });
        this.getUserData();
      }
    });
  }

  async deleteExp(exp, subexp) {
    console.log('delete Experience');
    console.log(exp);
    console.log(subexp);
    console.log(this.state.experiences[subexp][exp]);
    let xcat = this.state.experiences[subexp][exp].category;
    await firebase
      .database()
      .ref(`experiences/${subexp}/${exp}`)
      .remove();

    await firebase
      .database()
      .ref(`approved/${xcat}/${exp}`)
      .remove();
    this.getUserData();
  }

  renderExperiences() {
    if (this.state.experiences != undefined) {
      let experiences = this.state.experiences;
      let deleteExp = this.deleteExp;
      let nowTime = new Date().getTime();

      let approved = this.state.approved;
      return Object.keys(this.state.experiences).map(function(indexb) {
        let subexp = experiences[indexb];

        // console.log('SUB EXP ');
        // console.log(subexp);

        return Object.keys(subexp).map(function(index) {
          console.log('Experience Name');
          console.log(subexp[index].schedule);

          let xcount = 0;

          let catname = subexp[index].category;

          let waitingListCount = 0;

          console.log('CAT NAME');
          console.log(catname);
          if (approved != null) {
            if (approved[catname]) {
              console.log('Found category');
              if (approved[catname][subexp[index].newId] != undefined) {
                if (approved[catname][subexp[index].newId].waitingList) {
                  console.log('WAITINGLIST');

                  for (let bb in approved[catname][subexp[index].newId]
                    .waitingList) {
                    waitingListCount++;
                  }
                }

                if (approved[catname]) {
                  let xexp =
                    approved[subexp[index].category][subexp[index].newId];

                  console.log('Found Approved Node');
                  console.log(xexp);

                  for (let bb in xexp.schedule) {
                    console.log(xexp.schedule[bb].signedUp);

                    if (
                      xexp.schedule[bb].signedUp != 0 &&
                      xexp.schedule[bb].signedUp != undefined
                    ) {
                      console.log('Add to xcount');
                      console.log(xexp.schedule[bb].signedUp);

                      xcount = xcount + parseInt(xexp.schedule[bb].signedUp);
                    }
                  }
                }
              }
            }
          }
          let exp = subexp[index];

          let xStatus = exp.status;

          if (exp.endDate < nowTime) {
            xStatus = 'Expired';
          }

          if (exp.pinNumber == undefined) {
            exp.pinNumber = '- - -';
          }

          //console.log(exp.newId);
          return (
            <ExperienceItem key={index}>
              <Link
                style={{ textDecoration: 'none' }}
                to={{
                  pathname: '/approveExperience',
                  state: { userId: exp.uid, newId: exp.newId },
                }}>
                <ExperienceTitle>{exp.experienceName}</ExperienceTitle>
                <ExperienceCategory>{exp.category}</ExperienceCategory>
                <ExperienceStatus>{xStatus}</ExperienceStatus>
                <ExperienceSlots>{exp.slotsAvailable}</ExperienceSlots>
                <ExperienceWL>{waitingListCount}</ExperienceWL>
                <ExperiencePins>{exp.pinsUsed}</ExperiencePins>
                <ExperienceBK>{xcount}</ExperienceBK>
                <ExperienceNoShows>{exp.noShows}</ExperienceNoShows>
                <ExperienceNoShows>{exp.pinNumber}</ExperienceNoShows>
              </Link>
              <ExperienceNoShows
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={function() {
                  deleteExp(index, indexb, subexp);
                }}>
                Delete
              </ExperienceNoShows>
            </ExperienceItem>
          );
        });
      });
    }
  }

  render() {
    let blackBackground = null;
    let addNewCampaign = null;
    if (this.state.redirect == true) {
      //console.log('REDIRECT TO LOGIN');
      return (
        <Redirect
          to={{
            state: { campaign: this.state.selectedCampaign },
            pathname: '/campaign',
          }}
        />
      );
    }

    if (this.state.newCampaign == true) {
      blackBackground = <BlackBackground onClick={this.cancelAdd} />;
      addNewCampaign = this.renderNewCampaign();
    }

    if (this.state.loaded != false) {
      return (
        <div>
          <Header />

          <TopTitle>Manage Experiences</TopTitle>

          <AllExperiences>
            <ExperienceHeader>
              <ExperienceTitle style={{ fontSize: 12, color: 'gray' }}>
                TITLE
              </ExperienceTitle>
              <ExperienceCategory style={{ fontSize: 12, color: 'gray' }}>
                CATEGORY
              </ExperienceCategory>
              <ExperienceStatus style={{ fontSize: 12, color: 'gray' }}>
                STATUS
              </ExperienceStatus>
              <ExperienceSlots style={{ fontSize: 12, color: 'gray' }}>
                SLOTS
              </ExperienceSlots>
              <ExperienceWL style={{ fontSize: 12, color: 'gray' }}>
                WL
              </ExperienceWL>
              <ExperiencePins style={{ fontSize: 12, color: 'gray' }}>
                PINS
              </ExperiencePins>
              <ExperienceBK style={{ fontSize: 12, color: 'gray' }}>
                BK
              </ExperienceBK>
              <ExperienceNoShows style={{ fontSize: 12, color: 'gray' }}>
                NO-SHOWS
              </ExperienceNoShows>
              <ExperienceNoShows style={{ fontSize: 12, color: 'gray' }}>
                PIN
              </ExperienceNoShows>
              <ExperienceNoShows style={{ fontSize: 12, color: 'gray' }}>
                DELETE
              </ExperienceNoShows>
            </ExperienceHeader>

            {this.renderExperiences()}
          </AllExperiences>
        </div>
      );
    } else {
      return (
        <div>
          <Header />
          <TopTitle>Experiences</TopTitle>

          <LoadingGIF>
            <img src="images/loading.gif" />
          </LoadingGIF>
        </div>
      );
    }
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
const Campaigns = glamorous.div({
  margin: 'auto',
  width: 855,
  overflowY: 'hidden',
  overflowX: 'hidden',
  height: 685,
});
const CampaignTop = glamorous.div({
  position: 'relative',
  top: -25,
  left: 0,
  margin: 'auto',
  width: 850,
  background: 'linear-gradient(to bottom, black , transparent)',
  height: 50,
});

const CampaignItem = glamorous.div({
  margin: 10,
  ':hover': {
    backgroundColor: 'gray',
    backgroundImage: 'linear-gradient(to bottom, #FFFFFF 0%, #EEEEEE 100%)',
  },
  width: 140,
  height: 140,
  float: 'left',
  borderRadius: 33,
  backgroundColor: 'white',
  position: 'relative',
  cursor: 'pointer',
  backgroundImage: 'linear-gradient(to bottom, #FFFFFF 0%, #C9C9C9 100%)',
  padding: 5,
  backgroundColor: '#C9C9C9',
});

const CampaignItemNew = glamorous.div({
  margin: 10,

  width: 140,
  height: 140,
  float: 'left',
  borderRadius: 33,
  backgroundColor: 'black',
  position: 'relative',
  cursor: 'pointer',
  //    backgroundImage: 'linear-gradient(to bottom, #FFFFFF 0%, #C9C9C9 100%)',
  padding: 5,
  border: '1 px solid white',
  backgroundColor: 'black',

  ':hover': {
    opacity: 0.5,
    backgroundColor: '#C9C9C9',
  },
});

const CampaignTitle = glamorous.div({
  width: 115,
  padding: 7,
  paddingTop: 13,
  height: 80,
  fontSize: 21,
  fontFamily: 'DINNextLTPro',
  textOverflow: 'ellipsis',

  textTransform: 'capitalize',
  flexWrap: 'wrap',
  overflow: 'hidden',
  fontWeight: 'bold',
  letterSpacing: 0.63,
  color: '#000000',
});
const CampaignSeperator = glamorous.div({
  backgroundColor: 'black',
  position: 'absolute',
  right: 20,
  top: 95,
  height: 1,
  width: 100,
});
const CampaignTreeCount = glamorous.div({
  fontSize: 30,
  color: '#C1272D',
  position: 'absolute',
  right: 42,
  top: 108,
  fontFamily: 'DINNextLTPro',
});
const CampaignTreeIcon = glamorous.div({
  position: 'absolute',
  right: 8,
  top: 110,
  color: 'black',
  width: 30,
  height: 30,
});

const BlackBackground = glamorous.div({
  position: 'absolute',
  left: 0,
  zIndex: 10,
  top: 0,
  right: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
  backgroundColor: 'black',
  opacity: 0.5,
});

const DeleteButton = glamorous.div({
  borderRadius: 5,
  cursor: 'pointer',
  width: 120,
  color: 'white',
  backgroundColor: '#C1272D',
  textAlign: 'center',
  fontFamily: 'DINNextLTPro',
  padding: 5,
  border: '1px solid white',

  ':hover': {
    color: '#C1272D',
    backgroundColor: 'white',
    border: '1px solid #C1272D',
  },
});

const CancelButton = glamorous.div({
  borderRadius: 5,
  cursor: 'pointer',
  width: 120,
  color: '#C1272D',
  textAlign: 'center',
  padding: 5,
  fontFamily: 'DINNextLTPro',
  border: '1px solid black',

  ':hover': {
    color: '#C1272D',
    backgroundColor: 'black',
    border: '1px solid white',
  },
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

const LoadingGIF = glamorous.div({
  position: 'absolute',
  left: '50%',
  top: '50%',
  marginTop: -15,
  marginLeft: -15,
});

const Sidebar = glamorous.div({
  position: 'absolute',
  left: 100,
  top: 200,
  width: 150,
  height: 700,
});

const Sidebar2 = glamorous.div({
  position: 'absolute',
  right: 100,
  top: 200,
  width: 20,
  height: 700,
});

const CampaignItemSquare = glamorous.div({
  width: 7,
  height: 7,
  borderRadius: 3,
  backgroundColor: 'gray',
  float: 'left',
});

const CampaignItemWrap = glamorous.div({
  cursor: 'pointer',
  borderRadius: 5,
  border: '1px solid gray',
  float: 'left',
  margin: 3,
  padding: 2,
});

const AllExperiences = glamorous.div({
  position: 'absolute',
  left: '50%',
  marginLeft: -450,
  top: 160,
  width: 900,
  height: 600,
});

const ExperienceHeader = glamorous.div({
  width: 900,
  borderBottom: '1px solid lightgray',
  height: 20,
  padding: 5,
});
const ExperienceItem = glamorous.div({
  width: 900,
  borderBottom: '1px solid lightgray',
  height: 20,
  padding: 5,
  ':hover': {
    backgroundColor: 'lightgray',
  },
});
const ExperienceTitle = glamorous.div({
  float: 'left',
  width: 300,
  fontFamily: 'DINNextLTPro',
  fontSize: 12,
  textAlign: 'left',
});

const ExperienceStatus = glamorous.div({
  float: 'left',
  width: 70,
  fontFamily: 'DINNextLTPro',
  fontSize: 12,
  textAlign: 'center',
});
const ExperienceCategory = glamorous.div({
  float: 'left',
  width: 100,
  fontFamily: 'DINNextLTPro',
  fontSize: 12,
  textAlign: 'center',
});
const ExperienceSlots = glamorous.div({
  float: 'left',
  width: 75,
  fontFamily: 'DINNextLTPro',
  fontSize: 12,
  textAlign: 'center',
});
const ExperienceWL = glamorous.div({
  float: 'left',
  width: 50,
  fontFamily: 'DINNextLTPro',
  fontSize: 12,
  textAlign: 'center',
});
const ExperiencePins = glamorous.div({
  float: 'left',
  width: 50,
  fontFamily: 'DINNextLTPro',
  fontSize: 12,
  textAlign: 'center',
});
const ExperienceBK = glamorous.div({
  float: 'left',
  width: 50,
  fontFamily: 'DINNextLTPro',
  fontSize: 12,
  textAlign: 'center',
});
const ExperienceNoShows = glamorous.div({
  float: 'left',
  width: 60,
  fontFamily: 'DINNextLTPro',
  fontSize: 12,
  textAlign: 'center',
});
