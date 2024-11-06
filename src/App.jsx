import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MobileNavMenu from './components/MobileNavMenu';
import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import DefaultPageLayout from './components/DefaultPageLayout'

// import BudgetPage from './pages/BudgetPage'
import ContactPage from './pages/ContactPage'
import SecretSantaPage from './pages/SecretSantaPage'
import GiftList2024 from './pages/GiftList2024'
import ProjectsPage from './pages/ProjectsPage'
import HomePage from './pages/HomePage'
import BQEPage from './BQE/Pages/BQEPage'
import BQERandomQuizPage from './BQE/Pages/BQERandomQuizPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPage from './pages/PrivacyPage'
import ResumePage from './pages/ResumePage'
import TermsPage from './pages/TermsPage'
import DndQuests from './pages/DndQuests'
import PodcastPage from './pages/PodcastPage'
// import TokenExchangePage from './pages/TokenExchangePage';
import BibleReadingPage from './BQE/Pages/BibleReadingPage'
import BibleReadingManualPage from './BQE/Pages/BibleReadingManualPage'
import FirstPeterPericopePage from './BQE/Pages/FirstPeterPericopePage'

import { Helmet } from 'react-helmet';
import SecretSantaForm from './SecretSanta/SecretSantaForm';

export default function App() {
  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);

  const pages = [
    { target: '/resume', label: 'Resume', element: <ResumePage />, showInHeader: true, showInFooter: true },
    { target: '/contact', label: 'Contact', element: <ContactPage />, showInHeader: true, showInFooter: true },
    // { target: '/budget', label: 'Budget', element: <BudgetPage />, showInHeader: false, showInFooter: false },
    { target: '/BQE', label: 'BQE', element: <BQEPage />, showInHeader: true, showInFooter: true },
    { target: '/BQE/quiz', label: 'BQE', element: <BQERandomQuizPage />, showInHeader: false, showInFooter: false },
    { target: '/projects', label: 'Projects', element: <ProjectsPage />, showInHeader: true, showInFooter: true },
    { target: '/privacy', label: 'Privacy Policy', element: <PrivacyPage />, showInHeader: false, showInFooter: true },
    { target: '/terms', label: 'Terms of Service', element: <TermsPage />, showInHeader: false, showInFooter: true },
    { target: '/home', label: 'Home', element: <HomePage />, showInHeader: false, showInFooter: false },
    { target: '/podcast', label: 'Podcast', element: <PodcastPage />, showInHeader: false, showInFooter: false },
    // { target: '/santa', label: 'Secret Santa', element: <SecretSantaPage />, showInHeader: false, showInFooter: false },
    { target: '/santa', label: 'Christmas Lists', element: <GiftList2024 />, showInHeader: true, showInFooter: true },
    { target: '/quests', label: 'Quests', element: <DndQuests />, showInHeader: false, showInFooter: false },
    { target: '/peter', label: '1 Peter Pericopes', element: <FirstPeterPericopePage />, showInHeader: false, showInFooter: false },
    { target: '/biblereading', label: 'Bible Extended Reading', element: <BibleReadingPage />, showInHeader: false, showInFooter: true },
    { target: '/group3724', label: 'Group 3-7-2024', element: <BibleReadingManualPage />, showInHeader: false, showInFooter: true },
    { target: '/', label: 'Home', element: <HomePage />, showInHeader: false, showInFooter: false },
    { target: '*', label: 'Not Found', element: <NotFoundPage />, showInHeader: false, showInFooter: false },
  ]

  const morePages = [
    // { target: '/resume', label: 'Resume', element: <ResumePage />, showInHeader: true, showInFooter: true },
    // { target: '/contact', label: 'Contact', element: <ContactPage />, showInHeader: true, showInFooter: true },
    // { target: '/BQE', label: 'BQE', element: <BQERandomQuizPage />, showInHeader: true, showInFooter: true },
    // { target: '/projects', label: 'Projects', element: <ProjectsPage />, showInHeader: true, showInFooter: true },
    // { target: '/privacy', label: 'Privacy Policy', element: <PrivacyPage />, showInHeader: false, showInFooter: true },
    // { target: '/terms', label: 'Terms of Service', element: <TermsPage />, showInHeader: false, showInFooter: true },
    // { target: '/home', label: 'Home', element: <HomePage />, showInHeader: false, showInFooter: false },
  ]

    return (
    <div className="App">
    <Helmet>
        <meta name="description" content="branson smith, branson smith software engineer, branson smith's work, web developer, resume, home of BQE" />
        <link rel="canonical" href={`https://www.bransonsmith.dev/`} />
    </Helmet>

      <AppHeader pages={pages.filter(page => page.showInHeader)} morePages={morePages}/>
      <MobileNavMenu navItems={pages.filter(p => p.showInHeader)} morePages={morePages}/>
      
      <div className='app-body min-h-[80vh]'>
        <Router>
          <Routes>
            {/* <Route path="/login-api" element={<TokenExchangePage />} /> */}
            {pages.map((page) => {
              return <Route key={page.target} path={page.target} element={<DefaultPageLayout>{page.element}</DefaultPageLayout>} />
            })}
            {/* <Route path={'/budget'} element={<BudgetPage />}></Route> */}
            <Route path={'/santa/:name'} element={<SecretSantaForm />}></Route>
          </Routes>
        </Router>
      </div>

      <AppFooter pages={pages.filter(page => page.showInFooter)} />
    </div>
  );
}
