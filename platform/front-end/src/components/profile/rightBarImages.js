import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CircularProgress from "@mui/material/CircularProgress";

export default class RightBarImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagesAreLoaded: false,
            loggedInUsername: this.props.loggedInUsername,
            showingImage: false,
        };
    }

    srcset(image, size, rows = 1, cols = 1) {
        return {
            src: `${image}?w=${size * cols}&h=${
                size * rows
            }&fit=crop&auto=format`,
            srcSet: `${image}?w=${size * cols}&h=${
                size * rows
            }&fit=crop&auto=format&dpr=2 2x`,
        };
    }

    images = [];

    formatPictures = (imageData) => {
        let counter = 2;
        imageData.forEach((element) => {
            if (element.imageLocation) {
                if (counter === 2) {
                    this.images.push({
                        img:
                            process.env.REACT_APP_SERVER +
                            "/public/" +
                            element.imageLocation,
                        rows: 2,
                        cols: 4,
                    });
                    counter = 0;
                } else {
                    this.images.push({
                        img:
                            process.env.REACT_APP_SERVER +
                            "/public/" +
                            element.imageLocation,
                        rows: 1,
                        cols: 2,
                    });
                    counter++;
                }
            }
        });
    };

    componentDidMount = () => {
        fetch(process.env.REACT_APP_SERVER + "/profile/getAllImagesByUser", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.userProfileToGet,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            .then((data) => {
                this.formatPictures(data);
                this.setState({ imagesAreLoaded: true });
            });
    };

    showImage = () => {
        this.setState({ showImage: true });
    };

    render() {
        const { imagesAreLoaded } = this.state;
        if (!imagesAreLoaded) {
            return (
                <ImageList
                    sx={{
                        width: 260,
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    variant="quilted"
                    cols={1}
                    rowHeight={121}
                >
                    <CircularProgress />
                </ImageList>
            );
        } else {
            return (
                <>
                    <ImageList
                        sx={{ width: 260, height: "100%", pb: 3 }}
                        variant="quilted"
                        cols={4}
                        rowHeight={121}
                    >
                        {this.images.length > 0
                            ? this.images.map((item) => (
                                  <ImageListItem
                                      key={item.img}
                                      cols={item.cols || 1}
                                      rows={item.rows || 1}
                                  >
                                      <img
                                          {...this.srcset(
                                              item.img,
                                              1,
                                              item.rows,
                                              item.cols
                                          )}
                                          alt={item.title}
                                          loading="lazy"
                                          onClick={() => this.showImage()}
                                      />
                                  </ImageListItem>
                              ))
                            : ""}
                    </ImageList>
                </>
            );
        }
    }
}
