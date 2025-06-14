
import React, { useState, useEffect, useCallback } from 'react';
import { getOpportunities, getFilterOptions } from '../services/api';
import { Search, ExternalLink, FilterX, ChevronDown, ChevronUp, Tag as TagIcon, CalendarDays, MapPin, Building, DollarSignIcon } from 'lucide-react';

const OpportunityCard = ({ opp }) => {
  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    return amount >= 1000000 ? `$${(amount / 1000000).toFixed(1)}M` : `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-purple-700 mb-1 sm:mb-0 flex-1 pr-2">{opp.title}</h3>
        <span className="text-2xl font-bold text-green-600 whitespace-nowrap">
          {formatAmount(opp.amount_max || opp.amount_min)}
        </span>
      </div>
      <div className="text-sm text-slate-600 mb-3 space-y-1">
        <p className='flex items-center'><Building className='h-4 w-4 mr-2 text-slate-500' /> {opp.organization}</p>
        <p className='flex items-center'><MapPin className='h-4 w-4 mr-2 text-slate-500' /> {opp.country} {opp.research_area && `• ${opp.research_area}`}</p>
        {opp.deadline && <p className='flex items-center'><CalendarDays className='h-4 w-4 mr-2 text-slate-500' /> Deadline: {new Date(opp.deadline).toLocaleDateString()}</p>}
      </div>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-3">{opp.description}</p>
      {opp.tags && opp.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {opp.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium flex items-center">
              <TagIcon className='h-3 w-3 mr-1'/> {tag}
            </span>
          ))}
        </div>
      )}
      <a 
        href={opp.application_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
      >
        Apply Now <ExternalLink className="ml-2 h-4 w-4" />
      </a>
    </div>
  );
};

const AccordionFilter = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-slate-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-left font-semibold text-slate-700 hover:text-purple-600"
      >
        {title}
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && <div className="mt-3 space-y-2 pr-1 max-h-60 overflow-y-auto">{children}</div>}
    </div>
  );
};

function FindFundingPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ countries: [], organizations: [], research_areas: [], tags: [] });
  const [selectedFilters, setSelectedFilters] = useState({
    country: '',
    organization: '',
    research_area: '',
    tags: [],
    amount_range: '' // e.g., '0-100k', '100k-500k', '500k-1m', '1m+'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOpportunities, setTotalOpportunities] = useState(0);

  const fetchOpps = useCallback(() => {
    setLoading(true);
    const params = {
      page: currentPage,
      per_page: 10, // Or make this configurable
      keyword: searchTerm,
      country: selectedFilters.country,
      organization: selectedFilters.organization,
      research_area: selectedFilters.research_area,
      tags: selectedFilters.tags.join(','),
    };
    if (selectedFilters.amount_range) {
        const [min, max] = selectedFilters.amount_range.split('-');
        if (min) params.min_amount = parseInt(min.replace('k','000').replace('m','000000'));
        if (max && max !== '+') params.max_amount = parseInt(max.replace('k','000').replace('m','000000'));
        else if (max === '+') params.min_amount = parseInt(min.replace('k','000').replace('m','000000')); // For 1m+
    }

    getOpportunities(params)
      .then(response => {
        setOpportunities(response.data.opportunities || []);
        setTotalPages(response.data.pages || 1);
        setTotalOpportunities(response.data.total || 0);
      })
      .catch(error => console.error('Error fetching opportunities:', error))
      .finally(() => setLoading(false));
  }, [currentPage, searchTerm, selectedFilters]);

  useEffect(() => {
    fetchOpps();
  }, [fetchOpps]);

  useEffect(() => {
    getFilterOptions()
      .then(response => setFilters(response.data))
      .catch(error => console.error('Error fetching filter options:', error));
  }, []);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleTagChange = (tag, checked) => {
    setSelectedFilters(prev => ({
        ...prev,
        tags: checked ? [...prev.tags, tag] : prev.tags.filter(t => t !== tag)
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedFilters({ country: '', organization: '', research_area: '', tags: [], amount_range: '' });
    setCurrentPage(1);
  };

  const fundingAmountRanges = [
    { label: 'Any Amount', value: '' },
    { label: 'Under $100K', value: '0-100k' },
    { label: '$100K - $500K', value: '100k-500k' },
    { label: '$500K - $1M', value: '500k-1m' },
    { label: 'Over $1M', value: '1m-+' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-1/4 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Filter Opportunities</h2>
            <div className="relative mb-4">
              <Input 
                type="text" 
                placeholder="Search by keyword..." 
                value={searchTerm} 
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>

            <AccordionFilter title="Country">
              {filters.countries.map(country => (
                <CheckboxItem key={country} label={country} value={country} checked={selectedFilters.country === country} onChange={() => handleFilterChange('country', selectedFilters.country === country ? '' : country)} type="radio" name="country" />
              ))}
            </AccordionFilter>

            <AccordionFilter title="Funding Organization">
              {filters.organizations.map(org => (
                <CheckboxItem key={org} label={org} value={org} checked={selectedFilters.organization === org} onChange={() => handleFilterChange('organization', selectedFilters.organization === org ? '' : org)} type="radio" name="organization" />
              ))}
            </AccordionFilter>

            <AccordionFilter title="Research Area">
              {filters.research_areas.map(area => (
                <CheckboxItem key={area} label={area} value={area} checked={selectedFilters.research_area === area} onChange={() => handleFilterChange('research_area', selectedFilters.research_area === area ? '' : area)} type="radio" name="research_area" />
              ))}
            </AccordionFilter>
            
            <AccordionFilter title="Funding Amount">
                {fundingAmountRanges.map(range => (
                    <CheckboxItem key={range.value} label={range.label} value={range.value} checked={selectedFilters.amount_range === range.value} onChange={() => handleFilterChange('amount_range', selectedFilters.amount_range === range.value ? '' : range.value)} type="radio" name="amount_range" />
                ))}
            </AccordionFilter>

            <AccordionFilter title="Tags">
                {filters.tags.map(tag => (
                    <CheckboxItem key={tag} label={tag} value={tag} checked={selectedFilters.tags.includes(tag)} onChange={(checked) => handleTagChange(tag, checked)} type="checkbox" />
                ))}
            </AccordionFilter>

            <button 
              onClick={clearAllFilters}
              className="w-full mt-6 flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <FilterX className="h-4 w-4 mr-2" /> Clear All Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:w-3/4">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 sm:mb-0">Funding Opportunities</h1>
            <p className="text-sm text-slate-500">Showing {opportunities.length > 0 ? `${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, totalOpportunities)} of` : ''} {totalOpportunities} results</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="loading-spinner mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading opportunities...</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow">
              <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600 font-semibold">No opportunities found.</p>
              <p className="text-slate-500">Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {opportunities.map(opp => <OpportunityCard key={opp.id} opp={opp} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="mt-10 flex justify-center items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className='text-sm text-slate-600'>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const Input = React.forwardRef((props, ref) => (
    <input {...props} ref={ref} className={`w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${props.className}`} />
));

const CheckboxItem = ({ label, value, checked, onChange, type = "checkbox", name }) => (
    <label className="flex items-center space-x-2 text-sm text-slate-600 hover:bg-slate-50 p-1 rounded cursor-pointer">
        <input 
            type={type} 
            name={name} 
            value={value} 
            checked={checked} 
            onChange={(e) => onChange(type === "checkbox" ? e.target.checked : e.target.value)} 
            className={`${type === 'checkbox' ? 'rounded' : 'rounded-full'} h-4 w-4 text-purple-600 border-slate-300 focus:ring-purple-500`}
        />
        <span>{label}</span>
    </label>
);

export default FindFundingPage;
