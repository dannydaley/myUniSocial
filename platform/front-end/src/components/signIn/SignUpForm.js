import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import myUniSocial from "../../assets/myUniSocial.png";
import falUni from "../../assets/falLogo.png";

export default class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signUpEmail: "",
            signUpUserName: "",
            signUpFirstName: "",
            signUpLastName: "",
            signUpPassword: "",
            confirmSignUpPassword: "",
        };
    }

    // gets called when email input field changes and sets value to state
    onEmailChange = (event) => {
        this.setState({ signUpEmail: event.target.value });
    };
    // gets called when first name input field changes and sets value to state
    onFirstNameChange = (event) => {
        this.setState({ signUpFirstName: event.target.value });
    };
    // gets called when last name input field changes and sets value to state
    onLastNameChange = (event) => {
        this.setState({ signUpLastName: event.target.value });
    };
    // gets called when  password input field changes and sets value to state
    onPasswordChange = (event) => {
        this.setState({ signUpPassword: event.target.value });
    };
    // // gets called when confirm password input field changes and sets value to state
    onPasswordConfirmChange = (event) => {
        this.setState({ confirmSignUpPassword: event.target.value });
    };

    // calls when user submits the sign up form
    onSubmitSignUp = () => {
        // send user data to server
        fetch(process.env.REACT_APP_SERVER + "/auth/signUp", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                signUpEmail: this.state.signUpEmail,
                signUpUserName:
                    this.state.signUpFirstName +
                    this.state.signUpLastName +
                    Math.round(Math.random() * 1e9),
                signUpFirstName: this.state.signUpFirstName,
                signUpLastName: this.state.signUpLastName,
                signUpPassword: this.state.signUpPassword,
                confirmSignUpPassword: this.state.confirmSignUpPassword,
            }),
        })
            // turn response into a JSON object
            .then((response) => response.json())
            .then((data) => {
                // if response is success
                if (data.status === "success") {
                    // update the session
                    this.props.updateSession(
                        data.firstName,
                        data.lastName,
                        data.username,
                        data.profilePicture
                    );
                }
            })
            // reroute to sign in page to login
            .then(this.props.onRouteChange("signin"));
    };

    render() {
        const { onRouteChange } = this.props;
        return (
            <Box
                sx={{
                    width: "30%",
                    padding: { xs: "5ch 10ch", md: "7ch", lg: "7ch" },
                    backgroundColor: "#f5c732",
                }}
            >
                <Box
                    sx={{
                        display: { xs: "flex", md: "none", lg: "none" },
                        paddingBottom: "30px",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <img alt="" src={falUni} style={{ width: "20vw" }} />
                    <img
                        alt=""
                        src={myUniSocial}
                        style={{ width: "25vw", marginBottom: "5px" }}
                    />
                </Box>
                <Box
                    component="form"
                    sx={{
                        "& .MuiTextField-root": { m: 1, width: "30ch" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        required
                        name="email"
                        id="outlined-required1"
                        type="email"
                        label="Email Address"
                        placeholder="Email Address"
                        onChange={this.onEmailChange}
                    />
                    <TextField
                        required
                        name="firstName"
                        id="outlined-required2"
                        type="text"
                        label="First name"
                        placeholder="first name"
                        onChange={this.onFirstNameChange}
                    />
                    <TextField
                        required
                        name="lastName"
                        id="outlined-required3"
                        type="text"
                        label="Last name"
                        placeholder="last name"
                        onChange={this.onLastNameChange}
                    />
                    <TextField
                        name="password"
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="off"
                        placeholder="create password"
                        onChange={this.onPasswordChange}
                    />
                    <TextField
                        name="confirmPassword"
                        id="outlined-password-input2"
                        label="Confirm Password"
                        type="password"
                        autoComplete="off"
                        placeholder="repeat password"
                        onChange={this.onPasswordConfirmChange}
                    />
                    <Button
                        variant="contained"
                        sx={{ width: "33ch", marginTop: "20px" }}
                        value="Sign Up"
                        onClick={() => this.onSubmitSignUp()}
                    >
                        Sign Up
                    </Button>
                    <Divider
                        variant="middle"
                        style={{ marginTop: "20px", marginBottom: "40px" }}
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{ width: "33ch" }}
                            onClick={() => onRouteChange("signin")}
                        >
                            Sign In
                        </Button>
                    </div>
                </Box>
            </Box>
        );
    }
}
