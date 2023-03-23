import { render, screen, fireEvent } from "@testing-library/react";
import SignInForm from "./SignInForm";

test("tests user login", () => {
    const onRouteChange = jest.fn();
    const onSubmitSignIn = jest.fn();

    let testEmail = "testuser@email.com";
    let testPassword = "test123";
    render(
        <SignInForm
            onSubmitSignIn={onSubmitSignIn}
            onRouteChange={onRouteChange}
        />
    );

    const emailField = screen.getByPlaceholderText("Email Address");
    const passwordField = screen.getByLabelText("Password");
    fireEvent.change(emailField, { target: { value: testEmail } });
    fireEvent.change(passwordField, { target: { value: testPassword } });
    fireEvent(
        screen.getByText("Sign In"),
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );
});
