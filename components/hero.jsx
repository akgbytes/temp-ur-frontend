"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { citiesAPI, buildersAPI, propertiesAPI } from "@/lib/api";

export default function Hero() {
    const [activeTab, setActiveTab] = useState("buy");
    const [searchQuery, setSearchQuery] = useState("");
    const [cities, setCities] = useState([]);
    const [builders, setBuilders] = useState([]);
    const [properties, setProperties] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchError, setSearchError] = useState("");
    const searchRef = useRef(null);
    const router = useRouter();

    // Fetch cities, builders, and properties data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [citiesRes, buildersRes, propertiesRes] = await Promise.all([
                    citiesAPI.getAll(),
                    buildersAPI.getAll(),
                    propertiesAPI.getAll()
                ]);
                
                // Handle different response structures for cities
                let citiesData = [];
                if (citiesRes.data) {
                    if (Array.isArray(citiesRes.data)) {
                        citiesData = citiesRes.data;
                    } else if (citiesRes.data.data && Array.isArray(citiesRes.data.data)) {
                        citiesData = citiesRes.data.data;
                    }
                }
                
                const buildersData = Array.isArray(buildersRes.data) ? buildersRes.data : [];
                const propertiesData = propertiesRes.data?.data && Array.isArray(propertiesRes.data.data) ? propertiesRes.data.data : [];
                
                setCities(citiesData);
                setBuilders(buildersData);
                setProperties(propertiesData);
            } catch (error) {
                // Silently handle error
            }
        };
        
        fetchData();
    }, []);

    // Generate suggestions based on search query
    useEffect(() => {
        if (searchQuery.length > 0) {
            const query = searchQuery.toLowerCase();
            
            // Filter cities - only include cities that have slugs
            const cityMatches = cities.filter(city => 
                city.name && city.slug && city.name.toLowerCase().includes(query)
            ).map(city => ({
                type: 'city',
                name: city.name,
                slug: city.slug,
                display: city.name
            }));
            
            // Filter builders
            const builderMatches = builders.filter(builder => 
                builder.name.toLowerCase().includes(query)
            ).map(builder => ({
                type: 'builder',
                name: builder.name,
                slug: builder.slug,
                display: `${builder.name} (Builder)`
            }));
            
            // Filter properties by project name
            const propertyMatches = properties.filter(property => {
                const projectName = property.projectName || property.title || '';
                return projectName.toLowerCase().includes(query);
            }).map(property => ({
                type: 'property',
                name: property.projectName || property.title,
                id: property._id,
                display: `${property.projectName || property.title} (Project)`
            }));
            
            const allSuggestions = [...cityMatches, ...builderMatches, ...propertyMatches].slice(0, 8);
            setSuggestions(allSuggestions);
            setShowSuggestions(allSuggestions.length > 0);
            setSearchError("");
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setSearchError("");
        }
    }, [searchQuery, cities, builders, properties]);

    const handleSearch = () => {
        if (activeTab === "sell") {
            // Post property feature is disabled
            alert("Post Property feature is currently disabled. Please contact us for assistance.");
            return;
        }

        if (activeTab === "rent") {
            // For rent tab, redirect to properties page with rental filter
            const params = new URLSearchParams();
            params.append("action", "Rent");
            params.append("type", "regular");
            if (searchQuery.trim()) {
                params.append("search", searchQuery.trim());
            }
            router.push(`/properties?${params.toString()}`);
            return;
        }

        if (!searchQuery.trim()) {
            setSearchError("Please enter a city, builder name, or project name");
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        
        // Check if it's a valid city - prioritize suggestions first, then exact match, then partial
        let cityMatch = null;
        
        // First, check if there are city suggestions (user is typing and suggestions are showing)
        const citySuggestions = suggestions.filter(s => s.type === 'city' && s.slug);
        if (citySuggestions.length > 0) {
            // Use the first city suggestion (most relevant match)
            const firstSuggestion = citySuggestions[0];
            // Find the city by matching the suggestion's name and slug
            const matchedCity = cities.find(city => 
                city.name && city.slug && 
                city.name.toLowerCase() === firstSuggestion.name.toLowerCase() &&
                city.slug === firstSuggestion.slug
            );
            if (matchedCity) {
                cityMatch = matchedCity;
            } else if (firstSuggestion.slug) {
                // If we have a slug from suggestion but can't find city in array, use suggestion directly
                cityMatch = { slug: firstSuggestion.slug, name: firstSuggestion.name };
            }
        }
        
        // If no match from suggestions, try exact match
        if (!cityMatch) {
            cityMatch = cities.find(city => 
                city.name && city.slug && city.name.toLowerCase() === query
            );
        }
        
        // If still no match, try to find a city that starts with the query
        if (!cityMatch) {
            cityMatch = cities.find(city => 
                city.name && city.slug && city.name.toLowerCase().startsWith(query)
            );
        }
        
        // As a last resort, try to find a city that contains the query
        if (!cityMatch) {
            cityMatch = cities.find(city => 
                city.name && city.slug && city.name.toLowerCase().includes(query)
            );
        }
        
        // Final check - ensure city has a valid slug
        if (cityMatch && !cityMatch.slug) {
            cityMatch = null;
        }
        
        // Check if it's a valid builder - try exact match first, then partial match
        let builderMatch = builders.find(builder => 
            builder.name.toLowerCase() === query
        );
        
        // If no exact match, try to find a builder from suggestions
        if (!builderMatch) {
            const builderSuggestions = suggestions.filter(s => s.type === 'builder');
            if (builderSuggestions.length === 1) {
                const matchedBuilder = builders.find(builder => 
                    builder.name.toLowerCase() === builderSuggestions[0].name.toLowerCase()
                );
                if (matchedBuilder) {
                    builderMatch = matchedBuilder;
                }
            }
        }

        // Check if it's a valid property/project - try exact match first
        let propertyMatch = properties.find(property => {
            const projectName = property.projectName || property.title || '';
            return projectName.toLowerCase() === query;
        });
        
        // If no exact match, try to find a property from suggestions
        if (!propertyMatch) {
            const propertySuggestions = suggestions.filter(s => s.type === 'property');
            if (propertySuggestions.length === 1) {
                propertyMatch = properties.find(property => 
                    property._id === propertySuggestions[0].id
                );
            }
        }

        if (cityMatch) {
            // Redirect to city page
            router.push(`/city/${cityMatch.slug}`);
        } else if (builderMatch) {
            // Redirect to builder page
            router.push(`/builder/${builderMatch.slug}`);
        } else if (propertyMatch) {
            // Redirect to property page
            router.push(`/properties/${propertyMatch._id}`);
        } else {
            // Show error for invalid search
            setSearchError("City, builder, or project not found. Please try a valid name.");
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.name);
        setShowSuggestions(false);
        
        if (activeTab === "rent") {
            // For rent tab, redirect to properties page with rental filter
            const params = new URLSearchParams();
            params.append("action", "Rent");
            params.append("type", "regular");
            params.append("search", suggestion.name);
            router.push(`/properties?${params.toString()}`);
        } else {
            if (suggestion.type === 'city') {
                router.push(`/city/${suggestion.slug}`);
            } else if (suggestion.type === 'builder') {
                router.push(`/builder/${suggestion.slug}`);
            } else if (suggestion.type === 'property') {
                router.push(`/properties/${suggestion.id}`);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <main className="heroSection position-relative overflow-hidden">
        <Image
          src="/img/heroImage.jpg"
          alt="Hero Image"
          fill
          className="object-fit-cover"
          priority
          loading="eager"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          sizes="100vw"
        />
        <div className="heroSearch position-absolute top-50 start-50 translate-middle w-100 px-2 px-md-5">
          <div className="container">
            <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8">
                            <div 
                                className="searchContainer rounded-4 shadow-lg p-3 p-md-5"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {/* Tab Navigation */}
                                <div className="d-none mb-3 mb-md-4" style={{ gap: '6px' }}>
                                    <button
                                        className={`btn flex-fill ${activeTab === "buy" ? "active" : ""}`}
                                        onClick={() => setActiveTab("buy")}
                                        style={{
                                            borderRadius: "10px",
                                            fontWeight: "600",
                                            padding: "8px 12px",
                                            fontSize: "13px",
                                            background: activeTab === "buy" 
                                                ? 'rgba(13, 110, 253, 0.9)' 
                                                : 'rgba(255, 255, 255, 0.2)',
                                            border: activeTab === "buy" 
                                                ? '1px solid rgba(13, 110, 253, 0.3)' 
                                                : '1px solid rgba(255, 255, 255, 0.3)',
                                            color: activeTab === "buy" ? 'white' : 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        className={`btn flex-fill ${activeTab === "rent" ? "active" : ""}`}
                                        onClick={() => router.push('/properties')}
                                        style={{
                                            borderRadius: "10px",
                                            fontWeight: "600",
                                            padding: "8px 12px",
                                            fontSize: "13px",
                                            background: 'rgba(220, 53, 69, 0.9)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Sell
                                    </button>
                                    <div style={{ display: 'none' }}>
                                        <button
                                            className={`btn flex-fill ${activeTab === "sell" ? "active" : ""}`}
                                            onClick={() => setActiveTab("sell")}
                                            style={{
                                                borderRadius: "10px",
                                                fontWeight: "600",
                                                padding: "8px 12px",
                                                fontSize: "13px",
                                                background: activeTab === "sell" 
                                                    ? 'rgba(13, 110, 253, 0.9)' 
                                                    : 'rgba(255, 255, 255, 0.2)',
                                                border: activeTab === "sell" 
                                                    ? '1px solid rgba(13, 110, 253, 0.3)' 
                                                    : '1px solid rgba(255, 255, 255, 0.3)',
                                                color: activeTab === "sell" ? 'white' : 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Sell
                                        </button>
                                    </div>
                                </div>

                                {/* Search Content */}
                                {activeTab === "sell" ? (
                                    // Sell Tab - HIDDEN
                                    <div style={{ display: 'none' }}>
                                        <div className="text-center">
                                            <h4 className="mb-3 fs-5 fs-md-4" style={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: '600' }}>Ready to sell your property?</h4>
                                            <p className="mb-4 small" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>List your property and reach thousands of potential buyers</p>
                                            <button 
                                                className="btn px-3 px-md-4 py-2"
                                                onClick={handleSearch}
                                                style={{
                                                    background: 'rgba(220, 53, 69, 0.9)',
                                                    border: '1px solid rgba(220, 53, 69, 0.3)',
                                                    backdropFilter: 'blur(10px)',
                                                    borderRadius: '10px',
                                                    color: 'white',
                                                    fontWeight: '600',
                                                    fontSize: '13px',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 4px 16px rgba(220, 53, 69, 0.3)',
                                                    height: '40px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = 'rgba(220, 53, 69, 1)';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = 'rgba(220, 53, 69, 0.9)';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 4px 16px rgba(220, 53, 69, 0.3)';
                                                }}
                                            >
                                                <i className="bi bi-plus-circle-fill me-2"></i>
                                                Post Your Property
                                            </button>
                                        </div>
                                    </div>
                                ) : activeTab === "rent" ? (
                                    // Rent Tab - Show rental properties message
                                    <div className="text-center">
                                        <h4 className="mb-3 fs-5 fs-md-4" style={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: '600' }}>Find Your Perfect Rental</h4>
                                        <p className="mb-4 small" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Browse through our extensive collection of rental properties</p>
                                        <button 
                                            className="btn px-3 px-md-4 py-2"
                                            onClick={() => router.push('/properties?action=Rent&type=regular')}
                                            style={{
                                                background: 'rgba(220, 53, 69, 0.9)',
                                                border: '1px solid rgba(220, 53, 69, 0.3)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '10px',
                                                color: 'white',
                                                fontWeight: '600',
                                                fontSize: '13px',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 16px rgba(220, 53, 69, 0.3)',
                                                height: '40px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(220, 53, 69, 1)';
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(220, 53, 69, 0.9)';
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 4px 16px rgba(220, 53, 69, 0.3)';
                                            }}
                                        >
                                            <i className="bi bi-house-door-fill me-2"></i>
                                            View Rental Properties
                                        </button>
                                    </div>
                                ) : (
                                    // Buy/Rent Tabs - Search functionality
                                    <>
                                        {/* Search Input */}
                                        <div className="position-relative mb-3">
                                            <div className="input-group">
                                                <span 
                                                    className="input-group-text border-end-0"
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.2)',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                                        backdropFilter: 'blur(10px)',
                                                        color: 'rgba(255, 255, 255, 0.9)'
                                                    }}
                                                >
                                                    <i className="bi bi-geo-alt-fill" style={{ color: 'rgba(255, 255, 255, 0.8)' }}></i>
                                                </span>
                                                <input 
                                                    ref={searchRef}
                                                    type="text" 
                                                    className="form-control border-start-0" 
                                                    placeholder="Search by builder, or project name..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                                        backdropFilter: 'blur(10px)',
                                                        color: 'white',
                                                        fontSize: '13px',
                                                        padding: '10px 14px'
                                                    }}
                                                />
                                            </div>
                                            
                                            {/* Autocomplete Suggestions */}
                                            {showSuggestions && suggestions.length > 0 && (
                                                <div 
                                                    className="position-absolute w-100 mt-1 rounded-3 shadow-lg"
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.95)',
                                                        backdropFilter: 'blur(20px)',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                                        zIndex: 1000,
                                                        maxHeight: '300px',
                                                        overflowY: 'auto'
                                                    }}
                                                >
                                                    {suggestions.map((suggestion, index) => (
                                                        <div
                                                            key={index}
                                                            className="px-3 py-2 cursor-pointer d-flex align-items-center"
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            style={{
                                                                borderBottom: index < suggestions.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                                                transition: 'background-color 0.2s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = 'rgba(13, 110, 253, 0.1)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = 'transparent';
                                                            }}
                                                        >
                                                            <i className={`bi ${
                                                                suggestion.type === 'city' ? 'bi-geo-alt-fill' : 
                                                                suggestion.type === 'builder' ? 'bi-building' : 
                                                                'bi-house-door-fill'
                                                            } me-2 text-primary`}></i>
                                                            <span className="text-dark">{suggestion.display}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Search Error */}
                                            {searchError && (
                                                <div className="mt-2 px-3 py-2 rounded-3" style={{
                                                    background: 'rgba(220, 53, 69, 0.1)',
                                                    border: '1px solid rgba(220, 53, 69, 0.3)',
                                                    color: 'rgba(220, 53, 69, 0.9)',
                                                    fontSize: '12px'
                                                }}>
                                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                    {searchError}
                                                </div>
                                            )}
                                        </div>
                  
                  
                  {/* Search Button */}
                                        <button 
                                            className="btn w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                                            onClick={handleSearch}
                                            style={{ 
                                                fontSize: "13px", 
                                                fontWeight: "600",
                                                background: 'rgba(220, 53, 69, 0.9)',
                                                border: '1px solid rgba(220, 53, 69, 0.3)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '10px',
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 16px rgba(220, 53, 69, 0.3)',
                                                height: '40px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(220, 53, 69, 1)';
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(220, 53, 69, 0.9)';
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 4px 16px rgba(220, 53, 69, 0.3)';
                                            }}
                                        >
                    <i className="bi bi-search"></i>
                                            Search {activeTab === "buy" ? "Properties" : "Rentals"}
                  </button>
                                    </>
                                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
}