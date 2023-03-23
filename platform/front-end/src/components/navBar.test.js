import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import NavBar from "./navBar";

test("testing navigation to users profile", () => {
    render(
        <Router>
            <NavBar />
        </Router>
    );

    const messagesButton = screen.getByTestId("messagesButton");

    // trigger click messages button event
    fireEvent(
        messagesButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    // one second timer to give the next component time to render
    setTimeout(() => "1000");

    const goToMessagesButton = screen.getByTestId("goToMessages");
    // trigger click go to messages button event
    fireEvent(
        goToMessagesButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/messages"); // Expect to navigate to myProfile
});
