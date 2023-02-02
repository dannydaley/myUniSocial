import "./CodeEditor.css";
import React from "react";

class CodeEditor extends React.Component {
    constructor() {
        super();
        this.state = {
            color: "white",
        };
    }

    render() {
        return (
            <textarea
                placeholder="Adding code will improve your chances for an accurate answer"
                spellcheck="false"
                className="codeEditor"
                style={{
                    width: "90%",
                    minHeight: "200px",
                    color: this.state.color,
                }}
                onKeyDown={(event) => {
                    if (event.key === "Tab" && !event.shiftKey) {
                        event.preventDefault();
                        event.target.value += "    ";
                    }
                }}
                onChange={this.props.onCodeChange}
            />
        );
    }
}

export default CodeEditor;
