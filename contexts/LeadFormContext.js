"use client";

import React, { createContext, useContext, useState } from 'react';

const LeadFormContext = createContext();

export const useLeadForm = () => {
  const context = useContext(LeadFormContext);
  if (!context) {
    throw new Error('useLeadForm must be used within a LeadFormProvider');
  }
  return context;
};

export const LeadFormProvider = ({ children }) => {
  const [showLeadForm, setShowLeadForm] = useState(false);

  const handleGetInTouch = () => {
    setShowLeadForm(true);
  };

  const handleCloseLeadForm = () => {
    setShowLeadForm(false);
  };

  return (
    <LeadFormContext.Provider value={{
      showLeadForm,
      handleGetInTouch,
      handleCloseLeadForm
    }}>
      {children}
    </LeadFormContext.Provider>
  );
};
