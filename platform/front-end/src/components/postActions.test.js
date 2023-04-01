import { render, screen, fireEvent } from "@testing-library/react";
import PostActions from "./postActions";

test("testing post action", () => {
    const dislikeAction = jest.fn();
    render(<PostActions dislikeAction={dislikeAction} />);

    const dislikeButton = screen.getByTestId("thumb-down-button");

    // trigger click account button event
    fireEvent(
        dislikeButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );
});
