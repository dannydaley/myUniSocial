import MessagesFeed from "../components/messages/messageFeed";
import * as React from "react";

export default class MessagesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: "general",
        };
    }
    componentDidMount() {
        this.props.SwitchPlatform("myUniSocial");
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
                <MessagesFeed
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
