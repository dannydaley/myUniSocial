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
                    <Button
                        variant="contained"
                        sx={{
                            fontSize: 12,
                            padding: 0,
                            width: "100%",
                            height: "30px",
                            backgroundColor: "gray",
                            color: "red",
                            "&:hover": { backgroundColor: "black" },
                        }}
                        size="medium"
                        onClick={() =>
                            this.props.onRouteChange("signoutAndDelete")
                        }
                    >
                        Delete Account
                    </Button>
                </Stack>

                <a
                    style={{ marginTop: "auto", textDecoration: "none" }}
                    href={
                        "https://eu.jotform.com/sign/230583571284055/invite/01gtc87ce613aaf304a8d0d908"
                    }
                    rel="noreferrer"
                    target="_blank"
                >
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            height: "30px",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="small"
                    >
                        Consent Form
                    </Button>
                </a>
                <a
                    style={{ marginTop: "10px", textDecoration: "none" }}
                    href={
                        "https://forms.office.com/Pages/ResponsePage.aspx?id=s-4LVT1qRkahEfidAXd5LnDKbBdyf5JGo-fKf-5dPR9URUMzRFE5RkQ4QjZRTVBaRzUzMlBFNFYxOC4u"
                    }
                    rel="noreferrer"
                    target="_blank"
                >
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            height: "30px",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="small"
                    >
                        Research Form
                    </Button>
                </a>
                <a
                    style={{ marginTop: "auto", textDecoration: "none" }}
                    href={
                        process.env.REACT_APP_SERVER +
                        "/public/privacy-policy.html"
                    }
                    rel="noreferrer"
                    target="_blank"
                >
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            height: "30px",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="small"
                    >
                        Privacy Policy
                    </Button>
                </a>

                <a
                    style={{ marginTop: "20px", textDecoration: "none" }}
                    href={
                        process.env.REACT_APP_SERVER +
                        "/public/cookie-policy.html"
                    }
                    rel="noreferrer"
                    target="_blank"
                >
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            height: "30px",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="small"
                    >
                        Cookie Policy
                    </Button>
                </a>
            </Container>
        );
    }
}
