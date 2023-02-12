import * as React from "react";
import { useLocation } from "react-router-dom";
import PostPage from "./PostPage";

export default function PostGate(props) {
    const params = useLocation();
    let pathname = params.pathname;
    var postToGet = pathname.substring(6);

    return (
        <>
            <PostPage
                SwitchPlatform={props.SwitchPlatform}
                postToGet={postToGet}
                loggedInUsername={props.loggedInUsername}
                userFirstName={props.userFirstName}
                userLastName={props.userLastName}
                userProfilePicture={props.userProfilePicture}
                getNotifications={props.getNotifications}
            />
        </>
    );
}
