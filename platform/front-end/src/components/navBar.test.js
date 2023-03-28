import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import NavBar from "./navBar";

test("testing nav bar messages", () => {
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

    expect(window.location.pathname).toBe("/messages"); // Expect to navigate to messages
});

test("testing nav bar my feed", () => {
    render(
        <Router>
            <NavBar />
        </Router>
    );

    const accountButton = screen.getByTestId("accountButton");

    // trigger click account button event
    fireEvent(
        accountButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    // one second timer to give the next component time to render
    setTimeout(() => "1000");

    const goToMyFeed = screen.getByTestId("goToMyFeed");
    // trigger click go to my feed button event
    fireEvent(
        goToMyFeed,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/"); // Expect to navigate to my feed
});

test("testing nav bar my profile", () => {
    render(
        <Router>
            <NavBar />
        </Router>
    );

    const accountButton = screen.getByTestId("accountButton");

    // trigger click account button event
    fireEvent(
        accountButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    // one second timer to give the next component time to render
    setTimeout(() => "1000");

    const goToMyProfile = screen.getByTestId("goToMyProfile");
    // trigger click go to my profile button event
    fireEvent(
        goToMyProfile,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(window.location.pathname).toBe("/myProfile"); // Expect to navigate to myProfile
});

test("testing nav bar signout", () => {
    const onRouteChange = jest.fn();
    render(
        <Router>
            <NavBar onRouteChange={onRouteChange} />
        </Router>
    );

    const accountButton = screen.getByTestId("accountButton");

    // trigger click account button event
    fireEvent(
        accountButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    // one second timer to give the next component time to render
    setTimeout(() => "1000");

    const signout = screen.getByTestId("signOut");
    // trigger click go to sign out button event
    fireEvent(
        signout,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(onRouteChange).toBeCalledWith("signout"); // Expect to navigate to sign out
});

test("testing nav bar signout and delete", () => {
    const onRouteChange = jest.fn();
    render(
        <Router>
            <NavBar onRouteChange={onRouteChange} />
        </Router>
    );

    const accountButton = screen.getByTestId("accountButton");

    // trigger click account button event
    fireEvent(
        accountButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    // one second timer to give the next component time to render
    setTimeout(() => "1000");

    const signoutAndDelete = screen.getByTestId("signOutAndDelete");
    // trigger click go to sign out and delete button event
    fireEvent(
        signoutAndDelete,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    expect(onRouteChange).toBeCalledWith("signoutAndDelete"); // Expect to navigate to sign out and delete
});
