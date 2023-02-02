import QuestionPage from "../../pages/QuestionPage";
import * as React from "react";
import { useLocation } from "react-router-dom";

export default function ProfileGate(props) {
    const params = useLocation();
    let pathname = params.pathname;
    var questionToGet = pathname.substring(10);

    return (
        <>
            <QuestionPage
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
