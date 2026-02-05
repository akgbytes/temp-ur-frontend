"use client";

import React from "react";
import { useLeadForm } from "@/contexts/LeadFormContext";

const GetInTouchButton = () => {
  const { handleGetInTouch } = useLeadForm();
  return (
    <div className="text-center">
      <button 
        onClick={handleGetInTouch}
        className="btn btn-warning btn-lg px-4 py-3 fw-bold"
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(255, 193, 7, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(255, 193, 7, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 16px rgba(255, 193, 7, 0.3)';
        }}
      >
        <i className="bi bi-telephone-fill me-2"></i>
        Get in Touch
      </button>
    </div>
  );
};

export default GetInTouchButton;
