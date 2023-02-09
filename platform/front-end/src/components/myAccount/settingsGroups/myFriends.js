import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default class MyFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataIsLoaded: false,
        };
    }

    deleteFriend = (friend) => {
        fetch(process.env.REACT_APP_SERVER + "/friends/deleteFriend", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
                friend: friend,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
            .then(this.componentDidMount());
    };

    componentDidMount = () => {
        this.setState({ dataIsLoaded: false });
        fetch(process.env.REACT_APP_SERVER + "/friends/getFriends", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
            .then((data) => {
                this.setState({ friends: data, dataIsLoaded: true });
            });
    };

    render() {
        const { settings, loggedInUsername } = this.props;
        const { dataIsLoaded } = this.state;
        if (!dataIsLoaded) {
            return (
                <div>
                    <Typography
                        variant="h3"
                        component="div"
                        color="white"
                        sx={{
                            textAlign: "center",
                            mt: 2,
                            paddingTop: 1,
                            paddingBottom: 2,
                            bgcolor: "none",
                        }}
                    >
                        {settings}
                    </Typography>
                </div>
            );
        } else {
            return (
                <div>
                    <Typography
                        variant="h3"
                        component="div"
                        color="white"
                        sx={{
                            textAlign: "center",
                            mt: 2,
                            paddingTop: 1,
                            paddingBottom: 2,
                            bgcolor: "none",
                        }}
                    >
                        {settings}
                    </Typography>
                    <Stack
                        spacing={1}
                        sx={{
                            width: "60%",
                            margin: "50px auto 0",
                        }}
                    >
                        {/* A FOR EACH LOOP LISTING A BUTTON FOR EACH CIRCLE FOLLOWED IN USER DATA */}
                        {this.state.friends
                            .sort((a, b) =>
                                a.firstName.localeCompare(b.firstName)
                            )
                            .map((friend) =>
                                friend.username !== loggedInUsername ? (
                                    <Button
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                        }}
                                    >
                                        <Link
                                            to={`/${friend.username}`}
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    backgroundImage:
                                                        "url(" +
                                                        process.env
                                                            .REACT_APP_SERVER +
                                                        "/public/" +
                                                        friend.profilePicture +
                                                        ")",
                                                    backgroundSize: "cover",
                                                    minWidth: "70px",
                                                    height: "70px",

                                                    border: "1px solid gray",
                                                    borderRadius: "50%",
                                                }}
                                            ></div>
                                        </Link>
                                        <Link
                                            to={`/${friend.username}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "white",
                                            }}
                                        >
                                            <Typography variant="h6">
                                                {friend.firstName}{" "}
                                                {friend.lastName}
                                            </Typography>
                                        </Link>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                this.deleteFriend(
                                                    friend.username
                                                )
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </Button>
                                ) : (
                                    ""
                                )
                            )}
                    </Stack>
                </div>
            );
        }
    }
}
