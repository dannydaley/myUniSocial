import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SchoolIcon from "@mui/icons-material/School";
import InfoIcon from "@mui/icons-material/Info";
import Button from "@mui/material/Button";
import ImageIcon from "@mui/icons-material/Image";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

export default class MyInformation extends React.Component {
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
            dataIsLoaded: false,
        };
    }

    // calls when component mounts
    componentDidMount = async (newCircle) => {
        // if no module is selected, default to general
        if (!newCircle) {
            newCircle = "general";
        }
        // initiate loading screen
        this.setState({ dataIsLoaded: false });
        // fetch general user data from server
        fetch(process.env.REACT_APP_SERVER + "/account/getUserGeneralInfo", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
            }),
        })
            // turn response into a JSON object
            .then((response) => response.json())
            // apply response data to state
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
                    dataIsLoaded: true,
                });
            });
    };

    // calls when 'first name' text field is updated and applies to state
    onFirstNameChange = (event) => {
        this.setState({ firstName: event.target.value });
    };

    // calls when 'last name' text field is updated and applies to state
    onLastNameChange = (event) => {
        this.setState({ lastName: event.target.value });
    };

    // calls when 'about me' text field is updated and applies to state
    onAboutMeChange = (event) => {
        this.setState({ aboutMe: event.target.value });
    };

    // calls when 'location' text field is updated and applies to state
    onLocationChange = (event) => {
        this.setState({ location: event.target.value });
    };

    // calls when 'education' text field is updated and applies to state
    onEducationChange = (event) => {
        this.setState({ education: event.target.value });
    };

    // calls when 'work' text field is updated and applies to state
    onWorkChange = (event) => {
        this.setState({ work: event.target.value });
    };

    // calls when 'profile picture' text field is updated and applies to state
    onProfilePictureChange = (event) => {
        this.updateProfilePicture(event.target.files[0]);
    };

    // calls when 'cover picture' text field is updated and applies to state
    onCoverPictureChange = (event) => {
        this.updateCoverPicture(event.target.files[0]);
    };

    // calls when user updates profile picture
    updateProfilePicture = async (image) => {
        // create data form for file input
        let formData = new FormData();
        // apply the image to the form
        formData.append("image", image);
        // apply username to form ready to send to server
        formData.append("username", this.props.loggedInUsername);
        // send request to server to upload image and update profile picture
        await axios
            .post(
                process.env.REACT_APP_SERVER + "/account/changeProfilePicture",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    body: JSON.stringify({
                        username: this.props.loggedInUsername,
                    }),
                }
            )
            // apply response data to state and refresh the data on the users screen
            .then((res) => {
                this.setState({ profilePicture: res.profilePicture });
                this.props.refreshData();
            })
            // remount the parent component to refresh profile picture accross the site
            .then(this.props.remount());
    };

    // calls when user updates cover picture
    updateCoverPicture = async (image) => {
        // create data form for file input
        let formData = new FormData();
        // apply the image to the form
        formData.append("image", image);
        // apply username to form ready to send to server
        formData.append("username", this.props.loggedInUsername);
        // send request to server to upload image and update cover picture
        await axios
            .post(
                process.env.REACT_APP_SERVER + "/account/changeCoverPicture",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    body: JSON.stringify({
                        username: this.props.loggedInUsername,
                    }),
                }
            )
            // apply response data to state and refresh the data on the users screen
            .then((res) => {
                this.setState({ coverPicture: res.coverPicture });
                this.props.remount();
            });
    };

    // calls when user complete form to update user info
    updateUserGeneralInfo = () => {
        // get the variable from the state
        const { firstName, lastName, aboutMe, location, education, work } =
            this.state;
        // send data to server
        fetch(process.env.REACT_APP_SERVER + "/account/updateUserGeneralInfo", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: this.props.loggedInUsername,
                firstName: firstName,
                lastName: lastName,
                aboutMe: aboutMe,
                location: location,
                education: education,
                work: work,
            }),
        })
            // turn response into a JSON object
            .then((response) => response.json())
            // remount the parent component and refresh data
            .then(this.props.remount());
    };

    render() {
        const { settings } = this.props;
        const {
            firstName,
            lastName,
            aboutMe,
            location,
            education,
            work,
            profilePicture,
            coverPicture,
            dataIsLoaded,
        } = this.state;
        if (!dataIsLoaded) {
            return (
                <Box
                    sx={{
                        padding: 2,
                        bgcolor: "none",
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        } else {
            return (
                <div style={{ height: "100%" }}>
                    <Typography
                        variant="h3"
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
                        {settings}
                    </Typography>
                    <div style={{ marginTop: "30px", display: "block" }}>
                        {this.props.updated ? (
                            <h3 style={{ color: "white" }}>Info updated!</h3>
                        ) : (
                            ""
                        )}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-around",
                                width: "70%",
                                margin: "0 auto",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundImage:
                                            "url(" +
                                            process.env.REACT_APP_SERVER +
                                            "/public/" +
                                            profilePicture +
                                            ")",
                                        backgroundSize: "cover",
                                        minWidth: "140px",
                                        height: "140px",
                                        marginBottom: "20px",
                                        border: "1px solid gray",
                                        borderRadius: "3%",
                                    }}
                                ></div>
                                <label htmlFor="file-input">
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <ImageIcon
                                            fontSize="large"
                                            sx={{
                                                mt: 3,
                                                fontSize: 30,
                                                color: "white",
                                                mr: 1,
                                                ":hover": { cursor: "pointer" },
                                            }}
                                        />
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{
                                                textAlign: "center",
                                                mt: 2,
                                                paddingTop: 1,
                                                paddingBottom: 3,
                                                bgcolor: "none",
                                                color: "white",
                                                ":hover": { cursor: "pointer" },
                                                textDecorationLine: "underline",
                                            }}
                                        >
                                            Change profile picture
                                        </Typography>
                                    </div>
                                </label>
                                <input
                                    id="file-input"
                                    type="file"
                                    name="file"
                                    onChange={this.onProfilePictureChange.bind(
                                        this
                                    )}
                                    hidden
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundImage:
                                            "url(" +
                                            process.env.REACT_APP_SERVER +
                                            "/public/" +
                                            coverPicture +
                                            ")",
                                        backgroundSize: "cover",
                                        minWidth: "140px",
                                        height: "140px",
                                        marginBottom: "20px",
                                        border: "1px solid gray",
                                        borderRadius: "3%",
                                    }}
                                ></div>
                                <label htmlFor="cover-file-input">
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <ImageIcon
                                            fontSize="large"
                                            sx={{
                                                mt: 3,
                                                fontSize: 30,
                                                color: "white",
                                                mr: 1,
                                                ":hover": { cursor: "pointer" },
                                            }}
                                        />
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{
                                                textAlign: "center",
                                                mt: 2,
                                                paddingTop: 1,
                                                paddingBottom: 3,
                                                bgcolor: "none",
                                                color: "white",
                                                ":hover": { cursor: "pointer" },
                                                textDecorationLine: "underline",
                                            }}
                                        >
                                            Change cover picture
                                        </Typography>
                                    </div>
                                </label>
                                <input
                                    id="cover-file-input"
                                    type="file"
                                    name="coverfile"
                                    onChange={this.onCoverPictureChange.bind(
                                        this
                                    )}
                                    hidden
                                />
                            </div>
                        </div>
                        <PersonIcon
                            sx={{ mr: 2, color: "rgba(255, 255, 255, 0.7)" }}
                        />
                        <TextField
                            sx={{
                                mr: "5%",
                                maxWidth: "30%",
                                width: "25%",
                                border: "6px solid white",
                                borderRadius: "4px",
                                backgroundColor: "white",
                            }}
                            id="outlined-textarea"
                            label="First name"
                            placeholder="Your first name"
                            multiline
                            defaultValue={firstName}
                            onChange={this.onFirstNameChange}
                        />
                        <TextField
                            sx={{
                                maxWidth: "30%",
                                width: "30%",
                                border: "6px solid white",
                                borderRadius: "4px",
                                backgroundColor: "white",
                            }}
                            id="outlined-textarea"
                            label="Last name"
                            placeholder="Your last name"
                            multiline
                            defaultValue={lastName}
                            onChange={this.onLastNameChange}
                        />
                    </div>
                    <div style={{ marginTop: "30px" }}>
                        <InfoIcon
                            sx={{ mr: 2, color: "rgba(255, 255, 255, 0.7)" }}
                        />
                        <TextField
                            sx={{
                                maxWidth: "60%",
                                width: "60%",
                                border: "6px solid white",
                                borderRadius: "4px",
                                backgroundColor: "white",
                            }}
                            id="outlined-textarea"
                            label="About me"
                            placeholder="Tell them who you are!"
                            multiline
                            minRows={4}
                            defaultValue={aboutMe}
                            onChange={this.onAboutMeChange}
                        />
                    </div>
                    <div style={{ marginTop: "30px" }}>
                        <LocationCityIcon
                            sx={{ mr: 2, color: "rgba(255, 255, 255, 0.7)" }}
                        />
                        <TextField
                            sx={{
                                maxWidth: "60%",
                                width: "60%",
                                border: "6px solid white",
                                borderRadius: "4px",
                                backgroundColor: "white",
                            }}
                            id="outlined-textarea"
                            label="Location"
                            placeholder="Tell them where you are!"
                            multiline
                            defaultValue={location}
                            onChange={this.onLocationChange}
                        />
                    </div>
                    <div style={{ marginTop: "30px" }}>
                        <SchoolIcon
                            sx={{ mr: 2, color: "rgba(255, 255, 255, 0.7)" }}
                        />
                        <TextField
                            sx={{
                                maxWidth: "60%",
                                width: "60%",
                                border: "6px solid white",
                                borderRadius: "4px",
                                backgroundColor: "white",
                            }}
                            id="outlined-textarea"
                            label="School/University"
                            placeholder="Tell them where you went to school!"
                            multiline
                            defaultValue={education}
                            onChange={this.onEducationChange}
                        />
                    </div>
                    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
                        <WorkIcon
                            sx={{ mr: 2, color: "rgba(255, 255, 255, 0.7)" }}
                        />
                        <TextField
                            sx={{
                                maxWidth: "60%",
                                width: "60%",
                                border: "6px solid white",
                                borderRadius: "4px",
                                backgroundColor: "white",
                            }}
                            id="outlined-textarea"
                            label="Work"
                            placeholder="Tell them where you work!"
                            multiline
                            defaultValue={work}
                            onChange={this.onWorkChange}
                        />
                    </div>
                    <div>
                        <Button
                            variant="contained"
                            onClick={() => this.updateUserGeneralInfo()}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            );
        }
    }
}
