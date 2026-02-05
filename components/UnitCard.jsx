'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const UnitCard = ({ unit }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body p-4">
          <div className="text-center mb-3">
            <h5 className="card-title fw-bold text-primary">{unit.unitType}</h5>
            <p className="card-text text-muted fs-5">{unit.area}</p>
          </div>
          {unit.floorPlan && (
            <div className="mt-3 position-relative">
              <Image
                src={unit.floorPlan}
                alt={`${unit.unitType} Floor Plan`}
                width={300}
                height={200}
                className="img-fluid rounded shadow-sm"
                style={{ objectFit: 'cover' }}
              />
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-sm btn-light position-absolute"
                style={{
                  bottom: '10px',
                  right: '10px',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                title="View Full Floor Plan"
              >
                <i className="bi bi-arrows-fullscreen" style={{ fontSize: '1.2rem' }}></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Full Floor Plan */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={unit.floorPlan}
                  alt={`${unit.unitType} Floor Plan - Full View`}
                  width={1200}
                  height={800}
                  className="img-fluid rounded"
                  style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                />
                <div className="text-center mt-3">
                  <h5 className="text-white">{unit.unitType} - {unit.area}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UnitCard;

