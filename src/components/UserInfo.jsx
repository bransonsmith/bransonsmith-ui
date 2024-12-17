import { useEffect, useState } from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Loading from './Loading';
import { makeRequestToApi } from '../Services/ApiService';

export default function UserInfo() {

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const tryToGetUserInfo = async () => {
        const response = await makeRequestToApi('Account/GetUserInfo', 'GET', null);
        if (response.status === 200) {
            setUserInfo(response.data);
            const userInfoJson = JSON.stringify(response.data);
            localStorage.setItem('user_info', userInfoJson);
            setLoading(false);
        } else {
            setUserInfo(null)
            localStorage.setItem('user_info', null);
            setLoading(false);
        }
    }

    useEffect(() => {
        tryToGetUserInfo()
    }, []);

    return (
        <div>
            { loading
            ? <Loading />
            : <div>
                { userInfo
                ? <div>{userInfo && userInfo.userName && <>{userInfo.userName} <LogoutButton/></>}</div>
                : <LoginButton />
                }
            </div>
            }
        </div>
    );
}