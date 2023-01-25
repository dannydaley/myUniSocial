import "./App.css";
import React, { Component } from "react";
import SignIn from "./pages/SignIn";
import NavBar from "./components/navBar";
import ProfilePage from "./pages/ProfilePage";
import MyAccountPage from "./pages/myAccountPage";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/core/styles";
import ProfileGate from "./pages/ProfileGate";
import MessagesPage from "./pages/messagesPage";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            input: "",
            route: "signin",
            isSignedIn: false,
            mailNotifications: 0,
            notifications: ["1", "2", "3"],
            alertNotifications: 0,
            userFirstName: "",
            userLastName: "",
            loggedInUsername: "",
            userProfilePicture: "",
            userCoverPicture: "",
            UIColor: "",
        };
    }
    // const isLoggedIn = useSelector(state => state.isLoggedIn),
    delay = (ms) => new Promise((res) => setTimeout(res, ms));

    delayFunction = (time) => {
        this.delay(time);
    };

    getNotifications = async () => {
        fetch(process.env.REACT_APP_SERVER + "/getNotifications", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.state.loggedInUsername,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            // .then(await this.delayFunction(1000))
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => (data)) SHOULD SHOW WHAT WE GET
            .then((data) => {
                this.setState({
                    alertNotifications: data.unseenNotifications.length,
                    mailNotifications: data.messages.length,
                    notifications: data.notifications,
                });
            });
    };

    componentDidMount() {
        this.interval = setInterval(() => this.getNotifications(), 10000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    confirmFriendRequest = (sender, loggedInUser) => {
        fetch(process.env.REACT_APP_SERVER + "/confirmFriendRequest", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sender: sender,
                recipient: loggedInUser,
            }),
        }).then((response) => response.json());
    };

    refuseFriendRequest = (sender, loggedInUser) => {
        fetch(process.env.REACT_APP_SERVER + "/refuseFriendRequest", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sender: sender,
                recipient: loggedInUser,
            }),
        }).then((response) => response.json());
    };

    sendFriendRequest = () => {
        fetch(process.env.REACT_APP_SERVER + "/friendRequest", {
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
            fetch(process.env.REACT_APP_SERVER + "/signout", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sender: this.props.loggedInUsername,
                }),
            });
        } else if (route === "home") {
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
        fetch(process.env.REACT_APP_SERVER + "/refreshData", {
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
                                        <MyAccountPage
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
