import "./App.css";
import React, { Component } from "react";
import SignIn from "./pages/SignIn";
import NavBar from "./components/navBar";
import ProfilePage from "./pages/ProfilePage";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/core/styles";
import ProfileGate from "./pages/ProfileGate";
import MessagesPage from "./pages/messagesPage";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import AccountPage from "./pages/AccountPage";
import QuestionGate from "./components/myUni404/components/FullQuestion/QuestionGate";
import AskQuestionPage from "./components/myUni404/pages/AskQuestionPage";
import QuestionFeedGate from "./components/myUni404/components/home/QuestionFeedGate";
import { io } from "socket.io-client";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            input: "",
            route: "signin",
            platform: "myUniSocial",
            isSignedIn: false,
            mailNotifications: 0,
            notifications: ["1", "2", "3"],
            userID: 0,
            alertNotifications: 0,
            userFirstName: "",
            userLastName: "",
            loggedInUsername: "",
            userProfilePicture: "",
            userCoverPicture: "",
            UIColor: "",
            socketId: "",
            socket: {},
        };
    }

    delay = (ms) => new Promise((res) => setTimeout(res, ms));

    delayFunction = (time) => {
        this.delay(time);
    };

    SwitchPlatform = (platform) => this.setState({ platform: platform });

    getNotifications = async () => {
        fetch(
            process.env.REACT_APP_SERVER + "/notifications/getNotifications",
            {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: this.state.loggedInUsername,
                }),
            }
        )
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => (data)) SHOULD SHOW WHAT WE GET
            .then((data) => {
                this.setState({
                    alertNotifications: data.unseenNotifications.length,
                    mailNotifications: data.messages.length,
                    notifications: data.notifications,
                });
            });
    };
    checkForSession = () => {
        fetch(process.env.REACT_APP_SERVER + "/auth/refreshSessionStatus", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "check for session",
            }),
        }).then((response) => console.log(response.json()));
    };
    componentDidMount() {
        // this.interval = setInterval(() => this.getNotifications(), 10000);
        this.checkForSession();
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    confirmFriendRequest = (sender, loggedInUser) => {
        fetch(process.env.REACT_APP_SERVER + "/friends/confirmFriendRequest", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sender: sender,
                recipient: loggedInUser,
            }),
        }).then((response) => response.json());
    };

    refuseFriendRequest = (sender, loggedInUser) => {
        fetch(process.env.REACT_APP_SERVER + "/friends/refuseFriendRequest", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sender: sender,
                recipient: loggedInUser,
            }),
        }).then((response) => response.json());
    };

    sendFriendRequest = () => {
        fetch(process.env.REACT_APP_SERVER + "/friends/friendRequest", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sender: this.props.loggedInUsername,
                recipient: this.props.userProfileToGet,
            }),
        }).then((response) => response.json());
    };

    onRouteChange = (route) => {
        if (route === "signout") {
            this.setState({ isSignedIn: false });
            fetch(process.env.REACT_APP_SERVER + "/auth/signout", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sender: this.props.loggedInUsername,
                }),
            });
        } else if (route === "home") {
            if (!this.state.socketId) {
                const socket = io.connect(process.env.REACT_APP_SERVER);
                socket.on("connect", () => {
                    this.setState({ socketId: socket.id, socket: socket });
                    console.log(socket.id);
                    console.log(socket);
                });
                socket.emit("join", {
                    username: this.state.loggedInUsername,
                });
                socket.on("connect_error", () => {
                    console.log("error");
                    setTimeout(() => socket.connect(), 3001);
                });
            }
            this.setState({ isSignedIn: true });
        }
        this.setState({ route: route });
    };

    updateSession = (
        firstName,
        lastName,
        userName,
        userProfilePicture,
        userCoverPicture
    ) => {
        this.setState({
            userFirstName: firstName,
            userLastName: lastName,
            loggedInUsername: userName,
            userProfilePicture: userProfilePicture,
            userCoverPicture: userCoverPicture,
            isSignedIn: true,
        });
    };

    refreshData = () => {
        fetch(process.env.REACT_APP_SERVER + "/account/refreshData", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                loggedInUsername: this.state.loggedInUsername,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => (data)) SHOULD SHOW WHAT WE GET
            .then((data) => {
                this.setState({
                    userFirstName: data.firstName,
                    userLastName: data.lastName,
                    userProfilePicture: data.profilePicture,
                });
            });
    };

    // THESE FUNCTIONS HANDLE INCREMENTING THE NOTIFICATIONS. THESE ARE CURRENTLY PASSED INTO THE NAV BAR
    changeMailNotifications = (mailNotifications) => {
        this.setState({ mailNotifications: this.state.mailNotifications + 1 });
    };
    changeAlertNotifications = (mailNotifications) => {
        this.setState({
            alertNotifications: this.state.alertNotifications + 1,
        });
    };

    onColorChange = (event) => {
        this.setState({ color: event.target.value });
    };

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div className="App">
                    {this.state.isSignedIn === true ? (
                        <div>
                            <NavBar
                                platform={this.state.platform}
                                loggedInUsername={this.state.loggedInUsername}
                                getNotifications={this.getNotifications}
                                refuseFriendRequest={this.refuseFriendRequest}
                                confirmFriendRequest={this.confirmFriendRequest}
                                onRouteChange={this.onRouteChange}
                                onColorChange={this.onColorChange}
                                UIColor={this.state.UIColor}
                                mailNotifications={this.state.mailNotifications}
                                changeMailNotifications={
                                    this.changeMailNotifications
                                }
                                changeAlertNotifications={
                                    this.changeAlertNotifications
                                }
                                alertNotifications={
                                    this.state.alertNotifications
                                }
                                notifications={this.state.notifications}
                            />
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <HomePage
                                            SwitchPlatform={this.SwitchPlatform}
                                            getNotifications={
                                                this.getNotifications
                                            }
                                            setNotifications={
                                                this.setNotifications
                                            }
                                            changeMailNotifications={
                                                this.changeMailNotifications
                                            }
                                            onRouteChange={this.onRouteChange}
                                            userFirstName={
                                                this.state.userFirstName
                                            }
                                            userLastName={
                                                this.state.userLastName
                                            }
                                            loggedInUsername={
                                                this.state.loggedInUsername
                                            }
                                            userProfilePicture={
                                                this.state.userProfilePicture
                                            }
                                        />
                                    }
                                />
                                <Route
                                    path="myProfile"
                                    element={
                                        <ProfilePage
                                            SwitchPlatform={this.SwitchPlatform}
                                            getNotifications={
                                                this.getNotifications
                                            }
                                            loggedInUsername={
                                                this.state.loggedInUsername
                                            }
                                            userFirstName={
                                                this.state.userFirstName
                                            }
                                            userLastName={
                                                this.state.userLastName
                                            }
                                            userProfileToGet={
                                                this.state.loggedInUsername
                                            }
                                            changeAlertNotifications={
                                                this.changeAlertNotifications
                                            }
                                            userProfilePicture={
                                                this.state.userProfilePicture
                                            }
                                        />
                                    }
                                />
                                <Route
                                    path="/:username"
                                    component={ProfilePage}
                                    element={
                                        <ProfileGate
                                            SwitchPlatform={this.SwitchPlatform}
                                            getNotifications={
                                                this.getNotifications
                                            }
                                            userFirstName={
                                                this.state.userFirstName
                                            }
                                            userLastName={
                                                this.state.userLastName
                                            }
                                            state={{ from: "the-page-id" }}
                                            loggedInUsername={
                                                this.state.loggedInUsername
                                            }
                                            userProfilePicture={
                                                this.state.userProfilePicture
                                            }
                                        />
                                    }
                                    exact
                                ></Route>
                                <Route
                                    path="myAccount"
                                    element={
                                        <AccountPage
                                            SwitchPlatform={this.SwitchPlatform}
                                            refreshData={this.refreshData}
                                            updateSession={this.updateSession}
                                            getNotifications={
                                                this.getNotifications
                                            }
                                            userFirstName={
                                                this.state.userFirstName
                                            }
                                            userProfilePicture={
                                                this.state.userProfilePicture
                                            }
                                            loggedInUsername={
                                                this.state.loggedInUsername
                                            }
                                            userCoverPicture={
                                                this.state.userCoverPicture
                                            }
                                        />
                                    }
                                />
                                <Route
                                    path="messages"
                                    element={
                                        <MessagesPage
                                            socket={this.state.socket}
                                            SwitchPlatform={this.SwitchPlatform}
                                            // getNotifications={
                                            //     this.getNotifications
                                            // }
                                            setNotifications={
                                                this.setNotifications
                                            }
                                            changeMailNotifications={
                                                this.changeMailNotifications
                                            }
                                            onRouteChange={this.onRouteChange}
                                            userFirstName={
                                                this.state.userFirstName
                                            }
                                            userLastName={
                                                this.state.userLastName
                                            }
                                            loggedInUsername={
                                                this.state.loggedInUsername
                                            }
                                            userProfilePicture={
                                                this.state.userProfilePicture
                                            }
                                        />
                                    }
                                />
                                <Route
                                    path="myuni404/feed/:feed"
                                    element={
                                        <QuestionFeedGate
                                            SwitchPlatform={this.SwitchPlatform}
                                            updateProfilePicture={
                                                this.updateProfilePicture
                                            }
                                            userProfilePicture={
                                                this.state.userProfilePicture
                                            }
                                            userData={this.state}
                                            userID={this.state.userID}
                                            userFirstName={
                                                this.state.userFirstName
                                            }
                                            userLastName={
                                                this.state.userLastName
                                            }
                                        />
                                    }
                                ></Route>
                                <Route
                                    path="question/:id"
                                    element={
                                        <QuestionGate
                                            SwitchPlatform={this.SwitchPlatform}
                                            userProfilePicture={
                                                this.state.userProfilePicture
                                            }
                                            getNotifications={
                                                this.getNotifications
                                            }
                                            userFirstName={
                                                this.state.userFirstName
                                            }
                                            userLastName={
                                                this.state.userLastName
                                            }
                                            state={{ from: "the-page-id" }}
                                            loggedInUsername={
                                                this.state.loggedInUsername
                                            }
                                        />
                                    }
                                ></Route>
                                <Route
                                    path="ask-question"
                                    element={
                                        <AskQuestionPage
                                            SwitchPlatform={this.SwitchPlatform}
                                            updateProfilePicture={
                                                this.updateProfilePicture
                                            }
                                            userProfilePicture={
                                                this.state.userProfilePicture
                                            }
                                            userData={this.state}
                                            userID={this.state.userID}
                                            userFirstName={
                                                this.state.userFirstName
                                            }
                                            userLastName={
                                                this.state.userLastName
                                            }
                                        />
                                    }
                                ></Route>
                            </Routes>
                        </div>
                    ) : (
                        <SignIn
                            onRouteChange={this.onRouteChange}
                            route={this.state.route}
                            updateSession={this.updateSession}
                        />
                    )}
                </div>
            </ThemeProvider>
        );
    }
}
