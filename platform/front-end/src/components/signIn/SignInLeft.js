//This component handles the image aside from the login/sign up form.
import myUniSocial from "../../assets/myUniSocial.png";

function SignInLeft() {
    return (
        <div
            style={{
                backgroundColor: "#292929",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <img
                alt=""
                src={myUniSocial}
                style={{ width: "30vw", marginBottom: "5px" }}
            />
        </div>
    );
}

export default SignInLeft;
