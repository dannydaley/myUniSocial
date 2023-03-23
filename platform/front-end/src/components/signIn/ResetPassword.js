import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import myUniSocial from "../../assets/myUniSocial.png";
// import falUni from "../../assets/falLogo.png";
import { Typography } from "@mui/material";

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            status: "",
        };
    }

    // calls when email input field is changed and assigns value to state
    onEmailChange = (event) => {
        this.setState({ email: event.target.value });
    };

    // calls when user submits sign in form
    onSubmit = () => {
        // send login input data to server
        fetch(process.env.REACT_APP_SERVER + "/account/resetPassword", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: this.state.email,
            }),
        })
            // turn response into JSON object
            .then((response) => response.json())
            // if response returns success, apply user data to session updater
            .then((data) => {
                this.setState({ status: data.status });
            });
    };

    render() {
        const { onRouteChange } = this.props;
        if (this.state.status === "success") {
            return (
                <div
                    style={{
                        width: "30%",
                        padding: "10ch",
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
                        {/* <img alt="" src={falUni} style={{ width: "20vw" }} /> */}
                        <img
                            alt=""
                            src={myUniSocial}
                            style={{ width: "250px", marginBottom: "5px" }}
                        />
                    </Box>
                    <Box
                        component="form"
                        sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}
                        noValidate
                        autoComplete="off"
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    width: "275px",
                                    textAlign: "justify",
                                    color: "gray",
                                }}
                            >
                                An email with your temporary email has been
                                sent! If you don't receive it in 5 mins, email:
                                "noreply.myunisocial@gmail.com" and we'll rest
                                it manually.
                            </Typography>
                            <TextField
                                required
                                id="outlined-required"
                                type="email"
                                label="Email Address"
                                placeholder="Email Address"
                                onChange={this.onEmailChange}
                            />

                            <Button
                                variant="contained"
                                sx={{ width: "33ch", marginTop: "20px" }}
                                onClick={() => this.onSubmit()}
                            >
                                Reset Password
                            </Button>
                        </div>
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
                </div>
            );
        } else if (this.state.status === "not found") {
            return (
                <div
                    style={{
                        width: "30%",
                        padding: "10ch",
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
                        {/* <img alt="" src={falUni} style={{ width: "20vw" }} /> */}
                        <img
                            alt=""
                            src={myUniSocial}
                            style={{ width: "250px", marginBottom: "5px" }}
                        />
                    </Box>
                    <Box
                        component="form"
                        sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}
                        noValidate
                        autoComplete="off"
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    width: "275px",
                                    textAlign: "justify",
                                    color: "gray",
                                }}
                            >
                                We didn't find and an account with that email
                            </Typography>
                            <TextField
                                required
                                id="outlined-required"
                                type="email"
                                label="Email Address"
                                placeholder="Email Address"
                                onChange={this.onEmailChange}
                            />

                            <Button
                                variant="contained"
                                sx={{ width: "33ch", marginTop: "20px" }}
                                onClick={() => this.onSubmit()}
                            >
                                Reset Password
                            </Button>
                        </div>
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
                </div>
            );
        } else {
            return (
                <div
                    style={{
                        width: "30%",
                        padding: "10ch",
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
                        {/* <img alt="" src={falUni} style={{ width: "20vw" }} /> */}
                        <img
                            alt=""
                            src={myUniSocial}
                            style={{ width: "250px", marginBottom: "5px" }}
                        />
                    </Box>
                    <Box
                        component="form"
                        sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}
                        noValidate
                        autoComplete="off"
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            //         onSubmit={() => this.onSubmitSignIn()}
                        >
                            <Typography
                                sx={{
                                    width: "275px",
                                    textAlign: "justify",
                                    color: "gray",
                                }}
                            >
                                Enter the email address linked to your account
                                and we'll send you a temporary password.
                            </Typography>
                            <TextField
                                required
                                id="outlined-required"
                                type="email"
                                label="Email Address"
                                placeholder="Email Address"
                                onChange={this.onEmailChange}
                            />

                            <Button
                                variant="contained"
                                sx={{ width: "33ch", marginTop: "20px" }}
                                onClick={() => this.onSubmit()}
                            >
                                Reset Password
                            </Button>
                        </div>
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
                </div>
            );
        }
    }
}

export default ResetPassword;
