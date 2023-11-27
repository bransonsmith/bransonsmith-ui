import { useAuth0 } from "@auth0/auth0-react";
import { useState } from 'react';

export function UserNav() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [hover, setHover] = useState(false);

  return <div className="flex flex-row h-7">
    { isAuthenticated
    ? <div className="flex flex-row h-6 w-full mb-1">
      <span className="px-1">{user.name}</span>
      <button className="cursor-pointer h-full py-0 px-2 text-center hover:bg-contentBg ml-auto bg-inherit"
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Sign Out
      </button>
    </div>
    : <LoginButton />
    }
  </div>

}

export function LoginButton() {
    const { loginWithRedirect } = useAuth0();

    return <button className="cursor-pointer h-full py-0 px-2 text-center hover:bg-contentBg ml-auto bg-inherit"
      onClick={() => loginWithRedirect()}>
        Sign In/Up
    </button>;
}

export function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
}