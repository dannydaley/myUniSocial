import React from "react";
import QuestionCard from "./QuestionCard";
import NoQuestions from "./NoQuestions";

class QuestionFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feed: "Web",
            feedData: [],
            passedFirstLoad: false,
        };
    }
    feedData = "";
    //COMPONENT DID MOUNT IS BUILT IN AND RUNS WHEN THE COMPONENT MOUNTS
    componentDidMount = async () => {
        // this.setState({ settings: newSettings })
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + "/getQuestionFeed", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                feed: this.props.viewFeed,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            // .then(await this.delayFunction())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
            .then((data) => {
                this.setState({ feedData: data });
            });
    };

    key = 0;
    render() {
        return (
            <div style={{ padding: "20px", margin: "0 auto" }}>
                {this.state.feedData.length > 0 ? (
                    this.state.feedData.map((item) => (
                        <QuestionCard
                            key={this.key++}
                            userID={this.props.userID}
                            userData={this.props.userData}
                            readyQuestion={this.props.readyQuestion}
                            viewProfile={this.props.viewProfile}
                            changeRoute={this.props.changeRoute}
                            authorProfilePicture={item.authorProfilePicture}
                            poster={item.author}
                            authorID={item.authorID}
                            title={item.title}
                            question={item.text}
                            code={item.code}
                            postID={item.postID}
                            language={item.language}
                            number={item.score}
                            replies={0}
                        />
                    ))
                ) : (
                    <NoQuestions />
                )}
            </div>
        );
    }
}

export default QuestionFeed;
