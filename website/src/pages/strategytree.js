import React from 'react';
import glamorous from 'glamorous';
import Header2 from '../components/header2';
import firebase, {
  doCreateUserWithEmailAndPassword,
  auth,
  provider,
  db,
} from '../Components/firebase.js';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import FileUploader from 'react-firebase-file-uploader';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import '../scss/react-datepicker.css';

export default class StrategyTree extends React.Component {
  constructor(props) {
    super(props);

    //console.log('CONSTRUCT STRATEGY TREE');

    //console.log(this.props.location.state.campaign);

    this.state = {
      zoom: 100,
      relativeX: 0,
      relativeY: 0,
      sideBarTitle: '',
      sideBarDesc: '',
      sideBarAttachments: '',
      sideBarStartDate: '',
      sideBarEventDate: '',
      attributePassword: '',
      loaded: false,
      attributeDropDown: '',
      attributeLegalObserver1: '',
      attributeLegalObserver2: '',
      attributeEmail: '',
      attributeEmail2: '',
      newNodeName: '',
      selectedDoc: '',
      showEdit: false,
      newNodeDesc: '',
      newIcon: '',
      newTitle: '',
      newDesc: '',
      documents: [],
      newNodeLocation: '',
      oDesc: '',
      oTitle: '',
      newNodeDate: '',
      newNodeStack: '',
      newNodeEventTime: '',
      chooseIcon: false,
      chooseDocuments: false,
      chooseAttributes: false,
      newNodeDirection: '',
      newStartDate: null,
      editNode: false,
      editNodeBase: '',
      editNodeStack: '',
      showSideMenu: false,
      newEventDate: null,
      newNode: false,
      newNodeBase: null,
      mouseover: null,
      strategy: null,
      redirectBack: false,
      campaignName: this.props.location.state.campaignName || '',
      campaignId: this.props.location.state.campaignId || null,
      strategyId: this.props.location.state.strategyId || null,
      zooming: false,
      panning: false,
      panDir: null,
      zoomDir: null,
    };

    this.saveStrategy = this.saveStrategy.bind(this);
    this.attributeChanged = this.attributeChanged.bind(this);
    this.deleteCampaign = this.deleteCampaign.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.cancelAdd = this.cancelAdd.bind(this);
    this.gotUploadURL = this.gotUploadURL.bind(this);
    this.cancelNodeIcon = this.cancelNodeIcon.bind(this);
    //console.log(this.state);
    this.getUserData = this.getUserData.bind(this);
    this.renderNodes = this.renderNodes.bind(this);
    this.addNode = this.addNode.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleTitleChange2 = this.handleTitleChange2.bind(this);
    this.handleDescChange2 = this.handleDescChange2.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.createNode = this.createNode.bind(this);
    this.saveNode = this.saveNode.bind(this);
    this.editNode = this.editNode.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.chooseIcon = this.chooseIcon.bind(this);
    this.chooseAttributes = this.chooseAttributes.bind(this);
    this.chooseDocuments = this.chooseDocuments.bind(this);
    this.renderChooseIcon = this.renderChooseIcon.bind(this);
    this.renderAttributes = this.renderAttributes.bind(this);
    this.renderDocuments = this.renderDocuments.bind(this);
    this.chooseMyIcon = this.chooseMyIcon.bind(this);
    this.saveNodeIcon = this.saveNodeIcon.bind(this);
    this.selectDocument = this.selectDocument.bind(this);
    this.dDocument = this.dDocument.bind(this);
    this.saveAttachments = this.saveAttachments.bind(this);
    this.uploadDocument = this.uploadDocument.bind(this);
    this.downloadDocument = this.downloadDocument.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.updateNodeCount = this.updateNodeCount.bind(this);
    this.editCampaign = this.editCampaign.bind(this);
    this.renderEditCampaign = this.renderEditCampaign.bind(this);
    this.mouseout = this.mouseout.bind(this);
    this.saveAttributes = this.saveAttributes.bind(this);
    this.dSidebarDocument = this.dSidebarDocument.bind(this);
    this.renderSideBarDocuments = this.renderSideBarDocuments.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleEmail2Change = this.handleEmail2Change.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleLegalObserverChange = this.handleLegalObserverChange.bind(this);
    this.handleLegalObserver2Change = this.handleLegalObserver2Change.bind(
      this
    );
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.scrollTo = this.scrollTo.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.zoomTo = this.zoomTo.bind(this);

    this.zoomStart = this.zoomStart.bind(this);
    this.panStart = this.panStart.bind(this);

    this.zoomStop = this.zoomStop.bind(this);
    this.panStop = this.panStop.bind(this);
    this.panInterval = null;
    this.zoomInterval = null;
  }

  handleUploadStart() {
    this.setState({ isUploading: true, progress: 0 });
  }

  handleProgress(progress) {
    this.setState({ progress });
  }

  handleUploadError(error) {
    //console.log('UPLOAD ERROR');
    this.setState({ isUploading: false });
    console.error(error);
  }

  handleUploadSuccess(filename) {
    //console.log('UPLOAD SUCCESS');
    //console.log(filename);

    let gotUploadURL = this.gotUploadURL;

    firebase
      .storage()
      .ref('strategy/' + this.state.campaignId + '/' + this.state.strategyId)
      .child(filename)
      .getDownloadURL()
      .then(function(xurl) {
        gotUploadURL(filename, xurl);
      });

    this.setState({ progress: 100, isUploading: false });
    //firebase.storage().ref('avatars').child(filename).getDownloadURL().then(this.gotAvatar);
  }

  gotUploadURL(filename, xurl) {
    let documents = this.state.documents;

    documents.push({ filename: filename, url: xurl });
    this.setState({ documents: documents });
  }

  async deleteNode() {
    //console.log('delete node');

    //console.log(this.state.editNodeStack);

    await firebase
      .database()
      .ref(
        `strategies/${this.state.campaignId}/${this.state.strategyId}/tree${
          this.state.editNodeStack
        }`
      )
      .remove();

    this.cancelAdd();
    this.getUserData();
    this.updateNodeCount();
  }

  async updateNodeCount() {
    let nodeCount = this.countNodes(this.state.strategy.tree) + 1;

    //console.log('UPDATE NODE COUNT');
    //console.log(this.state.strategy);
    //console.log(nodeCount);
    await firebase
      .database()
      .ref(
        `strategies/${this.state.campaignId}/${this.state.strategyId}/nodeCount`
      )
      .set(nodeCount);
  }

  countNodes(xnodes) {
    let xcount = 1;

    if (xnodes.rightNode) {
      xcount = xcount + this.countNodes(xnodes.rightNode);
    }
    if (xnodes.leftNode) {
      xcount = xcount + this.countNodes(xnodes.leftNode);
    }
    if (xnodes.bottomNode) {
      xcount = xcount + this.countNodes(xnodes.bottomNode);
    }

    return xcount;
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
        .ref(`strategies/${this.state.campaignId}/${this.state.strategyId}`);

      let strategies = await userRef2.once('value');

      strategies = strategies.val();

      //console.log('strategies');
      //console.log(strategies);

      this.setState({
        loaded: true,
        oTitle: strategies.title,
        oDesc: strategies.desc,
        campaign: campaign,
        strategy: strategies,
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

  renderNodes() {
    let x = 0,
      y = 0;

    if (this.state.strategy) {
      return this.renderNode(this.state.strategy.tree, x, y, '');
    } else {
      return null;
    }
  }

  addNode(xdir, xnode, x, y, nodeStack) {
    //console.log('Add Node');
    //console.log(nodeStack);

    this.setState({
      documents: [],
      newNodeName: '',
      newStartDate: '',
      newEventDate: '',
      newNode: true,
      newNodeBase: xnode,
      newNodeStack: nodeStack,
    });
  }

  async editNode(xnode, x, y, nodeStack) {
    //console.log('Edit Node');

    let xdocs = [];

    if (xnode.documents) {
      xdocs = xnode.documents;
    }

    if (!xnode.password) {
      xnode.password = '';
    }

    if (!xnode.dropdown) {
      xnode.dropdown = '';
    }

    if (!xnode.legalObserver1) {
      xnode.legalObserver1 = '';
    }

    if (!xnode.legalObserver2) {
      xnode.legalObserver2 = '';
    }

    if (!xnode.email1) {
      xnode.email1 = '';
    }

    if (!xnode.email2) {
      xnode.email2 = '';
    }

    await this.setState({
      attributePassword: xnode.password,
      attributeDropDown: xnode.dropdown,
      attributeLegalObserver1: xnode.legalObserver1,
      attributeLegalObserver2: xnode.legalObserver2,
      attributeEmail: xnode.email1,
      attributeEmail2: xnode.email2,
      documents: xdocs,
      newNodeName: xnode.title,
      newNodeDesc: xnode.desc,
      newNodeLocation: xnode.location,
      newEventDate: moment(xnode.event_date),
      newStartDate: xnode.start_date,
      editNode: true,
      editNodeBase: xnode,
      editNodeStack: nodeStack,
    });

    //console.log(this.state);
  }

  mouseover(input, xnode) {
    //console.log('Mouseover');
    //console.log(input);

    //console.log(xnode);

    let xdocs = [];

    if (xnode.documents) {
      xdocs = xnode.documents;
    }

    this.setState({
      sideBarTitle: xnode.title,
      sideBarDesc: xnode.desc,
      sideBarAttachments: xdocs,
      sideBarStartDate: xnode.start_date,
      sideBarEventDate: xnode.event_date,
      mouseover: input,
    });
  }

  mouseout(input) {
    // this.setState({mouseover: null})
  }

  renderNode(xnode, x, y, nodeStack, fromDir) {
    //  //console.log('RENDER NODE');
    //  //console.log(xnode);

    if (y < 150) {
      y = 150;
    }

    let mouseover = this.mouseover;
    let mouseout = this.mouseout;
    let addNode = this.addNode;
    let editNode = this.editNode;
    let rightSide = null;
    let bottomSide = null;
    let leftSide = null;
    let nodeIcon = null;

    if (xnode.icon != undefined) {
      let xClass = 'fa fa-' + xnode.icon;

      nodeIcon = <i class={xClass} />;
    }

    let yOff = this.state.relativeY;
    let xOff = this.state.relativeX;

    let rightOut = null;
    let bottomOut = null;
    let leftOut = null;

    let dragMe = null;
    dragMe = (
      <div
        style={{
          right: 5,
          top: 2,
          position: 'absolute',
        }}>
        <img style={{ height: 24 }} src="images/NodeHandle.png" />
      </div>
    );

    let extraLine = null;
    let output = <div />;

    if (!xnode.rightNode) {
      // //console.log('right node not found')

      if (this.state.mouseover == nodeStack) {
        rightSide = (
          <RightSide
            onMouseOver={function() {
              mouseover(nodeStack, xnode);
            }}
            onClick={function() {
              addNode('right', xnode, x, y, nodeStack + '/rightNode');
            }}>
            <MyPlusSign>+</MyPlusSign>
          </RightSide>
        );
      }
    } else {
      // //console.log('Right node found')
      rightOut = this.renderNode(
        xnode.rightNode,
        x + 300,
        y + 120,
        nodeStack + '/rightNode',
        'rightNode'
      );
      rightSide = <RightLine />;
      extraLine = <BottomLine style={{ left: 400, top: 15, height: 85 }} />;
    }
    if (!xnode.leftNode) {
      ////console.log('Left node not found')
      if (this.state.mouseover == nodeStack) {
        leftSide = (
          <LeftSide
            onMouseOver={function() {
              mouseover(nodeStack, xnode);
            }}
            onClick={function() {
              addNode('ledt', xnode, x, y, nodeStack + '/leftNode');
            }}>
            <MyPlusSign>+</MyPlusSign>
          </LeftSide>
        );
      }
    } else {
      ////console.log('Left node found')

      leftOut = this.renderNode(
        xnode.leftNode,
        x - 300,
        y + 120,
        nodeStack + '/leftNode',
        'leftNode'
      );
      leftSide = <LeftLine />;
      extraLine = <BottomLine style={{ left: -200, top: 15, height: 85 }} />;
    }
    if (!xnode.bottomNode) {
      // //console.log('bottom node not found')

      if (this.state.mouseover == nodeStack) {
        bottomSide = (
          <BottomSide
            onMouseOver={function() {
              mouseover(nodeStack, xnode);
            }}
            onClick={function() {
              addNode('bottom', xnode, x, y, nodeStack + '/bottomNode');
            }}>
            <MyPlusSign>+</MyPlusSign>
          </BottomSide>
        );
      }
    } else {
      // //console.log('bottom node found')
      bottomOut = this.renderNode(
        xnode.bottomNode,
        x,
        y + 120,
        nodeStack + '/bottomNode',
        'bottomNode'
      );
      bottomSide = <BottomLine />;
    }

    output = (
      <NodePosition
        style={{ left: '50%', top: 150 }}
        onMouseOver={function() {
          mouseover(nodeStack, xnode);
        }}
        style={{ marginLeft: x - 150 + xOff, marginTop: y + yOff }}>
        <MyNode>
          <NodeIcon
            onClick={function() {
              editNode(xnode, x, y, nodeStack);
            }}>
            {nodeIcon}
          </NodeIcon>
          <NodeTitle
            onClick={function() {
              editNode(xnode, x, y, nodeStack);
            }}>
            {xnode.title.toUpperCase()}
          </NodeTitle>

          {dragMe}
        </MyNode>
        {rightSide}
        {bottomSide}
        {leftSide}
      </NodePosition>
    );

    return (
      <div>
        {output}
        {rightOut}
        {leftOut}
        {bottomOut}
      </div>
    );
  }

  handleTitleChange(input, value) {
    this.setState({ newNodeName: input.target.value });
  }

  handleDateChange(input, value) {
    this.setState({ newEventDate: input });
  }

  handleStartChange(input, value) {
    //console.log('Handle start change');
    //console.log(input.target.value);

    this.setState({ newStartDate: input.target.value });
  }

  handleDescChange(input, value) {
    this.setState({
      newDesc: input.target.value,
      newNodeDesc: input.target.value,
    });
  }

  handleDescChange2(input, value) {
    this.setState({
      oDesc: input.target.value,
      newNodeDesc: input.target.value,
    });
  }

  handleLocationChange(input, value) {
    this.setState({ newNodeLocation: input.target.value });
  }

  cancelAdd() {
    this.setState({
      newNode: false,
      newIcon: '',
      editNode: false,
      showEdit: false,
    });
  }

  cancelNodeIcon() {
    this.setState({
      chooseIcon: false,
      chooseAttributes: false,
      chooseDocuments: false,
    });
  }

  async createNode() {
    if (this.state.newNodeName == '') {
      alert('Please provide a Node Name');
      return false;
    }

    if (this.state.newNodeDesc == '') {
      alert('Please provide a Description');
      return false;
    }

    // //console.log('create node')

    let myCampaign = {
      password: this.state.attributePassword,
      dropdown: this.state.attributeDropDown,
      legalObserver1: this.state.attributeLegalObserver1,
      legalObserver2: this.state.attributeLegalObserver2,
      email1: this.state.attributeEmail,
      email2: this.state.attributeEmail2,
      created: firebase.database.ServerValue.TIMESTAMP,
      title: this.state.newNodeName,
      desc: this.state.newNodeDesc,
      location: this.state.newNodeLocation,
      event_date: this.state.newEventDate.valueOf(),
      start_date: this.state.newStartDate,
      documents: this.state.documents,
    };

    // //console.log(myCampaign);

    let newNode = await firebase
      .database()
      .ref(
        `strategies/${this.state.campaignId}/${this.state.strategyId}/tree${
          this.state.newNodeStack
        }`
      )
      .set(myCampaign);
    // //console.log(newNode)

    await this.setState({
      attributePassword: '',
      attributeDropDown: '',
      attributeLegalObserver1: '',
      attributeLegalObserver2: '',
      attributeEmail: '',
      attributeEmail2: '',

      newNodeName: '',
      newNodeDesc: '',
      newNodeLocation: '',
      newNodeDate: '',
      newNodeEventTime: '',
      newNodeDirection: '',
      newStartDate: null,
      newEventDate: null,
      newNode: false,
      newNodeBase: null,
      documents: [],
    });

    alert('Node Added');
    this.getUserData();
    this.updateNodeCount();
  }

  async saveNode() {
    if (this.state.newNodeName == '') {
      alert('node name be blank');
      return false;
    }

    if (this.state.newNodeDesc == '') {
      alert('node desc be blank');
      return false;
    }

    //console.log('save node');

    let myCampaign = this.state.editNodeBase;

    if (this.state.newIcon != '') {
      myCampaign.icon = this.state.newIcon;
    }
    (myCampaign.title = this.state.newNodeName),
      (myCampaign.desc = this.state.newNodeDesc),
      (myCampaign.location = this.state.newNodeLocation),
      (myCampaign.documents = this.state.documents);
    (myCampaign.event_date = this.state.newEventDate.valueOf()),
      (myCampaign.start_date = this.state.newStartDate);

    (myCampaign.password = this.state.attributePassword),
      (myCampaign.dropdown = this.state.attributeDropDown),
      (myCampaign.legalObserver1 = this.state.attributeLegalObserver1),
      (myCampaign.legalObserver2 = this.state.attributeLegalObserver2),
      (myCampaign.email1 = this.state.attributeEmail),
      (myCampaign.email2 = this.state.attributeEmail2),
      console.log(myCampaign);

    let newNode = await firebase
      .database()
      .ref(
        `strategies/${this.state.campaignId}/${this.state.strategyId}/tree${
          this.state.editNodeStack
        }`
      )
      .set(myCampaign);
    //console.log(newNode);

    await this.setState({
      attributePassword: '',
      attributeDropDown: '',
      attributeLegalObserver1: '',
      attributeLegalObserver2: '',
      attributeEmail: '',
      attributeEmail2: '',

      newNodeName: '',
      newNodeDesc: '',
      newNodeLocation: '',
      newIcon: '',
      newNodeDate: '',
      newNodeEventTime: '',
      newNodeDirection: '',
      newStartDate: null,
      newEventDate: null,
      newNode: false,
      newNodeBase: null,
      documents: '',
    });

    alert('Node Saved');
    this.getUserData();
    this.cancelAdd();
  }

  renderNewStrategyNode() {
    let xCount = this.state.newNodeName.length;

    return (
      <div
        style={{
          zIndex: 11,
          position: 'absolute',
          left: '50%',
          width: 600,
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
          NEW EVENT NODE
        </div>

        <div
          style={{
            position: 'absolute',
            left: 25,
            fontSize: 20,
            color: '#C1272D',
            top: 60,
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
          Node Name
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
            maxLength={21}
            type="text"
            name="title"
            value={this.state.newNodeName}
            onChange={this.handleTitleChange}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 420,
            fontFamily: 'DINNextLTPro',
            fontSize: 16,
            fontWeight: 'bold',
            top: 100,
          }}>
          <AttributeButton onClick={this.chooseAttributes}>
            <i
              style={{ color: '#C1272D', marginRight: 10 }}
              class="fa fa-align-justify"
            />
            Attributes
          </AttributeButton>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 420,
            fontSize: 16,
            fontWeight: 'bold',
            top: 140,
          }}>
          <AttributeButton onClick={this.chooseIcon}>
            <i
              style={{ color: '#C1272D', marginRight: 10 }}
              class="fa fa-expand"
            />
            Node Icon
          </AttributeButton>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 420,
            fontSize: 16,
            fontWeight: 'bold',
            top: 180,
          }}>
          <AttributeButton onClick={this.chooseDocuments}>
            <i
              style={{ color: '#C1272D', marginRight: 10 }}
              class="fa fa-plus"
            />
            Attach Document
          </AttributeButton>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 305,
            fontFamily: 'DINNextLTPro',
            color: '#C1272D',
            fontSize: 20,
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
            top: 180,
          }}>
          <i class="fa fa-comment" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontFamily: 'DINNextLTPro',
            fontSize: 16,
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
            style={{ fontSize: 20, width: 300, height: 100 }}
            name="Text1"
            cols="40"
            rows="5"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 220,
            fontSize: 20,
            color: '#C1272D',
            top: 328,
          }}>
          <i class="fa fa-calendar" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 250,
            fontFamily: 'DINNextLTPro',
            fontSize: 16,
            fontWeight: 'bold',
            top: 330,
          }}>
          Event Date
        </div>
        <div
          style={{
            position: 'absolute',
            left: 250,
            fontFamily: 'DINNextLTPro',
            fontSize: 16,
            fontWeight: 'bold',
            top: 400,
          }}>
          Start Time
        </div>

        <div
          style={{
            position: 'absolute',
            left: 250,
            fontSize: 16,
            fontWeight: 'bold',
            top: 360,
          }}>
          <DatePicker
            style={{ fontSize: 20, fontFamily: 'DINNextLTPro', height: 40 }}
            selected={this.state.newEventDate}
            onChange={this.handleDateChange}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 250,
            fontSize: 16,
            fontWeight: 'bold',
            top: 420,
          }}>
          <input
            type="time"
            style={{
              fontSize: 16,
              fontFamily: 'DINNextLTPro',
              width: 130,
              height: 30,
            }}
            value={this.state.newStartDate}
            onChange={this.handleStartChange}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 25,
            fontSize: 20,
            color: '#C1272D',
            top: 328,
          }}>
          <i class="fa fa-globe" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 328,
          }}>
          Location
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontWeight: 'bold',
            top: 360,
          }}>
          <textarea
            onChange={this.handleLocationChange}
            style={{
              fontSize: 20,
              fontFamily: 'DINNextLTPro',
              width: 150,
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
            top: 478,
          }}>
          <i class="fa fa-file" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 478,
          }}>
          Attachments
        </div>

        <div
          style={{
            position: 'absolute',
            left: 25,
            width: 350,
            height: 100,
            fontSize: 20,
            top: 521,
          }}>
          {this.renderDocumentListSmall()}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 450,
            fontSize: 16,
            fontWeight: 'bold',
            top: 598,
          }}>
          <SaveButton onClick={this.createNode}>CREATE</SaveButton>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 300,
            fontSize: 16,
            fontWeight: 'bold',
            top: 598,
          }}>
          <CancelButton onClick={this.cancelAdd}>CANCEL</CancelButton>
        </div>
      </div>
    );
  }

  chooseDocuments() {
    //console.log('choose Documents');
    this.setState({
      chooseDocuments: true,
    });
  }

  chooseAttributes() {
    //console.log('choose Attributes');
    this.setState({
      chooseAttributes: true,
    });
  }

  renderEditStrategyNode() {
    let xCount = this.state.newNodeName.length;
    let startTime = this.state.newStartDate;
    let eventTime = this.state.newEventDate;

    //console.log('Render SEdit strategy Node');
    //console.log(this.state.editNodeStack);

    let deleteNode = null;

    if (this.state.editNodeStack !== '') {
      deleteNode = (
        <div
          style={{
            position: 'absolute',
            left: 20,
            fontSize: 16,
            fontWeight: 'bold',
            top: 590,
          }}>
          <DeleteButton onClick={this.deleteNode}>DELETE</DeleteButton>
        </div>
      );
    }

    return (
      <div
        style={{
          zIndex: 11,

          position: 'absolute',
          left: '50%',
          width: 600,
          height: 630,
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
            fontFamily: 'DINNextLTPro',
            fontSize: 20,
            fontWeight: 'bold',
            top: 10,
          }}>
          EDIT EVENT NODE
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
            fontFamily: 'DINNextLTPro',
            fontSize: 16,
            fontWeight: 'bold',
            top: 60,
          }}>
          Node Name
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
              width: 320,
              height: 30,
              fontFamily: 'DINNextLTPro',
              fontSize: 24,
            }}
            maxLength={21}
            type="text"
            name="title"
            value={this.state.newNodeName}
            onChange={this.handleTitleChange}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 420,
            fontSize: 16,
            fontWeight: 'bold',
            top: 100,
          }}>
          <AttributeButton onClick={this.chooseAttributes}>
            <i
              style={{ color: '#C1272D', marginRight: 10 }}
              class="fa fa-align-justify"
            />
            Attributes
          </AttributeButton>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 420,
            fontSize: 16,
            fontWeight: 'bold',
            top: 140,
          }}>
          <AttributeButton onClick={this.chooseIcon}>
            <i
              style={{ color: '#C1272D', marginRight: 10 }}
              class="fa fa-expand"
            />
            Node Icon
          </AttributeButton>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 420,
            fontSize: 16,
            fontWeight: 'bold',
            top: 180,
          }}>
          <AttributeButton onClick={this.chooseDocuments}>
            <i
              style={{ color: '#C1272D', marginRight: 10 }}
              class="fa fa-plus"
            />
            Attach Document
          </AttributeButton>
        </div>
        <div
          style={{
            position: 'absolute',
            color: '#C1272D',
            left: 325,
            fontFamily: 'DINNextLTPro',
            fontSize: 20,
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
            top: 205,
          }}>
          <textarea
            maxLength={255}
            onChange={this.handleDescChange}
            style={{ fontSize: 20, width: 320, height: 100 }}
            name="Text1"
            cols="40"
            rows="5">
            {this.state.newNodeDesc}
          </textarea>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 220,
            fontSize: 20,
            color: '#C1272D',
            top: 338,
          }}>
          <i class="fa fa-calendar" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 250,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 338,
          }}>
          Event Date
        </div>
        <div
          style={{
            position: 'absolute',
            left: 250,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 410,
          }}>
          Start Time
        </div>
        <div
          style={{
            position: 'absolute',
            left: 250,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 360,
          }}>
          <DatePicker
            style={{ fontSize: 20, height: 40 }}
            selected={eventTime}
            onChange={this.handleDateChange}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 250,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 430,
          }}>
          <input
            type="time"
            style={{
              fontSize: 16,
              height: 30,
              fontFamily: 'DINNextLTPro',
              width: 130,
            }}
            value={startTime}
            onChange={this.handleStartChange}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 25,
            color: '#C1272D',
            fontSize: 20,
            top: 338,
          }}>
          <i class="fa fa-globe" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 338,
          }}>
          Location
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 362,
          }}>
          <textarea
            maxLength={255}
            onChange={this.handleLocationChange}
            style={{ fontSize: 20, width: 150, height: 100 }}
            name="Text1"
            cols="40"
            rows="5">
            {this.state.newNodeLocation}
          </textarea>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 25,
            fontSize: 20,
            color: '#C1272D',
            top: 478,
          }}>
          <i class="fa fa-file" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 478,
          }}>
          Attachments
        </div>
        <div
          style={{
            position: 'absolute',
            left: 25,
            width: 450,
            height: 80,
            fontSize: 20,
            top: 499,
          }}>
          {this.renderDocumentListSmall()}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 300,
            fontSize: 16,
            fontWeight: 'bold',
            top: 590,
          }}>
          <CancelButton onClick={this.cancelAdd}>CANCEL</CancelButton>
        </div>{' '}
        <div
          style={{
            position: 'absolute',
            left: 450,
            fontSize: 16,
            fontWeight: 'bold',
            top: 590,
          }}>
          <SaveButton onClick={this.saveNode}>SAVE</SaveButton>
        </div>
        {deleteNode}
      </div>
    );
  }

  chooseIcon() {
    //console.log('choose Icon');
    this.setState({
      chooseIcon: true,
    });
  }

  async chooseMyIcon(xIcon) {
    //console.log('xICON');
    //console.log(xIcon);
    await this.setState({ newIcon: xIcon, chooseIcon: false });
    this.forceUpdate();
    //console.log('Save Icon');
    //console.log(this.state.newIcon);

    await firebase
      .database()
      .ref(
        `strategies/${this.state.campaignId}/${this.state.strategyId}/tree${
          this.state.editNodeStack
        }/icon`
      )
      .set(this.state.newIcon);
  }

  async saveNodeIcon() {}

  renderAttributes() {
    let chooseMyIcon = this.chooseMyIcon;

    let xCount = this.state.newNodeName.length;
    let startTime = this.state.newStartDate;
    let eventTime = this.state.newEventDate;

    //console.log('Render SEdit strategy Node');
    //console.log(startTime);

    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          width: 600,
          height: 650,
          marginLeft: -300,
          backgroundColor: '#eeeeee',
          top: 100,
          zIndex: 100,
        }}>
        <CancelLeft onClick={this.cancelNodeIcon} style={{}}>
          <i class="fa fa-arrow-left" />
        </CancelLeft>

        <div style={{ position: 'absolute', left: 90, fontSize: 26, top: 5 }}>
          <i class="fa fa-check" />
        </div>
        <div
          style={{
            position: 'absolute',
            fontFamily: 'DINNextLTPro',
            left: 120,
            fontSize: 20,
            fontWeight: 'bold',
            top: 10,
          }}>
          ATTRIBUTES:
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontFamily: 'DINNextLTPro',
            fontSize: 14,
            padding: 5,
            top: 50,
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
          quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
          mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
          Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad
          litora torquent per conubia nostra, per inceptos himenaeos.
          <br />
          <br />
          Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.
          Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem
          at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut
          ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel,
          suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia
          aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt
          sed, euismod in, nibh.
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 20,
            color: '#C1272D',
            top: 280,
          }}>
          <i class="fa fa-pencil" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 80,
            fontFamily: 'DINNextLTPro',
            fontSize: 14,
            fontWeight: 'bold',
            top: 280,
          }}>
          Password
        </div>
        <div
          style={{
            position: 'absolute',
            left: 80,
            fontSize: 16,
            fontWeight: 'bold',
            top: 300,
          }}>
          <input
            style={{
              paddingLeft: 5,
              width: 200,
              height: 30,
              fontFamily: 'DINNextLTPro',
              fontSize: 16,
            }}
            maxLength={21}
            type="password"
            name="xpassword"
            value={this.state.attributePassword}
            onChange={this.handlePasswordChange}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 320,
            fontSize: 20,
            color: '#C1272D',
            top: 280,
          }}>
          <i class="fa fa-pencil" />
        </div>
        <div
          style={{
            position: 'absolute',
            fontFamily: 'DINNextLTPro',
            left: 350,
            fontSize: 14,
            fontWeight: 'bold',
            top: 280,
          }}>
          Attribute
        </div>
        <div
          style={{
            position: 'absolute',
            left: 350,
            fontSize: 16,
            fontWeight: 'bold',
            top: 300,
          }}>
          <select
            style={{
              width: 200,
              height: 30,
              fontFamily: 'DINNextLTPro',
              fontSize: 14,
            }}
            maxLength={21}
            type="text"
            name="dropdownlist"
            value={this.state.attributeDropDown}
            onChange={this.handleDropDownChange}>
            <option>Cost Value</option>
            <option>Color List</option>
            <option>Vehicle List</option>
            <option>Material List</option>
          </select>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 20,
            color: '#C1272D',
            top: 370,
          }}>
          <i class="fa fa-pencil" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 80,
            fontSize: 14,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 370,
          }}>
          Legal Observer 1 Name
        </div>
        <div
          style={{
            position: 'absolute',
            left: 80,
            fontSize: 16,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 390,
          }}>
          <input
            style={{
              paddingLeft: 5,
              width: 200,
              fontFamily: 'DINNextLTPro',
              height: 30,
              fontSize: 16,
            }}
            maxLength={21}
            type="text"
            name="legalobjsert"
            value={this.state.attributeLegalObserver1}
            onChange={this.handleLegalObserverChange}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 50,
            fontSize: 20,
            color: '#C1272D',
            top: 460,
          }}>
          <i class="fa fa-pencil" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 80,
            fontSize: 14,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 460,
          }}>
          Legal Observer 2 Name
        </div>
        <div
          style={{
            position: 'absolute',
            left: 80,
            fontSize: 16,
            fontWeight: 'bold',
            top: 485,
          }}>
          <input
            style={{
              paddingLeft: 5,
              width: 200,
              fontFamily: 'DINNextLTPro',
              height: 30,
              fontSize: 16,
            }}
            maxLength={21}
            type="text"
            name="legalobsertver02"
            value={this.state.attributeLegalObserver2}
            onChange={this.handleLegalObserver2Change}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 320,
            fontSize: 20,
            color: '#C1272D',
            top: 370,
          }}>
          <i class="fa fa-pencil" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 350,
            fontSize: 14,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 370,
          }}>
          E-mail{' '}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 350,
            fontSize: 16,
            fontWeight: 'bold',
            top: 390,
          }}>
          <input
            style={{
              paddingLeft: 5,
              width: 200,
              fontFamily: 'DINNextLTPro',
              height: 30,
              fontSize: 16,
            }}
            maxLength={21}
            type="text"
            name="email1"
            value={this.state.attributeEmail}
            onChange={this.handleEmailChange}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 320,
            fontSize: 20,
            color: '#C1272D',
            top: 460,
          }}>
          <i class="fa fa-pencil" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 350,
            fontSize: 14,
            fontFamily: 'DINNextLTPro',
            fontWeight: 'bold',
            top: 460,
          }}>
          E-mail
        </div>
        <div
          style={{
            position: 'absolute',
            left: 350,
            fontSize: 16,
            fontWeight: 'bold',
            top: 485,
          }}>
          <input
            style={{
              paddingLeft: 5,
              width: 200,
              height: 30,
              fontFamily: 'DINNextLTPro',
              fontSize: 16,
            }}
            maxLength={21}
            type="text"
            name="email2"
            value={this.state.attributeEmail2}
            onChange={this.handleEmail2Change}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            right: 200,
            fontSize: 16,
            fontWeight: 'bold',
            top: 600,
          }}>
          <CancelButton onClick={this.cancelNodeIcon}>CANCEL</CancelButton>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 25,
            fontSize: 16,
            fontWeight: 'bold',
            top: 600,
          }}>
          <SaveButton onClick={this.saveAttributes}>SAVE</SaveButton>
        </div>
      </div>
    );
  }

  saveAttributes() {
    this.cancelNodeIcon();
  }

  handleDropDownChange(input) {
    this.setState({ attributeDropDown: input.target.value });
  }

  handleEmail2Change(input) {
    this.setState({ attributeEmail2: input.target.value });
  }

  handleEmailChange(input) {
    this.setState({ attributeEmail: input.target.value });
  }

  handleLegalObserverChange(input) {
    this.setState({ attributeLegalObserver1: input.target.value });
  }
  handleLegalObserver2Change(input) {
    this.setState({ attributeLegalObserver2: input.target.value });
  }

  handlePasswordChange(input) {
    //console.log('PASSWORD CHANGE');
    //console.log(input.target.value);

    this.setState({ attributePassword: input.target.value });
  }

  selectDocument(xDoc) {
    //console.log('xDoc SELECTED');
    //console.log(xDoc);
    let myDoc = this.state.documents[xDoc];

    //console.log(myDoc);

    this.setState({ selectedDoc: xDoc });
  }

  renderDocumentList() {
    //console.log('RENDER DOCUMENT LIST');
    //console.log(this.state.documents);

    let documents = this.state.documents;
    let selectDocument = this.selectDocument;

    let selectedDoc = this.state.selectedDoc;

    if (this.state.documents.length > 0) {
      //console.log('documents found!');

      return Object.keys(this.state.documents).map(function(name, index) {
        //console.log('Document Name');
        //console.log(name);
        if (name == selectedDoc) {
          return (
            <DocumentItem
              style={{
                color: 'green',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
              key={name}
              onClick={function() {
                selectDocument(name);
              }}>
              <i class="fa fa-file" />
              {documents[name].filename}
            </DocumentItem>
          );
        } else {
          return (
            <DocumentItem
              key={name}
              onClick={function() {
                selectDocument(name);
              }}>
              <i class="fa fa-file" />
              {documents[name].filename}
            </DocumentItem>
          );
        }
      });
    } else {
      //console.log('No documents found');

      return (
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'DINNextLTPro',
            margin: 50,
          }}>
          No Documents uploaded to this node
        </div>
      );
    }
  }

  renderDocumentListSmall() {
    //console.log('RENDER DOCUMENT LIST Small');
    //console.log(this.state.documents);

    let dDocument = this.dDocument;
    let documents = this.state.documents;

    let selectedDoc = this.state.selectedDoc;

    if (this.state.documents.length > 0) {
      //console.log('documents found!');

      return Object.keys(this.state.documents).map(function(name, index) {
        //console.log('Document Name');
        //console.log(name);

        return (
          <DocumentItemSmall
            key={name}
            onClick={function() {
              dDocument(name);
            }}>
            <i
              style={{ marginRight: 10, float: 'left', color: '#C1272D' }}
              class="fa fa-file"
            />
            <DocumentItemSmallText>
              {documents[name].filename}
            </DocumentItemSmallText>
          </DocumentItemSmall>
        );
      });
    } else {
      //console.log('No documents found');

      return (
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'DINNextLTPro',
            color: 'gray',
            margin: 25,
          }}>
          No Documents
        </div>
      );
    }
  }

  renderSideBarDocuments() {
    //console.log('RENDER DOCUMENT LIST Sidebar ');
    //console.log(this.state.sideBarAttachments);

    let dDocument = this.dSidebarDocument;
    let documents = this.state.sideBarAttachments;

    if (documents.length > 0) {
      //console.log('documents found!');

      return Object.keys(this.state.sideBarAttachments).map(function(
        name,
        index
      ) {
        //console.log('Document Name');
        //console.log(name);

        let fname = documents[name].filename;

        if (fname.length > 15) {
          fname = fname.substr(0, 15) + '...';
        }

        return (
          <DocumentItemSide
            key={name}
            onClick={function() {
              dDocument(name);
            }}>
            <SideDocText>
              <i style={{ color: '#C1272D', margin: 2 }} class="fa fa-file" />
              {fname}
            </SideDocText>
          </DocumentItemSide>
        );
      });
    } else {
      //console.log('No documents found');

      return <div style={{ textAlign: 'center', margin: 0 }}>No Documents</div>;
    }
  }

  renderDocuments() {
    let chooseMyIcon = this.chooseMyIcon;

    let xCount = this.state.newNodeName.length;
    let startTime = this.state.newStartDate;
    let eventTime = this.state.newEventDate;

    //console.log('Render Documents Page');
    //console.log(startTime);

    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          width: 600,
          height: 650,
          marginLeft: -300,
          backgroundColor: '#eeeeee',
          top: 100,
          zIndex: 100,
        }}>
        <CancelLeft onClick={this.cancelNodeIcon} style={{}}>
          <i class="fa fa-arrow-left" />
        </CancelLeft>

        <div style={{ position: 'absolute', left: 90, fontSize: 26, top: 5 }}>
          <i class="fa fa-file" />
        </div>
        <div
          style={{
            position: 'absolute',
            fontFamily: 'DINNextLTPro',
            left: 120,
            fontSize: 20,
            fontWeight: 'bold',
            top: 10,
          }}>
          DOCUMENTS:
        </div>

        <div style={{ margin: 10, marginTop: 80, height: 400 }}>
          {this.renderDocumentList()}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 80,
            fontSize: 16,
            fontWeight: 'bold',
            top: 505,
          }}>
          <label
            style={{
              borderRadius: 5,
              cursor: 'pointer',
              textAlign: 'center',
              color: 'white',
              backgroundColor: 'black',
              padding: 5,
              paddingLeft: 25,
              paddingRight: 25,
              width: 100,
              fontFamily: 'DINNextLTPro',
              border: '1px solid white',
            }}>
            UPLOAD
            <FileUploader
              hidden
              name="Avatar"
              accept="image/*"
              // filename={file => this.state.uid + file.name.split('.')[1] }
              storageRef={firebase
                .storage()
                .ref(
                  'strategy/' +
                    this.state.campaignId +
                    '/' +
                    this.state.strategyId
                )}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
            />
          </label>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 240,
            fontSize: 16,
            fontWeight: 'bold',
            top: 500,
          }}>
          <div
            style={{
              borderRadius: 5,
              cursor: 'pointer',
              textAlign: 'center',
              padding: 5,
              width: 100,
              fontFamily: 'DINNextLTPro',
              border: '1px solid black',
            }}
            onClick={this.downloadDocument}>
            DOWNLOAD
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 420,
            fontSize: 16,
            fontWeight: 'bold',
            top: 500,
          }}>
          <DeleteButton onClick={this.deleteDocument}>DELETE</DeleteButton>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 200,
            fontSize: 16,
            fontWeight: 'bold',
            top: 600,
          }}>
          <CancelButton onClick={this.cancelNodeIcon}>CANCEL</CancelButton>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 25,
            fontSize: 16,
            fontWeight: 'bold',
            top: 600,
          }}>
          <SaveButton onClick={this.saveAttachments}>SAVE</SaveButton>
        </div>
      </div>
    );
  }

  async saveAttachments() {
    let newNode = await firebase
      .database()
      .ref(
        `strategies/${this.state.campaignId}/${this.state.strategyId}/tree${
          this.state.editNodeStack
        }/documents`
      )
      .set(this.state.documents);

    this.cancelNodeIcon();
    this.getUserData();
  }

  uploadDocument() {}

  downloadDocument() {
    //console.log('Download Document');

    //console.log(this.state.documents[this.state.selectedDoc].url);

    // fake server request, getting the file url as response
    setTimeout(() => {
      const response = {
        file: this.state.documents[this.state.selectedDoc].url,
      };
      // server sent the url to the file!
      // now, let's download:
      window.open(response.file);
      // you could also do:
      // window.location.href = response.file;
    }, 100);
  }

  dDocument(xdoc) {
    //console.log('Download Document');
    //console.log(this.state.documents[xdoc].url);

    // fake server request, getting the file url as response
    setTimeout(() => {
      const response = {
        file: this.state.documents[xdoc].url,
      };
      // server sent the url to the file!
      // now, let's download:
      window.open(response.file);
      // you could also do:
      // window.location.href = response.file;
    }, 100);
  }

  dSidebarDocument(xdoc) {
    //console.log('Download Sidebar Document');
    //console.log(this.state.sideBarAttachments[xdoc].url);

    // fake server request, getting the file url as response
    setTimeout(() => {
      const response = {
        file: this.state.sideBarAttachments[xdoc].url,
      };
      // server sent the url to the file!
      // now, let's download:
      window.open(response.file);
      // you could also do:
      // window.location.href = response.file;
    }, 100);
  }

  deleteDocument() {
    let documents = this.state.documents;
    let newdocs = [];

    for (let bb = 0; bb < documents.length; bb++) {
      if (bb != this.state.selectedDoc) {
        newdocs.push(documents[bb]);
      }
    }

    this.setState({ documents: newdocs });
  }

  renderChooseIcon() {
    let chooseMyIcon = this.chooseMyIcon;

    let xCount = this.state.newNodeName.length;
    let startTime = this.state.newStartDate;
    let eventTime = this.state.newEventDate;

    //console.log('Render SEdit strategy Node');
    //console.log(startTime);

    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          width: 600,
          height: 650,
          marginLeft: -300,
          backgroundColor: '#eeeeee',
          top: 100,
          zIndex: 100,
        }}>
        <CancelLeft onClick={this.cancelNodeIcon} style={{}}>
          <i class="fa fa-arrow-left" />
        </CancelLeft>

        <div style={{ position: 'absolute', left: 90, fontSize: 26, top: 5 }}>
          <i class="fa fa-check" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 120,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'DINNextLTPro',
            top: 10,
          }}>
          {' '}
          NODE ICON FOR: {this.state.newNodeName}
        </div>

        <div style={{ margin: 80 }}>
          <IconItem
            onClick={function() {
              chooseMyIcon('check');
            }}
            style={{
              color: this.state.newIcon == 'check' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-check" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('adjust');
            }}
            style={{
              color: this.state.newIcon == 'adjust' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-adjust" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('address-book');
            }}
            style={{
              color: this.state.newIcon == 'address-book' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-address-book" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('ambulance');
            }}
            style={{
              color: this.state.newIcon == 'ambulance' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-ambulance" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('anchor');
            }}
            style={{
              color: this.state.newIcon == 'anchor' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-anchor" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('asterisk');
            }}
            style={{
              color: this.state.newIcon == 'asterisk' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-asterisk" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('binoculars');
            }}
            style={{
              color: this.state.newIcon == 'binoculars' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-binoculars" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('bell');
            }}
            style={{
              color: this.state.newIcon == 'bell' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-bell" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('bolt');
            }}
            style={{
              color: this.state.newIcon == 'bolt' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-bolt" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('bomb');
            }}
            style={{
              color: this.state.newIcon == 'bomb' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-bomb" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('book');
            }}
            style={{
              color: this.state.newIcon == 'book' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-book" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('building');
            }}
            style={{
              color: this.state.newIcon == 'building' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-building" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('bullseye');
            }}
            style={{
              color: this.state.newIcon == 'bullseye' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-bullseye" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('beer');
            }}
            style={{
              color: this.state.newIcon == 'beer' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-beer" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('bus');
            }}
            style={{ color: this.state.newIcon == 'bus' ? '#C1272D' : 'none' }}>
            <i class="fa fa-bus" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('car');
            }}
            style={{ color: this.state.newIcon == 'car' ? '#C1272D' : 'none' }}>
            <i class="fa fa-car" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('certificate');
            }}
            style={{
              color: this.state.newIcon == 'certificate' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-certificate" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('circle');
            }}
            style={{
              color: this.state.newIcon == 'circle' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-circle" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('bullhorn');
            }}
            style={{
              color: this.state.newIcon == 'bullhorn' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-bullhorn" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('child');
            }}
            style={{
              color: this.state.newIcon == 'child' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-child" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('cubes');
            }}
            style={{
              color: this.state.newIcon == 'cubes' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-cubes" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('coffee');
            }}
            style={{
              color: this.state.newIcon == 'coffee' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-coffee" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('female');
            }}
            style={{
              color: this.state.newIcon == 'female' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-female" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('file');
            }}
            style={{
              color: this.state.newIcon == 'file' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-file" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('compass');
            }}
            style={{
              color: this.state.newIcon == 'compass' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-compass" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('flag');
            }}
            style={{
              color: this.state.newIcon == 'flag' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-flag" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('globe');
            }}
            style={{
              color: this.state.newIcon == 'globe' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-globe" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('download');
            }}
            style={{
              color: this.state.newIcon == 'download' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-download" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('heart');
            }}
            style={{
              color: this.state.newIcon == 'heart' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-heart" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('envelope');
            }}
            style={{
              color: this.state.newIcon == 'envelope' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-envelope" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('leaf');
            }}
            style={{
              color: this.state.newIcon == 'leaf' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-leaf" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('life-ring');
            }}
            style={{
              color: this.state.newIcon == 'life-ring' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-life-ring" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('home');
            }}
            style={{
              color: this.state.newIcon == 'home' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-home" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('phone');
            }}
            style={{
              color: this.state.newIcon == 'phone' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-phone" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('plane');
            }}
            style={{
              color: this.state.newIcon == 'plane' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-plane" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('paw');
            }}
            style={{ color: this.state.newIcon == 'paw' ? '#C1272D' : 'none' }}>
            <i class="fa fa-paw" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('puzzle-piece');
            }}
            style={{
              color: this.state.newIcon == 'puzzle-piece' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-puzzle-piece" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('rocket');
            }}
            style={{
              color: this.state.newIcon == 'rocket' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-rocket" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('wrench');
            }}
            style={{
              color: this.state.newIcon == 'wrench' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-wrench" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('subway');
            }}
            style={{
              color: this.state.newIcon == 'subway' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-subway" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('tv');
            }}
            style={{ color: this.state.newIcon == 'tv' ? '#C1272D' : 'none' }}>
            <i class="fa fa-tv" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('print');
            }}
            style={{
              color: this.state.newIcon == 'print' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-print" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('train');
            }}
            style={{
              color: this.state.newIcon == 'train' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-train" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('tree');
            }}
            style={{
              color: this.state.newIcon == 'tree' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-tree" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('trophy');
            }}
            style={{
              color: this.state.newIcon == 'trophy' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-trophy" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('truck');
            }}
            style={{
              color: this.state.newIcon == 'truck' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-truck" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('university');
            }}
            style={{
              color: this.state.newIcon == 'university' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-university" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('wifi');
            }}
            style={{
              color: this.state.newIcon == 'wifi' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-wifi" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('thermometer-half');
            }}
            style={{
              color:
                this.state.newIcon == 'thermometer-half' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-thermometer-half" />
          </IconItem>
          <IconItem
            onClick={function() {
              chooseMyIcon('shower');
            }}
            style={{
              color: this.state.newIcon == 'shower' ? '#C1272D' : 'none',
            }}>
            <i class="fa fa-shower" />
          </IconItem>
        </div>
      </div>
    );
  }

  editCampaign() {
    this.setState({ showEdit: true });
  }

  handleTitleChange(input, value) {
    this.setState({ newNodeName: input.target.value });
  }

  handleTitleChange2(input, value) {
    this.setState({ oTitle: input.target.value });
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
          height: 390,
          marginLeft: -300,
          backgroundColor: '#eeeeee',
          top: 150,
        }}>
        <div
          style={{
            position: 'absolute',
            left: 10,
            fontFamily: 'DINNextLTPro',
            fontSize: 26,
            top: 5,
          }}>
          <i class="fa fa-check" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontFamily: 'DINNextLTPro',
            fontSize: 20,
            fontWeight: 'bold',
            top: 10,
          }}>
          EDIT STRATEGY
        </div>

        <div
          style={{
            position: 'absolute',
            left: 25,
            fontFamily: 'DINNextLTPro',
            color: '#C1272D',
            fontSize: 20,
            top: 55,
          }}>
          <i class="fa fa-pencil" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            fontFamily: 'DINNextLTPro',
            fontSize: 16,
            fontWeight: 'bold',
            top: 60,
          }}>
          Strategy Name
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
            value={this.state.oTitle}
            onChange={this.handleTitleChange2}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 320,
            fontSize: 20,
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
            fontFamily: 'DINNextLTPro',
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
          Strategy Description
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
            defaultValue={this.state.oDesc}
            style={{
              fontSize: 20,
              width: 300,
              fontFamily: 'DINNextLTPro',
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
            top: 330,
          }}>
          <DeleteButton onClick={this.deleteCampaign}>DELETE</DeleteButton>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 450,
            fontSize: 16,
            fontWeight: 'bold',
            top: 330,
          }}>
          <SaveButton onClick={this.saveStrategy}>SAVE</SaveButton>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 300,
            fontSize: 16,
            fontWeight: 'bold',
            top: 330,
          }}>
          <CancelButton onClick={this.cancelAdd}>CANCEL</CancelButton>
        </div>
      </div>
    );
  }

  async saveStrategy() {
    if (this.state.oTitle == '') {
      alert('Title cannot be blank');
      return false;
    }

    if (this.state.oDesc == '') {
      alert('Description cannot be blank');
      return false;
    }

    await firebase
      .database()
      .ref(`strategies/${this.state.campaignId}/${this.state.strategyId}/title`)
      .set(this.state.oTitle);
    await firebase
      .database()
      .ref(`strategies/${this.state.campaignId}/${this.state.strategyId}/desc`)
      .set(this.state.oDesc);
    this.cancelAdd();
    this.getUserData();
  }

  deleteCampaign() {
    firebase
      .database()
      .ref(`strategies/${this.state.campaignId}/${this.state.strategyId}`)
      .remove();
    this.setState({ redirectBack: true });
  }

  attributeChanged(xattribute) {
    //console.log('show side menu');
    //console.log(xattribute);

    this.setState({ showSideMenu: xattribute });
  }

  async zoomStart(direction) {
    //console.log('zoom start');

    await this.setState({ zoomDir: direction });

    this.zoomInterval = setInterval(this.zoomTo, 25);
  }

  zoomStop() {
    //console.log('zoom stop');

    clearInterval(this.zoomInterval);
  }

  async panStart(direction) {
    //console.log('pan start');

    await this.setState({ panDir: direction });

    this.panInterval = setInterval(this.scrollTo, 25);
  }

  panStop() {
    //console.log('pan stop');

    clearInterval(this.panInterval);
  }

  zoomTo() {
    let direction = this.state.zoomDir;
    let z = this.state.zoom;

    //console.log(z);

    let x = this.state.relativeX;
    let y = this.state.relativeY;
    if (direction === 'IN') {
      if (z > 120) {
        return false;
      }
      this.setState({ relativeY: y - 2, zoom: z + 1 });
    }

    if (direction === 'OUT') {
      if (z < 50) {
        return false;
      }

      this.setState({ relativeY: y + 2, zoom: z - 1 });
    }
  }

  scrollTo() {
    let direction = this.state.panDir;
    let x = this.state.relativeX;
    let y = this.state.relativeY;

    if (direction === 'UP') {
      this.setState({ relativeY: y - 3 });
    }

    if (direction === 'DOWN') {
      this.setState({ relativeY: y + 3 });
    }

    if (direction === 'LEFT') {
      this.setState({ relativeX: x - 3 });
    }

    if (direction === 'RIGHT') {
      this.setState({ relativeX: x + 3 });
    }
  }

  renderControls() {
    let panStart = this.panStart;
    let panStop = this.panStop;

    return (
      <Controls>
        <UpArrow
          onMouseDown={function() {
            panStart('UP');
          }}
          onMouseUp={function() {
            panStop('IN');
          }}>
          <i class="fa fa-arrow-up" />
        </UpArrow>
        <DownArrow
          onMouseDown={function() {
            panStart('DOWN');
          }}
          onMouseUp={function() {
            panStop('IN');
          }}>
          <i class="fa fa-arrow-down" />
        </DownArrow>
        <LeftArrow
          onMouseDown={function() {
            panStart('LEFT');
          }}
          onMouseUp={function() {
            panStop('IN');
          }}>
          <i class="fa fa-arrow-left" />
        </LeftArrow>
        <RightArrow
          onMouseDown={function() {
            panStart('RIGHT');
          }}
          onMouseUp={function() {
            panStop('IN');
          }}>
          <i class="fa fa-arrow-right" />
        </RightArrow>
      </Controls>
    );
  }

  renderControls2() {
    let zoomStart = this.zoomStart;
    let zoomStop = this.zoomStop;

    return (
      <Controls2>
        <MagArrow>
          <i class="fa fa-search" />
        </MagArrow>
        <UpArrow2
          onMouseDown={function() {
            zoomStart('IN');
          }}
          onMouseUp={function() {
            zoomStop('IN');
          }}>
          <i class="fa fa-plus" />
        </UpArrow2>
        <DownArrow2
          onMouseDown={function() {
            zoomStart('OUT');
          }}
          onMouseUp={function() {
            zoomStop('IN');
          }}>
          <i class="fa fa-minus" />
        </DownArrow2>
      </Controls2>
    );
  }

  render() {
    let blackBackground = null;

    let addNewStrategyNode = null;

    let chooseIcon = null;
    let chooseAttributes = null;
    let sideBar = null;

    let startDate = null;
    let eventDate = null;

    let controls = this.renderControls();

    let controls2 = this.renderControls2();

    if (this.state.sideBarStartDate) {
      startDate = new Date(this.state.sideBarStartDate).toLocaleDateString();
    }
    if (this.state.sideBarEventDate) {
      eventDate = new Date(this.state.sideBarEventDate).toLocaleDateString();
    }

    if (this.state.showSideMenu == true && this.state.sideBarTitle != '') {
      sideBar = (
        <Sidebar>
          <div
            style={{
              position: 'absolute',
              left: 15,
              fontFamily: 'DINNextLTPro',
              color: '#C1272D',
              fontSize: 26,
              top: 10,
            }}>
            <i class="fa fa-info" />
          </div>
          <div
            style={{
              position: 'absolute',

              width: 150,
              overflow: 'hidden',
              textOverflow: 'ellipsis',

              height: 22,

              left: 45,
              fontFamily: 'DINNextLTPro',
              fontSize: 20,
              fontWeight: 'bold',
              top: 10,
            }}>
            {this.state.sideBarTitle}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 10,
              fontFamily: 'DINNextLTPro',
              color: '#C1272D',
              fontSize: 26,
              top: 45,
            }}>
            <i class="fa fa-comment" />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 45,
              fontFamily: 'DINNextLTPro',
              fontSize: 16,
              fontWeight: 'bold',
              top: 50,
            }}>
            Description
          </div>
          <div
            style={{
              position: 'absolute',
              left: 45,
              fontFamily: 'DINNextLTPro',
              fontSize: 12,
              top: 66,
              width: 150,
              height: 100,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
            {this.state.sideBarDesc}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 10,
              fontFamily: 'DINNextLTPro',
              color: '#C1272D',
              fontSize: 26,
              top: 158,
            }}>
            <i class="fa fa-file" />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 45,
              fontFamily: 'DINNextLTPro',
              fontSize: 16,
              fontWeight: 'bold',
              top: 164,
            }}>
            Attachments
          </div>

          <div
            style={{
              position: 'absolute',
              left: 45,
              fontFamily: 'DINNextLTPro',
              fontSize: 12,
              top: 186,
              width: 150,
              height: 80,
            }}>
            {this.renderSideBarDocuments()}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 10,
              fontFamily: 'DINNextLTPro',
              color: '#C1272D',
              fontSize: 26,
              top: 285,
            }}>
            <i class="fa fa-calendar" />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 45,
              color: 'white',
              fontFamily: 'DINNextLTPro',
              fontSize: 16,
              fontWeight: 'bold',
              top: 291,
            }}>
            Start Date:
          </div>

          <div
            style={{
              position: 'absolute',
              right: 10,
              color: 'lightgray',
              fontFamily: 'DINNextLTPro',
              fontSize: 20,
              top: 325,
              height: 30,
            }}>
            {startDate}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 10,
              color: '#C1272D',
              fontSize: 26,
              top: 365,
            }}>
            <i class="fa fa-calendar" />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 45,
              color: 'white',
              fontFamily: 'DINNextLTPro',
              fontSize: 16,
              fontWeight: 'bold',
              top: 373,
            }}>
            Event Date:
          </div>

          <div
            style={{
              position: 'absolute',
              right: 10,
              color: 'lightgray',
              fontFamily: 'DINNextLTPro',
              fontSize: 20,
              top: 395,
              height: 30,
            }}>
            {eventDate}
          </div>
        </Sidebar>
      );
    }

    let chooseDocuments = null;

    if (this.state.chooseIcon == true) {
      chooseIcon = this.renderChooseIcon();
    }

    if (this.state.redirectBack == true) {
      //console.log('REDIRECT TO Home');
      return (
        <Redirect
          to={{
            state: { campaign: this.state.campaignId },
            pathname: '/campaign',
          }}
        />
      );
    }

    if (this.state.showEdit == true) {
      chooseIcon = this.renderEditCampaign();
      blackBackground = <BlackBackground onClick={this.cancelAdd} />;
    }

    if (this.state.chooseAttributes == true) {
      chooseAttributes = this.renderAttributes();
    }

    if (this.state.chooseDocuments == true) {
      chooseDocuments = this.renderDocuments();
    }
    if (this.state.newNode == true) {
      blackBackground = <BlackBackground onClick={this.cancelAdd} />;

      addNewStrategyNode = this.renderNewStrategyNode();
    }

    if (this.state.editNode == true) {
      blackBackground = <BlackBackground onClick={this.cancelAdd} />;

      addNewStrategyNode = this.renderEditStrategyNode();
    }

    if (this.state.loaded != false) {
      return (
        <div onMouseOver={this.mouseout}>
          <Header2
            attributeChanged={this.attributeChanged}
            campaign={this.state.campaignId}
            strategy={this.state.strategyId}
          />
          <div style={{ textAlign: 'center' }}>
            <h2
              style={{
                color: '#C9C9C9',
                fontFamily: 'DINNextLTPro',
              }}>
              STRATEGY TREE: {this.state.campaignName.toUpperCase()} :{' '}
              {this.state.oTitle.toUpperCase()}
              <i
                onClick={this.editCampaign}
                style={{ cursor: 'pointer', color: 'white', marginLeft: 10 }}
                class="fa fa-gears"
              />
            </h2>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              style={{
                width: 36,
                margin: 10,
              }}
              src="images/TreesPageIcon.png"
            />
          </div>

          <div style={{ zoom: this.state.zoom + '%' }}>
            {' '}
            {this.renderNodes()}
          </div>
          {chooseIcon}
          {controls}
          {chooseAttributes}
          {chooseDocuments}
          {addNewStrategyNode}
          {blackBackground}
          {sideBar}
          {controls}
          {controls2}
        </div>
      );
    } else {
      return (
        <div onMouseOver={this.mouseout}>
          <Header2
            attributeChanged={this.attributeChanged}
            campaign={this.state.campaignId}
            strategy={this.state.strategyId}
          />

          <LoadingGIF>
            <img src="images/loading.gif" />
          </LoadingGIF>
        </div>
      );
    }
  }
}

const MyPlusSign = glamorous.div({
  width: 30,
  height: 25,
  border: '1px solid white',
  borderRadius: 5,
  color: '#fff',
  textAlign: 'center',
  verticalAlign: 'middle',
  fontSize: 20,
  cursor: 'pointer',
  ':hover': {
    color: 'black',
    backgroundColor: 'white',
  },
});

const MyNode = glamorous.div({
  marginLeft: 50,
  position: 'relative',
  width: 190,
  height: 20,
  padding: 5,
  backgroundColor: '#C9C9C9',

  cursor: 'pointer',
  color: '#444',
  borderRadius: 8,
  zIndex: 9,

  ':hover': {
    backgroundColor: 'white',
  },
});

const NodePosition = glamorous.div({
  position: 'absolute',
  left: '50%',
  top: 150,
  width: 290,
  height: 70,
});

const DocumentItem = glamorous.div({
  cursor: 'pointer',

  width: 500,
  height: 30,
  margin: 2,
  marginLeft: 30,
  fontSize: 16,
  color: 'grey',
  fontFamily: 'DINNextLTPro',

  ':hover': {
    color: 'blue',
  },
});
const DocumentItemSmallText = glamorous.div({
  float: 'left',

  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: 85,
  height: 14,
  fontFamily: 'DINNextLTPro',
  fontSize: 12,
});

const DocumentItemSmall = glamorous.div({
  cursor: 'pointer',
  float: 'left',

  width: 120,
  height: 20,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  margin: 2,
  marginLeft: 30,
  fontSize: 12,
  color: 'grey',
  fontFamily: 'DINNextLTPro',

  ':hover': {
    color: 'blue',
  },
});
const DocumentItemSide = glamorous.div({
  cursor: 'pointer',
  width: 130,
  overflow: 'hidden',
  height: 18,
  margin: 2,
  marginLeft: 0,
  fontSize: 12,
  fontFamily: 'DINNextLTPro',
  color: 'grey',
  ':hover': {
    color: 'blue',
  },
});

const LeftSide = glamorous.div({
  position: 'absolute',
  width: 30,
  height: 30,
  left: 10,
  top: 2,
});
const RightSide = glamorous.div({
  position: 'absolute',
  width: 30,
  height: 30,
  left: 260,
  top: 2,
});
const BottomSide = glamorous.div({
  position: 'absolute',
  width: 30,
  height: 30,
  left: 135,
  top: 35,
});

const NodeIcon = glamorous.div({
  width: 28,
  height: 28,
  float: 'left',
});

const IconItem = glamorous.div({
  margin: 3,
  width: 30,
  height: 30,
  textAlign: 'center',
  fontSize: 26,
  padding: 3,
  paddingTop: 5,
  float: 'left',
  border: '1px solid transparent',
  borderRadius: 5,
  ':hover': {
    color: '#C1272D',
  },
});

const NodeTitle = glamorous.div({
  fontSize: 16,
  fontFamily: 'DINNextLTPro',
  textOverflow: 'ellipsis',
  textTransform: 'capitalize',
  height: 20,
  flexWrap: 'wrap',
  overflow: 'hidden',
  float: 'left',
  width: 130,
});

const LeftLine = glamorous.div({
  position: 'absolute',
  width: 210,
  height: 115,
  left: -150,
  top: 15,
  borderTop: '2px solid gray',
  borderRadius: 10,
  borderLeft: '2px solid gray',
  zIndex: 0,
});
const RightLine = glamorous.div({
  position: 'absolute',
  width: 210,
  height: 115,
  left: 240,
  borderTop: '2px solid gray',
  borderRadius: 10,
  top: 15,
  borderRight: '2px solid gray',
  zIndex: 0,
});
const BottomLine = glamorous.div({
  position: 'absolute',
  width: 2,
  height: 100,
  left: 150,
  top: 30,
  backgroundColor: 'gray',
  zIndex: 0,
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

const Sidebar = glamorous.div({
  right: 30,
  top: 60,
  position: 'absolute',
  width: 190,
  height: 450,
  padding: 5,
  backgroundColor: '#000',
  color: '#ffffff',
  border: '1px solid lightgray',
  borderRadius: 3,
});

const Controls = glamorous.div({
  left: 20,
  top: 180,
  position: 'absolute',
  width: 60,
  height: 100,
  zIndex: 1000,
});

const Controls2 = glamorous.div({
  left: 20,
  top: 80,
  position: 'absolute',
  width: 60,
  height: 100,
  zIndex: 1000,
});

const LeftArrow = glamorous.div({
  left: 5,
  top: 50,
  position: 'absolute',
  width: 20,
  height: 20,
  padding: 2,
  border: '1px solid gray',
  color: 'gray',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: 'black',
  ':hover': {
    color: 'white',
  },
});

const RightArrow = glamorous.div({
  right: 5,
  top: 50,
  position: 'absolute',
  width: 20,
  height: 20,
  padding: 2,
  border: '1px solid gray',
  color: 'gray',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: 'black',
  ':hover': {
    color: 'white',
  },
});

const UpArrow = glamorous.div({
  left: 17,
  top: 25,
  position: 'absolute',
  width: 20,
  height: 20,
  padding: 2,
  border: '1px solid gray',
  color: 'gray',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: 'black',
  ':hover': {
    color: 'white',
  },
});

const DownArrow = glamorous.div({
  left: 17,
  bottom: -1,
  position: 'absolute',
  width: 20,
  height: 20,
  padding: 2,
  border: '1px solid gray',
  color: 'gray',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: 'black',
  ':hover': {
    color: 'white',
  },
});

const MagArrow = glamorous.div({
  left: 17,
  top: 2,
  position: 'absolute',
  width: 20,
  height: 20,
  padding: 2,
  border: '1px solid gray',
  color: 'gray',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: 'black',
  ':hover': {
    color: 'white',
  },
});

const UpArrow2 = glamorous.div({
  left: 17,
  top: 27,
  position: 'absolute',
  width: 20,
  height: 20,
  padding: 2,
  border: '1px solid gray',
  color: 'gray',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: 'black',
  ':hover': {
    color: 'white',
  },
});

const CancelLeft = glamorous.div({
  position: 'absolute',
  left: 10,
  top: 10,
  width: 60,
  height: 24,
  borderRadius: 10,
  border: '1px solid #090909',
  color: '#090909',
  textAlign: 'center',
  cursor: 'pointer',
  fontSize: 22,

  ':hover': {
    color: 'white',
    backgroundColor: '#090909',
  },
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

const AttributeButton = glamorous.div({
  borderRadius: 5,
  cursor: 'pointer',
  padding: 5,
  fontFamily: 'DINNextLTPro',
  width: 150,
  border: '1px solid black',
  ':hover': {
    color: 'white',
    backgroundColor: 'black',
    border: '1px solid white',
  },
});

const LoadingGIF = glamorous.div({
  position: 'absolute',
  left: '50%',
  top: '50%',
  marginTop: -15,
  marginLeft: -15,
});

const SideDocText = glamorous.div({
  overflow: 'hidden',
  height: 13,
  margin: 2,
  marginLeft: 0,
  textOverflow: 'ellipsis',
  fontSize: 12,
  fontFamily: 'DINNextLTPro',
  color: 'grey',
  float: 'left',
  ':hover': {
    color: 'blue',
  },
});

const DownArrow2 = glamorous.div({
  left: 17,
  bottom: 23,
  position: 'absolute',
  width: 20,
  height: 20,
  border: '1px solid gray',
  padding: 2,
  color: 'gray',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: 'black',
  ':hover': {
    color: 'white',
  },
});
