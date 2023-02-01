import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default class MessagesRightBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            dataIsLoaded: false,
        };
    }

    componentDidMount = () => {
        this.setState({ chatsAreLoaded: false });
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
        let { getChat, loggedInUsername } = this.props;
        return (
            <div style={{ position: "fixed", width: "100vw" }}>
                <React.Fragment>
                    <CssBaseline />
                    <Container
                        maxWidth="sm"
                        sx={{
                            float: "right",
                            bgcolor: "#343434",
                            height: "80vh",
                            width: 300,
                            mr: 4,
                            mt: 16,
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ paddingTop: 1, bgcolor: "none" }}>
                            <Typography
                                variant="h6"
                                component="div"
                                color="white"
                                sx={{
                                    textAlign: "center",
                                    mt: 2,
                                }}
                            >
                                Friends
                            </Typography>
                            <Stack
                                spacing={1}
                                sx={{
                                    width: 250,
                                    margin: "50px auto 0",
                                }}
                            >
                                {/* A FOR EACH LOOP LISTING A BUTTON FOR EACH CIRCLE FOLLOWED IN USER DATA */}
                                {this.state.friends.map((friend) =>
                                    friend.username !== loggedInUsername ? (
                                        <Button
                                            key={friend.username}
                                            variant="contained"
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%",
                                            }}
                                            onClick={() =>
                                                getChat(
                                                    loggedInUsername,
                                                    false,
                                                    friend.username
                                                )
                                            }
                                            color="success"
                                        >
                                            <img
                                                key={friend.profilePicture}
                                                alt=""
                                                src={
                                                    process.env
                                                        .REACT_APP_SERVER +
                                                    "/public/" +
                                                    friend.profilePicture
                                                }
                                                width="50px"
                                                height="50px"
                                                style={{
                                                    mb: 3,
                                                    borderRadius: "50%",
                                                }}
                                            />
                                            {friend.firstName} {friend.lastName}
                                        </Button>
                                    ) : (
                                        ""
                                    )
                                )}
                            </Stack>
                        </Box>
                    </Container>
                </React.Fragment>
            </div>
        );
    }
}
