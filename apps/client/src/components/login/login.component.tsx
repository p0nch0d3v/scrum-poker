import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { FunctionComponent } from "react";
import { loginUser } from "../../services/api.service";

import { Box, Button, Typography } from "@mui/material";
import Config from "../../config/config";

type LoginProps = {
    clientId: string,
    afterLogin: any
};

const LoginComponent: FunctionComponent<LoginProps> = ({ clientId, afterLogin }) => {
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'space-evenly'}
            height={'100vh'}>
            <Typography sx={{ fontSize: '2.5em' }}>
                {Config.ApplicationTitle}
            </Typography>
            <Box maxWidth={'33vw'}>
                <GoogleOAuthProvider clientId={clientId}>
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
            </Box>
            <Box display={"flex"} flexDirection={'column'} maxWidth={'33vw'}>
                <Typography sx={{ fontSize: '1.5em', textAlign: 'cemter', marginBottom: '0.5em' }}>With Email</Typography>
                <Button disabled sx={{ marginBottom: '0.5em' }} variant="contained">Login</Button>
                <Button disabled sx={{ marginBottom: '0.5em' }} variant="contained">Signup</Button>
            </Box>
        </Box>
    );
}

export default LoginComponent;
