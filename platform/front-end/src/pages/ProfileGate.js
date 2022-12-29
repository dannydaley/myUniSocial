import ProfilePage from './ProfilePage'
import * as React from 'react';
import { useLocation } from "react-router-dom";

export default function ProfileGate (props) {  
    const params = useLocation();
    let pathname = params.pathname;
    var userProfileToGet = pathname.substring(1);
    return (
        <> 
            <ProfilePage userProfileToGet={userProfileToGet} loggedInUsername={props.loggedInUsername} userFirstName={props.userFirstName} userLastName={props.userLastName} userProfilePicture={props.userProfilePicture} getNotifications={props.getNotifications}/>                        
        </>
    )  
}  
