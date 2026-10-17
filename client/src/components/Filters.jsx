import '../styles/SideBar.css';

function Filters({selectedFilter, setSelectedFilter, visaOptions}) {
  
  const handleCheckBoxChange = (label) => {
    if(selectedFilter.includes(label)){
      // remove filter if already set
      setSelectedFilter(selectedFilter.filter(f => f !== label));
    } else{
      // add filter if not already set
      setSelectedFilter([...selectedFilter, label]);
    }
  };

  return (
    <div className="filters-wrapper">
      <div className="filters-container">
        {visaOptions.map(option =>
          <label key={option.id} className="filter-option">
            <input 
              type="checkbox" 
              id={option.id}
              value={option.label}
              checked = {selectedFilter.includes(option.label)}
              onChange={() => handleCheckBoxChange(option.label)}
              className={`checkbox-${option.color}`}
              style={{ borderColor: option.color, backgroundColor: option.color }}
            />
          </label>
        )}
      </div>
      <button
        className="reset-filter-button"
        onClick={() => setSelectedFilter(visaOptions.map(option => option.label))}
      >
        Reset
      </button>
    </div>
  );
}

export default Filters;