import React from 'react';
import glamorous from 'glamorous';
import Header from '../components/header';
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

    //console.log('CONSTRUCT CAMPIAGN');

    //console.log(this.props.location.state.campaign);

    this.state = {
      campaignId: this.props.location.state.campaign,
      title: '',
      loaded: false,
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      userImage: null,
      password2: '',
      uid: 0,
      newCampaign: false,
      newTitle: '',
      newDesc: '',
      newTaskTitle: '',
      newTaskDesc: '',
      redirect: false,
      showEdit: false,
      selectedCampaign: null,
      currentPage: 0,
      redirectBack: false,
    };

    this.editCampaign = this.editCampaign.bind(this);

    this.handleTitleChange2 = this.handleTitleChange2.bind(this);
    this.handleDescChange2 = this.handleDescChange2.bind(this);

    this.handleTitleChange = this.handleTitleChange.bind(this);

    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleTaskTitleChange = this.handleTaskTitleChange.bind(this);
    this.handleTaskDescChange = this.handleTaskDescChange.bind(this);

    this.getUserData = this.getUserData.bind(this);
    this.addCampaign = this.addCampaign.bind(this);
    this.cancelAdd = this.cancelAdd.bind(this);
    this.createCampaign = this.createCampaign.bind(this);
    this.renderSideBarCampaigns = this.renderSideBarCampaigns.bind(this);
    this.renderSideBarPaging = this.renderSideBarPaging.bind(this);
    this.gotoCampaign = this.gotoCampaign.bind(this);
    this.gotoCampaign = this.gotoCampaign.bind(this);
    this.saveCampaign = this.saveCampaign.bind(this);
    this.deleteCampaign = this.deleteCampaign.bind(this);
  }

  deleteCampaign() {
    firebase
      .database()
      .ref(`campaigns/${this.state.campaignId}`)
      .remove();
    this.setState({ redirectBack: true });
  }

  async saveCampaign() {
    if (this.state.title == '' || this.state.desc == '') {
      return false;
    }

    //console.log('save campaign');

    firebase
      .database()
      .ref(`campaigns/${this.state.campaignId}/title`)
      .set(this.state.title);
    firebase
      .database()
      .ref(`campaigns/${this.state.campaignId}/desc`)
      .set(this.state.desc);

    await this.setState({
      showEdit: false,
    });

    alert('Campaign Saved');
    this.getUserData();
  }

  async getUserData() {
    //console.log('Campaign Id');

    //console.log(this.state.campaignId);

    let userRef = await firebase
      .database()
      .ref(`campaigns/${this.state.campaignId}`);

    let userValue = await userRef.once('value');

    //console.log('Get Campaign Specific Data');
    let campaign = userValue.val();

    if (campaign != null) {
      let userRef2 = await firebase
        .database()
        .ref(`strategies/${this.state.campaignId}`);

      let strategies = await userRef2.once('value');

      strategies = strategies.val();

      //console.log('strategies');
      //console.log(strategies);

      this.setState({
        loaded: true,
        campaign: campaign,
        title: campaign.title,
        desc: campaign.desc,
        strategies: strategies,
      });
    }
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

  addCampaign() {
    this.setState({ newCampaign: true });
  }

  gotoCampaign(xcampaign) {
    //console.log('go to strategy');

    //console.log(this.state.strategies[xcampaign]);

    this.setState({
      redirect: true,
      campaignId: this.state.campaignId,
      strategyId: xcampaign,
      strategy: this.state.strategies[xcampaign],
    });
  }

  renderCampaigns() {
    let gotoStrategy = this.gotoCampaign;

    if (this.state.strategies != null) {
      let strategies = this.state.strategies;
      return Object.keys(this.state.strategies).map(function(name, index) {
        //console.log(name);

        let nodeCount = 0;

        let createdTime = null;
        if (strategies[name].created) {
          createdTime = new Date(strategies[name].created).toLocaleDateString();

          createdTime = createdTime.toString().replace('/', '.');
          createdTime = createdTime.toString().replace('/', '.');
        }

        if (strategies[name].nodeCount) {
          nodeCount = strategies[name].nodeCount;
        }

        return (
          <CampaignItem
            onClick={function() {
              gotoStrategy(name);
            }}
            key={name}>
            <CampaignTitle>
              {strategies[name].title.toUpperCase()}
            </CampaignTitle>
            <CampaignSeperator />
            <CampaignTreeCount>{nodeCount}</CampaignTreeCount>
            <CampaignTreeIcon>
              <img style={{ height: 18 }} src="images/PeopleIcon.png" />
            </CampaignTreeIcon>
            <CampaignTime>{createdTime}</CampaignTime>
          </CampaignItem>
        );
      });
    } else {
      return null;
    }
  }

  handleTitleChange(input, value) {
    this.setState({ newTitle: input.target.value });
  }

  handleDescChange(input, value) {
    this.setState({ newDesc: input.target.value });
  }

  handleTitleChange2(input, value) {
    this.setState({ title: input.target.value });
  }

  handleDescChange2(input, value) {
    this.setState({ desc: input.target.value });
  }

  handleTaskTitleChange(input, value) {
    this.setState({ newTaskTitle: input.target.value });
  }

  handleTaskDescChange(input, value) {
    this.setState({ newTaskDesc: input.target.value });
  }

  async createCampaign() {
    if (this.state.newTitle == '') {
      alert('Title cannot be blank');
      return false;
    }

    if (this.state.newTaskTitle == '') {
      alert('Task Title cannot be blank');
      return false;
    }

    if (this.state.newDesc == '') {
      alert('description cannot be blank');
      return false;
    }
    if (this.state.newTaskDesc == '') {
      alert('First task description cannot be blank');
      return false;
    }

    if (this.state.strategies != null) {
      let strats = Object.keys(this.state.strategies);

      for (let bb = 0; bb < strats.length; bb++) {
        //console.log('check strategy');
        //console.log(strats[bb]);
        if (this.state.strategies[strats[bb]].title === this.state.newTitle) {
          alert('Strategy tree with same title exists');
          return false;
        }
      }
    }

    //console.log('create strategy');

    let myCampaign = {
      created: firebase.database.ServerValue.TIMESTAMP,
      title: this.state.newTitle,
      desc: this.state.newDesc,
      nodeCount: 0,
    };

    let nodeCount = 1;

    //console.log(this.state.strategies);
    if (this.state.strategies != null) {
      nodeCount = Object.keys(this.state.strategies).length + 1;
    }
    //console.log(nodeCount);

    await firebase
      .database()
      .ref(`campaigns/${this.state.campaignId}/nodeCount`)
      .set(nodeCount);

    let newNode = await firebase
      .database()
      .ref(`strategies/${this.state.campaignId}`)
      .push(myCampaign);
    //console.log(newNode);

    let myFirst = {
      title: this.state.newTaskTitle,
      desc: this.state.newTaskDesc,
      parent: true,
    };

    let newNode2 = await firebase
      .database()
      .ref(`strategies/${this.state.campaignId}/${newNode.key}/tree`)
      .set(myFirst);
    //console.log(newNode2);

    await this.setState({
      newCampaign: false,
      newDesc: '',
      newTitle: '',
    });

    alert('Strategy Tree Added');
    this.getUserData();
  }

  invitePeople() {}

  cancelAdd() {
    this.setState({ newCampaign: false, showEdit: false });
  }

  renderEditCampaign() {
    let xCount = this.state.newTitle.length;

    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          zIndex: 11,
          width: 600,
          height: 400,
          marginLeft: -300,
          backgroundColor: '#eeeeee',
          top: 150,
        }}>
        <div style={{ position: 'absolute', left: 10, fontSize: 26, top: 5 }}>
          <i class="fa fa-check" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 20,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 10,
          }}>
          EDIT CAMPAIGN
        </div>

        <div
          style={{
            position: 'absolute',
            left: 25,
            fontSize: 20,
            color: '#C1272D',
            top: 55,
          }}>
          <i class="fa fa-pencil" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 60,
          }}>
          Campaign Name
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontWeight: 'bold',
            top: 100,
          }}>
          <input
            style={{
              width: 300,
              height: 30,
              fontFamily: 'DINNextLTPro',
              fontSize: 24,
            }}
            maxLength={52}
            type="text"
            name="title"
            value={this.state.title}
            onChange={this.handleTitleChange2}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 450,
            fontSize: 16,
            fontWeight: 'bold',
            top: 100,
          }}>
          <div
            style={{
              borderRadius: 5,
              cursor: 'pointer',
              fontFamily: 'DINNextLTPro',
              padding: 5,
              width: 120,
              border: '1px solid black',
            }}
            onClick={this.invitePeople}>
            <i style={{ marginRight: 10 }} class="fa fa-users" />
            Invite People
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 305,
            fontSize: 20,
            color: '#C1272D',
            fontFamily: 'DINNextLTPro',
            top: 140,
          }}>
          {xCount}/52
        </div>

        <div
          style={{
            position: 'absolute',
            left: 25,
            fontSize: 20,
            color: '#C1272D',
            top: 175,
          }}>
          <i class="fa fa-comment" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'DINNextLTPro',
            top: 180,
          }}>
          Campaign Description
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontWeight: 'bold',
            top: 210,
          }}>
          <textarea
            maxLength={255}
            onChange={this.handleDescChange2}
            defaultValue={this.state.desc}
            style={{
              fontSize: 20,
              fontFamily: 'DINNextLTPro',
              width: 300,
              height: 100,
            }}
            name="Text1"
            cols="40"
            rows="5"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 20,
            fontSize: 16,
            fontWeight: 'bold',
            top: 350,
          }}>
          <DeleteButton onClick={this.deleteCampaign}>DELETE</DeleteButton>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 450,
            fontSize: 16,
            fontWeight: 'bold',
            top: 350,
          }}>
          <SaveButton onClick={this.saveCampaign}>SAVE</SaveButton>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 300,
            fontSize: 16,
            fontWeight: 'bold',
            top: 350,
          }}>
          <CancelButton onClick={this.cancelAdd}>CANCEL</CancelButton>
        </div>
      </div>
    );
  }

  renderNewCampaign() {
    let xCount = this.state.newTitle.length;

    let xCount2 = this.state.newTaskTitle.length;

    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          width: 600,
          zIndex: 12,
          height: 650,
          marginLeft: -300,
          backgroundColor: '#eeeeee',
          top: 100,
        }}>
        <div style={{ position: 'absolute', left: 10, fontSize: 26, top: 5 }}>
          <i class="fa fa-check" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 20,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 10,
          }}>
          ADD A STRATEGY TREE
        </div>

        <div
          style={{
            position: 'absolute',
            left: 25,
            fontSize: 20,
            color: '#C1272D',
            top: 55,
          }}>
          <i class="fa fa-pencil" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 60,
          }}>
          Strategy Tree Name
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontWeight: 'bold',
            top: 100,
          }}>
          <input
            style={{
              width: 300,
              height: 30,
              fontFamily: 'DINNextLTPro',
              fontSize: 20,
            }}
            maxLength={52}
            type="text"
            name="title"
            value={this.state.newTitle}
            onChange={this.handleTitleChange}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 450,
            fontSize: 16,
            fontWeight: 'bold',
            top: 100,
          }}>
          <div
            style={{
              borderRadius: 5,
              cursor: 'pointer',
              padding: 5,
              fontFamily: 'DINNextLTPro',
              width: 120,
              border: '1px solid black',
            }}
            onClick={this.invitePeople}>
            <i style={{ marginRight: 10 }} class="fa fa-users" />
            Invite People
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 305,
            fontSize: 20,
            color: '#C1272D',
            fontFamily: 'DINNextLTPro',
            top: 140,
          }}>
          {xCount}/21
        </div>

        <div
          style={{
            position: 'absolute',
            left: 25,
            fontSize: 20,
            color: '#C1272D',
            top: 175,
          }}>
          <i class="fa fa-comment" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 180,
          }}>
          Description
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontWeight: 'bold',
            top: 210,
          }}>
          <textarea
            maxLength={255}
            onChange={this.handleDescChange}
            style={{
              fontSize: 20,
              fontFamily: 'DINNextLTPro',
              width: 300,
              height: 100,
            }}
            name="Text1"
            cols="40"
            rows="5"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 25,
            fontSize: 20,
            color: '#C1272D',
            top: 338,
          }}>
          <i class="fa fa-pencil" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 340,
          }}>
          First Task Name
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontWeight: 'bold',
            top: 370,
          }}>
          <input
            style={{
              width: 300,
              height: 30,
              fontFamily: 'DINNextLTPro',
              fontSize: 20,
            }}
            maxLength={52}
            type="text"
            name="title"
            value={this.state.newTaskTitle}
            onChange={this.handleTaskTitleChange}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 305,
            fontSize: 20,
            color: '#C1272D',
            fontFamily: 'DINNextLTPro',
            top: 410,
          }}>
          {xCount2}/21
        </div>

        <div
          style={{
            position: 'absolute',
            left: 25,
            fontSize: 20,
            color: '#C1272D',
            fontFamily: 'DINNextLTPro',
            top: 431,
          }}>
          <i class="fa fa-comment" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 435,
          }}>
          First Task Description
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontWeight: 'bold',
            top: 462,
          }}>
          <textarea
            maxLength={255}
            onChange={this.handleTaskDescChange}
            style={{
              fontSize: 20,
              fontFamily: 'DINNextLTPro',
              width: 300,
              height: 100,
            }}
            name="Text1"
            cols="40"
            rows="5"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 450,
            fontSize: 16,
            fontWeight: 'bold',
            top: 585,
          }}>
          <div
            style={{
              borderRadius: 5,
              cursor: 'pointer',
              width: 120,
              backgroundColor: 'black',
              textAlign: 'center',
              fontFamily: 'DINNextLTPro',
              padding: 5,
              color: 'white',
              border: '1px solid color',
            }}
            onClick={this.createCampaign}>
            CREATE
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 300,
            fontSize: 16,
            fontWeight: 'bold',
            top: 585,
          }}>
          <div
            style={{
              borderRadius: 5,
              cursor: 'pointer',
              width: 120,
              textAlign: 'center',
              fontFamily: 'DINNextLTPro',
              padding: 5,
              color: '#C1272D',
              border: '1px solid black',
            }}
            onClick={this.cancelAdd}>
            CANCEL
          </div>
        </div>
      </div>
    );
  }

  goToCampaignPage(xpage) {
    //console.log('go to page');
    //console.log(xpage);

    this.setState({ currentPage: xpage });
  }

  renderSideBarCampaigns() {
    let xpage = 0;

    let goToCampaignPage = this.goToCampaignPage;

    if (this.state.strategies != null) {
      let xstrategies = Object.keys(this.state.strategies);

      let xoutput = xstrategies.map(function(name, index) {
        //console.log('render sidebar');
        //console.log(name);
        //console.log(index);

        let nodeCount = 0;

        let xval = (parseInt(index) + 1) / 5;
        //console.log(xval);

        let xval2 = (parseInt(index) + 1) / 20;
        //console.log(xval2);

        let xval3 = parseInt(xval2);

        if (xval2.toString().indexOf('.') == -1) {
          //console.log('set 5 go gogo');
          return (
            <div>
              <CampaignItemWrap
                onClick={function() {
                  goToCampaignPage(xval3);
                }}>
                <CampaignItemSquare style={{ width: 15 }} key={name} />
              </CampaignItemWrap>
              <br />
              <br />
            </div>
          );
        } else if (xval.toString().indexOf('.') == -1) {
          //console.log('set 5 go gogo');
          return (
            <div>
              <CampaignItemWrap
                onClick={function() {
                  goToCampaignPage(xval3);
                }}>
                <CampaignItemSquare style={{ width: 15 }} key={name} />
              </CampaignItemWrap>
              <br />
            </div>
          );
        } else {
          return (
            <CampaignItemWrap
              onClick={function() {
                goToCampaignPage(xval3);
              }}>
              <CampaignItemSquare style={{ width: 15 }} key={name} />
            </CampaignItemWrap>
          );
        }
      });

      let extraboxes = [];

      //console.log('EXTRABOXES');

      for (let xx = xstrategies.length; xx < 100; xx++) {
        extraboxes.push(
          <div>
            <CampaignItemWrap>
              <CampaignItemSquare
                style={{ backgroundColor: 'transparent', width: 15 }}
              />
            </CampaignItemWrap>
          </div>
        );

        let xval = (parseInt(xx) + 1) / 5;

        if (xval.toString().indexOf('.') == -1) {
          extraboxes.push(<br />);
        }

        if (xx == 19 || xx == 39 || xx == 59 || xx == 79) {
          extraboxes.push(<br />);
        }
      }
      return (
        <Sidebar>
          {xoutput}
          {extraboxes}
        </Sidebar>
      );
    } else {
      return null;
    }
  }

  renderSideBarPaging() {
    let goToCampaignPage = this.goToCampaignPage;

    if (this.state.strategies != null) {
      let xstrategies = Object.keys(this.state.strategies);

      let xoutput = xstrategies.map(function(name, index) {
        //console.log('render sidebar');
        //console.log(index);

        let nodeCount = 0;

        let xval = (parseInt(index) + 1) / 5;
        //console.log(xval);

        let xval2 = (parseInt(index) + 1) / 20;
        //console.log(xval2);

        if (xval2.toString().indexOf('.') == -1) {
          //console.log('set 5 go gogo');

          let xval3 = parseInt(xval2);

          return (
            <div>
              <CampaignItemWrap
                onClick={function() {
                  goToCampaignPage(xval3);
                }}>
                <CampaignItemSquare />
              </CampaignItemWrap>
              <br />
            </div>
          );
        } else if (xval.toString().indexOf('.') == -1) {
          //console.log('set 5 go gogo');
          return null;
        } else {
          return null;
        }
      });

      let extraboxes = [];

      //console.log('EXTRABOXES');
      let pVal = parseInt(xstrategies.length / 20);

      //console.log(pVal);
      for (let xx = pVal; xx < 4; xx++) {
        extraboxes.push(
          <div>
            <CampaignItemWrap>
              <CampaignItemSquare style={{ backgroundColor: 'transparent' }} />
            </CampaignItemWrap>
            <br />
          </div>
        );
      }

      return (
        <Sidebar2>
          <div>
            <CampaignItemWrap
              onClick={function() {
                goToCampaignPage(0);
              }}>
              <CampaignItemSquare />
            </CampaignItemWrap>
            <br />
          </div>
          {xoutput}
          {extraboxes}
        </Sidebar2>
      );
    } else {
      return null;
    }
  }

  render() {
    let blackBackground = null;

    let topTitle = 'Campaign : ';

    if (this.state.campaign != null) {
      topTitle = 'Campaign : ' + this.state.campaign.title;
    }

    topTitle = topTitle.toUpperCase();

    let myCampaigns = this.renderCampaigns();
    let addNewCampaign = null;
    if (this.state.redirect == true) {
      //console.log('REDIRECT TO strategy tree');
      return (
        <Redirect
          to={{
            state: {
              campaignId: this.state.campaignId,
              campaignName: this.state.newTitle,
              strategyId: this.state.strategyId,
            },
            pathname: '/strategytree',
          }}
        />
      );
    }

    if (this.state.redirectBack == true) {
      //console.log('REDIRECT TO Home');
      return (
        <Redirect
          to={{
            pathname: '/home',
          }}
        />
      );
    }

    if (this.state.newCampaign == true) {
      addNewCampaign = this.renderNewCampaign();
      blackBackground = <BlackBackground onClick={this.cancelAdd} />;
    }
    let editCampaign = null;

    let sideBarCampaigns = this.renderSideBarCampaigns();

    let sideBarPages = this.renderSideBarPaging();

    if (this.state.showEdit == true) {
      editCampaign = this.renderEditCampaign();
      blackBackground = <BlackBackground onClick={this.cancelAdd} />;
    }

    if (this.state.loaded != false) {
      return (
        <div>
          <Header campaign={this.state.campaignId} />

          <TopTitle>
            {topTitle}{' '}
            <i
              onClick={this.editCampaign}
              style={{ cursor: 'pointer', color: 'white', marginLeft: 10 }}
              class="fa fa-gears"
            />
          </TopTitle>
          <div style={{ textAlign: 'center' }}>
            <img
              style={{
                width: 36,
                margin: 10,
              }}
              src="images/TreesPageIcon.png"
            />
          </div>
          <Campaigns style={{ height: window.innerHeight - 200 }}>
            {myCampaigns}

            <CampaignItemNew
              style={{
                textAlign: 'center',
                fontSize: 60,
                verticalAlign: 'middle',
              }}
              onClick={this.addCampaign}>
              +
            </CampaignItemNew>
          </Campaigns>

          {blackBackground}

          {addNewCampaign}
          {editCampaign}
          {sideBarCampaigns}
          {sideBarPages}
        </div>
      );
    } else {
      return (
        <div>
          <Header campaign={this.state.campaignId} />

          <TopTitle>
            {topTitle}{' '}
            <i
              onClick={this.editCampaign}
              style={{ cursor: 'pointer', color: 'white', marginLeft: 10 }}
              class="fa fa-gears"
            />
          </TopTitle>
          <div style={{ textAlign: 'center' }}>
            <img
              style={{
                width: 36,
                margin: 10,
              }}
              src="images/TreesPageIcon.png"
            />
          </div>
          <LoadingGIF>
            <img src="images/loading.gif" />
          </LoadingGIF>
        </div>
      );
    }
  }

  editCampaign() {
    this.setState({ showEdit: true });
  }
}

const Campaigns = glamorous.div({
  margin: 'auto',
  width: 855,
  height: 800,
  overflowY: 'hidden',
});

const TopTitle = glamorous.div({
  width: '100%',
  marginTop: 20,
  textAlign: 'center',
  fontSize: 22,
  color: '#C9C9C9',
  fontFamily: 'DINNextLTPro',
});

const CampaignItem = glamorous.div({
  margin: 10,
  width: 140,
  height: 90,
  float: 'left',
  borderRadius: 19,
  backgroundColor: 'white',
  position: 'relative',
  cursor: 'pointer',
  backgroundImage: 'linear-gradient(to bottom, #FFFFFF 0%, #C9C9C9 100%)',
  padding: 5,
  ':hover': {
    backgroundColor: 'gray',
    backgroundImage: 'linear-gradient(to bottom, #FFFFFF 0%, #EEEEEE 100%)',
  },
});
const CampaignItemNew = glamorous.div({
  margin: 10,
  width: 140,
  height: 90,
  float: 'left',
  borderRadius: 19,
  backgroundColor: 'black',
  position: 'relative',
  color: 'white',
  cursor: 'pointer',
  padding: 5,
  border: '1px solid white',

  ':hover': {
    opacity: 0.5,
    backgroundColor: '#C9C9C9',
  },
});

const CampaignTitle = glamorous.div({
  width: 130,
  padding: 5,

  height: 54,
  textOverflow: 'ellipsis',
  fontFamily: 'DINNextLTPro',

  fontSize: 16,
  textTransform: 'capitalize',
  flexWrap: 'wrap',
  overflow: 'hidden',
  fontWeight: 'bold',
});
const CampaignSeperator = glamorous.div({
  backgroundColor: '#CCCCCC',
  position: 'absolute',
  right: 10,
  left: 10,
  top: 67,
  height: 1,
});
const CampaignTreeCount = glamorous.div({
  fontSize: 18,
  color: 'red',
  position: 'absolute',
  right: 22,
  top: 75,
  fontFamily: 'DINNextLTPro',
});
const CampaignTreeIcon = glamorous.div({
  position: 'absolute',
  right: -11,
  top: 75,
  color: 'black',
  width: 30,
  height: 30,
});

const CampaignTime = glamorous.div({
  position: 'absolute',
  left: 10,
  top: 76,
  color: 'black',
  width: 30,
  height: 30,
  fontWeight: 'bold',
  fontFamily: 'DINNextLTPro',
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
