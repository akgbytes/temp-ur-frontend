'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { propertiesAPI, buildersAPI, citiesAPI, categoriesAPI } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export default function PropertyPageContent() {
  // Get URL search parameters
  const searchParams = useSearchParams();
  
  // State management
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(12);
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '', unit: 'crores' },
    category: '',
    subcategory: '',
    configuration: '',
    city: '',
    locality: '',
    builder: '',
    propertyType: '',
    possession: ''
  });

  // Sort state
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price-low, price-high, name-asc, name-desc

  // Function to get category ID by name
  const getCategoryIdByName = (categoryName) => {
    if (!Array.isArray(categories)) return '';
    const category = categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category._id : '';
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [propertiesRes, buildersRes, citiesRes, categoriesRes] = await Promise.all([
          propertiesAPI.getAll({ limit: 1000 }), // Fetch all properties (increased limit)
          buildersAPI.getAll(),
          citiesAPI.getAll(),
          categoriesAPI.getAll()
        ]);

        // Properties API returns {success: true, data: [...], pagination: {...}}
        // But apiCall wraps it in {data: {success: true, data: [...], pagination: {...}}, error: null}
        const propertiesData = propertiesRes.data && propertiesRes.data.data && Array.isArray(propertiesRes.data.data) ? propertiesRes.data.data : [];
        const buildersData = Array.isArray(buildersRes.data) ? buildersRes.data : (Array.isArray(buildersRes) ? buildersRes : []);
        const citiesData = Array.isArray(citiesRes.data) ? citiesRes.data : (Array.isArray(citiesRes) ? citiesRes : []);
        const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : (Array.isArray(categoriesRes) ? categoriesRes : []);

        
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
        setBuilders(buildersData);
        setCities(citiesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle URL parameters after data is loaded
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const cityParam = searchParams.get('city');
    const subcategoryParam = searchParams.get('subcategory');
    const possessionParam = searchParams.get('possession');
    
    if (categoryParam && categories.length > 0) {
      const categoryId = getCategoryIdByName(categoryParam);
      if (categoryId) {
        setFilters(prev => ({
          ...prev,
          category: categoryId
        }));
      }
    }
    
    if (cityParam && cities.length > 0) {
      const city = cities.find(c => c.name.toLowerCase() === cityParam.toLowerCase());
      if (city) {
        setFilters(prev => ({
          ...prev,
          city: city._id
        }));
      }
    }
    
    if (subcategoryParam) {
      setFilters(prev => ({
        ...prev,
        subcategory: subcategoryParam
      }));
    }
    
    if (possessionParam) {
      setFilters(prev => ({
        ...prev,
        possession: possessionParam
      }));
    }
  }, [categories, cities, searchParams]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    let filtered = [...properties];

    // Price filter
    if (filters.priceRange.min !== '' || filters.priceRange.max !== '') {
      const multiplier = filters.priceRange.unit === 'crores' ? 10000000 : 100000;
      const minPrice = filters.priceRange.min !== '' ? parseFloat(filters.priceRange.min) * multiplier : 0;
      const maxPrice = filters.priceRange.max !== '' ? parseFloat(filters.priceRange.max) * multiplier : Infinity;
      
      console.log(`Price Filter - Min: ${filters.priceRange.min}, Max: ${filters.priceRange.max}, Unit: ${filters.priceRange.unit}`);
      console.log(`Converted - Min: ${minPrice}, Max: ${maxPrice}`);

      filtered = filtered.filter(property => {
        let propertyPrice = 0;
        
        // Get the price value - it's stored as a number in the database
        if (property.price) {
          propertyPrice = typeof property.price === 'number' ? property.price : parseFloat(property.price);
        }
        
        // Debug logging
        console.log(`Property: ${property.projectName || property.title}, Price: ${propertyPrice}, Min: ${minPrice}, Max: ${maxPrice}, Passes: ${propertyPrice >= minPrice && propertyPrice <= maxPrice}`);
        
        // Filter based on the actual numeric price value
        return propertyPrice >= minPrice && propertyPrice <= maxPrice;
      });
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(property => 
        property.category && 
        (typeof property.category === 'object' ? property.category._id === filters.category : property.category === filters.category)
      );
    }

    // Subcategory filter
    if (filters.subcategory) {
      filtered = filtered.filter(property => {
        // Handle subcategory matching for both ID and name
        return property.subcategory === filters.subcategory || 
               property.subcategoryName === filters.subcategory ||
               (typeof property.subcategory === 'object' && property.subcategory._id === filters.subcategory);
      });
    }

    // Configuration filter
    if (filters.configuration) {
      filtered = filtered.filter(property => {
        // Check if property has selectedConfigurations and if it includes the selected configuration
        return property.selectedConfigurations && 
               property.selectedConfigurations.some(config => config.type === filters.configuration);
      });
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(property => 
        property.city && 
        (typeof property.city === 'object' ? property.city._id === filters.city : property.city === filters.city)
      );
    }

    // Builder filter
    if (filters.builder) {
      filtered = filtered.filter(property => 
        property.builder && 
        (typeof property.builder === 'object' ? property.builder._id === filters.builder : property.builder === filters.builder)
      );
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property => property.type === filters.propertyType);
    }

    // Possession filter
    if (filters.possession) {
      filtered = filtered.filter(property => {
        if (!property.possessionDate) return false;
        // possessionDate is in YYYY-MM format
        const year = property.possessionDate.split('-')[0];
        return year === filters.possession;
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-low':
          const priceA = a.minPrice || a.price || 0;
          const priceB = b.minPrice || b.price || 0;
          return priceA - priceB;
        case 'price-high':
          const priceA2 = a.maxPrice || a.price || 0;
          const priceB2 = b.maxPrice || b.price || 0;
          return priceB2 - priceA2;
        case 'name-asc':
          const nameA = (a.projectName || a.title || '').toLowerCase();
          const nameB = (b.projectName || b.title || '').toLowerCase();
          return nameA.localeCompare(nameB);
        case 'name-desc':
          const nameA2 = (a.projectName || a.title || '').toLowerCase();
          const nameB2 = (b.projectName || b.title || '').toLowerCase();
          return nameB2.localeCompare(nameA2);
        default:
          return 0;
      }
    });

    setFilteredProperties(sorted);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, properties, sortBy]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle price range change
  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  // Get subcategories for selected category
  const getSubcategories = () => {
    if (!filters.category || !Array.isArray(categories)) return [];
    const selectedCategory = categories.find(cat => cat._id === filters.category);
    return selectedCategory?.deepSubcategories || [];
  };

  // Get localities for selected city
  const getLocalities = () => {
    if (!filters.city || !Array.isArray(cities)) return [];
    const selectedCity = cities.find(city => city._id === filters.city);
    return selectedCity?.localities || [];
  };

  // Get configurations for selected subcategory
  const getConfigurations = () => {
    if (!filters.subcategory || !Array.isArray(categories)) return [];
    const selectedCategory = categories.find(cat => cat._id === filters.category);
    if (!selectedCategory) return [];
    const selectedSubcategory = selectedCategory.deepSubcategories?.find(sub => sub._id === filters.subcategory);
    return selectedSubcategory?.configurations || [];
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      priceRange: { min: '', max: '', unit: 'lakhs' },
      category: '',
      subcategory: '',
      configuration: '',
      city: '',
      locality: '',
      possession: '',
      builder: '',
      propertyType: ''
    });
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of properties section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate smart pagination range (shows limited pages with ellipsis)
  const getPaginationRange = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    if (totalPages <= 1) return [1];
    
    // Generate range around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Build final range with dots
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <>
      <Header />
      
      {/* Analytics Tracking */}
      <AnalyticsTracker 
        pageUrl="/properties"
        pageTitle="Properties for Sale & Rent in India | Urbanesta"
      />
      
      {/* Hero Section */}
      <div className="container mt-5 pt-5 bg-custom-primary rounded-4 text-center text-white pb-3">
        <h2 className="display-6 display-md-5 fw-bold mb-3">Discover Property Near You</h2>
        <p>The neighborhoods best suited to your lifestyle, and the agents who know them best.</p>
      </div>

      {/* Main Content */}
      <div className="container mt-4 mt-md-5">
        {/* Mobile Filter Toggle Button */}
        <div className="d-md-none mb-3">
          <button 
            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className="bi bi-funnel"></i>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <span className="badge bg-primary ms-2">{filteredProperties.length}</span>
          </button>
        </div>

        <div className="row">
          {/* Filter Section - Responsive */}
          <div className={`col-lg-3 col-md-4 col-12 mb-4 ${showFilters ? 'd-block' : 'd-none d-md-block'}`}>
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title fw-bold mb-0">Filter Properties</h5>
                  <div className="d-flex gap-2">
                    <button 
                      type="button" 
                      onClick={clearFilters}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Clear All
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowFilters(false)}
                      className="btn btn-sm btn-outline-danger d-md-none"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Price Range</label>
                  
                  {/* Unit Selection */}
                  <div className="d-flex gap-2 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="priceUnit"
                        id="lakhs"
                        checked={filters.priceRange.unit === 'lakhs'}
                        onChange={() => handlePriceRangeChange('unit', 'lakhs')}
                      />
                      <label className="form-check-label" htmlFor="lakhs">Lakhs</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="priceUnit"
                        id="crores"
                        checked={filters.priceRange.unit === 'crores'}
                        onChange={() => handlePriceRangeChange('unit', 'crores')}
                      />
                      <label className="form-check-label" htmlFor="crores">Crores</label>
                    </div>
                  </div>

                  {/* Dual Range Slider Container */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge badge-custom-primary">
                        ₹{filters.priceRange.min !== '' ? filters.priceRange.min : 0} {filters.priceRange.unit === 'lakhs' ? 'L' : 'Cr'}
                      </span>
                      <span className="badge bg-success">
                        ₹{filters.priceRange.max !== '' ? filters.priceRange.max : 50} {filters.priceRange.unit === 'lakhs' ? 'L' : 'Cr'}
                      </span>
                    </div>
                    
                    {/* Custom Dual Range Slider */}
                    <div className="dual-range-slider position-relative">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="0.5"
                        value={filters.priceRange.min || 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (parseFloat(value) <= (parseFloat(filters.priceRange.max || 50))) {
                            handlePriceRangeChange('min', value === '0' ? '' : value);
                          }
                        }}
                        className="range-slider range-slider-min"
                      />
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="0.5"
                        value={filters.priceRange.max || 50}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (parseFloat(value) >= (parseFloat(filters.priceRange.min || 0))) {
                            handlePriceRangeChange('max', value === '50' ? '' : value);
                          }
                        }}
                        className="range-slider range-slider-max"
                      />
                      <div className="slider-track"></div>
                      <div 
                        className="slider-range"
                        style={{
                          left: `${filters.priceRange.min !== '' ? (filters.priceRange.min / 50) * 100 : 0}%`,
                          width: `${((filters.priceRange.max !== '' ? filters.priceRange.max : 50) - (filters.priceRange.min !== '' ? filters.priceRange.min : 0)) / 50 * 100}%`
                        }}
                      ></div>
                    </div>
                    
                    <div className="d-flex justify-content-between small text-muted mt-1">
                      <span>0</span>
                      <span>12.5</span>
                      <span>25</span>
                      <span>37.5</span>
                      <span>50</span>
                    </div>
                  </div>

                  {/* Manual Input Fields */}
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Min"
                        min="0"
                        max="50"
                        step="0.5"
                        value={filters.priceRange.min}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!value || (parseFloat(value) <= (parseFloat(filters.priceRange.max || 50)))) {
                            handlePriceRangeChange('min', value);
                          }
                        }}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Max"
                        min="0"
                        max="50"
                        step="0.5"
                        value={filters.priceRange.max}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!value || (parseFloat(value) >= (parseFloat(filters.priceRange.min || 0)))) {
                            handlePriceRangeChange('max', value);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Price Range Display */}
                  {(filters.priceRange.min !== '' || filters.priceRange.max !== '') && (
                    <div className="mt-2 text-center">
                      <small className="text-success fw-medium">
                        Range: ₹{filters.priceRange.min || 0} - ₹{filters.priceRange.max || 50} {filters.priceRange.unit === 'lakhs' ? 'Lakhs' : 'Crores'}
                      </small>
                    </div>
                  )}
                </div>

                <style jsx>{`
                  .dual-range-slider {
                    height: 6px;
                    position: relative;
                    margin: 15px 0;
                  }

                  .range-slider {
                    position: absolute;
                    width: 100%;
                    height: 6px;
                    outline: none;
                    background: transparent;
                    pointer-events: none;
                    -webkit-appearance: none;
                  }

                  .range-slider::-webkit-slider-thumb {
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #007bff;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    cursor: pointer;
                    pointer-events: all;
                    -webkit-appearance: none;
                    position: relative;
                    z-index: 2;
                  }

                  .range-slider::-moz-range-thumb {
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #007bff;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    cursor: pointer;
                    pointer-events: all;
                  }

                  .range-slider-max::-webkit-slider-thumb {
                    background: #28a745;
                  }

                  .range-slider-max::-moz-range-thumb {
                    background: #28a745;
                  }

                  .slider-track {
                    position: absolute;
                    width: 100%;
                    height: 6px;
                    background: #e9ecef;
                    border-radius: 3px;
                  }

                  .slider-range {
                    position: absolute;
                    height: 6px;
                    background: linear-gradient(90deg, #007bff, #28a745);
                    border-radius: 3px;
                  }

                  .range-slider:focus {
                    outline: none;
                  }

                  .range-slider:focus::-webkit-slider-thumb {
                    box-shadow: 0 2px 8px rgba(0,123,255,0.3);
                  }

                  .range-slider:focus::-moz-range-thumb {
                    box-shadow: 0 2px 8px rgba(0,123,255,0.3);
                  }

                  /* Mobile responsive adjustments */
                  @media (max-width: 767px) {
                    .dual-range-slider {
                      margin: 10px 0;
                    }
                    
                    .range-slider::-webkit-slider-thumb {
                      height: 20px;
                      width: 20px;
                    }
                    
                    .range-slider::-moz-range-thumb {
                      height: 20px;
                      width: 20px;
                    }
                  }
                `}</style>

                {/* Category Filter */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select 
                    className="form-select rounded-2"
                    value={filters.category}
                    onChange={(e) => {
                      handleFilterChange('category', e.target.value);
                      // Clear subcategory when category changes
                      handleFilterChange('subcategory', '');
                    }}
                  >
                    <option value="">All Categories</option>
                    {Array.isArray(categories) && categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory Filter - Always show if there are subcategories */}
                {Array.isArray(categories) && categories.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Subcategory
                      {filters.category && (
                        <small className="text-muted ms-1">
                          (for {categories.find(cat => cat._id === filters.category)?.name})
                        </small>
                      )}
                    </label>
                    <select 
                      className="form-select rounded-2"
                      value={filters.subcategory}
                      onChange={(e) => {
                      handleFilterChange('subcategory', e.target.value);
                      // Clear configuration when subcategory changes
                      handleFilterChange('configuration', '');
                    }}
                    >
                      <option value="">All Subcategories</option>
                      {filters.category ? (
                        // Show subcategories for selected category
                        getSubcategories().map((subcategory) => (
                          <option key={subcategory._id} value={subcategory._id}>
                            {subcategory.name}
                          </option>
                        ))
                      ) : (
                        // Show all subcategories from all categories if no category selected
                        Array.isArray(categories) && categories.flatMap(category => 
                          (category.deepSubcategories || []).map(subcategory => (
                            <option key={`${category._id}-${subcategory._id}`} value={subcategory._id}>
                              {category.name} - {subcategory.name}
                            </option>
                          ))
                        )
                      )}
                    </select>
                  </div>
                )}

                {/* Configuration Filter - Show if subcategory has configurations */}
                {filters.subcategory && getConfigurations().length > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Configuration
                      <small className="text-muted ms-1">
                        (for {getSubcategories().find(sub => sub._id === filters.subcategory)?.name})
                      </small>
                    </label>
                    <select 
                      className="form-select rounded-2"
                      value={filters.configuration || ''}
                      onChange={(e) => handleFilterChange('configuration', e.target.value)}
                    >
                      <option value="">All Configurations</option>
                      {getConfigurations().map((config) => (
                        <option key={config._id} value={config.type}>
                          {config.type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* City Filter */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">City</label>
                  <select 
                    className="form-select rounded-2"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {Array.isArray(cities) && cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Locality Filter */}
                {filters.city && getLocalities().length > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Locality</label>
                    <select 
                      className="form-select rounded-2"
                      value={filters.locality}
                      onChange={(e) => handleFilterChange('locality', e.target.value)}
                    >
                      <option value="">All Localities</option>
                      {getLocalities().map((locality) => (
                        <option key={locality._id} value={locality._id}>
                          {locality.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Builder Filter */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Builder</label>
                  <select 
                    className="form-select rounded-2"
                    value={filters.builder}
                    onChange={(e) => handleFilterChange('builder', e.target.value)}
                  >
                    <option value="">All Builders</option>
                    {Array.isArray(builders) && builders.map((builder) => (
                      <option key={builder._id} value={builder._id}>
                        {builder.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property Type Filter */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Property Type</label>
                  <select 
                    className="form-select rounded-2"
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="regular">Regular Properties</option>
                    <option value="builder">Builder Projects</option>
                  </select>
                </div>

                {/* Possession Year Filter */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Possession Year</label>
                  <select 
                    className="form-select rounded-2"
                    value={filters.possession}
                    onChange={(e) => handleFilterChange('possession', e.target.value)}
                  >
                    <option value="">All Years</option>
                    {Array.from(new Set(
                      properties
                        .filter(p => p.possessionDate)
                        .map(p => p.possessionDate.split('-')[0])
                    ))
                    .sort((a, b) => parseInt(a) - parseInt(b))
                    .map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-center">
                  <small className="text-muted">
                    Showing {filteredProperties.length} of {properties.length} properties
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Property Cards Section - Responsive */}
          <div className="col-lg-9 col-md-8 col-12">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border spinner-custom-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading properties...</p>
              </div>
            ) : filteredProperties.length > 0 ? (
              <>
                {/* Sort and Pagination Info Bar */}
                <div className="row mb-3 align-items-center">
                  <div className="col-md-6 col-12 mb-2 mb-md-0">
                    {totalPages > 1 && (
                      <p className="text-muted mb-0">
                        Showing page {currentPage} of {totalPages} 
                        ({filteredProperties.length} properties total)
                      </p>
                    )}
                    {totalPages <= 1 && (
                      <p className="text-muted mb-0">
                        Showing {filteredProperties.length} properties
                      </p>
                    )}
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="d-flex justify-content-md-end justify-content-start align-items-center gap-2">
                      <label className="form-label mb-0 text-muted small">Sort by:</label>
                      <select 
                        className="form-select form-select-sm"
                        style={{ width: 'auto', minWidth: '180px' }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Properties Grid */}
                <div className="row g-3 g-md-4">
                  {currentProperties.map((property) => (
                    <div key={property._id} className="col-xl-4 col-lg-6 col-md-6 col-12">
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <nav aria-label="Properties pagination">
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        
                        {getPaginationRange().map((page, index) => (
                          <li key={index} className={`page-item ${currentPage === page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                            {page === '...' ? (
                              <span className="page-link">...</span>
                            ) : (
                              <button 
                                className="page-link" 
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            )}
                          </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-search" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                </div>
                <h4 className="text-muted">No Properties Found</h4>
                <p className="text-muted">
                  Try adjusting your filters or clearing them to see more results.
                </p>
                <button 
                  onClick={clearFilters}
                  className="btn btn-custom-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
