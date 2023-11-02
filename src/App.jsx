import React, { useEffect, useState } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import awsConfig from './aws-exports';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import DndForm from './components/DndForm'
import MobileNavMenu from './components/MobileNavMenu';
import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import DefaultPageLayout from './components/DefaultPageLayout'

import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPage from './pages/PrivacyPage'
import ResumePage from './pages/ResumePage'
import TermsPage from './pages/TermsPage'

Amplify.configure(awsConfig);

export default function App() {
  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);

  useEffect(() => {

    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setUser(data); break;
        case "signOut":
          setUser(null); break;
        case "customOAuthState": setCustomState(data); break;
      }
    });

    Auth.currentAuthenticatedUser()
      .then(currentUser => { setUser(currentUser); 
        console.log("user", user) })
      .catch(() => console.log("Not signed in"));

    return unsubscribe;
  }, []);

  const pages = [
    { target: '/resume', label: 'Resume', element: <ResumePage />, showInHeader: true, showInFooter: true },
    { target: '/contact', label: 'Contact', element: <ContactPage />, showInHeader: true, showInFooter: true },
    { target: '/privacy', label: 'Privacy Policy', element: <PrivacyPage />, showInHeader: false, showInFooter: true },
    { target: '/terms', label: 'Terms of Service', element: <TermsPage />, showInHeader: false, showInFooter: true },
    { target: '/home', label: 'Home', element: <HomePage />, showInHeader: false, showInFooter: false },
    { target: '/', label: 'Home', element: <HomePage />, showInHeader: false, showInFooter: false },
    { target: '*', label: 'Not Found', element: <NotFoundPage />, showInHeader: false, showInFooter: false },
  ]

    return (
    <div className="App">

      <AppHeader pages={pages.filter(page => page.showInHeader)} />
      <MobileNavMenu navItems={pages.filter(p => p.showInHeader)}/>
      
      <div className='app-body min-h-[80vh]'>
        <Router>
          <Routes>
          {pages.map((page) => {
            return <Route key={page.target} path={page.target} element={<DefaultPageLayout>{page.element}</DefaultPageLayout>} />
          })}
          </Routes>
        </Router>
      </div>

      <AppFooter pages={pages.filter(page => page.showInFooter)} />
    </div>
  );
}
