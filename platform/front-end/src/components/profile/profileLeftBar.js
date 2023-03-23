import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SchoolIcon from "@mui/icons-material/School";

export default class ProfileLeftBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            aboutMe: "",
            location: "",
            education: "",
            work: "",
            profilePicture: "",
            coverPicture: "",
            asked: 0,
            answered: 0,
            dataIsLoaded: false,
        };
    }

    componentDidMount = async (newCircle) => {
        if (!newCircle) {
            newCircle = "general";
        }
        this.setState({ dataIsLoaded: false });
        // get user general info from server
        fetch(process.env.REACT_APP_SERVER + "/account/getUserGeneralInfo", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.userProfileToGet,
            }),
        })
            //turn the response into a json object
            .then((response) => response.json())
            // app.y returned data to state and switch data is loaded to true
            .then((data) => {
                this.setState({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    aboutMe: data.aboutMe,
                    location: data.location,
                    education: data.education,
                    coverPicture: data.coverPicture,
                    work: data.work,
                    profilePicture: data.profilePicture,
                    asked: data.asked,
                    answered: data.answered,
                    dataIsLoaded: true,
                });
            });
    };

    render() {
        const {
            isFriendsWithLoggedInUser,
            sendFriendRequest,
            friendRequestSent,
            // requestSender,
            loggedInUsername,
        } = this.props;

        const {
            firstName,
            lastName,
            profilePicture,
            asked,
            answered,
            work,
            location,
            education,
            aboutMe,
        } = this.state;
        return (
            <Container
                xs={0}
                sx={{
                    padding: "20px",
                    paddingTop: "110px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "left",
                    flexDirection: "column",
                    backgroundColor: "#292929",
                    width: "220px",
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                }}
            >
                <Box sx={{ padding: 2, bgcolor: "none" }}>
                    <div
                        style={{
                            backgroundImage:
                                "url(" +
                                process.env.REACT_APP_SERVER +
                                "/public/" +
                                profilePicture +
                                ")",
                            backgroundSize: "cover",
                            minWidth: "120px",
                            minHeight: "120px",
                            marginBottom: "50px",
                            border: "1px solid gray",
                            borderRadius: "50%",
                            width: "200px",
                            height: "200px",
                            ":hover": { cursor: "pointer" },
                            zIndex: 100000000,
                        }}
                    ></div>

                    <Typography
                        variant="h5"
                        component="div"
                        color="white"
                        sx={{ textAlign: "center", mt: 2 }}
                    >
                        {firstName} {lastName}
                    </Typography>
                    {isFriendsWithLoggedInUser ? (
                        ""
                    ) : friendRequestSent && loggedInUsername ? (
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            sx={{
                                textTransform: "none",
                                mt: 2,
                                backgroundColor: "gray",
                            }}
                        >
                            Friend Requested
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            sx={{ textTransform: "none", mt: 2 }}
                            onClick={sendFriendRequest}
                        >
                            Add Friend
                        </Button>
                    )}
                </Box>
                <Typography
                    variant="h6"
                    component="div"
                    color="white"
                    sx={{ mt: 2 }}
                >
                    About {firstName}
                </Typography>
                <PersonIcon
                    sx={{
                        textAlign: "center",
                        justifySelf: "center",
                        color: "white",
                        mt: 2,
                    }}
                />
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "center" }}
                >
                    "{aboutMe}"
                </Typography>
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "left", mt: 4 }}
                >
                    <WorkIcon sx={{ textAlign: "left", mr: 2 }} />
                    {work}
                </Typography>
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "left", mt: 2 }}
                >
                    <LocationCityIcon sx={{ textAlign: "left", mr: 2 }} />
                    {location}
                </Typography>
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "left", mt: 2 }}
                >
                    <SchoolIcon sx={{ textAlign: "left", mr: 0.4 }} />
                    {education}
                </Typography>
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "canter", mt: 2 }}
                >
                    404 Asked: {asked}
                </Typography>
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "center", mt: 2 }}
                >
                    404 Answered: {answered}
                </Typography>
            </Container>
        );
    }
}
