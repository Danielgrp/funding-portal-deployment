
import React from 'react';

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-800 mb-6 text-center">About Us</h1>
      <div className="bg-white p-8 rounded-lg shadow-md prose lg:prose-xl mx-auto">
        <p>
          Welcome to the Research Funding Portal (GRP)! Our mission is to empower researchers by providing a centralized, 
          easy-to-use platform for discovering funding opportunities from around the globe.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Our Vision</h2>
        <p>
          We believe that groundbreaking research deserves accessible funding. GRP aims to bridge the gap between 
          researchers and funding organizations, fostering innovation and accelerating scientific discovery.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Key Features</h2>
        <ul>
          <li>Comprehensive database of grants, fellowships, and awards.</li>
          <li>Real-time updates from numerous funding sources.</li>
          <li>Powerful search and filtering tools to pinpoint relevant opportunities.</li>
          <li>User-friendly interface designed for researchers.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
        <p>
          Have questions or feedback? We'd love to hear from you! Please reach out to us at 
          <a href="mailto:contact@researchfundingportal.example.com">contact@researchfundingportal.example.com</a>.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
