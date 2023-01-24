import * as React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import myUni404 from "../assets/myUni404small.png";
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
        fetch(process.env.REACT_APP_SERVER + "/getUsersCircles", {
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
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                    backgroundColor: "#292929",
                    width: 1,
                    height: "94vh",
                    position: "sticky",
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
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#f5c732",
                        mb: "50px",
                        "&:hover": { backgroundColor: "gray" },
                    }}
                    size="medium"
                    onClick={() => this.props.changeRoute("ask")}
                >
                    Ask a question
                </Button>
                <Stack
                    spacing={2}
                    sx={{
                        width: 240,
                        margin: "50px auto 0",
                        height: "500px",
                        overflowY: "auto",
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#f5c732",
                            mb: "50px",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                        onClick={() => changeCircle("general")}
                    >
                        GENERAL
                    </Button>
                    {this.state.circles.map((circle) =>
                        circle.length > 2 ? (
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#f5c732",
                                    mb: "50px",
                                    "&:hover": { backgroundColor: "gray" },
                                }}
                                size="medium"
                                onClick={() => changeCircle(`${circle}`)}
                            >
                                {circle}
                            </Button>
                        ) : (
                            ""
                        )
                    )}
                    <a href="http://147.182.247.158:9010/" target="_blank">
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#f5c732",
                                mb: "50px",
                                "&:hover": { backgroundColor: "gray" },
                            }}
                            size="medium"
                        >
                            <img src={myUni404} />
                        </Button>
                    </a>
                </Stack>
                <Stack
                    spacing={2}
                    direction="column"
                    sx={{ width: "80%", margin: "0 auto" }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                        onClick={() => this.props.changeFeed(1, "Web")}
                    >
                        Web
                    </Button>
                    {/* <Link to={'feed'} style={{textDecoration: 'none'}}> */}
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                        onClick={() => this.props.changeFeed(2, "GamDev")}
                    >
                        Game Dev
                    </Button>
                    {/* </Link>  */}
                    {/* <Link to={'feed'} style={{textDecoration: 'none'}}> */}
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                        onClick={() => this.props.changeFeed(3, "SysOs")}
                    >
                        Systems/OS
                    </Button>
                    {/* </Link> */}
                    {/* <Link to={'feed'} style={{textDecoration: 'none'}}> */}
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                        onClick={() => this.props.changeFeed(4, "Robotics")}
                    >
                        Robotics
                    </Button>
                    {/* </Link> */}
                </Stack>
                <a
                    href="https://falmouth.myday.cloud/dashboard/home"
                    target={"_blank"}
                    rel="noreferrer"
                    style={{
                        justifySelf: "flex-end",
                        alignSelf: "flex-end",
                        marginTop: "auto",
                        textDecoration: "none",
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            width: "100%",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                            justifySelf: "flex-end",
                            alignSelf: "flex-end",
                            marginTop: "auto",
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
