import * as React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link, Navigate } from "react-router-dom";
import myUniSocial from "../../../../../src/logo.png";

export default function HomeLeft(props) {
    const { userProfilePicture } = props;
    return (
        <Container
            xs={0}
            sx={{
                // width: "224px",
                padding: { md: "110px 0 0 0", lg: "110 20px 20px 20px" },

                // paddingTop: "110px",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "column",
                backgroundColor: "#292929",
                width: { md: "150px", lg: "224px" },
                // border: { }
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
            </Link>{" "}
            <Stack
                spacing={2}
                direction="column"
                sx={{ width: "80%", margin: "0 auto" }}
            >
                <Link to="/ask-question" sx={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        sx={{
                            textDecoration: "none",
                            padding: "5px 0",
                            backgroundColor: "#f5c732",
                            "&:hover": { backgroundColor: "gray" },
                        }}
                        size="medium"
                        // onClick={() => props.changeRoute("ask")}
                    >
                        Ask a question
                    </Button>
                </Link>

                <Button
                    variant="contained"
                    sx={{
                        padding: "5px 0",
                        backgroundColor: "#f5c732",
                        "&:hover": { backgroundColor: "gray" },
                    }}
                    size="medium"
                    onClick={() => props.changeFeed(1, "Web")}
                >
                    Web
                </Button>

                {/* <Link to={'feed'} style={{textDecoration: 'none'}}> */}
                <Button
                    variant="contained"
                    sx={{
                        padding: "5px 0",
                        backgroundColor: "#f5c732",
                        "&:hover": { backgroundColor: "gray" },
                    }}
                    size="medium"
                    onClick={() => props.changeFeed(2, "GamDev")}
                >
                    Game Dev
                </Button>
                {/* </Link>  */}
                {/* <Link to={'feed'} style={{textDecoration: 'none'}}> */}
                <Button
                    variant="contained"
                    sx={{
                        padding: "5px 0",
                        backgroundColor: "#f5c732",
                        "&:hover": { backgroundColor: "gray" },
                    }}
                    size="medium"
                    onClick={() => props.changeFeed(3, "SysOs")}
                >
                    Systems/OS
                </Button>
                {/* </Link> */}
                {/* <Link to={'feed'} style={{textDecoration: 'none'}}> */}
                <Button
                    variant="contained"
                    sx={{
                        padding: "5px 0",
                        backgroundColor: "#f5c732",
                        "&:hover": { backgroundColor: "gray" },
                    }}
                    size="medium"
                    onClick={() => {
                        props.changeFeed(4, "Robotics");
                        // useNavigate("/myUni404");
                    }}
                >
                    Robotics
                </Button>
                {/* </Link> */}
            </Stack>
            <Link
                to="/"
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
                    <img src={myUniSocial} width={"105px"} alt="myUni404" />
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
