import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { FunctionComponent } from "react";
import { Box, Button, Link, Typography } from "@mui/material";
import useSessionStorage from '../../hooks/useSessionStorage';

import { loginUser } from "../../services/api.service";
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
                        useOneTap={false}
                        type="standard"
                        ux_mode="popup"
                        onSuccess={async (credentialResponse) => {
                            const googleToken = credentialResponse?.credential
                            const isUserCreated = await loginUser( googleToken|| '');
                            if (isUserCreated === true) {
                                afterLogin(googleToken);
                            }
                        }}
                        onError={() => {
                            console.error("Login Failed");
                        }}
                    />
                </GoogleOAuthProvider>
            </Box>
            <Box display={"flex"} flexDirection={'column'} maxWidth={'33vw'}>
                <Typography sx={{ fontSize: '1.5em', textAlign: 'cemter', marginBottom: '0.5em' }}>With Email</Typography>
                <Button disabled sx={{ marginBottom: '0.5em' }} variant="contained">Login</Button>
                <Button disabled sx={{ marginBottom: '0.5em' }} variant="contained">Signup</Button>
            </Box>
            <Link target={'_blank'} href="/privacy-policy">Privacy Policy</Link>
        </Box>
    );
}

export default LoginComponent;
