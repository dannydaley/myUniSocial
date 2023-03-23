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

test("testing 'Ask Question' Navigation", () => {
    render(
        <Router>
            <HomeLeft />
        </Router>
    );

    const askButton = screen.getByTestId("Ask");

    // trigger click ask question feed button  event
    fireEvent(
        askButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/ask-question"); // Expect to navigate to myProfile
});

test("testing 'Web' Navigation", () => {
    render(
        <Router>
            <HomeLeft />
        </Router>
    );

    const webButton = screen.getByTestId("Web");

    // trigger click web feed button  event
    fireEvent(
        webButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/myuni404/feed/Web"); // Expect to navigate to myProfile
});

test("testing 'Game Dev' Navigation", () => {
    render(
        <Router>
            <HomeLeft />
        </Router>
    );

    const gamDevButton = screen.getByTestId("GamDev");

    // trigger click game dev feed button event
    fireEvent(
        gamDevButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/myuni404/feed/GamDev"); // Expect to navigate to myProfile
});

test("testing 'SysOs' Navigation", () => {
    render(
        <Router>
            <HomeLeft />
        </Router>
    );

    const sysOsButton = screen.getByTestId("SysOs");

    // trigger SysOs feed button  event
    fireEvent(
        sysOsButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/myuni404/feed/SysOs"); // Expect to navigate to myProfile
});

test("testing 'Robotics' Navigation", () => {
    render(
        <Router>
            <HomeLeft />
        </Router>
    );

    const roboticsButton = screen.getByTestId("Robotics");

    // trigger robotics feed button event
    fireEvent(
        roboticsButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/myuni404/feed/Robotics"); // Expect to navigate to myProfile
});

test("testing 'myUniSocial' Navigation", () => {
    render(
        <Router>
            <HomeLeft />
        </Router>
    );

    const myUniSocialButton = screen.getByTestId("myUniSocialLink");

    // trigger myUniSocial button click event
    fireEvent(
        myUniSocialButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/"); // Expect to navigate to myProfile
});
