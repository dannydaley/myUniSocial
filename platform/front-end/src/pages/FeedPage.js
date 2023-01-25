import Feed from "../components/Feed";
import * as React from "react";

export default class FeedPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: "general",
        };
    }

    render() {
        const {
            onRouteChange,
            userFirstName,
            userLastName,
            loggedInUsername,
            userProfilePicture,
            getNotifications,
        } = this.props;
        return (
            <div>
                <Feed
                    getNotifications={getNotifications}
                    circle={this.state.circle}
                    changeMailNotifications={this.changeMailNotifications}
                    onRouteChange={onRouteChange}
                    userFirstName={userFirstName}
                    userLastName={userLastName}
                    loggedInUsername={loggedInUsername}
                    userProfilePicture={userProfilePicture}
                />
            </div>
        );
    }
}
