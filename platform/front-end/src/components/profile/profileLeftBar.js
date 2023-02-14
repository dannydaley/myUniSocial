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
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + "/account/getUserGeneralInfo", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.userProfileToGet,
            }),
        })
            //turn the response into a json object
            .then((response) => response.json())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
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
                                this.state.profilePicture +
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
                        }}
                    ></div>

                    <Typography
                        variant="h5"
                        component="div"
                        color="white"
                        sx={{ textAlign: "center", mt: 2 }}
                    >
                        {this.state.firstName} {this.state.lastName}
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
                    About {this.state.firstName}
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
                    "{this.state.aboutMe}"
                </Typography>
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "left", mt: 4 }}
                >
                    <WorkIcon sx={{ textAlign: "left", mr: 2 }} />
                    {this.state.work}
                </Typography>
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "left", mt: 2 }}
                >
                    <LocationCityIcon sx={{ textAlign: "left", mr: 2 }} />
                    {this.state.location}
                </Typography>
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "left", mt: 2 }}
                >
                    <SchoolIcon sx={{ textAlign: "left", mr: 0.4 }} />
                    {this.state.education}
                </Typography>
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "canter", mt: 2 }}
                >
                    404 Asked: {this.state.asked}
                </Typography>
                <Typography
                    variant="h7"
                    component="div"
                    color="white"
                    sx={{ textAlign: "center", mt: 2 }}
                >
                    404 Answered: {this.state.answered}
                </Typography>
            </Container>
        );
    }
}
