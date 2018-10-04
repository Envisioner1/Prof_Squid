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
import Header from '../components/headeradmin';
import {
  DateRangePicker,
  SingleDatePicker,
  DayPickerRangeController,
} from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import Select from 'react-select';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import FileUploader from 'react-firebase-file-uploader';
import ReactPlayer from 'react-player';
import moment from 'moment';
import MultiSelect from '@khanacademy/react-multi-select';
export class CreateExperience extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialGeo: {
        lat: 40.854885,
        lng: -88.081807,
      },
      redirect: false,
      country: 'All',
      gender: 'All',
      uid: this.props.location.state.userId,
      newId: this.props.location.state.newId,
      moms: false,
      noticePeriod: 1,
      entertainers: false,
      explorers: false,
      fashion: false,
      foodies: false,
      entrepreneurs: false,
      timeZone: null,
      recordExists: false,
      approved: null,
      waitingCount: 0,
      workout: false,
      bloggers: false,
      minimumFollowers: 0,
      maximumFollowers: 100000000,
      resetDay: 1,

      address: '',
      parentCompanyName: '',
      businessName: '',
      contactName: '',
      experienceName: '',
      category: 'Restaurant',
      description: '',
      instagramHandle: '',
      duration: 120,
      guestCount: 1000,
      guestDayCount: 10,
      followerReq: 100,
      postReq: 50,
      plusOne: 0,
      reviewReq: 50,
      schedule: {},
      whatYouGet: '',
      whatYouGetIcon: '',
      eventPrice: 25,
      experienceDesc: '',
      expectations: '',
      whereIsIt: '',
      startDate: '',
      endDate: '',
      experienceLogo: null,
      storiesThumbnail: null,
      feedThumbnail: null,
      detailedView: null,
      experienceVideo: null,
      storyVideos: {},
      businessLogo: null,
      geocode: {},
      newId: this.props.location.state.newId,
      eventType: 'open',
    };

    this.handleentrepreneurs = this.handleentrepreneurs.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.toggleCheckboxFalse = this.toggleCheckboxFalse.bind(this);

    this.handleTimeZone = this.handleTimeZone.bind(this);
    this.findScheduleItem = this.findScheduleItem.bind(this);
    this.handleWaitingCount = this.handleWaitingCount.bind(this);
    this.handleParentCompanyName = this.handleParentCompanyName.bind(this);
    this.handleBusinessName = this.handleBusinessName.bind(this);
    this.handleContactName = this.handleContactName.bind(this);
    this.handleExperienceName = this.handleExperienceName.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleNoticePeriod = this.handleNoticePeriod.bind(this);
    this.handleGender = this.handleGender.bind(this);
    this.handleEventType = this.handleEventType.bind(this);
    this.handleCountry = this.handleCountry.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleInstagramHandle = this.handleInstagramHandle.bind(this);
    this.handleDuration = this.handleDuration.bind(this);
    this.handleGuestCount = this.handleGuestCount.bind(this);
    this.handleGuestDayCount = this.handleGuestDayCount.bind(this);
    this.handleFollowerReq = this.handleFollowerReq.bind(this);
    this.handlePostReq = this.handlePostReq.bind(this);
    this.rejectExperience = this.rejectExperience.bind(this);
    this.approveExperience = this.approveExperience.bind(this);
    this.pauseExperience = this.pauseExperience.bind(this);
    this.timeChanged = this.timeChanged.bind(this);
    this.handleReviewReq = this.handleReviewReq.bind(this);
    this.handlePlusOne = this.handlePlusOne.bind(this);
    this.handleWhatYouGet = this.handleWhatYouGet.bind(this);
    this.handleWhatYouGetIcon = this.handleWhatYouGetIcon.bind(this);
    this.renderStoryVideos = this.renderStoryVideos.bind(this);
    this.handleResetDay = this.handleResetDay.bind(this);

    this.handleEventPrice = this.handleEventPrice.bind(this);
    this.handleExperienceDesc = this.handleExperienceDesc.bind(this);
    this.handleExpectations = this.handleExpectations.bind(this);
    this.handleWhereIsIt = this.handleWhereIsIt.bind(this);
    this.handleLocation = this.handleLocation.bind(this);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.sendPush = this.sendPush.bind(this);
    this.handleStartTime = this.handleStartTime.bind(this);
    this.handleExperienceVideo = this.handleExperienceVideo.bind(this);
    this.handleStoryVideo = this.handleStoryVideo.bind(this);
    this.deleteStoryVideo = this.deleteStoryVideo.bind(this);
    this.gotStoryVideo = this.gotStoryVideo.bind(this);
    this.removeStory = this.removeStory.bind(this);
    this.copy7 = this.copy7.bind(this);
    this.handleBusinessLogo = this.handleBusinessLogo.bind(this);
    this.gotBusinessLogo = this.gotBusinessLogo.bind(this);
    this.deleteBusinessLogo = this.deleteBusinessLogo.bind(this);

    this.datesChanged = this.datesChanged.bind(this);
    this.renderDayFields = this.renderDayFields.bind(this);
    this.handleGo = this.handleGo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.gotGeoCode = this.gotGeoCode.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleExperienceLogo = this.handleExperienceLogo.bind(this);
    this.handleStoriesThumbnail = this.handleStoriesThumbnail.bind(this);
    this.handleFeedThumbnail = this.handleFeedThumbnail.bind(this);
    this.handleDetailedView = this.handleDetailedView.bind(this);
    this.gotDetailedURL = this.gotDetailedURL.bind(this);
    this.gotDetailedURL = this.gotDetailedURL.bind(this);
    this.gotFeedURL = this.gotFeedURL.bind(this);
    this.gotExperienceURL = this.gotExperienceURL.bind(this);
    this.gotExperienceVideo = this.gotExperienceVideo.bind(this);
    this.gotStoriesURL = this.gotStoriesURL.bind(this);
    this.createExperiencePlaceholder = this.createExperiencePlaceholder.bind(
      this
    );
    this.deleteDetailedView = this.deleteDetailedView.bind(this);
    this.deleteFeedThumbnail = this.deleteFeedThumbnail.bind(this);
    this.deleteThumbnail = this.deleteThumbnail.bind(this);
    this.deleteExperienceLogo = this.deleteExperienceLogo.bind(this);
    this.deleteExperienceVideo = this.deleteExperienceVideo.bind(this);

    this.handleMapMounted = this.handleMapMounted.bind(this);

    this.handleTechies = this.handleTechies.bind(this);
    this.handleBloggers = this.handleBloggers.bind(this);
    this.handleEntertainers = this.handleEntertainers.bind(this);
    this.handleExplorers = this.handleExplorers.bind(this);
    this.handleFashion = this.handleFashion.bind(this);
    this.handleFoodies = this.handleFoodies.bind(this);
    this.handleMoms = this.handleMoms.bind(this);
    this.handleRacers = this.handleRacers.bind(this);
    this.handleWorkout = this.handleWorkout.bind(this);

    this.ihandleBloggers = this.ihandleBloggers.bind(this);
    this.ihandleEntertainers = this.ihandleEntertainers.bind(this);
    this.ihandleExplorers = this.ihandleExplorers.bind(this);
    this.ihandleFashion = this.ihandleFashion.bind(this);
    this.ihandleFoodies = this.ihandleFoodies.bind(this);
    this.ihandleMoms = this.ihandleMoms.bind(this);
    this.ihandleRacers = this.ihandleRacers.bind(this);
    this.ihandleWorkout = this.ihandleWorkout.bind(this);
    this.includeDay = this.includeDay.bind(this);
    this.handleMaximum = this.handleMaximum.bind(this);
    this.handleMinimum = this.handleMinimum.bind(this);

    this.countries = [
      { label: 'Afghanistan', value: 'AF' },
      { label: 'land Islands', value: 'AX' },
      { label: 'Albania', value: 'AL' },
      { label: 'Algeria', value: 'DZ' },
      { label: 'American Samoa', value: 'AS' },
      { label: 'AndorrA', value: 'AD' },
      { label: 'Angola', value: 'AO' },
      { label: 'Anguilla', value: 'AI' },
      { label: 'Antarctica', value: 'AQ' },
      { label: 'Antigua and Barbuda', value: 'AG' },
      { label: 'Argentina', value: 'AR' },
      { label: 'Armenia', value: 'AM' },
      { label: 'Aruba', value: 'AW' },
      { label: 'Australia', value: 'AU' },
      { label: 'Austria', value: 'AT' },
      { label: 'Azerbaijan', value: 'AZ' },
      { label: 'Bahamas', value: 'BS' },
      { label: 'Bahrain', value: 'BH' },
      { label: 'Bangladesh', value: 'BD' },
      { label: 'Barbados', value: 'BB' },
      { label: 'Belarus', value: 'BY' },
      { label: 'Belgium', value: 'BE' },
      { label: 'Belize', value: 'BZ' },
      { label: 'Benin', value: 'BJ' },
      { label: 'Bermuda', value: 'BM' },
      { label: 'Bhutan', value: 'BT' },
      { label: 'Bolivia', value: 'BO' },
      { label: 'Bosnia and Herzegovina', value: 'BA' },
      { label: 'Botswana', value: 'BW' },
      { label: 'Bouvet Island', value: 'BV' },
      { label: 'Brazil', value: 'BR' },
      { label: 'British Indian Ocean Territory', value: 'IO' },
      { label: 'Brunei Darussalam', value: 'BN' },
      { label: 'Bulgaria', value: 'BG' },
      { label: 'Burkina Faso', value: 'BF' },
      { label: 'Burundi', value: 'BI' },
      { label: 'Cambodia', value: 'KH' },
      { label: 'Cameroon', value: 'CM' },
      { label: 'Canada', value: 'CA' },
      { label: 'Cape Verde', value: 'CV' },
      { label: 'Cayman Islands', value: 'KY' },
      { label: 'Central African Republic', value: 'CF' },
      { label: 'Chad', value: 'TD' },
      { label: 'Chile', value: 'CL' },
      { label: 'China', value: 'CN' },
      { label: 'Christmas Island', value: 'CX' },
      { label: 'Cocos (Keeling) Islands', value: 'CC' },
      { label: 'Colombia', value: 'CO' },
      { label: 'Comoros', value: 'KM' },
      { label: 'Congo', value: 'CG' },
      { label: 'Congo, The Democratic Republic of the', value: 'CD' },
      { label: 'Cook Islands', value: 'CK' },
      { label: 'Costa Rica', value: 'CR' },
      { label: "Cote D'Ivoire", value: 'CI' },
      { label: 'Croatia', value: 'HR' },
      { label: 'Cuba', value: 'CU' },
      { label: 'Cyprus', value: 'CY' },
      { label: 'Czech Republic', value: 'CZ' },
      { label: 'Denmark', value: 'DK' },
      { label: 'Djibouti', value: 'DJ' },
      { label: 'Dominica', value: 'DM' },
      { label: 'Dominican Republic', value: 'DO' },
      { label: 'Ecuador', value: 'EC' },
      { label: 'Egypt', value: 'EG' },
      { label: 'El Salvador', value: 'SV' },
      { label: 'Equatorial Guinea', value: 'GQ' },
      { label: 'Eritrea', value: 'ER' },
      { label: 'Estonia', value: 'EE' },
      { label: 'Ethiopia', value: 'ET' },
      { label: 'Falkland Islands (Malvinas)', value: 'FK' },
      { label: 'Faroe Islands', value: 'FO' },
      { label: 'Fiji', value: 'FJ' },
      { label: 'Finland', value: 'FI' },
      { label: 'France', value: 'FR' },
      { label: 'French Guiana', value: 'GF' },
      { label: 'French Polynesia', value: 'PF' },
      { label: 'French Southern Territories', value: 'TF' },
      { label: 'Gabon', value: 'GA' },
      { label: 'Gambia', value: 'GM' },
      { label: 'Georgia', value: 'GE' },
      { label: 'Germany', value: 'DE' },
      { label: 'Ghana', value: 'GH' },
      { label: 'Gibraltar', value: 'GI' },
      { label: 'Greece', value: 'GR' },
      { label: 'Greenland', value: 'GL' },
      { label: 'Grenada', value: 'GD' },
      { label: 'Guadeloupe', value: 'GP' },
      { label: 'Guam', value: 'GU' },
      { label: 'Guatemala', value: 'GT' },
      { label: 'Guernsey', value: 'GG' },
      { label: 'Guinea', value: 'GN' },
      { label: 'Guinea-Bissau', value: 'GW' },
      { label: 'Guyana', value: 'GY' },
      { label: 'Haiti', value: 'HT' },
      { label: 'Heard Island and Mcdonald Islands', value: 'HM' },
      { label: 'Holy See (Vatican City State)', value: 'VA' },
      { label: 'Honduras', value: 'HN' },
      { label: 'Hong Kong', value: 'HK' },
      { label: 'Hungary', value: 'HU' },
      { label: 'Iceland', value: 'IS' },
      { label: 'India', value: 'IN' },
      { label: 'Indonesia', value: 'ID' },
      { label: 'Iran, Islamic Republic Of', value: 'IR' },
      { label: 'Iraq', value: 'IQ' },
      { label: 'Ireland', value: 'IE' },
      { label: 'Isle of Man', value: 'IM' },
      { label: 'Israel', value: 'IL' },
      { label: 'Italy', value: 'IT' },
      { label: 'Jamaica', value: 'JM' },
      { label: 'Japan', value: 'JP' },
      { label: 'Jersey', value: 'JE' },
      { label: 'Jordan', value: 'JO' },
      { label: 'Kazakhstan', value: 'KZ' },
      { label: 'Kenya', value: 'KE' },
      { label: 'Kiribati', value: 'KI' },
      { label: "Korea, Democratic People'S Republic of", value: 'KP' },
      { label: 'Korea, Republic of', value: 'KR' },
      { label: 'Kuwait', value: 'KW' },
      { label: 'Kyrgyzstan', value: 'KG' },
      { label: "Lao People'S Democratic Republic", value: 'LA' },
      { label: 'Latvia', value: 'LV' },
      { label: 'Lebanon', value: 'LB' },
      { label: 'Lesotho', value: 'LS' },
      { label: 'Liberia', value: 'LR' },
      { label: 'Libyan Arab Jamahiriya', value: 'LY' },
      { label: 'Liechtenstein', value: 'LI' },
      { label: 'Lithuania', value: 'LT' },
      { label: 'Luxembourg', value: 'LU' },
      { label: 'Macao', value: 'MO' },
      { label: 'Macedonia, The Former Yugoslav Republic of', value: 'MK' },
      { label: 'Madagascar', value: 'MG' },
      { label: 'Malawi', value: 'MW' },
      { label: 'Malaysia', value: 'MY' },
      { label: 'Maldives', value: 'MV' },
      { label: 'Mali', value: 'ML' },
      { label: 'Malta', value: 'MT' },
      { label: 'Marshall Islands', value: 'MH' },
      { label: 'Martinique', value: 'MQ' },
      { label: 'Mauritania', value: 'MR' },
      { label: 'Mauritius', value: 'MU' },
      { label: 'Mayotte', value: 'YT' },
      { label: 'Mexico', value: 'MX' },
      { label: 'Micronesia, Federated States of', value: 'FM' },
      { label: 'Moldova, Republic of', value: 'MD' },
      { label: 'Monaco', value: 'MC' },
      { label: 'Mongolia', value: 'MN' },
      { label: 'Montenegro', value: 'ME' },
      { label: 'Montserrat', value: 'MS' },
      { label: 'Morocco', value: 'MA' },
      { label: 'Mozambique', value: 'MZ' },
      { label: 'Myanmar', value: 'MM' },
      { label: 'Namibia', value: 'NA' },
      { label: 'Nauru', value: 'NR' },
      { label: 'Nepal', value: 'NP' },
      { label: 'Netherlands', value: 'NL' },
      { label: 'Netherlands Antilles', value: 'AN' },
      { label: 'New Caledonia', value: 'NC' },
      { label: 'New Zealand', value: 'NZ' },
      { label: 'Nicaragua', value: 'NI' },
      { label: 'Niger', value: 'NE' },
      { label: 'Nigeria', value: 'NG' },
      { label: 'Niue', value: 'NU' },
      { label: 'Norfolk Island', value: 'NF' },
      { label: 'Northern Mariana Islands', value: 'MP' },
      { label: 'Norway', value: 'NO' },
      { label: 'Oman', value: 'OM' },
      { label: 'Pakistan', value: 'PK' },
      { label: 'Palau', value: 'PW' },
      { label: 'Palestinian Territory, Occupied', value: 'PS' },
      { label: 'Panama', value: 'PA' },
      { label: 'Papua New Guinea', value: 'PG' },
      { label: 'Paraguay', value: 'PY' },
      { label: 'Peru', value: 'PE' },
      { label: 'Philippines', value: 'PH' },
      { label: 'Pitcairn', value: 'PN' },
      { label: 'Poland', value: 'PL' },
      { label: 'Portugal', value: 'PT' },
      { label: 'Puerto Rico', value: 'PR' },
      { label: 'Qatar', value: 'QA' },
      { label: 'Reunion', value: 'RE' },
      { label: 'Romania', value: 'RO' },
      { label: 'Russian Federation', value: 'RU' },
      { label: 'RWANDA', value: 'RW' },
      { label: 'Saint Helena', value: 'SH' },
      { label: 'Saint Kitts and Nevis', value: 'KN' },
      { label: 'Saint Lucia', value: 'LC' },
      { label: 'Saint Pierre and Miquelon', value: 'PM' },
      { label: 'Saint Vincent and the Grenadines', value: 'VC' },
      { label: 'Samoa', value: 'WS' },
      { label: 'San Marino', value: 'SM' },
      { label: 'Sao Tome and Principe', value: 'ST' },
      { label: 'Saudi Arabia', value: 'SA' },
      { label: 'Senegal', value: 'SN' },
      { label: 'Serbia', value: 'RS' },
      { label: 'Seychelles', value: 'SC' },
      { label: 'Sierra Leone', value: 'SL' },
      { label: 'Singapore', value: 'SG' },
      { label: 'Slovakia', value: 'SK' },
      { label: 'Slovenia', value: 'SI' },
      { label: 'Solomon Islands', value: 'SB' },
      { label: 'Somalia', value: 'SO' },
      { label: 'South Africa', value: 'ZA' },
      { label: 'South Georgia and the South Sandwich Islands', value: 'GS' },
      { label: 'Spain', value: 'ES' },
      { label: 'Sri Lanka', value: 'LK' },
      { label: 'Sudan', value: 'SD' },
      { label: 'Suriname', value: 'SR' },
      { label: 'Svalbard and Jan Mayen', value: 'SJ' },
      { label: 'Swaziland', value: 'SZ' },
      { label: 'Sweden', value: 'SE' },
      { label: 'Switzerland', value: 'CH' },
      { label: 'Syrian Arab Republic', value: 'SY' },
      { label: 'Taiwan, Province of China', value: 'TW' },
      { label: 'Tajikistan', value: 'TJ' },
      { label: 'Tanzania, United Republic of', value: 'TZ' },
      { label: 'Thailand', value: 'TH' },
      { label: 'Timor-Leste', value: 'TL' },
      { label: 'Togo', value: 'TG' },
      { label: 'Tokelau', value: 'TK' },
      { label: 'Tonga', value: 'TO' },
      { label: 'Trinidad and Tobago', value: 'TT' },
      { label: 'Tunisia', value: 'TN' },
      { label: 'Turkey', value: 'TR' },
      { label: 'Turkmenistan', value: 'TM' },
      { label: 'Turks and Caicos Islands', value: 'TC' },
      { label: 'Tuvalu', value: 'TV' },
      { label: 'Uganda', value: 'UG' },
      { label: 'Ukraine', value: 'UA' },
      { label: 'United Arab Emirates', value: 'AE' },
      { label: 'United Kingdom', value: 'GB' },
      { label: 'United States', value: 'US' },
      { label: 'United States Minor Outlying Islands', value: 'UM' },
      { label: 'Uruguay', value: 'UY' },
      { label: 'Uzbekistan', value: 'UZ' },
      { label: 'Vanuatu', value: 'VU' },
      { label: 'Venezuela', value: 'VE' },
      { label: 'Viet Nam', value: 'VN' },
      { label: 'Virgin Islands, British', value: 'VG' },
      { label: 'Virgin Islands, U.S.', value: 'VI' },
      { label: 'Wallis and Futuna', value: 'WF' },
      { label: 'Western Sahara', value: 'EH' },
      { label: 'Yemen', value: 'YE' },
      { label: 'Zambia', value: 'ZM' },
      { label: 'Zimbabwe', value: 'ZW' },
    ];
  }

  async handleTimeZone(input, value) {
    await this.setState({ timeZone: input.target.value });
    this.datesChanged();
  }

  randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  deleteExperienceVideo() {
    this.setState({ experienceVideo: null });
  }

  handleMinimum(input, value) {
    this.setState({ minimumFollowers: input.target.value });
    console.log(this.state);
  }

  handleTechies(input, value) {
    if (input.target.checked == true) {
      this.setState({ techies: true });
    } else {
      this.setState({ techies: false });
    }
    //console.log(this.state);
  }

  handleMaximum(input, value) {
    this.setState({ maximumFollowers: input.target.value });
    console.log(this.state);
  }

  handleBloggers(input, value) {
    console.log('HANDLE BLOGGERSSSS');
    console.log(input.target.checked);

    if (input.target.checked == true) {
      this.setState({ bloggers: true });
    } else {
      this.setState({ bloggers: false });
    }
    console.log(this.state);
  }

  handleentrepreneurs(input, value) {
    if (input.target.checked == true) {
      this.setState({ entrepreneurs: true });
    } else {
      this.setState({ entrepreneurs: false });
    }
    console.log(this.state);
  }

  async pauseExperience() {
    await firebase
      .database()
      .ref(`experiences/${this.state.uid}/${this.state.newId}/status`)
      .set('Paused');

    await firebase
      .database()
      .ref(`approved/${this.state.category}/${this.state.newId}/status`)
      .set('Paused');

    this.setState({ redirect: true });
    alert('Experience Paused');
  }

  async approveExperience() {
    await firebase
      .database()
      .ref(`experiences/${this.state.uid}/${this.state.newId}/status`)
      .set('Approved');
    let pinNumber = Math.random()
      .toString()
      .substr(2, 4);
    await firebase
      .database()
      .ref(`experiences/${this.state.uid}/${this.state.newId}/pinNumber`)
      .set(pinNumber);

    let newValue = this.state;

    delete newValue.approved;

    if (newValue.experienceVideo == null) {
      alert('no experience video found.');
      return false;
    }
    let foundStoryVideo = false;

    for (let sjd in newValue.storyVideos) {
      foundStoryVideo = true;
      break;
    }

    if (newValue.postReq === '') {
      alert('Please provide number of experiences required.');
      return false;
    }

    if (foundStoryVideo == false) {
      alert('no story video found.');
      return false;
    }

    if (newValue.address == '') {
      alert('Please provide location address');
      return false;
    }
    if (newValue.parentCompanyName == '') {
      alert('Please provide parent company name');
      return false;
    }
    if (newValue.businessName == '') {
      alert('Please provide business name');
      return false;
    }
    if (newValue.experienceName == '') {
      alert('Please provide experience name');
      return false;
    }
    if (newValue.category == '') {
      alert('Please provide category');
      return false;
    }
    if (newValue.description == '') {
      alert('Please provide description');
      return false;
    }
    if (newValue.instagramHandle == '') {
      alert('Please provide instagram handle');
      return false;
    }
    if (newValue.duration == '') {
      alert('Please provide duration');
      return false;
    }
    if (newValue.guestCount == '') {
      alert('Please provide gust count');
      return false;
    }

    if (newValue.eventPrice == '') {
      alert('Please provide event Price');
      return false;
    }
    if (newValue.experienceDesc == '') {
      alert('Please provide experience Desc');
      return false;
    }
    if (newValue.expectations == '') {
      alert('Please provide expectations ');
      return false;
    }
    if (newValue.whereIsIt == '') {
      alert('Please provide address listing');
      return false;
    }
    if (newValue.geocode == '') {
      alert('Please provide location mapping');
      return false;
    }
    if (newValue.startDate == '') {
      alert('Please provide start date');
      return false;
    }
    if (newValue.endDate == '') {
      alert('Please provide end date');
      return false;
    }

    if (newValue.experienceLogo == null) {
      alert('Please provide experience logo');
      return false;
    }
    if (newValue.storiesThumbnail == null) {
      alert('Please provide stories thumbnail');
      return false;
    }
    if (newValue.feedThumbnail == null) {
      alert('Please provide feed thumb');
      return false;
    }
    if (newValue.detailedView == null) {
      alert('Please provide detailed view thumb');
      return false;
    }

    if (newValue.experienceLogo == null) {
      alert('Please provide experience logo');
      return false;
    }
    if (newValue.storiesThumbnail == null) {
      alert('Please provide stories thumbnail');
      return false;
    }
    if (newValue.feedThumbnail == null) {
      alert('Please provide feed thumb');
      return false;
    }
    if (newValue.detailedView == null) {
      alert('Please provide detailed view thumb');
      return false;
    }

    newValue.pinNumber = pinNumber;
    newValue.startDate = new Date(newValue.startDate).getTime();
    newValue.endDate = new Date(newValue.endDate).getTime();
    newValue.status = 'Approved';
    newValue.bookedCount = 0;

    let xcount = 0;

    for (let bb in newValue.schedule) {
      newValue.schedule[bb].quota = this.state.guestCount;

      if (newValue.schedule[bb].attending == undefined) {
        newValue.schedule[bb].attending = { test: true };
      }

      // newValue.schedule[bb].signedUp = 0;
      // newValue.schedule[bb].pinEntered = 0;
      // newValue.schedule[bb].noShow = 0;
      xcount = xcount + 1;
    }

    if (xcount == 0) {
      alert('You must provide a schedule');
      return;
    }

    newValue.approvedDate = firebase.database.ServerValue.TIMESTAMP;

    console.log('NEWVALUE');
    console.log(newValue);

    await firebase
      .database()
      .ref(`approved/Restaurant/${this.state.newId}`)
      .remove();

    await firebase
      .database()
      .ref(`approved/Activity/${this.state.newId}`)
      .remove();

    await firebase
      .database()
      .ref(`approved/Hotels/${this.state.newId}`)
      .remove();

    await firebase
      .database()
      .ref(`approved/Events/${this.state.newId}`)
      .remove();

    await firebase
      .database()
      .ref(`approved/Spas/${this.state.newId}`)
      .remove();

    await firebase
      .database()
      .ref(`approved/Fitness/${this.state.newId}`)
      .remove();

    await firebase
      .database()
      .ref(`approved/BeautyClinics/${this.state.newId}`)
      .remove();

    await firebase
      .database()
      .ref(`approved/OddsAndEnds/${this.state.newId}`)
      .remove();

    await firebase
      .database()
      .ref(`approved/${this.state.category}/${this.state.newId}`)
      .set(newValue);

    await firebase
      .database()
      .ref(`experiences/${this.state.uid}/${this.state.newId}`)
      .set(newValue);
    this.sendPush();

    this.setState({ redirect: true });
    alert('Experience Approved');
  }

  handleEntertainers(input, value) {
    if (input.target.checked == true) {
      this.setState({ entertainers: true });
    } else {
      this.setState({ entertainers: false });
    }
    //console.log(this.state);
  }

  handleExplorers(input, value) {
    if (input.target.checked == true) {
      this.setState({ explorers: true });
    } else {
      this.setState({ explorers: false });
    }
    //console.log(this.state);
  }

  handleFashion(input, value) {
    if (input.target.checked == true) {
      this.setState({ fashion: true });
    } else {
      this.setState({ fashion: false });
    }
    //console.log(this.state);
  }

  handleFoodies(input, value) {
    if (input.target.checked == true) {
      this.setState({ foodies: true });
    } else {
      this.setState({ foodies: false });
    }
    //console.log(this.state);
  }

  handleMoms(input, value) {
    if (input.target.checked == true) {
      this.setState({ moms: true });
    } else {
      this.setState({ moms: false });
    }
    //console.log(this.state);
  }

  handleRacers(input, value) {
    if (input.target.checked == true) {
      this.setState({ entrepreneurs: true });
    } else {
      this.setState({ entrepreneurs: false });
    }
    //console.log(this.state);
  }

  handleWorkout(input, value) {
    if (input.target.checked == true) {
      this.setState({ workout: true });
    } else {
      this.setState({ workout: false });
    }
    //console.log(this.state);
  }

  ihandleBloggers(input, value) {
    if (input.target.checked == true) {
      this.setState({ ibloggers: true });
    } else {
      this.setState({ ibloggers: false });
    }
    //console.log(this.state);
  }

  ihandleEntertainers(input, value) {
    if (input.target.checked == true) {
      this.setState({ ientertainers: true });
    } else {
      this.setState({ ientertainers: false });
    }
    //console.log(this.state);
  }

  ihandleExplorers(input, value) {
    if (input.target.checked == true) {
      this.setState({ iexplorers: true });
    } else {
      this.setState({ iexplorers: false });
    }
    //console.log(this.state);
  }

  ihandleFashion(input, value) {
    if (input.target.checked == true) {
      this.setState({ ifashion: true });
    } else {
      this.setState({ ifashion: false });
    }
    //console.log(this.state);
  }

  ihandleFoodies(input, value) {
    if (input.target.checked == true) {
      this.setState({ ifoodies: true });
    } else {
      this.setState({ ifoodies: false });
    }
    //console.log(this.state);
  }

  ihandleMoms(input, value) {
    if (input.target.checked == true) {
      this.setState({ imoms: true });
    } else {
      this.setState({ imoms: false });
    }
    //console.log(this.state);
  }

  ihandleRacers(input, value) {
    if (input.target.checked == true) {
      this.setState({ ientrepreneurs: true });
    } else {
      this.setState({ ientrepreneurs: false });
    }
    //console.log(this.state);
  }

  ihandleWorkout(input, value) {
    if (input.target.checked == true) {
      this.setState({ iworkout: true });
    } else {
      this.setState({ iworkout: false });
    }
    //console.log(this.state);
  }

  gotStoryVideo(filename, xurl) {
    //console.log('Got URL ' + xurl);

    let storyVideos = this.state.storyVideos;

    let randomNumber = this.randomString(
      5,
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    );

    storyVideos[randomNumber] = { filename: filename, url: xurl };

    this.setState({ storyVideos: storyVideos });
  }

  handleStoryVideo(filename) {
    //console.log('UPLOAD SUCCESS');
    //console.log(filename);

    let gotUploadURL = this.gotStoryVideo;

    firebase
      .storage()
      .ref('experiences/' + this.state.uid + '/' + this.state.newId)
      .child(filename)
      .getDownloadURL()
      .then(function(xurl) {
        gotUploadURL(filename, xurl);
      });

    this.setState({ progress: 100, isUploading: false });
    //firebase.storage().ref('avatars').child(filename).getDownloadURL().then(this.gotAvatar);
  }

  deleteStoryVideo() {
    this.setState({ storyVideo: null });
  }

  gotExperienceVideo(filename, xurl) {
    //console.log('Got URL ' + xurl);
    this.setState({ experienceVideo: { filename: filename, url: xurl } });
  }

  handleExperienceVideo(filename) {
    //console.log('UPLOAD SUCCESS');
    //console.log(filename);

    let gotUploadURL = this.gotExperienceVideo;

    firebase
      .storage()
      .ref('experiences/' + this.state.uid + '/' + this.state.newId)
      .child(filename)
      .getDownloadURL()
      .then(function(xurl) {
        gotUploadURL(filename, xurl);
      });

    this.setState({ progress: 100, isUploading: false });
    //firebase.storage().ref('avatars').child(filename).getDownloadURL().then(this.gotAvatar);
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

  handleExperienceLogo(filename) {
    //console.log('UPLOAD SUCCESS');
    //console.log(filename);

    let gotUploadURL = this.gotExperienceURL;

    firebase
      .storage()
      .ref('experiences/' + this.state.uid + '/' + this.state.newId)
      .child(filename)
      .getDownloadURL()
      .then(function(xurl) {
        gotUploadURL(filename, xurl);
      });

    this.setState({ progress: 100, isUploading: false });
    //firebase.storage().ref('avatars').child(filename).getDownloadURL().then(this.gotAvatar);
  }

  handleExperienceVideo(filename) {
    //console.log('UPLOAD SUCCESS');
    //console.log(filename);

    let gotUploadURL = this.gotExperienceVideo;

    firebase
      .storage()
      .ref('experiences/' + this.state.uid + '/' + this.state.newId)
      .child(filename)
      .getDownloadURL()
      .then(function(xurl) {
        gotUploadURL(filename, xurl);
      });

    this.setState({ progress: 100, isUploading: false });
    //firebase.storage().ref('avatars').child(filename).getDownloadURL().then(this.gotAvatar);
  }

  handleStoriesThumbnail(filename) {
    //console.log('UPLOAD SUCCESS');
    //console.log(filename);

    let gotUploadURL = this.gotStoriesURL;

    firebase
      .storage()
      .ref('experiences/' + this.state.uid + '/' + this.state.newId)
      .child(filename)
      .getDownloadURL()
      .then(function(xurl) {
        gotUploadURL(filename, xurl);
      });

    this.setState({ progress: 100, isUploading: false });
    //firebase.storage().ref('avatars').child(filename).getDownloadURL().then(this.gotAvatar);
  }

  handleFeedThumbnail(filename) {
    //console.log('UPLOAD SUCCESS');
    //console.log(filename);

    let gotUploadURL = this.gotFeedURL;

    firebase
      .storage()
      .ref('experiences/' + this.state.uid + '/' + this.state.newId)
      .child(filename)
      .getDownloadURL()
      .then(function(xurl) {
        gotUploadURL(filename, xurl);
      });

    this.setState({ progress: 100, isUploading: false });
    //firebase.storage().ref('avatars').child(filename).getDownloadURL().then(this.gotAvatar);
  }

  handleDetailedView(filename) {
    //console.log('UPLOAD SUCCESS');
    //console.log(filename);

    let gotUploadURL = this.gotDetailedURL;

    firebase
      .storage()
      .ref('experiences/' + this.state.uid + '/' + this.state.newId)
      .child(filename)
      .getDownloadURL()
      .then(function(xurl) {
        gotUploadURL(filename, xurl);
      });

    this.setState({ progress: 100, isUploading: false });
    //firebase.storage().ref('avatars').child(filename).getDownloadURL().then(this.gotAvatar);
  }

  gotDetailedURL(filename, xurl) {
    //console.log('Got URL ' + xurl);

    this.setState({ detailedView: { filename: filename, url: xurl } });
  }

  gotFeedURL(filename, xurl) {
    //console.log('Got URL ' + xurl);
    this.setState({ feedThumbnail: { filename: filename, url: xurl } });
  }

  gotExperienceURL(filename, xurl) {
    //console.log('Got URL ' + xurl);
    this.setState({ experienceLogo: { filename: filename, url: xurl } });
  }

  gotStoriesURL(filename, xurl) {
    //console.log('Got URL ' + xurl);
    this.setState({ storiesThumbnail: { filename: filename, url: xurl } });
  }

  async createExperiencePlaceholder() {
    //console.log('Get the specific experience to edit');
    //console.log(`experiences/${this.state.uid}/${this.state.newId}`);

    let userRef = await firebase
      .database()
      .ref(`experiences/${this.state.uid}/${this.state.newId}`);

    let userValue = await userRef.once('value');

    //console.log('Get Campaign Data');
    let experience = userValue.val();

    let approvedRef = await firebase
      .database()
      .ref(`approved/${experience.category}/${experience.newId}`);

    let approvedValue = await approvedRef.once('value');

    //console.log('Get Campaign Data');
    let approved = approvedValue.val();

    //console.log(experience);
    experience.startDate = moment(experience.startDate);
    experience.endDate = moment(experience.endDate);

    delete experience.redirect;
    await this.setState(experience);

    if (approved.schedule == undefined) {
      approved.schedule = [];
    }

    if (approved != null) {
      this.setState({ recordExists: true, approved: approved });
    }

    let gotGeoCode = this.gotGeoCode;

    setTimeout(function() {
      gotGeoCode(experience.geocode);
    }, 500);
  }

  componentDidMount() {
    /* Create reference to messages in Firebase Database */
    //console.log('compnentn mount111111');
    //console.log(auth);
    auth.onAuthStateChanged(authUser => {
      //console.log('auth changed');
      //console.log(authUser);

      if (authUser) {
        // this.setState({uid: authUser.uid});
        this.createExperiencePlaceholder();
      }
    });
  }

  handleChange(address) {
    this.setState({ address });
  }

  handleSelect(address) {
    this.setState({ address: address });

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(this.gotGeoCode)
      .catch(error => console.error('Error', error));
  }

  gotGeoCode(latlng) {
    //console.log('Geocode');
    //console.log(latlng);
    this.setState({ initialGeo: latlng, geocode: latlng });

    if (this._map) {
      this._map.panTo(latlng);
    }
  }

  handleParentCompanyName(input, value) {
    this.setState({ parentCompanyName: input.target.value });
    //console.log(this.state);
  }

  handleBusinessName(input, value) {
    this.setState({ businessName: input.target.value });
    //console.log(this.state);
  }

  handleContactName(input, value) {
    this.setState({ contactName: input.target.value });
    //console.log(this.state);
  }

  handleExperienceName(input, value) {
    this.setState({ experienceName: input.target.value });
    //console.log(this.state);
  }

  handleNoticePeriod(input, value) {
    this.setState({ noticePeriod: input.target.value });
    //console.log(this.state);
  }

  handleCategory(input, value) {
    this.setState({ category: input.target.value });
    //console.log(this.state);
  }

  handleGender(input, value) {
    this.setState({ gender: input.target.value });
    //console.log(this.state);
  }

  handleEventType(input, value) {
    this.setState({ eventType: input.target.value });
    //console.log(this.state);
  }

  handleCountry(input, value) {
    console.log('HANDLE COUNTRY');
    console.log(input);
    this.setState({ country: input });
    //console.log(this.state);
  }

  handleDescription(input, value) {
    this.setState({ description: input.target.value });
    //console.log(this.state);
  }

  handleInstagramHandle(input, value) {
    this.setState({ instagramHandle: input.target.value });
    //console.log(this.state);
  }

  handleDuration(input, value) {
    this.setState({ duration: input.target.value });
    //console.log(this.state);
  }

  handleGuestCount(input, value) {
    this.setState({ guestCount: input.target.value });
    //console.log(this.state);
  }
  handleWaitingCount(input, value) {
    this.setState({ waitingCount: input.target.value });
    //console.log(this.state);
  }

  handleGuestDayCount(input, value) {
    this.setState({ guestDayCount: input.target.value });
    //console.log(this.state);
  }

  handleFollowerReq(input, value) {
    this.setState({ followerReq: input.target.value });
    //console.log(this.state);
  }

  handlePostReq(input, value) {
    this.setState({ postReq: input.target.value });
    //console.log(this.state);
  }

  handleEventPrice(input, value) {
    this.setState({ eventPrice: input.target.value });
    //console.log(this.state);
  }

  handleExperienceDesc(input, value) {
    this.setState({ experienceDesc: input.target.value });
    //console.log(this.state);
  }

  handleExpectations(input, value) {
    this.setState({ expectations: input.target.value });
    //console.log(this.state);
  }

  handleResetDay(input, value) {
    this.setState({ resetDay: input.target.value });
    //console.log(this.state);
  }

  handleWhereIsIt(input, value) {
    this.setState({ whereIsIt: input.target.value });
    //console.log(this.state);
  }

  handleLocation(input, value) {
    this.setState({ location: input.target.value });
    //console.log(this.state);
  }

  handleStartDate(input, value) {
    this.setState({ startDate: new Date(input.target.value).getTime() });
    //console.log(this.state);
  }

  handleEndDate(input, value) {
    this.setState({ endDate: new Date(input.target.value).getTime() });
    //console.log(this.state);
  }

  handleStartTime(input, value) {
    this.setState({ startTime: input.target.value });
    //console.log(this.state);
  }

  includeDay(day) {
    //console.log('INCLUDE DAY' +day)
    let newschedule = this.state.schedule;

    if (newschedule[day].active === false) {
      newschedule[day].active = true;
    } else {
      newschedule[day].active = false;
    }

    this.setState({ schedule: newschedule });
  }

  sortByKey(array, key) {
    return array.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  copy7() {
    console.log('Copy 7');

    let schedule = this.state.schedule;

    for (let bb = 7; bb < schedule.length; bb++) {
      if ((bb / 7).toString().indexOf('.') == -1) {
        schedule[bb].active = schedule[0].active;
        schedule[bb].time = schedule[0].time;
      }
      if (((bb - 1) / 7).toString().indexOf('.') == -1) {
        schedule[bb].active = schedule[1].active;
        schedule[bb].time = schedule[1].time;
      }
      if (((bb - 2) / 7).toString().indexOf('.') == -1) {
        schedule[bb].active = schedule[2].active;
        schedule[bb].time = schedule[2].time;
      }
      if (((bb - 3) / 7).toString().indexOf('.') == -1) {
        schedule[bb].active = schedule[3].active;
        schedule[bb].time = schedule[3].time;
      }
      if (((bb - 4) / 7).toString().indexOf('.') == -1) {
        schedule[bb].active = schedule[4].active;
        schedule[bb].time = schedule[4].time;
      }
      if (((bb - 5) / 7).toString().indexOf('.') == -1) {
        schedule[bb].active = schedule[5].active;
        schedule[bb].time = schedule[5].time;
      }
      if (((bb - 6) / 7).toString().indexOf('.') == -1) {
        schedule[bb].active = schedule[6].active;
        schedule[bb].time = schedule[6].time;
      }
    }

    this.setState({ schedule: schedule });
  }

  renderDayFields() {
    let includeDay = this.includeDay;

    console.log('Render Day Fields');
    console.log(this.state.schedule);
    let xcount = 0;
    let timeChanged = this.timeChanged;
    let schedule = this.state.schedule;
    let findScheduleItem = this.findScheduleItem;
    // let schedule = this.props.experience.schedule;

    let approved = this.state.approved;
    //  console.log('schedule')
    // ;
    //   console.log(schedule);

    let copy7 = this.copy7;

    return Object.keys(schedule).map(function(index) {
      console.log('Schedule A ');
      console.log(schedule[index].day);
      let weekday = new Date(schedule[index].timestamp).getDay();
      xcount = xcount + 1;
      //   console.log(weekday);

      if (weekday == 0) {
        weekday = 'Sunday ' + schedule[index].day;
      }
      if (weekday == 1) {
        weekday = 'Monday ' + schedule[index].day;
      }

      if (weekday == 2) {
        weekday = 'Tuesday ' + schedule[index].day;
      }
      if (weekday == 3) {
        weekday = 'Wednesday ' + schedule[index].day;
      }
      if (weekday == 4) {
        weekday = 'Thursday ' + schedule[index].day;
      }
      if (weekday == 5) {
        weekday = 'Friday ' + schedule[index].day;
      }
      if (weekday == 6) {
        weekday = 'Saturday ' + schedule[index].day;
      }

      let checkedStatus = false;

      if (schedule[index].active == true) {
        checkedStatus = true;
      }

      let xbooked = 0;
      let oTime = new Date(schedule[index].oTime).getTime();

      if (approved != null) {
        console.log('approved not null');
        if (approved.schedule) {
          console.log(approved);
          if (approved.schedule[index]) {
            if (
              approved.schedule[index].timestamp == schedule[index].timestamp
            ) {
              console.log(approved.schedule[index].attending);
              if (approved.schedule[index].attending) {
                console.log('Found Attending !!!!');

                for (let bb in approved.schedule[index].attending) {
                  console.log('attending');
                  xbooked = xbooked + 1;
                }
              }
            }
          }
        }
      }

      if (xcount == 7) {
        return (
          <LabelSectionB>
            <LabelSection>
              <LabelDay>
                <input
                  name={'foo'}
                  type={'checkbox'}
                  checked={checkedStatus}
                  onChange={function() {
                    includeDay(index);
                  }}
                />{' '}
                {weekday}
                <br />
              </LabelDay>
              <LabelRight>
                <LabelCount style={{ float: 'right', color: 'green' }}>
                  {xbooked} Booked
                </LabelCount>

                <input
                  placeholderTextColor="red"
                  placeholder="@blahblahgo"
                  style={{
                    fontSize: 14,
                    paddingLeft: 5,
                    float: 'right',
                    fontFamily: 'DINNextLTProLight',
                    color: 'black',
                    width: 250,
                    height: 30,
                    background: '#000000',
                    borderWidth: 1,
                    borderColor: '#999999',
                    borderRadius: 5,
                    backgroundColor: 'white',
                  }}
                  maxLength={100}
                  type="time"
                  name="email"
                  value={schedule[index].time}
                  onChange={function(data) {
                    timeChanged(index, data);
                  }}
                />
              </LabelRight>
            </LabelSection>
            <LabelSection style={{ height: 50 }}>
              <LabelDay
                style={{ color: 'green', cursor: 'pointer' }}
                onClick={copy7}>
                Copy Above TimeSlots
              </LabelDay>
              <LabelRight>-----------------</LabelRight>
            </LabelSection>
          </LabelSectionB>
        );
      } else {
        return (
          <LabelSection>
            <LabelSection>
              <LabelDay>
                <input
                  name={'foo'}
                  type={'checkbox'}
                  checked={checkedStatus}
                  onChange={function() {
                    includeDay(index);
                  }}
                />{' '}
                {weekday}
              </LabelDay>
              <LabelRight>
                <LabelCount style={{ float: 'right', color: 'green' }}>
                  {xbooked} Booked
                </LabelCount>
                <input
                  placeholderTextColor="red"
                  placeholder="@blahblahgo"
                  style={{
                    fontSize: 14,
                    paddingLeft: 5,
                    float: 'right',
                    fontFamily: 'DINNextLTProLight',
                    color: 'black',
                    width: 250,
                    height: 30,
                    background: '#000000',
                    borderWidth: 1,
                    borderColor: '#999999',
                    borderRadius: 5,
                    backgroundColor: 'white',
                  }}
                  maxLength={100}
                  type="time"
                  name="email"
                  value={schedule[index].time}
                  onChange={function(data) {
                    timeChanged(index, data);
                  }}
                />
              </LabelRight>
            </LabelSection>
          </LabelSection>
        );
      }
    });
  }

  handleBusinessLogo(filename) {
    //console.log('UPLOAD SUCCESS');
    //console.log(filename);

    let gotUploadURL = this.gotBusinessLogo;

    firebase
      .storage()
      .ref('experiences/' + this.state.uid + '/' + this.state.newId)
      .child(filename)
      .getDownloadURL()
      .then(function(xurl) {
        gotUploadURL(filename, xurl);
      });

    this.setState({ progress: 100, isUploading: false });
    //firebase.storage().ref('avatars').child(filename).getDownloadURL().then(this.gotAvatar);
  }

  gotBusinessLogo(filename, xurl) {
    //console.log('Got URL ' + xurl);
    this.setState({ businessLogo: { filename: filename, url: xurl } });
  }

  handleIncludeSaturday(input, value) {
    if (input.target.checked == true) {
      this.setState({ includeSaturday: true });
    } else {
      this.setState({ includeSaturday: false });
    }
    //console.log(this.state);
  }

  handleIncludeSunday(input, value) {
    if (input.target.checked == true) {
      this.setState({ includeSunday: true });
    } else {
      this.setState({ includeSunday: false });
    }
    //console.log(this.state);
  }

  handleReviewReq(input, value) {
    this.setState({ reviewReq: input.target.value });
    //console.log(this.state);
  }

  handlePlusOne(input, value) {
    this.setState({ plusOne: input.target.value });

    //console.log(this.state);
  }

  handleWhatYouGet(input, value) {
    this.setState({ whatYouGet: input.target.value });
    //console.log(this.state);
  }

  handleWhatYouGetIcon(input, value) {
    this.setState({ whatYouGetIcon: input.target.value });
    //console.log(this.state);
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async handleGo() {
    let newValue = this.state;

    let foundActive = 0;

    for (let bb in this.state.schedule) {
      if (this.state.schedule[bb].active == true) {
        foundActive = 1;
        break;
      }
    }

    if (foundActive == 0) {
      alert('You Must provide a schedule');
      return false;
    }

    if (newValue.postReq === '') {
      alert('Please provide number of experiences required.');
      return false;
    }
    if (newValue.address == '') {
      alert('Please provide location address');
      return false;
    }
    if (newValue.parentCompanyName == '') {
      alert('Please provide parent company name');
      return false;
    }
    if (newValue.businessName == '') {
      alert('Please provide business name');
      return false;
    }
    if (newValue.experienceName == '') {
      alert('Please provide experience name');
      return false;
    }
    if (newValue.category == '') {
      alert('Please provide category');
      return false;
    }
    if (newValue.description == '') {
      alert('Please provide description');
      return false;
    }
    if (newValue.instagramHandle == '') {
      alert('Please provide instagram handle');
      return false;
    }
    if (newValue.duration == '') {
      alert('Please provide duration');
      return false;
    }
    if (newValue.guestCount == '') {
      alert('Please provide gust count');
      return false;
    }
    if (newValue.followerReq == '') {
      alert('Please provide followers Req');
      return false;
    }

    if (newValue.eventPrice == '') {
      alert('Please provide event Price');
      return false;
    }
    if (newValue.experienceDesc == '') {
      alert('Please provide experience Desc');
      return false;
    }
    if (newValue.expectations == '') {
      alert('Please provide expectations ');
      return false;
    }
    if (newValue.whereIsIt == '') {
      alert('Please provide address listing');
      return false;
    }
    if (newValue.geocode == '') {
      alert('Please provide location mapping');
      return false;
    }
    if (newValue.startDate == '') {
      alert('Please provide start date');
      return false;
    }
    if (newValue.endDate == '') {
      alert('Please provide end date');
      return false;
    }

    if (newValue.experienceLogo == null) {
      alert('Please provide experience logo');
      return false;
    }
    if (newValue.storiesThumbnail == null) {
      alert('Please provide stories thumbnail');
      return false;
    }
    if (newValue.feedThumbnail == null) {
      alert('Please provide feed thumb');
      return false;
    }
    if (newValue.detailedView == null) {
      alert('Please provide detailed view thumb');
      return false;
    }

    delete newValue.initialGeo;

    delete newValue.countries;
    newValue.noShows = 0;
    newValue.slotsAvailable = newValue.guestCount;
    newValue.pinsUsed = 0;

    // delete newValue.newId

    newValue.startDate = new Date(newValue.startDate).getTime();
    newValue.endDate = new Date(newValue.endDate).getTime();
    newValue.status = 'Waiting List';

    //console.log('Create record with');
    //console.log(this.state.newId);

    await firebase
      .database()
      .ref(`experiences/${this.state.uid}/${this.state.newId}`)
      .set(newValue);

    alert('Experience Saved!');
    this.setState({ redirect: true });
  }

  renderPlaceSearch() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div>
            <input
              style={{ width: 250 }}
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div
              className="autocomplete-dropdown-container"
              style={{ zIndex: 100000000000 }}>
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}>
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }

  handleMapMounted(map) {
    //console.log('Hanlde Map Mounted');
    //console.log(map);
    this._map = map;

    this._map.panTo(this.state.geocode);
  }

  deleteBusinessLogo() {
    this.setState({ businessLogo: null });
  }

  deleteDetailedView() {
    this.setState({ detailedView: null });
  }

  deleteFeedThumbnail() {
    this.setState({ feedThumbnail: null });
  }

  deleteThumbnail() {
    this.setState({ storiesThumbnail: null });
  }

  deleteExperienceLogo() {
    this.setState({ experienceLogo: null });
  }

  removeStory(index) {
    //console.log('Remove Story');

    let mystoryVideos = this.state.storyVideos;

    delete mystoryVideos[index];

    this.setState({ storyVideos: mystoryVideos });
  }

  renderStoryVideos() {
    let removeStory = this.removeStory;
    let storyVideos = this.state.storyVideos;
    return Object.keys(this.state.storyVideos).map(function(index) {
      let storyURL = storyVideos[index].url;

      if (storyVideos[index].url.indexOf('.mp4') != -1) {
        return (
          <StoryItemWrap>
            <ReactPlayer
              style={{
                float: 'left',
                margin: 10,
              }}
              controls
              width={160}
              height={120}
              url={storyURL}
            />{' '}
            <StoryDelete
              onClick={function() {
                removeStory(index);
              }}>
              Remove
            </StoryDelete>
          </StoryItemWrap>
        );
      } else {
        return (
          <StoryItemWrap>
            <img
              src={storyURL}
              style={{
                float: 'left',
                margin: 10,
                width: 160,
                height: 120,
                border: '2px solid gray',
              }}
            />
            <StoryDelete
              onClick={function() {
                removeStory(index);
              }}>
              Remove
            </StoryDelete>
          </StoryItemWrap>
        );
      }
    });
  }

  timeChanged(date, time) {
    //console.log('Time Changed');

    //console.log(date, time);

    let newschedule = this.state.schedule;

    newschedule[date].time = time.target.value;

    this.setState({ schedule: newschedule });
  }

  async rejectExperience() {
    await firebase
      .database()
      .ref(`experiences/${this.state.uid}/${this.state.newId}/status`)
      .set('Rejected');
    await firebase
      .database()
      .ref(`approved/${this.state.category}/${this.state.newId}`)
      .remove();

    this.setState({ redirect: true });
    alert('Experience Rejected');
  }

  toggleCheckbox() {
    let checkboxes = document.getElementsByName('foo');
    console.log('toggle checkboxes');
    console.log(checkboxes);

    for (var bb = 0; bb < checkboxes.length; bb++) {
      //      console.log(checkbox)
      checkboxes[bb].checked = true;
    }

    let newSchedule = this.state.schedule;

    for (var bb = 0; bb < newSchedule.length; bb++) {
      //      console.log(checkbox)
      newSchedule[bb].active = true;
    }

    this.setState({ schedule: newSchedule });
  }

  toggleCheckboxFalse() {
    let checkboxes = document.getElementsByName('foo');

    console.log('toggle checkboxes false');
    console.log(checkboxes);

    for (var bb = 0; bb < checkboxes.length; bb++) {
      //      console.log(checkbox)
      checkboxes[bb].checked = false;
    }

    let newSchedule = this.state.schedule;

    for (var bb = 0; bb < newSchedule.length; bb++) {
      //      console.log(checkbox)
      newSchedule[bb].active = false;
    }

    this.setState({ schedule: newSchedule });
  }

  async sendPush() {
    console.log('send Push');

    if (this.state.recordExists == false) {
      let userRef = await firebase
        .database()
        .ref(`topicNotifications/`)
        .push({
          title: 'A new Expin Experience is available.',
          content: this.state.experienceName + ' is  now available.',
        });
    }
  }

  findScheduleItem(timestamp) {
    //    console.log('Find Schedule Item');

    for (let bb = 0; bb < this.state.schedule.length; bb++) {
      if (this.state.schedule[bb].oTime == timestamp) {
        console.log(this.state.schedule[bb]);
        return this.state.schedule[bb];
      }
    }

    return { time: '17:00' };
  }

  timeToEpoch(xtime) {
    console.log('TIme TO Epock');
    console.log(xtime);

    xtime = xtime.split(':');

    let firstcount = parseInt(xtime[0]) * 3600000;

    firstcount = firstcount + parseInt(xtime[1]) * 60000;

    console.log(firstcount);
    return firstcount;
  }

  datesChanged(input) {
    if (input != undefined) {
      this.setState({
        startDate: input.startDate,
        endDate: input.endDate,
      });
    } else {
      input = {
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      };
    }

    console.log('Dates Changed');
    //console.log(input.startDate);
    //console.log(input.endDate);
    if (input.endDate != undefined && input.endDate != null) {
      let newSchedule = [];

      console.log('endDate Go ');

      var now = new Date(input.endDate._d);
      //    console.log(now);
      for (
        var d = new Date(input.startDate._d);
        d <= now;
        d.setDate(d.getDate() + 1)
      ) {
        console.log('d');
        console.log(d);
        let xdate = moment(d).format('L');
        console.log(xdate);
        let oTime = new Date(d).getTime();

        let timestamp = oTime;
        let timezone = parseFloat(this.state.timeZone) * 3600000;
        timestamp = timestamp + timezone - 3600000 * 8;
        console.log('timezone');
        console.log(timezone);
        timestamp =
          timestamp + this.timeToEpoch(this.findScheduleItem(timestamp).time);

        console.log(timestamp);
        let existingActive = false;
        let existingTime = '17:00';
        let existingSignedUp = 0;
        let existingPinEntered = 0;
        let existingAttending = { test: true };
        let existingNoShow = 0;
        if (this.findScheduleItem(oTime) != null) {
          let xitem = this.findScheduleItem(oTime);
          existingActive = xitem.active;
          existingTime = xitem.time;
          existingSignedUp = xitem.signedUp;
          existingPinEntered = xitem.pinEntered;
          existingNoShow = xitem.noShow;
          existingAttending = xitem.attending;
          console.log('Found Custom time');
          console.log(existingTime);
        }

        if (existingActive == undefined) {
          existingActive = false;
        }
        if (existingAttending == undefined) {
          existingActive = { test: true };
        }
        if (existingPinEntered == undefined) {
          existingPinEntered = 0;
        }
        if (existingNoShow == undefined) {
          existingNoShow = false;
        }

        xdate = xdate.replace('/', '-');
        xdate = xdate.replace('/', '-');
        newSchedule.push({
          day: xdate,
          active: existingActive,
          attending: existingAttending,
          time: existingTime,
          timestamp: timestamp,
          oTime: oTime,
          noShow: existingNoShow,
          pinEntered: existingPinEntered,
          noShow: existingNoShow,
        });
      }

      //  console.log(newSchedule)
      this.setState({ schedule: newSchedule });
    }
  }

  render() {
    let passwordWarning = null;

    if (this.state.password !== this.state.password2) {
      passwordWarning = <PassWarn>{'Passwords do not match!'}</PassWarn>;
    }

    if (this.state.redirect == true) {
      console.log('REDIRECT TO LOGIN C');
      return <Redirect to={'/adminexperiences'} />;
    }

    let ibloggersButton = (
      <input type={'checkbox'} onChange={this.ihandleBloggers} />
    );
    let ientertainersButton = (
      <input type={'checkbox'} onChange={this.ihandleEntertainers} />
    );
    let iexplorersButton = (
      <input type={'checkbox'} onChange={this.ihandleExplorers} />
    );
    let ifashionButton = (
      <input type={'checkbox'} onChange={this.ihandleFashion} />
    );
    let ifoodiesButton = (
      <input type={'checkbox'} onChange={this.ihandleFoodies} />
    );
    let imomsButton = <input type={'checkbox'} onChange={this.ihandleMoms} />;
    let iracingButton = (
      <input type={'checkbox'} onChange={this.ihandleentrepreneurs} />
    );
    let iworkoutButton = (
      <input type={'checkbox'} onChange={this.ihandleWorkout} />
    );

    if (this.state.ibloggers == true) {
      ibloggersButton = (
        <input type={'checkbox'} checked onChange={this.ihandleBloggers} />
      );
    }

    if (this.state.ientertainers == true) {
      ientertainersButton = (
        <input type={'checkbox'} checked onChange={this.ihandleEntertainers} />
      );
    }

    if (this.state.iexplorers == true) {
      iexplorersButton = (
        <input type={'checkbox'} checked onChange={this.ihandleExplorers} />
      );
    }

    if (this.state.ifashion == true) {
      ifashionButton = (
        <input type={'checkbox'} checked onChange={this.ihandleFashion} />
      );
    }

    if (this.state.ifoodies == true) {
      ifoodiesButton = (
        <input type={'checkbox'} checked onChange={this.ihandleFoodies} />
      );
    }

    if (this.state.imoms == true) {
      imomsButton = (
        <input type={'checkbox'} checked onChange={this.ihandleMoms} />
      );
    }

    if (this.state.ientrepreneurs == true) {
      iracingButton = (
        <input type={'checkbox'} checked onChange={this.ihandleentrepreneurs} />
      );
    }

    if (this.state.iworkout == true) {
      iworkoutButton = (
        <input type={'checkbox'} checked onChange={this.ihandleWorkout} />
      );
    }

    let techiesButton = (
      <input type={'checkbox'} onChange={this.handleTechies} />
    );
    if (this.state.techies == true) {
      techiesButton = (
        <input type={'checkbox'} checked onChange={this.handleTechies} />
      );
    }

    let bloggersButton = (
      <input type={'checkbox'} onChange={this.handleBloggers} />
    );
    let entertainersButton = (
      <input type={'checkbox'} onChange={this.handleEntertainers} />
    );
    let explorersButton = (
      <input type={'checkbox'} onChange={this.handleExplorers} />
    );
    let fashionButton = (
      <input type={'checkbox'} onChange={this.handleFashion} />
    );
    let foodiesButton = (
      <input type={'checkbox'} onChange={this.handleFoodies} />
    );
    let momsButton = <input type={'checkbox'} onChange={this.handleMoms} />;
    let racingButton = <input type={'checkbox'} onChange={this.handleRacers} />;
    let workoutButton = (
      <input type={'checkbox'} onChange={this.handleWorkout} />
    );

    if (this.state.bloggers == true) {
      bloggersButton = (
        <input type={'checkbox'} checked onChange={this.handleBloggers} />
      );
    }

    if (this.state.entertainers == true) {
      entertainersButton = (
        <input type={'checkbox'} checked onChange={this.handleEntertainers} />
      );
    }

    if (this.state.explorers == true) {
      explorersButton = (
        <input type={'checkbox'} checked onChange={this.handleExplorers} />
      );
    }

    if (this.state.fashion == true) {
      fashionButton = (
        <input type={'checkbox'} checked onChange={this.handleFashion} />
      );
    }

    if (this.state.foodies == true) {
      foodiesButton = (
        <input type={'checkbox'} checked onChange={this.handleFoodies} />
      );
    }

    if (this.state.moms == true) {
      momsButton = (
        <input type={'checkbox'} checked onChange={this.handleMoms} />
      );
    }

    if (this.state.entrepreneurs == true) {
      racingButton = (
        <input type={'checkbox'} checked onChange={this.handleRacers} />
      );
    }

    if (this.state.workout == true) {
      workoutButton = (
        <input type={'checkbox'} checked onChange={this.handleWorkout} />
      );
    }

    let experienceLogo = null;
    let storiesThumb = null;
    let feedThumb = null;
    let detailedThumb = null;
    let businessLogo = null;
    if (this.state.businessLogo != null) {
      businessLogo = this.state.businessLogo.url;
    }

    let videoURL = null;
    if (this.state.experienceVideo != null) {
      videoURL = this.state.experienceVideo.url;

      //console.log('set video URL');
      //console.log(videoURL);
    }

    if (this.state.experienceLogo != null) {
      experienceLogo = this.state.experienceLogo.url;
    }

    if (this.state.storiesThumbnail != null) {
      storiesThumb = this.state.storiesThumbnail.url;
    }

    if (this.state.feedThumbnail != null) {
      feedThumb = this.state.feedThumbnail.url;
    }

    if (this.state.detailedView != null) {
      detailedThumb = this.state.detailedView.url;
    }

    //  if (this.state.redirect == true) {
    //      console.log('REDIRECT TO LOGIN');
    //      return <Redirect to={{pathname: '/home'}}/>;
    //  }

    return (
      <div>
        <Header />

        <LabelSection
          style={{
            textAlign: 'center',
            position: 'absolute',
            left: '50%',
            top: 90,
            marginLeft: -400,
            width: 800,
          }}>
          <div
            style={{
              float: 'left',
              width: 160,
              textAlign: 'center',
              padding: 8,
              color: 'white',
              backgroundColor: 'red',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'DINNextLTPro',

              marginLeft: 65,
              marginTop: 20,
              fontWeight: 'bold',
            }}
            onClick={this.rejectExperience}>
            REJECT EXPERIENCE
          </div>
          <div
            style={{
              float: 'left',
              width: 160,
              textAlign: 'center',
              padding: 8,
              color: 'black',
              backgroundColor: 'yellow',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'DINNextLTPro',

              marginLeft: 65,
              marginTop: 20,
              fontWeight: 'bold',
            }}
            onClick={this.pauseExperience}>
            PAUSE EXPERIENCE
          </div>
          <div
            style={{
              float: 'left',
              width: 160,
              textAlign: 'center',
              padding: 8,
              color: 'white',
              backgroundColor: 'green',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'DINNextLTPro',

              marginLeft: 65,
              marginTop: 20,
              fontWeight: 'bold',
            }}
            onClick={this.approveExperience}>
            APPROVE EXPERIENCE
          </div>
        </LabelSection>

        <MyGrid>
          <LogoText> Edit Experience</LogoText>
          <LabelLine style={{ marginBottom: 20 }} />

          <LabelSection>
            <LabelLeft>1</LabelLeft>
            <LabelLeft2>Parent Company Name</LabelLeft2>
            <LabelRight>
              <input
                placeholderTextColor="red"
                placeholder="Parent Company Name"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
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
                value={this.state.parentCompanyName}
                onChange={this.handleParentCompanyName}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>2</LabelLeft>
            <LabelLeft2>Business Name</LabelLeft2>
            <LabelRight>
              <input
                placeholderTextColor="red"
                placeholder="Business Name"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
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
                value={this.state.businessName}
                onChange={this.handleBusinessName}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>2</LabelLeft>
            <LabelLeft2>Contact Name</LabelLeft2>
            <LabelRight>
              <input
                placeholderTextColor="red"
                placeholder="Contact Name"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
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
                value={this.state.contactName}
                onChange={this.handleContactName}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection style={{ height: 190 }}>
            <ImageDimensions>
              375 x 386 px<br />
              png/jpg
            </ImageDimensions>
            <LabelLeft>22</LabelLeft>
            <LabelLeft2>Business Logo</LabelLeft2>
            <LabelRight>
              <label
                style={{
                  borderRadius: 5,
                  cursor: 'pointer',
                  margin: 5,
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
                  name="BusinessLogo"
                  accept="image/*"
                  filename={file => 'BusinessLogo' + file.name.split('.')[1]}
                  storageRef={firebase
                    .storage()
                    .ref(
                      'experiences/' + this.state.uid + '/' + this.state.newId
                    )}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleBusinessLogo}
                  onProgress={this.handleProgress}
                />
              </label>{' '}
              <InputDelete onClick={this.deleteBusinessLogo}>
                Remove
              </InputDelete>
            </LabelRight>
            <LabelBelow>
              <img
                src={businessLogo}
                style={{
                  width: 150,
                  height: 150,
                  marginLeft: -210,
                  marginTop: 20,
                  border: '2px solid gray',
                }}
              />
            </LabelBelow>
          </LabelSection>

          <LabelLine style={{ marginBottom: 10, marginTop: 10 }} />

          <LabelSection>
            <LabelLeft>3</LabelLeft>
            <LabelLeft2>Experience Title</LabelLeft2>
            <LabelRight>
              <input
                placeholderTextColor="red"
                placeholder="i.e. skydiving in dubai"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
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
                value={this.state.experienceName}
                onChange={this.handleExperienceName}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>4</LabelLeft>
            <LabelLeft2>Category</LabelLeft2>
            <LabelRight>
              <select
                style={{ fontSize: 20 }}
                defaultValue={this.state.category}
                value={this.state.category}
                onChange={this.handleCategory}>
                <option value={'Restaurant'}>Restaurants</option>
                <option value={'Activity'}>Activities</option>
                <option value={'Hotels'}>Hotels & Resorts</option>
                <option value={'Events'}>Events</option>
                <option value={'Spas'}> Spas</option>
                <option value={'Fitness'}>Fitness</option>
                <option value={'BeautyClinics'}>Beauty Clinics</option>
                <option value={'OddsAndEnds'}>Odds & Ends</option>
              </select>
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>4</LabelLeft>
            <LabelLeft2>Minimum Notice Period</LabelLeft2>
            <LabelRight>
              <select
                style={{ fontSize: 20 }}
                defaultValue={this.state.noticePeriod}
                value={this.state.noticePeriod}
                onChange={this.handleNoticePeriod}>
                <option value={'0'}>0 Day</option>

                <option value={'1'}>1 Day</option>
                <option value={'2'}>2 Day</option>
                <option value={'3'}>3 Day</option>
                <option value={'4'}>4 Day</option>
                <option value={'5'}>5 Day</option>
                <option value={'6'}>6 Day</option>
                <option value={'7'}>7 Day</option>
              </select>
            </LabelRight>
          </LabelSection>
          <LabelSection>
            <LabelLeft>4</LabelLeft>
            <LabelLeft2>Timezone</LabelLeft2>
            <LabelRight>
              <select
                defaultValue={this.state.timeZone}
                value={this.state.timeZone}
                onChange={this.handleTimeZone}
                name="DropDownTimezone"
                id="DropDownTimezone">
                <option value="-12.0">(GMT -12:00) Eniwetok, Kwajalein</option>
                <option value="-11.0">(GMT -11:00) Midway Island, Samoa</option>
                <option value="-10.0">(GMT -10:00) Hawaii</option>
                <option value="-9.0">(GMT -9:00) Alaska</option>
                <option value="-8.0">
                  (GMT -8:00) Pacific Time (US &amp; Canada)
                </option>
                <option value="-7.0">
                  (GMT -7:00) Mountain Time (US &amp; Canada)
                </option>
                <option value="-6.0">
                  (GMT -6:00) Central Time (US &amp; Canada), Mexico City
                </option>
                <option value="-5.0">
                  (GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima
                </option>
                <option value="-4.0">
                  (GMT -4:00) Atlantic Time (Canada), Caracas, La Paz
                </option>
                <option value="-3.5">(GMT -3:30) Newfoundland</option>
                <option value="-3.0">
                  (GMT -3:00) Brazil, Buenos Aires, Georgetown
                </option>
                <option value="-2.0">(GMT -2:00) Mid-Atlantic</option>
                <option value="-1.0">
                  (GMT -1:00 hour) Azores, Cape Verde Islands
                </option>
                <option value="0.0">
                  (GMT) Western Europe Time, London, Lisbon, Casablanca
                </option>
                <option value="1.0">
                  (GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris
                </option>
                <option value="2.0">
                  (GMT +2:00) Kaliningrad, South Africa
                </option>
                <option value="3.0">
                  (GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg
                </option>
                <option value="3.5">(GMT +3:30) Tehran</option>
                <option value="4.0">
                  (GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi
                </option>
                <option value="4.5">(GMT +4:30) Kabul</option>
                <option value="5.0">
                  (GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent
                </option>
                <option value="5.5">
                  (GMT +5:30) Bombay, Calcutta, Madras, New Delhi
                </option>
                <option value="5.75">(GMT +5:45) Kathmandu</option>
                <option value="6.0">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                <option value="7.0">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                <option value="8.0">
                  (GMT +8:00) Beijing, Perth, Singapore, Hong Kong
                </option>
                <option value="9.0">
                  (GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk
                </option>
                <option value="9.5">(GMT +9:30) Adelaide, Darwin</option>
                <option value="10.0">
                  (GMT +10:00) Eastern Australia, Guam, Vladivostok
                </option>
                <option value="11.0">
                  (GMT +11:00) Magadan, Solomon Islands, New Caledonia
                </option>
                <option value="12.0">
                  (GMT +12:00) Auckland, Wellington, Fiji, Kamchatka
                </option>
              </select>
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>5</LabelLeft>
            <LabelLeft2>About the Experience</LabelLeft2>
            <LabelRight>
              <textarea
                placeholderTextColor="red"
                placeholder="describe the experience"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 100,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                maxLength={5000}
                type="text"
                name="email"
                value={this.state.description}
                onChange={this.handleDescription}
              />
            </LabelRight>
          </LabelSection>

          <LabelLine style={{ marginTop: 120 }} />

          <LabelSection>
            <LabelLeft>11</LabelLeft>
            <LabelLeft2>Influence Types:</LabelLeft2>
            <LabelRight>
              {bloggersButton} Bloggers<br />
              {entertainersButton} Entertainers<br />
              {explorersButton} Explorers<br />
              {fashionButton} Fashionistas<br />
              {foodiesButton} Foodies<br />
              {momsButton} Mothers<br />
              {racingButton} entrepreneurs<br />
              {workoutButton} Spartans<br />
              {techiesButton} Techies<br />
            </LabelRight>
          </LabelSection>

          <LabelLine style={{ marginTop: 120 }} />

          <LabelSection>
            <LabelLeft>11</LabelLeft>
            <LabelLeft2>Event Type </LabelLeft2>
            <LabelRight>
              <select
                style={{ fontSize: 20 }}
                defaultValue={this.state.eventType}
                value={this.state.eventType}
                onChange={this.handleEventType}>
                <option value={'open'}>Open</option>
                <option value={'waitinglist'}>Waiting List</option>
              </select>
            </LabelRight>
          </LabelSection>

          <LabelLine style={{ marginTop: 150 }} />

          <LabelSection>
            <LabelLeft>11</LabelLeft>
            <LabelLeft2>Allowed Genders </LabelLeft2>
            <LabelRight>
              <select
                style={{ fontSize: 20 }}
                defaultValue={this.state.gender}
                value={this.state.gender}
                onChange={this.handleGender}>
                <option value={'All'}>All</option>
                <option value={'male'}>Male</option>
                <option value={'female'}>Female</option>
              </select>
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>11</LabelLeft>
            <LabelLeft2>Allowed Country </LabelLeft2>
            <LabelRight>
              <Select
                isMulti={true}
                value={this.state.country}
                options={this.countries}
                onChange={this.handleCountry}
              />
            </LabelRight>
          </LabelSection>

          <LabelLine style={{}} />

          <LabelSection>
            <LabelLeft>6</LabelLeft>
            <LabelLeft2>Instagram Handle</LabelLeft2>
            <LabelRight>
              @
              <input
                placeholderTextColor="red"
                placeholder="blahblahgo"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
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
                value={this.state.instagramHandle}
                onChange={this.handleInstagramHandle}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>7</LabelLeft>
            <LabelLeft2>Duration</LabelLeft2>
            <LabelRight>
              <select style={{ fontSize: 20 }} onChange={this.handleDuration}>
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={90}>1.5 Hour</option>
                <option selected value={120}>
                  2 Hour
                </option>
                <option value={180}>3 Hour</option>
                <option value={240}>4 Hour</option>
                <option value={300}>5 Hour</option>
                <option value={360}>6 Hour</option>
                <option value={420}>7 Hour</option>
                <option value={480}>All Day</option>
              </select>
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>8</LabelLeft>
            <LabelLeft2>Minimum Followers Required</LabelLeft2>
            <LabelRight>
              <input
                type={'number'}
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 30,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                onChange={this.handleMinimum}
                defaultValue={this.state.minimumFollowers}
                value={this.state.minimumFollowers}
                max={10000}
                min={10}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>8</LabelLeft>
            <LabelLeft2>Maximum Followers Required</LabelLeft2>
            <LabelRight>
              <input
                type={'number'}
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 30,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                onChange={this.handleMaximum}
                defaultValue={this.state.maximumFollowers}
                value={this.state.maximumFollowers}
                max={10000}
                min={10}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>8</LabelLeft>
            <LabelLeft2>Monthly Slots Available</LabelLeft2>
            <LabelRight>
              <input
                type={'number'}
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 30,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                onChange={this.handleGuestCount}
                defaultValue={this.state.guestCount}
                value={this.state.guestCount}
                max={10000}
                min={10}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>8</LabelLeft>
            <LabelLeft2>Waiting List Amount</LabelLeft2>
            <LabelRight>
              <input
                type={'number'}
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 30,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                onChange={this.handleWaitingCount}
                defaultValue={this.state.waitingCount}
                value={this.state.waitingCount}
                max={10000}
                min={0}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>8</LabelLeft>
            <LabelLeft2>Day To Reset</LabelLeft2>
            <LabelRight>
              <input
                type={'number'}
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 30,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                onChange={this.handleResetDay}
                defaultValue={this.state.resetDay}
                value={this.state.resetDay}
                max={28}
                min={1}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection>
            <LabelLeft>8</LabelLeft>
            <LabelLeft2>Max No. of Guests PER DAY</LabelLeft2>
            <LabelRight>
              <input
                type={'number'}
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 30,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                onChange={this.handleGuestDayCount}
                defaultValue={this.state.guestDayCount}
                value={this.state.guestDayCount}
                max={10000}
                min={10}
              />
            </LabelRight>
          </LabelSection>

          <LabelLine style={{}} />

          <LabelSection>
            <LabelLeft>9</LabelLeft>
            <LabelLeft2>No. of Followers Req.</LabelLeft2>
            <LabelRight>
              <input
                placeholderTextColor="red"
                placeholder="100"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 30,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                maxLength={100}
                type="number"
                name="email"
                defaultValue={this.state.followerReq}
                value={this.state.followerReq}
                onChange={this.handleFollowerReq}
              />
            </LabelRight>
          </LabelSection>
          <LabelSection>
            <LabelLeft>10</LabelLeft>
            <LabelLeft2>No. of Experiences Attended </LabelLeft2>
            <LabelRight>
              <input
                placeholderTextColor="red"
                placeholder="100"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 30,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                maxLength={100}
                type="number"
                name="email"
                defaultValue={this.state.postReq}
                value={this.state.postReq}
                onChange={this.handlePostReq}
              />
            </LabelRight>
          </LabelSection>
          <LabelSection>
            <LabelLeft>11</LabelLeft>
            <LabelLeft2>Genuine Reviews Req.</LabelLeft2>
            <LabelRight>
              <input
                placeholderTextColor="red"
                placeholder="100"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 30,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                maxLength={100}
                type="number"
                name="email"
                defaultValue={this.state.reviewReq}
                value={this.state.reviewReq}
                onChange={this.handleReviewReq}
              />
            </LabelRight>
          </LabelSection>

          <LabelLine style={{ marginBottom: 10 }} />

          <LabelSection>
            <LabelLeft>11</LabelLeft>
            <LabelLeft2>Plus One?</LabelLeft2>
            <LabelRight>
              <select
                style={{ fontSize: 20 }}
                defaultValue={this.state.plusOne}
                value={this.state.plusOne}
                onChange={this.handlePlusOne}>
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
              </select>
            </LabelRight>
          </LabelSection>

          <LabelLine style={{ marginBottom: 10 }} />

          <LabelSection>
            <LabelLeft>11</LabelLeft>
            <LabelLeft2>What you get?</LabelLeft2>
            <LabelRight>
              <input
                placeholderTextColor="red"
                placeholder="item?"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 150,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                maxLength={100}
                type="text"
                name="email"
                value={this.state.whatYouGet}
                onChange={this.handleWhatYouGet}
              />
              Icon:
              <input
                placeholderTextColor="red"
                placeholder="icon"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 50,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                maxLength={100}
                type="text"
                name="email"
                value={this.state.whatYouGetIcon}
                onChange={this.handleWhatYouGetIcon}
              />
            </LabelRight>
          </LabelSection>
          <LabelLine style={{ marginBottom: 10, marginTop: 100 }} />

          <LabelSection>
            <LabelLeft>11</LabelLeft>
            <LabelLeft2>What you're going to experience</LabelLeft2>
            <LabelRight>
              <textarea
                placeholderTextColor="red"
                placeholder="describe the experience"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 100,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                maxLength={5000}
                type="text"
                name="email"
                value={this.state.experienceDesc}
                onChange={this.handleExperienceDesc}
              />
            </LabelRight>
          </LabelSection>
          <LabelLine style={{ marginBottom: 10, marginTop: 100 }} />

          <LabelSection>
            <LabelLeft>12</LabelLeft>
            <LabelLeft2>Whats expected from you</LabelLeft2>
            <LabelRight>
              <textarea
                placeholderTextColor="red"
                placeholder="appropriate attire, supplies that are required"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 100,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                maxLength={5000}
                type="text"
                name="email"
                value={this.state.expectations}
                onChange={this.handleExpectations}
              />
            </LabelRight>
          </LabelSection>

          <LabelLine style={{ marginBottom: 10, marginTop: 100 }} />

          <LabelSection style={{ height: 140 }}>
            <LabelLeft>13</LabelLeft>
            <LabelLeft2>Where its at</LabelLeft2>
            <LabelRight>
              <textarea
                placeholderTextColor="red"
                placeholder="My Venue, 123 3rd St"
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  float: 'right',
                  fontFamily: 'DINNextLTProLight',
                  color: 'black',
                  width: 250,
                  height: 100,
                  background: '#000000',
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 5,
                  backgroundColor: 'white',
                }}
                maxLength={5000}
                type="text"
                name="email"
                value={this.state.whereIsIt}
                onChange={this.handleWhereIsIt}
              />
            </LabelRight>
          </LabelSection>

          <LabelSection style={{ height: 200 }}>
            <LabelLeft>14</LabelLeft>
            <LabelLeft2>Location - Google Maps</LabelLeft2>
            <LabelRight>{this.renderPlaceSearch()}</LabelRight>
          </LabelSection>
          <LabelBelow style={{ height: 800, overflow: 'hidden' }}>
            <Map
              google={this.props.google}
              zoom={14}
              style={{ width: 600, height: 400, overflow: 'hidden' }}
              initialCenter={this.state.initialGeo}
              center={this.state.initialGeo}
              onGoogleApiLoaded={this.handleMapMounted}>
              <Marker position={this.state.geocode} />
            </Map>
          </LabelBelow>
          <LabelLine style={{ marginBottom: 10, marginTop: 10 }} />

          <LabelSection style={{ height: 50 }}>
            <LabelLeft>15</LabelLeft>
            <LabelLeft2>Availabilty</LabelLeft2>
          </LabelSection>

          <LabelBelow style={{ height: 50 }}>
            <DateRangePicker
              startDate={this.state.startDate} // momentPropTypes.momentObj or null,
              startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
              endDate={this.state.endDate} // momentPropTypes.momentObj or null,
              endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
              onDatesChange={this.datesChanged} // PropTypes.func.isRequired,
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
            />
          </LabelBelow>

          {this.renderDayFields()}

          <LabelLine style={{ marginBottom: 10, marginTop: 10 }} />

          <LabelSection style={{ height: 160 }}>
            <ImageDimensions>
              110 x 100 px<br />
              png/jpg
            </ImageDimensions>
            <LabelLeft>19</LabelLeft>
            <LabelLeft2>Experience Logo</LabelLeft2>

            <LabelRight>
              <label
                style={{
                  borderRadius: 5,
                  cursor: 'pointer',
                  margin: 5,
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
                  name="ExperienceLogo"
                  accept="image/*"
                  filename={file => 'ExperienceLogo' + file.name.split('.')[1]}
                  storageRef={firebase
                    .storage()
                    .ref(
                      'experiences/' + this.state.uid + '/' + this.state.newId
                    )}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleExperienceLogo}
                  onProgress={this.handleProgress}
                />
              </label>
              <InputDelete onClick={this.deleteExperienceLogo}>
                Remove
              </InputDelete>
            </LabelRight>
            <LabelBelow>
              <img
                src={experienceLogo}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginLeft: -210,
                  marginTop: 20,
                  border: '2px solid gray',
                }}
              />
            </LabelBelow>
          </LabelSection>

          <LabelSection style={{ height: 370 }}>
            <ImageDimensions>
              1080 x 1920 px<br />
              102 x 180 px<br />
              png/jpg
            </ImageDimensions>
            <LabelLeft>20</LabelLeft>
            <LabelLeft2>Stories Thumbnail</LabelLeft2>
            <LabelRight>
              <label
                style={{
                  borderRadius: 5,
                  cursor: 'pointer',
                  margin: 5,
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
                  name="StoriesThumbnail"
                  accept="image/*"
                  filename={file => 'StoriesThumb' + file.name.split('.')[1]}
                  storageRef={firebase
                    .storage()
                    .ref(
                      'experiences/' + this.state.uid + '/' + this.state.newId
                    )}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleStoriesThumbnail}
                  onProgress={this.handleProgress}
                />
              </label>{' '}
              <InputDelete onClick={this.deleteThumbnail}>Remove</InputDelete>
            </LabelRight>
            <LabelBelow>
              <img
                src={storiesThumb}
                style={{
                  width: 150,
                  height: 300,
                  marginLeft: -210,
                  marginTop: 20,
                  border: '2px solid gray',
                }}
              />
            </LabelBelow>
          </LabelSection>

          <LabelSection style={{ height: 190 }}>
            <ImageDimensions>
              344 x 241 px<br />
              png/jpg
            </ImageDimensions>
            <LabelLeft>21</LabelLeft>
            <LabelLeft2>Feed Thumbnail</LabelLeft2>
            <LabelRight>
              <label
                style={{
                  borderRadius: 5,
                  cursor: 'pointer',
                  margin: 5,
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
                  name="FeedThumbnail"
                  accept="image/*"
                  filename={file => 'FeedThumb' + file.name.split('.')[1]}
                  storageRef={firebase
                    .storage()
                    .ref(
                      'experiences/' + this.state.uid + '/' + this.state.newId
                    )}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleFeedThumbnail}
                  onProgress={this.handleProgress}
                />
              </label>{' '}
              <InputDelete onClick={this.deleteFeedThumbnail}>
                Remove
              </InputDelete>
            </LabelRight>
            <LabelBelow>
              <img
                src={feedThumb}
                style={{
                  width: 150,
                  height: 150,
                  marginLeft: -210,
                  marginTop: 20,
                  border: '2px solid gray',
                }}
              />
            </LabelBelow>
          </LabelSection>

          <LabelSection style={{ height: 190 }}>
            <ImageDimensions>
              375 x 386 px<br />
              png/jpg
            </ImageDimensions>
            <LabelLeft>22</LabelLeft>
            <LabelLeft2>Detailed View Thumb</LabelLeft2>
            <LabelRight>
              <label
                style={{
                  borderRadius: 5,
                  cursor: 'pointer',
                  margin: 5,
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
                  name="DetailedView"
                  accept="image/*"
                  filename={file => 'DetailedView' + file.name.split('.')[1]}
                  storageRef={firebase
                    .storage()
                    .ref(
                      'experiences/' + this.state.uid + '/' + this.state.newId
                    )}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleDetailedView}
                  onProgress={this.handleProgress}
                />
              </label>{' '}
              <InputDelete onClick={this.deleteDetailedView}>
                Remove
              </InputDelete>
            </LabelRight>
            <LabelBelow>
              <img
                src={detailedThumb}
                style={{
                  width: 150,
                  height: 150,
                  marginLeft: -210,
                  marginTop: 20,
                  border: '2px solid gray',
                }}
              />
            </LabelBelow>
          </LabelSection>

          <LabelLine style={{ marginBottom: 10, marginTop: 10 }} />

          <LabelSection style={{ height: 190 }}>
            <ImageDimensions>
              1024x1920<br />
              avi/mp4
            </ImageDimensions>
            <LabelLeft>23</LabelLeft>
            <LabelLeft2>Experience Video</LabelLeft2>
            <LabelRight>
              <label
                style={{
                  borderRadius: 5,
                  cursor: 'pointer',
                  margin: 5,
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
                  name="DetailedView"
                  accept="video/*"
                  filename={file => 'ExperienceVideo' + file.name.split('.')[1]}
                  storageRef={firebase
                    .storage()
                    .ref(
                      'experiences/' + this.state.uid + '/' + this.state.newId
                    )}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleExperienceVideo}
                  onProgress={this.handleProgress}
                />
              </label>{' '}
              <InputDelete onClick={this.deleteExperienceVideo}>
                Remove
              </InputDelete>
            </LabelRight>
            <LabelBelow>
              <ReactPlayer controls width={160} height={120} url={videoURL} />
            </LabelBelow>
          </LabelSection>

          <LabelLine style={{ marginBottom: 10, marginTop: 10 }} />

          <LabelSection style={{ height: 60 }}>
            <LabelLeft>23</LabelLeft>
            <LabelLeft2>Story Preview Videos/Images</LabelLeft2>
            <LabelRight>
              <label
                style={{
                  borderRadius: 5,
                  cursor: 'pointer',
                  margin: 5,
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
                UPLOAD VIDEO OR IMAGE
                <FileUploader
                  hidden
                  name="StoryView"
                  filename={file =>
                    'StoryVideo' +
                    this.state.storyVideos.length +
                    '_' +
                    file.name.split('.')[1]
                  }
                  storageRef={firebase
                    .storage()
                    .ref(
                      'experiences/' + this.state.uid + '/' + this.state.newId
                    )}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleStoryVideo}
                  onProgress={this.handleProgress}
                />
              </label>
            </LabelRight>
          </LabelSection>

          <LabelSection style={{ height: 400 }}>
            <LabelBelow style={{ marginTop: 10, height: 320, width: 700 }}>
              {this.renderStoryVideos()}
            </LabelBelow>
          </LabelSection>

          <LabelLine style={{ marginBottom: 10, marginTop: 10 }} />
        </MyGrid>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCo3ohvRGCfnZJIB-KwvGXa77ntjPOvGAQ',
})(CreateExperience);

const ScrollContain = glamorous.div({
  overflowY: 'scroll',
  width: 800,
  overflowX: 'hidden',
  height: 530,
});

const MyGrid = glamorous.div({
  // pointerEvents: 'none',
  margin: 'auto',
  marginTop: 100,
  width: 800,

  backgroundColor: '#ffffff',
  border: '1px solid #333333',
  borderRadius: 10,
  //color: '#444',
  //  paddingTop:30,
  textAlign: 'center',
});

const LogoText = glamorous.div({
  color: 'black',
  fontSize: 30,
  margin: 25,
  marginBottom: 15,
  marginTop: 15,
  fontFamily: 'cursive',
  fontWeight: 'bold',
});

const LabelSection = glamorous.div({
  width: 700,
  height: 50,
  flex: 1,
  flexDirection: 'row',
});

const LabelSectionB = glamorous.div({
  width: 700,
  borderWidth: 1,
  borderColor: 'red',
  height: 100,
  flex: 1,
  flexDirection: 'row',
});
const LabelTop = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: 'black',
  marginTop: 20,
  fontFamily: 'DINNextLTPro',
  fontWeight: 'bold',
  fontSize: 12,
  letterSpacing: 0.24,
  marginBottom: 3,
  marginLeft: 125,
});

const LabelLost = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: '#C1272D',
  fontSize: 14,
  fontFamily: 'DINNextLTPro',
  marginLeft: 210,
  marginTop: 10,
  marginBottom: 15,
  textDecoration: 'none',
});

const LabelText = glamorous.div({
  width: '100%',
  textAlign: 'left',
  color: 'black',
  fontSize: 14,
  marginTop: 20,
  fontFamily: 'DINNextLTPro',
  marginLeft: 150,
  marginBottom: 40,
});

const LabelLeft = glamorous.div({
  width: 50,
  textAlign: 'center',
  color: 'black',
  fontSize: 14,
  padding: 10,
  fontFamily: 'DINNextLTPro',
  float: 'left',
});

const ImageDimensions = glamorous.div({
  position: 'relative',
  top: 60,
  left: 395,
  height: 100,
  width: 100,
  marginRight: -100,
  textAlign: 'left',
  color: 'black',
  fontSize: 14,
  fontFamily: 'DINNextLTPro',
  float: 'left',
});

const LabelBelow = glamorous.div({
  width: '100%',
  marginLeft: 50,
  textAlign: 'left',
  color: 'black',
  fontSize: 14,
  padding: 10,
  height: 350,
  fontFamily: 'DINNextLTPro',
});

const LabelLeft2 = glamorous.div({
  width: 200,
  float: 'left',
  padding: 10,
  color: 'black',
  textAlign: 'left',
  fontSize: 14,
  fontFamily: 'DINNextLTPro',
});

const LabelDay = glamorous.div({
  width: 200,
  height: 50,
  float: 'left',
  color: 'black',
  textAlign: 'left',
  fontSize: 14,
  marginLeft: 70,
  fontFamily: 'DINNextLTPro',
});

const LabelCount = glamorous.div({
  width: 70,
  height: 50,
  float: 'left',
  color: 'black',
  textAlign: 'left',
  fontSize: 14,
  marginLeft: 70,
  fontFamily: 'DINNextLTPro',
});
const LabelDayFirst = glamorous.div({
  width: 200,
  height: 50,
  float: 'left',
  color: 'black',
  textAlign: 'left',
  fontSize: 14,
  fontFamily: 'DINNextLTPro',
});

const InputDelete = glamorous.div({
  marginLeft: 10,
  width: 100,
  backgroundColor: 'gray',
  float: 'right',
  marginLeft: -100,
  margin: 5,
  color: 'white',
  textAlign: 'center',
  fontSize: 14,
  fontFamily: 'DINNextLTPro',
  cursor: 'pointer',
});

const LabelRight = glamorous.div({
  width: 400,
  float: 'right',

  color: 'black',
  fontSize: 14,
  fontFamily: 'DINNextLTPro',
});

const LabelLine = glamorous.div({
  width: 650,
  height: 2,
  backgroundColor: '#EEEEEE',
  marginLeft: 75,
  marginBottom: 10,
});

const StoryItemWrap = glamorous.div({
  width: 280,
  height: 150,
  float: 'left',
  borderRadius: 10,
  border: '1px solid black',
  backgroundColor: 'lightgray',
  backgroundColor: '#EEEEEE',
  margin: 5,
  cursor: 'pointer',
});

const ToggleButtons = glamorous.div({
  height: 50,
});
const ToggleButton = glamorous.div({
  height: 21,
  width: 100,
  margin: 10,
  backgroundColor: 'black',
  color: 'white',
  padding: 3,
  borderRadius: 5,
  marginLeft: 50,
  float: 'left',
});

const StoryDelete = glamorous.div({
  backgroundColor: 'blue',
  color: 'white',
  float: 'left',
  border: '1px solid black',
  borderRadius: 5,
  marginTop: 20,
  padding: 10,
});

const PassWarn = glamorous.div({
  width: '100%',
  textAlign: 'center',
  color: '#C1272D',
  fontSize: 16,
  marginBottom: 10,
  marginLeft: 0,
  fontFamily: 'DINNextLTPro',
});
