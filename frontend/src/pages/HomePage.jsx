
import React, { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Globe, Building2, Search, CheckCircle, Zap } from 'lucide-react';

const StatCard = ({ icon, value, label, bgColor, iconColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
    <div className={`p-4 rounded-full mb-4 ${bgColor}`}>
      {React.cloneElement(icon, { className: `h-8 w-8 ${iconColor}` })}
    </div>
    <div className="text-3xl font-bold text-slate-700">{value}</div>
    <div className="text-slate-500 mt-1">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="flex justify-center mb-4">
        {React.cloneElement(icon, { className: "h-12 w-12 text-purple-600" })}
    </div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm">{description}</p>
  </div>
);

function HomePage() {
  const [stats, setStats] = useState({ active_opportunities: '...', total_funding: '...', countries: '...', funding_sources: '...' });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    getStatistics()
      .then(response => {
        const data = response.data;
        setStats({
          active_opportunities: data.active_opportunities,
          total_funding: data.total_funding >= 1000000 
            ? `$${(data.total_funding / 1000000).toFixed(1)}M` 
            : `$${(data.total_funding / 1000).toFixed(0)}K`,
          countries: data.countries,
          funding_sources: data.funding_sources
        });
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
        // Fallback for display
        setStats({ active_opportunities: '50+', total_funding: '$60M+', countries: '5+', funding_sources: '10+' });
      })
      .finally(() => setLoadingStats(false));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Discover Your Next
            <br />
            <span className="text-yellow-300">Research Funding Opportunity</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-purple-100 mb-10">
            Access a comprehensive, real-time database of grants, fellowships, and funding programs from leading organizations worldwide.
          </p>
          <Link
            to="/find-funding"
            className="inline-block bg-yellow-400 text-purple-700 font-semibold px-10 py-4 rounded-lg text-lg hover:bg-yellow-300 transition-colors shadow-md transform hover:scale-105"
          >
            Explore Funding Now
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Platform at a Glance</h2>
          {loadingStats ? (
            <div className='text-center text-slate-600'>Loading statistics...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard icon={<TrendingUp />} value={stats.active_opportunities} label="Active Opportunities" bgColor="bg-blue-100" iconColor="text-blue-600" />
              <StatCard icon={<DollarSign />} value={stats.total_funding} label="Total Funding Available" bgColor="bg-green-100" iconColor="text-green-600" />
              <StatCard icon={<Globe />} value={stats.countries} label="Countries Represented" bgColor="bg-purple-100" iconColor="text-purple-600" />
              <StatCard icon={<Building2 />} value={stats.funding_sources} label="Funding Organizations" bgColor="bg-orange-100" iconColor="text-orange-600" />
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Why Choose Our Portal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search />} 
              title="Comprehensive Search"
              description="Powerful filters to quickly find relevant opportunities by research area, funding amount, country, and more."
            />
            <FeatureCard 
              icon={<Zap />} 
              title="Real-Time Updates"
              description="Our database is continuously updated to ensure you have access to the latest funding announcements."
            />
            <FeatureCard 
              icon={<CheckCircle />} 
              title="Trusted Sources"
              description="We aggregate data from prestigious national and international funding bodies, ensuring reliability."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Funding?</h2>
          <p className="text-lg text-purple-100 mb-8">
            Stop searching across dozens of websites. Your next big research project could be a click away.
          </p>
          <Link
            to="/find-funding"
            className="inline-block bg-white text-purple-600 font-semibold px-10 py-4 rounded-lg text-lg hover:bg-slate-100 transition-colors shadow-md transform hover:scale-105"
          >
            Start Your Search
          </Link>
        </div>
      </section>
    </>
  );
}

export default HomePage;
