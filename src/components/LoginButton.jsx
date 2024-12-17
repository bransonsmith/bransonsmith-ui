

export default function LoginButton() {

    const SendUserToIdp = () => {
        const idpAuthority = import.meta.env.VITE_APP_IDP_AUTHORITY || '';
        const clientId = import.meta.env.VITE_APP_IDP_CLIENT_ID || '';
        const redirectUri = import.meta.env.VITE_APP_IDP_REDIRECT_URI || '';
        const audience = import.meta.env.VITE_APP_IDP_AUDIENCE || '';
    

        const state = [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
        const authUrl = `${idpAuthority}/authorize?response_type=code` +
                        `&client_id=${encodeURIComponent(clientId)}` +
                        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                        `&state=${encodeURIComponent(state)}` +
                        `&audience=${encodeURIComponent(audience)}` +
                        `&scope=openid%20profile%20email`;
    
        // console.log(authUrl)
        window.location.href = authUrl;
    }

    return (
        <div style={{cursor: 'pointer'}}
            onClick={SendUserToIdp}>
            Login
        </div>
    );
}

// https://dev-m114vg22ow28sldo.us.auth0.com/authorize
// ?response_type=code
// &client_id=ZWOcWyhWh0pMkIBUVv9cfBqvghcbGtOi
// &redirect_uri=https%3A%2F%2Flocalhost%3A5173%2Flogin-api
// &state=p2h8gut67wajfi4oh568r2est1lvfy
// &audience=https%3A%2F%2Flocalhost%3A7227%2F
// &scope=openid%20profile%20email

// https://dev-m114vg22ow28sldo.us.auth0.com/authorize
// ?response_type=code
// &client_id=
// &redirect_uri=https%3A%2F%2Flocalhost%3A5173%2Flogin-api
// &state=us0f2sxa3wlx1x5s5a7g70nekr3z47
// &audience=https%3A%2F%2Flocalhost%3A7227%2F
// &scope=openid%20profile%20email