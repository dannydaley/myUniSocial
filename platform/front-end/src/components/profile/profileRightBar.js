import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import RightBarImages from "./rightBarImages";

export default class ProfileRightBar extends React.Component {
    render() {
        const { userFirstName, loggedInUsername, userProfileToGet } =
            this.props;
        return (
            <Container
                xs={0}
                sx={{
                    zIndex: "0",
                    padding: "20px",
                    paddingTop: "110px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                    backgroundColor: "#292929",
                    width: "250px",
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    paddingRight: "500px",
                }}
            >
                <Typography
                    variant="h6"
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
                    {userFirstName}'s images
                </Typography>

                <RightBarImages
                    loggedInUsername={loggedInUsername}
                    userProfileToGet={userProfileToGet}
                />
            </Container>
        );
    }
}
