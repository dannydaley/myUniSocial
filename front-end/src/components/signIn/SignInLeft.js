//This component handles the image aside from the login/sign up form.
import myUniSocial from "./../../../src/logo.png";
// import falUni from "../../assets/falLogo.png";
function SignInLeft() {
    return (
        <div
            style={{
                backgroundColor: "",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* <img alt="" src={falUni} style={{ width: "30vw" }} /> */}
            <img
                alt=""
                src={myUniSocial}
                style={{ width: "15vw", marginBottom: "5px" }}
            />
        </div>
    );
}

export default SignInLeft;
