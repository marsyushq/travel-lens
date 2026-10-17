import { useState, useEffect } from 'react';
import Filters from './Filters.jsx';
import CountryList from './CountryList.jsx';
import '../styles/SideBar.css';


function SideBar({countriesColors, visaData, visaOptions}) {
  //make everything to be selected by default 
  const [selectedFilter, setSelectedFilter] = useState(
    visaOptions.map(option => option.label)
  );
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  function getVisaCategory(value) {
    if (!value) return 'Unknown';

    switch (value) {
      case 'visa free':
        return 'visa free';
      case 'visa required':
        return 'visa required';
      case 'eta':
        return 'eta';
      case 'e-visa':
        return 'e-visa';
      case 'visa on arrival':
        return 'visa on arrival';
      default:
        // if value is a number string, treat as visa free
        return !isNaN(Number(value)) ? 'visa free' : 'Unknown';
    }
  }

  
  useEffect(() => {
    if (!visaData || !visaData.to){
      setFilteredCountries([]);
      return;
    };

    let filtered = Object.entries(visaData.to).map(([id, status]) => ({
      id,
      name: id,
      color: countriesColors[id],
      visaStatus: getVisaCategory(status)
    }));

    if (selectedFilter.length > 0) {
      filtered = filtered.filter(
        country => selectedFilter.includes(country.visaStatus)
      );
    } else {
      filtered = [];
    }

    if(searchQuery){
      filtered = filtered.filter(
        country => country.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    setFilteredCountries(filtered);

  }, [selectedFilter, searchQuery, countriesColors, visaData]);

  return(
    <div className="sidebar-container">
      <h2>Passport Visa Requirements</h2>
      <div className="sidebar-header">
        <input
          type="text"
          placeholder="Find a country..."
          className="search-bar"
          value = {searchQuery}
          onChange = {e => setSearchQuery(e.target.value)}
        />
        <Filters 
          selectedFilter={selectedFilter} 
          setSelectedFilter={setSelectedFilter}
          visaOptions={visaOptions}/>
      </div>
      <CountryList countries={filteredCountries}/>
    </div>
  );
}

export default SideBar;