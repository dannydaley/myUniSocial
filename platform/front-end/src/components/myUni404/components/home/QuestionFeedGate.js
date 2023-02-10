import * as React from "react";
import { useLocation } from "react-router-dom";
import HomePage404 from "../../pages/HomePage404";

export default function QuestionFeedGate(props) {
    //get url from location
    const params = useLocation();
    // pull the pathname from the url
    let pathname = params.pathname;
    // create a string of all the characters after the 15th character of the url
    var feedToGet = pathname.substring(15);
    // this allows questions to have their own working url

    return (
        <HomePage404
            feedToGet={feedToGet !== undefined ? feedToGet : "Web"}
            SwitchPlatform={props.SwitchPlatform}
            updateProfilePicture={props.updateProfilePicture}
            userProfilePicture={props.userProfilePicture}
            userData={props.userData}
            userID={props.userID}
            userFirstName={props.userFirstName}
            userLastName={props.userLastName}
        />
    );
}
