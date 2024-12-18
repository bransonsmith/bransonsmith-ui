import { useState } from 'react';
import { makeRequestToApi } from '../Services/ApiService';

export default function LogoutButton() {
    const logout = async () => {
        const response = await makeRequestToApi('Account/Logout', 'POST', null);
        localStorage.setItem('user_info', null);
        window.location.href = '/';
    }
    
    return (
        <div style={{cursor: 'pointer'}}
            onClick={logout}>
            Logout
        </div>
    );
}
