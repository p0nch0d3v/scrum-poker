import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { FunctionComponent } from "react";
import { loginUser } from "../../services/api.service";

type LoginProps = {
    afterLogin: any
};

const LoginComponent: FunctionComponent<LoginProps> = ({afterLogin}) => {
    return (
        <>
            <GoogleOAuthProvider clientId="">
                <GoogleLogin
                    useOneTap={true}
                    onSuccess={async (credentialResponse) => {
                        const userData = await loginUser(credentialResponse?.credential || '');
                        afterLogin(userData);
                    }}
                    onError={() => {
                        console.log("Login Failed");
                    }}
                />
            </GoogleOAuthProvider>
        </>
    );
}

export default LoginComponent;