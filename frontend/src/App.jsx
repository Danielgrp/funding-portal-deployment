
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import FindFundingPage from './pages/FindFundingPage';
import AboutPage from './pages/AboutPage'; // Placeholder
import { Search as SearchIcon } from 'lucide-react';
import './App.css'; // For custom global styles

function Navigation() {
  const location = useLocation();
  const linkClass = (path) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path 
        ? 'bg-white/20 text-white' 
        : 'text-purple-100 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <nav className="bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2 text-white">
              <SearchIcon className="h-7 w-7" />
              <span className="font-bold text-xl">GRP</span>
            </Link>
            <span className='ml-2 text-purple-200 text-xs hidden md:block'>Research Funding Portal</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className={linkClass('/')}>Home</Link>
              <Link to="/find-funding" className={linkClass('/find-funding')}>Find Funding</Link>
              <Link to="/about" className={linkClass('/about')}>About</Link>
            </div>
          </div>
          <div className='md:hidden'>
             {/* Mobile menu button can be added here */}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/find-funding" element={<FindFundingPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const Footer = () => (
  <footer className="bg-slate-800 text-slate-300 py-8 text-center">
    <p>&copy; {new Date().getFullYear()} Research Funding Portal. All rights reserved.</p>
    <p className="text-sm">Powered by Your Name/Organization</p>
  </footer>
);

export default App;
