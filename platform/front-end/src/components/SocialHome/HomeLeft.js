import * as React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import myUni404 from "../../assets/myUni404small.png";
import { Link } from "react-router-dom";

export default class HomeLeft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circles: [],
            dataIsLoaded: false,
        };
    }

    componentDidMount = () => {
        this.setState({ dataIsLoaded: false });
        fetch(process.env.REACT_APP_SERVER + "/modules/getUsersCircles", {
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
                this.setState({ circles: data, dataIsLoaded: true });
            });
    };

    render() {
        const { changeCircle, userProfilePicture } = this.props;
        const { dataIsLoaded } = this.state;
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
                        // onClick={() => this.props.changeRoute("myProfile")}
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
                {dataIsLoaded ? (
                    <Stack
                        key={1}
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
                            onClick={() => changeCircle("general")}
                        >
                            GENERAL
                        </Button>
                        {this.state.circles.map((circle) =>
                            circle.length >= 2 ? (
                                <Button
                                    key={Math.random() * 1000}
                                    variant="contained"
                                    sx={{
                                        width: "100%",
                                        height: "30px",
                                        backgroundColor: "#f5c732",
                                        "&:hover": { backgroundColor: "gray" },
                                    }}
                                    size="medium"
                                    onClick={() =>
                                        this.props.changeCircle(`${circle}`)
                                    }
                                >
                                    {circle}
                                </Button>
                            ) : (
                                ""
                            )
                        )}
                    </Stack>
                ) : (
                    <div>
                        <React.Fragment>
                            <CssBaseline />
                            <Container
                                position="fixed"
                                maxWidth="sm"
                                sx={{
                                    position: "fixed",
                                    bgcolor: "#343434",
                                    border: "",
                                    display: "flex",
                                    height: "80vh",
                                    width: 300,
                                    mt: 16,
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}
                            >
                                <Box sx={{ padding: 2, bgcolor: "none" }}>
                                    <Link to="/myProfile">
                                        <div
                                            style={{
                                                backgroundImage:
                                                    "url(" +
                                                    process.env
                                                        .REACT_APP_SERVER +
                                                    "/public/" +
                                                    userProfilePicture +
                                                    ")",
                                                backgroundSize: "cover",
                                                minWidth: "120px",
                                                height: "120px",
                                                marginBottom: "50px",
                                                border: "1px solid gray",
                                                borderRadius: "50%",
                                                width: "200px",
                                                ":hover": { cursor: "pointer" },
                                            }}
                                        ></div>
                                    </Link>
                                    <Stack
                                        spacing={2}
                                        sx={{
                                            width: 200,
                                            margin: "50px auto 0",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                changeCircle("general")
                                            }
                                            sx={{
                                                width: 200,
                                                margin: "0 auto",
                                            }}
                                        >
                                            GENERAL
                                        </Button>
                                    </Stack>
                                </Box>
                            </Container>
                        </React.Fragment>
                    </div>
                )}
                <Link
                    to="/myuni404/feed/Web"
                    // target="_blank"
                    rel="noreferrer"
                    style={{
                        justifySelf: "flex-end",
                        marginTop: "auto",
                        textDecoration: "none",
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#f5c732",
                            mb: "15px",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                    >
                        <img src={myUni404} width={"105px"} alt="myUni404" />
                    </Button>
                </Link>
                <a
                    href="https://falmouth.myday.cloud/dashboard/home"
                    target={"_blank"}
                    rel="noreferrer"
                    style={{
                        textDecoration: "none",
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#f5c732",
                            ml: "10px",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                    >
                        Falmouth myday
                    </Button>
                </a>
            </Container>
        );
    }
}
