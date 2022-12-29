import * as React from 'react';
import MyAccountRightBar from "./myAccountRightBar";
import MyAccountLeftBar from "./myAccountLeftBar";
            
export default class  MyAccountOverlay extends React.Component {

    render () {
        const { userFirstName, userLastName, changeSettings, userProfilePicture, loggedInUsername  } = this.props
        return (
            <div style={{width: '100vw', display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>            
                <MyAccountRightBar userFirstName={userFirstName} userLastName={userLastName} loggedInUsername={loggedInUsername} />                
                <MyAccountLeftBar userFirstName={userFirstName} userLastName={userLastName} changeSettings={changeSettings} userProfilePicture={userProfilePicture}/>
            </div>
        )       
    }
}