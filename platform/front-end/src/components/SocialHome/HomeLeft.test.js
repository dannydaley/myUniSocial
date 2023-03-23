import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import HomeLeft from "./HomeLeft";

test("testing navigation to users profile", () => {
    render(
        <Router>
            <HomeLeft />
        </Router>
    );

    const profilePicture = screen.getByTestId("myProfile");

    // trigger click profile picture event
    fireEvent(
        profilePicture,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/myProfile"); // Expect to navigate to myProfile
});

test("testing 'myUni404' Navigation", () => {
    render(
        <Router>
            <HomeLeft />
        </Router>
    );

    const myUniSocialButton = screen.getByTestId("myUni404Link");

    // trigger myUni404 button click event
    fireEvent(
        myUniSocialButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/myuni404/feed/Web"); // Expect to navigate to myProfile
});
