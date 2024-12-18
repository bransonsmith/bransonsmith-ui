
import { useEffect, useState } from 'react';
import { exchangeCodeForToken, getUserInfo } from '../Services/ApiService';
import Loading from '../Components/Loading';

export default function TokenExchangePage() {

    const [authCode, setAuthCode] = useState(null);
    const [localUserInfo, setLocalUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const tryToGetAccessToken = async (code) => {
        const response = await exchangeCodeForToken(code);
        if (response.status === 200) {
          setLoading(false);
        } else {
            console.error('Error exchanging code for token: ', response);
            setLoading(false);
        }
        while(loading) {}
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
      }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) { setAuthCode(code); }

         if (code) {
            setLoading(true);
            tryToGetAccessToken(code);
        }

      }, []);

    return (
        <div>
            {loading && <div>Loading...</div>}
            <Loading />
        </div>
    );
};
