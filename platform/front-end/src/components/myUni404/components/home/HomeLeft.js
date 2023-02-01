import * as React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function HomeLeft(props) {
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
            <div
                onClick={() => props.changeRoute("myProfile")}
                style={{
                    backgroundImage:
                        "url(" +
                        process.env.REACT_APP_SERVER +
                        "/public/" +
                        props.userData.userProfilePicture +
                        ")",
                    backgroundSize: "cover",
                    minWidth: "120px",
                    height: "120px",
                    marginBottom: "50px",
                    border: "1px solid gray",
                    borderRadius: "50%",
                }}
            ></div>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: "#f5c732",
                    mb: "50px",
                    "&:hover": { backgroundColor: "gray" },
                }}
                size="medium"
                onClick={() => props.changeRoute("ask")}
            >
                Ask a question
            </Button>
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
                    onClick={() => props.changeFeed(1, "Web")}
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
                    onClick={() => props.changeFeed(2, "GamDev")}
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
                    onClick={() => props.changeFeed(3, "SysOs")}
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
                    onClick={() => props.changeFeed(4, "Robotics")}
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
