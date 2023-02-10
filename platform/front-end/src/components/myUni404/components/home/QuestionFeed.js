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

    // calls when component mounts
    componentDidMount = async () => {
        // get the question feed from the server
        fetch(process.env.REACT_APP_SERVER + "/feeds/getQuestionFeed", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                feed: this.props.viewFeed,
            }),
        })
            // turn reponse into a JSON object
            .then((response) => response.json())
            // apply response data to state
            .then((data) => {
                this.setState({ feedData: data });
            });
    };

    // create key variable to increment and apply to every post/ question
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
