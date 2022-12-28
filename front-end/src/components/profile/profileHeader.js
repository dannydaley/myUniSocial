import * as React from 'react';

export default class ProfileHeader extends React.Component {
  
  render () {    
      return(
     <div style={{height: '50vh', backgroundImage: `url(${process.env.REACT_APP_SERVER}/public/${this.props.coverPicture})`}}></div>     
      )    
  } 
}