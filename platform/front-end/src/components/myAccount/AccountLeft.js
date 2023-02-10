import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

export default class AccountLeft extends React.Component {
    render() {
        const { changeSettings, userProfilePicture } = this.props;
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
                }}
            >
                <Link to="/myProfile">
                    <div
                        onClick={() => this.props.changeRoute("myProfile")}
                        style={{
                            backgroundImage:
                                "url(" +
                                process.env.REACT_APP_SERVER +
                                "/public/" +
                                userProfilePicture +
                                ")",
                            backgroundSize: "cover",
                            minWidth: "120px",
                            height: "120px",
                            marginBottom: "50px",
                            border: "1px solid gray",
                            borderRadius: "50%",
                        }}
                    ></div>
                </Link>

                <Stack
                    spacing={2}
                    direction="column"
                    sx={{ width: "80%", margin: "0 auto" }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            height: "30px",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                        onClick={() => changeSettings("My information")}
                    >
                        General
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            height: "30px",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                        onClick={() => changeSettings("My Circles")}
                    >
                        My Modules
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            height: "30px",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                        onClick={() => changeSettings("My friends")}
                    >
                        My friends
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            height: "30px",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                        onClick={() => changeSettings("My login info")}
                    >
                        My login
                    </Button>
                </Stack>
            </Container>
        );
    }
}
