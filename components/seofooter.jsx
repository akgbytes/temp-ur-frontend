'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { citiesAPI, categoriesAPI, buildersAPI, propertiesAPI } from '../lib/api';

const SeoFooter = () => {
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [builders, setBuilders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [citiesResult, categoriesResult, buildersResult] = await Promise.all([
                    citiesAPI.getAll(),
                    categoriesAPI.getAll(),
                    buildersAPI.getAll()
                ]);
                
                setCities(citiesResult.data || []);
                setCategories(categoriesResult.data || []);
                setBuilders(buildersResult.data || []);
            } catch (error) {
                console.error('Error fetching data for SEO footer:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Create popular searches from real data
    const createPopularSearches = () => {
        const popularSearches = [];
        
        // Get top cities and categories for popular searches
        const topCities = cities.slice(0, 8);
        const topCategories = categories.slice(0, 4);
        
        // Create popular search combinations
        topCities.forEach(city => {
            topCategories.forEach(category => {
                if (category.deepSubcategories && category.deepSubcategories.length > 0) {
                    category.deepSubcategories.slice(0, 2).forEach(subcategory => {
                        popularSearches.push({
                            text: `${subcategory.name} in ${city.name}`,
                            url: `/properties?city=${encodeURIComponent(city.name)}&category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory.name)}`
                        });
                    });
                } else {
                    popularSearches.push({
                        text: `${category.name} in ${city.name}`,
                        url: `/properties?city=${encodeURIComponent(city.name)}&category=${encodeURIComponent(category.name)}`
                    });
                }
            });
        });
        
        return popularSearches.slice(0, 12); // Limit to 12 popular searches
    };

    // Create SEO-friendly combinations
    const createSeoLinks = () => {
        const links = [];
        
        // City + Category combinations
        cities.slice(0, 8).forEach(city => {
            categories.forEach(category => {
                // Main category links
                links.push({
                    url: `/properties?city=${encodeURIComponent(city.name)}&category=${encodeURIComponent(category.name)}`,
                    text: `${category.name} in ${city.name}`,
                    type: 'main'
                });

                // Subcategory links if they exist
                if (category.deepSubcategories && category.deepSubcategories.length > 0) {
                    category.deepSubcategories.slice(0, 2).forEach(subcategory => {
                        links.push({
                            url: `/properties?city=${encodeURIComponent(city.name)}&category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory.name)}`,
                            text: `${subcategory.name} in ${city.name}`,
                            type: 'sub'
                        });
                    });
                }
            });
        });

        return links;
    };

    const seoLinks = createSeoLinks();
    const popularSearches = createPopularSearches();

    return (
        <div className="bg-light py-5 mt-5">
            <div className="container">
                <div className="row">
                    {/* Cities Column */}
                    <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
                        <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>CITIES</h6>
                        <ul className="list-unstyled">
                            {cities.slice(0, 12).map((city, index) => (
                                <li key={index} className="mb-2">
                                    <Link 
                                        href={`/properties?city=${encodeURIComponent(city.name)}`}
                                        className="text-decoration-none text-dark"
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        {city.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Residential Properties Column */}
                    <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
                        <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>RESIDENTIAL</h6>
                        <ul className="list-unstyled">
                            {cities.slice(0, 8).map((city, index) => (
                                <li key={index} className="mb-2">
                                    <Link 
                                        href={`/properties?city=${encodeURIComponent(city.name)}&category=Residential`}
                                        className="text-decoration-none text-dark"
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        Residential in {city.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Commercial Properties Column */}
                    <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
                        <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>COMMERCIAL</h6>
                        <ul className="list-unstyled">
                            {cities.slice(0, 8).map((city, index) => (
                                <li key={index} className="mb-2">
                                    <Link 
                                        href={`/properties?city=${encodeURIComponent(city.name)}&category=Commercial`}
                                        className="text-decoration-none text-dark"
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        Commercial in {city.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Property Types Column */}
                    <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
                        <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>PROPERTY TYPES</h6>
                        <ul className="list-unstyled">
                            {categories.map((category, index) => (
                                <li key={index} className="mb-2">
                                    <Link 
                                        href={`/properties?category=${encodeURIComponent(category.name)}`}
                                        className="text-decoration-none text-dark"
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Searches Column */}
                    <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
                        <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>POPULAR SEARCHES</h6>
                        <ul className="list-unstyled">
                            {popularSearches.slice(0, 8).map((search, index) => (
                                <li key={index} className="mb-2">
                                    <Link 
                                        href={search.url}
                                        className="text-decoration-none text-dark"
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        {search.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
                        <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>QUICK LINKS</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link href="/properties" className="text-decoration-none text-dark" style={{ fontSize: '0.85rem' }}>
                                    All Properties
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/builder" className="text-decoration-none text-dark" style={{ fontSize: '0.85rem' }}>
                                    Top Builders
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/city" className="text-decoration-none text-dark" style={{ fontSize: '0.85rem' }}>
                                    All Cities
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/about" className="text-decoration-none text-dark" style={{ fontSize: '0.85rem' }}>
                                    About Us
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/contact-us" className="text-decoration-none text-dark" style={{ fontSize: '0.85rem' }}>
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Additional SEO Content */}
                <div className="mt-4 pt-3 border-top">
                    <div className="row">
                        <div className="col-12">
                            <p className="text-muted small text-center mb-0">
                                Find the perfect property in your preferred location. Browse through our extensive collection of residential and commercial properties across major cities in India.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeoFooter;