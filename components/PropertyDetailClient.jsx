"use client";

import React from "react";
import LeadFormWithOTP from "./LeadFormWithOTP";
import { useLeadForm } from "@/contexts/LeadFormContext";

const PropertyDetailClient = ({ property }) => {
  const { showLeadForm, handleCloseLeadForm } = useLeadForm();

  return (
    <>
      {/* Lead Form Popup with OTP Verification */}
      {showLeadForm && (
        <LeadFormWithOTP 
          property={property} 
          onClose={handleCloseLeadForm}
          autoShow={false}
        />
      )}
    </>
  );
};

export default PropertyDetailClient;
