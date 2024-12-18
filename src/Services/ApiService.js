export const makeRequestToApi = async (urlPath, method, body) => {

    const url = import.meta.env.VITE_APP_API + '/' + urlPath;

    const fetchOptions = {
        method: method,
        headers: {  'Content-Type': 'application/json' },
        credentials: 'include'
    }
    if (body && method !== 'GET' && method !== 'DELETE') {
        fetchOptions.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(url, fetchOptions);

        if (response.status >= 200 && response.status<= 299) {
            const data = await response.json();
    
            return {
                status: response.status,
                data: data
            }
        }

        try {
            const errorData = await response.json();
            return {
                status: response.status,
                data: errorData
            }
        } catch (error) {
            return {
                status: response.status,
                data: null
            }
        }
    }
    catch (e) {
        console.error('Error making request to API: ', e);
        return {
            status: 500,
            data: null
        }
    }
}

export const getUserInfo = async () => {
    return await makeRequestToApi('Account/GetUserInfo', 'GET', null);
}

export const exchangeCodeForToken = async (code) => {
    return await makeRequestToApi(
        'Account/ExchangeCode', 'POST',
        { 'code': code, 'redirectUri': import.meta.env.VITE_APP_IDP_REDIRECT_URI }
    );
}

