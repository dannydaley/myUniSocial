import QuestionPage from "../../pages/QuestionPage";
import * as React from "react";
import { useLocation } from "react-router-dom";

export default function ProfileGate(props) {
    //get url from location
    const params = useLocation();
    // pull the pathname from the url
    let pathname = params.pathname;
    // create a string of all the characters after the 15th character of the url
    var questionToGet = pathname.substring(10);
    // this allows questions to have their own working url

    return (
        <>
            <QuestionPage
                SwitchPlatform={props.SwitchPlatform}
                questionToGet={questionToGet}
                loggedInUsername={props.loggedInUsername}
                userFirstName={props.userFirstName}
                userLastName={props.userLastName}
                userProfilePicture={props.userProfilePicture}
                getNotifications={props.getNotifications}
            />
        </>
    );
}
