import * as React from "react";
import { useLocation } from "react-router-dom";
import HomePage404 from "../../pages/HomePage404";

export default function QuestionFeedGate(props) {
    const params = useLocation();
    let pathname = params.pathname;
    var feedToGet = pathname.substring(15);

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
