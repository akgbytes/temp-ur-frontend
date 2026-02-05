"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { propertiesAPI, buildersAPI } from "@/lib/api";

const PropertiesContext = createContext();

export function PropertiesProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  // Fetch data function
  const fetchData = async (force = false) => {
    // Check if we have cached data and it's still fresh
    if (
      !force &&
      lastFetch &&
      Date.now() - lastFetch < CACHE_DURATION &&
      properties.length > 0
    ) {
      return;
    }

    try {
      setLoading(true);

      const [propertiesRes, buildersRes] = await Promise.all([
        propertiesAPI.getAll({ limit: 1000 }), // Fetch all properties once
        buildersAPI.getAll(),
      ]);

      if (propertiesRes.error) {
        throw new Error(propertiesRes.error);
      }

      if (buildersRes.error) {
        throw new Error(buildersRes.error);
      }

      const propertiesData =
        propertiesRes.data?.data || propertiesRes.data || propertiesRes || [];
      const buildersData = buildersRes.data || buildersRes || [];

      setProperties(propertiesData);
      setBuilders(buildersData);
      setLastFetch(Date.now());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Helper functions to filter properties
  const getLatestProperties = (limit = 50) => {
    return [...properties]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  // Specific builder's properties
  const getSpecificBuilderProperties = (id = "69044fd82f7aeb649593f2f9") => {
    return [...properties].filter((p) => p.builder._id === id);
  };

  const getBuilderProperties = (limit = 100) => {
    return properties.filter((p) => p.type === "builder").slice(0, limit);
  };

  const getResidentialProperties = (limit = 15) => {
    return properties
      .filter((property) => {
        const categoryName = property.category?.name || "";
        const subcategoryName = property.subcategoryName || "";

        const isResidential =
          categoryName.toLowerCase().includes("residential") ||
          subcategoryName.toLowerCase().includes("residential") ||
          subcategoryName.toLowerCase().includes("apartment") ||
          subcategoryName.toLowerCase().includes("house") ||
          subcategoryName.toLowerCase().includes("villa") ||
          subcategoryName.toLowerCase().includes("flat");

        return isResidential;
      })
      .slice(0, limit);
  };

  const getCommercialProperties = (limit = 15) => {
    return properties
      .filter((property) => {
        const categoryName = property.category?.name || "";
        const subcategoryName = property.subcategoryName || "";

        const isCommercial =
          categoryName.toLowerCase().includes("commercial") ||
          subcategoryName.toLowerCase().includes("commercial") ||
          subcategoryName.toLowerCase().includes("office") ||
          subcategoryName.toLowerCase().includes("retail") ||
          subcategoryName.toLowerCase().includes("shop") ||
          subcategoryName.toLowerCase().includes("showroom");

        return isCommercial;
      })
      .slice(0, limit);
  };

  const getBudgetProperties = (limit = 10) => {
    const minPrice = 10000000; // 1 Crore
    const maxPrice = 100000000; // 10 Crore

    return properties
      .filter((property) => {
        let propertyPrice = 0;

        if (property.type === "builder") {
          if (property.minPrice && property.maxPrice) {
            propertyPrice = (property.minPrice + property.maxPrice) / 2;
          } else if (property.minPrice) {
            propertyPrice = property.minPrice;
          } else if (property.price) {
            propertyPrice = property.price;
          }
        } else {
          propertyPrice = property.price || 0;
        }

        return propertyPrice >= minPrice && propertyPrice <= maxPrice;
      })
      .slice(0, limit);
  };

  const getLuxuryProperties = (limit = 10) => {
    const minPrice = 100000000; // 10 Crore

    return properties
      .filter((property) => {
        let propertyPrice = 0;

        if (property.type === "builder") {
          if (property.minPrice && property.maxPrice) {
            propertyPrice = (property.minPrice + property.maxPrice) / 2;
          } else if (property.minPrice) {
            propertyPrice = property.minPrice;
          } else if (property.maxPrice) {
            propertyPrice = property.maxPrice;
          } else if (property.price) {
            propertyPrice = property.price;
          }
        } else {
          propertyPrice = property.price || 0;
        }

        return propertyPrice > minPrice;
      })
      .slice(0, limit);
  };

  const getPossessionStats = () => {
    const stats = {};

    properties
      .filter((p) => p.type === "builder" && p.possessionDate)
      .forEach((property) => {
        const year = property.possessionDate.split("-")[0];
        if (!stats[year]) {
          stats[year] = 0;
        }
        stats[year]++;
      });

    return stats;
  };

  const value = {
    properties,
    builders,
    loading,
    error,
    refetch: () => fetchData(true),

    // Helper functions
    getLatestProperties,
    getBuilderProperties,
    getResidentialProperties,
    getCommercialProperties,
    getBudgetProperties,
    getLuxuryProperties,
    getPossessionStats,
    getSpecificBuilderProperties,
  };

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
}

// Custom hook to use the properties context
export function useProperties() {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error("useProperties must be used within a PropertiesProvider");
  }
  return context;
}
