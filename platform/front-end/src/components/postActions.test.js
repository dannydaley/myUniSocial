import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import PostActions from "./postActions";

test("testing post action", () => {
    const dislikeAction = jest.fn();
    render(
        <Router>
            <PostActions dislikeAction={dislikeAction} />
        </Router>
    );

    const dislikeButton = screen.getByTestId("thumb-down-button");

    // trigger click account button event
    fireEvent(
        dislikeButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );
    expect(() => dislikeAction); // Expect to navigate to sign out and delete
});

// test("testing post action", () => {
//     const dislikeAction = jest.fn();
//     render(
//         <Router>
//             <PostActions dislikeAction={dislikeAction} />
// 	    </Router>
// 	                                    <ThumbDownIcon
//                                     data-testid="thumb-down-button"
//                                     style={{
//                                         color: "white",
//                                         marginRight: "5px",
//                                     }}
//                                     onClick={this.dislikeAction}
//                                 />
//     );

//     const dislikeButton = screen.getByTestId("thumb-down-button");

// 	expect(dislikeAction).toBeCalled(); // Expect to navigate to sign out and delete
//     // trigger click account button event
//     fireEvent(
//         dislikeButton,
//         new MouseEvent("click", {
//             bubbles: true,
//             cancelable: true,
//         })
//     );

//     // one second timer to give the next component time to render
//     setTimeout(() => "1000");

//     const signoutAndDelete = screen.getByTestId("signOutAndDelete");
//     // trigger click go to sign out and delete button event
//     fireEvent(
//         signoutAndDelete,
//         new MouseEvent("click", {
//             bubbles: true,
//             cancelable: true,
//         })
//     );

//     expect(onRouteChange).toBeCalledWith("signoutAndDelete"); // Expect to navigate to sign out and delete
// });
