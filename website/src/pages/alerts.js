import React from 'react';
import glamorous from 'glamorous';
import Header from '../components/header';

export default class Alerts extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <TopTitle>Alerts</TopTitle>
      </div>
    );
  }
}

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
  width: 100,
  height: 200,
  backgroundColor: '#fff',
  color: '#444',
});
