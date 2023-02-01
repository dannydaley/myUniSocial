import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default class HomeRight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            dataIsLoaded: false,
        };
    }

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
        let { loggedInUsername } = this.props;
        return (
            <Container
                xs={0}
                sx={{
                    padding: "20px",
                    paddingTop: "110px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                    backgroundColor: "#292929",
                    width: "220px",
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    paddingRight: "5000px",
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
                        {this.state.friends.map((friend) =>
                            friend.username !== loggedInUsername ? (
                                <Link
                                    to={`/${friend.username}`}
                                    style={{ textDecoration: "none" }}
                                    key={friend.username}
                                >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            borderRadius: "30px 5px 5px 30px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            marginRight: "500px",
                                            paddingRight: "50px",
                                        }}
                                        color="success"
                                    >
                                        <img
                                            alt=""
                                            key={friend.profilePicture}
                                            src={
                                                process.env.REACT_APP_SERVER +
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
                                </Link>
                            ) : (
                                ""
                            )
                        )}
                    </Stack>
                </Box>
            </Container>
        );
    }
}
