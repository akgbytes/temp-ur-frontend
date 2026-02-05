"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from '@/lib/api';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState('Gurgaon');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cities from backend on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const { data, error } = await apiCall('/cities');
        
        if (data && Array.isArray(data) && data.length > 0) {
          setCities(data);
          // Set Gurgaon as default if it exists, otherwise use first city
          const gurgaonCity = data.find(city => 
            city.name.toLowerCase().includes('gurgaon') || 
            city.name.toLowerCase().includes('gurugram')
          );
          if (gurgaonCity) {
            setSelectedCity(gurgaonCity.name);
          } else if (!selectedCity || !data.find(city => city.name === selectedCity)) {
            setSelectedCity(data[0].name);
          }
        } else {
          // Fallback to default cities if API fails
          setCities([
            { name: 'Gurgaon', _id: 'default-gurgaon' },
            { name: 'Noida', _id: 'default-noida' },
            { name: 'Delhi', _id: 'default-delhi' },
            { name: 'Mumbai', _id: 'default-mumbai' }
          ]);
          setSelectedCity('Gurgaon');
        }
      } catch (error) {
        // Fallback to default cities if API fails
        setCities([
          { name: 'Gurgaon', _id: 'default-gurgaon' },
          { name: 'Noida', _id: 'default-noida' },
          { name: 'Delhi', _id: 'default-delhi' },
          { name: 'Mumbai', _id: 'default-mumbai' }
        ]);
        setSelectedCity('Gurgaon');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Save selected city to localStorage
  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem('selectedCity', selectedCity);
    }
  }, [selectedCity]);

  // Load selected city from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity && cities.length > 0) {
      const cityExists = cities.find(city => city.name === savedCity);
      if (cityExists) {
        setSelectedCity(savedCity);
      }
    }
  }, [cities]);

  const updateSelectedCity = (cityName) => {
    setSelectedCity(cityName);
  };

  const getSelectedCityData = () => {
    return cities.find(city => city.name === selectedCity) || null;
  };

  const value = {
    selectedCity,
    cities,
    loading,
    updateSelectedCity,
    getSelectedCityData
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
