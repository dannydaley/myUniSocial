import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeBlock = ({ codeString }) => {
    return (
        <SyntaxHighlighter
            language="javascript"
            style={a11yDark}
            showLineNumbers="true"
            wrapLongLines="true"
        >
            {codeString}
        </SyntaxHighlighter>
    );
};

export default CodeBlock;
