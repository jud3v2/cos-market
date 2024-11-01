import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@mui/material';

const Dropdown = ({ label, options = [], onChange, isPriceDropdown, priceRange, setPriceRange, maxPrice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {label}
          <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {isPriceDropdown ? (
              <>
                <div className="px-4 py-2">
                  {options.map(option => (
                    <a
                      key={option}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOptionClick(option);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {option}
                    </a>
                  ))}
                </div>
                <div className="border-t my-2"></div>
                <div className="px-4 py-2">
                  <Slider
                    value={priceRange}
                    onChange={(event, newValue) => {
                      setPriceRange(newValue);
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    max={maxPrice}
                    disableSwap
                    sx={{ width: 200 }}
                  />
                  <div className="flex justify-between mt-2">
                    <span>{`Min: ${priceRange[0]}`}</span>
                    <span>{`Max: ${priceRange[1]}`}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(option => (
                    <a
                      key={option}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOptionClick(option);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {option}
                    </a>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">Aucune option disponible</div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
