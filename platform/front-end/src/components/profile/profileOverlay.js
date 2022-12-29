import * as React from 'react';
import ProfileRightBar from "./profileRightBar";
import ProfileLeftBar from "./profileLeftBar";
            
export default class  ProfileOverlay extends React.Component {

    render () {
        const { userFirstName, userLastName, changeAlertNotifications, userProfilePicture, isFriendsWithLoggedInUser, sendFriendRequest, userProfileToGet } = this.props
        return (
            <div style={{width: '100vw', display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>            
                <ProfileRightBar userFirstName={userFirstName} userLastName={userLastName} userProfileToGet={userProfileToGet} />                
                <ProfileLeftBar
                userProfileToGet={userProfileToGet}
                sendFriendRequest={sendFriendRequest}
                userFirstName={userFirstName}
                userLastName={userLastName}
                isFriendsWithLoggedInUser={isFriendsWithLoggedInUser}
                changeAlertNotifications={changeAlertNotifications}
                userProfilePicture={userProfilePicture} />
            </div>
        )       
    }
}