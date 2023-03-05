import React from "react";
import TextField from "@mui/material/TextField";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/system";
import { switchUnstyledClasses } from "@mui/base/SwitchUnstyled";
import axios from "axios";

export default class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            author: this.props.loggedInUsername,
            imagesArray: [],
            link: "",
            postContent: "",
            postStrict: false,
            recipient: this.props.recipient,
        };
        this.onImageUploadChange = this.onImageUploadChange.bind(this);
        this.onPostSubmit = this.onPostSubmit.bind(this);
    }

    blue = {
        500: "#007FFF",
    };
    grey = {
        400: "#BFC7CF",
        500: "#AAB4BE",
        600: "#6F7E8C",
    };

    Root = styled("span")(
        ({ theme }) => `
    font-size: 0;
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    margin: 10px;
    cursor: pointer;      
    &.${switchUnstyledClasses.disabled} {
      opacity: 0.4;
      cursor: not-allowed;
    }      
    & .${switchUnstyledClasses.track} {
      background: ${
          theme.palette.mode === "dark" ? this.grey[600] : this.grey[400]
      };
      border-radius: 10px;
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
    }      
    & .${switchUnstyledClasses.thumb} {
      display: block;
      width: 14px;
      height: 14px;
      top: 3px;
      left: 3px;
      border-radius: 16px;
      background-color: #fff;
      position: relative;
      transition: all 200ms ease;
    }      
    &.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb} {
      background-color: ${this.grey[500]};
      box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
    }      
    &.${switchUnstyledClasses.checked} {
      .${switchUnstyledClasses.thumb} {
        left: 22px;
        top: 3px;
        background-color: #fff;
      }      
      .${switchUnstyledClasses.track} {
        background: ${this.blue[500]};
      }
    }      
    & .${switchUnstyledClasses.input} {
      cursor: inherit;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 1;
      margin: 0;
    }
    `
    );
    label = { componentsProps: { input: { "aria-label": "Demo switch" } } };

    delay = (ms) => new Promise((res) => setTimeout(res, ms));

    delayFunction = async () => {
        await this.delay(1000);
    };
    onStrictChange = async () => {
        this.setState({ postStrict: !this.state.postStrict });
        await this.delayFunction(2000);
    };
    onContentChange = (event) => {
        this.setState({ postContent: event.target.value });
    };
    onImageUploadChange = (event) => {
        this.setState({
            imagesArray: [...this.state.imagesArray, ...event.target.files],
        });
    };

    onPostSubmit = async () => {
        if (this.state.postContent.length < 5) {
            return;
        }
        let formData = new FormData();
        for (const key of Object.keys(this.state.imagesArray)) {
            formData.append("imagesArray", this.state.imagesArray[key]);
        }
        let recipient = this.props.recipient;
        if (this.props.recipient === undefined) {
            recipient = "none";
        }
        document.getElementById("filled-textarea").value = "";
        formData.append("username", this.props.loggedInUsername);
        formData.append("postContent", this.state.postContent);
        formData.append("postStrict", this.state.postStrict);
        formData.append("recipient", recipient);
        formData.append("circle", this.props.circle);
        await axios
            .post(process.env.REACT_APP_SERVER + "/posts/newPost", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                body: JSON.stringify({
                    relativePostId: 0,
                    username: this.props.loggedInUsername,
                    postData: this.state,
                    circle: this.props.circle,
                }),
            })
            .then((data) => {
                if (data.data.data === "success") {
                    this.props.changeCircle(this.props.circle);
                }
            });
    };

    render() {
        return (
            <div
                style={{
                    marginTop: "20px",
                    backgroundColor: "#292929",
                    padding: "20px",
                    borderRadius: "10px",
                }}
            >
                <label htmlFor="file-input">
                    <ImageIcon
                        fontSize="large"
                        sx={{ mt: 2, fontSize: 35, color: "white", mr: 2 }}
                    />
                </label>
                <input
                    id="file-input"
                    type="file"
                    name="file"
                    onChange={this.onImageUploadChange.bind(this)}
                    multiple
                    hidden
                />
                <TextField
                    style={{
                        backgroundColor: "white",
                        opacity: "0.5",
                        borderRadius: "5px",
                        width: "50%",
                        padding: 0,
                    }}
                    sx={{ mt: 2, mr: 2, p: 0 }}
                    size="small"
                    id="filled-textarea"
                    label="New Post"
                    placeholder="I've got something to say!"
                    multiline
                    onChange={this.onContentChange}
                />
                <LoadingButton
                    onClick={() => this.onPostSubmit()}
                    endIcon={<SendIcon />}
                    loadingPosition="end"
                    variant="contained"
                    size="small"
                    sx={{
                        backgroundColor: "#f5c732",
                        mb: 3,
                    }}
                >
                    Post
                </LoadingButton>
            </div>
        );
    }
}
