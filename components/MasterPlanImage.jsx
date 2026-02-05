'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const MasterPlanImage = ({ masterPlan, projectName }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="position-relative">
        <Image
          src={masterPlan}
          alt={`${projectName} Master Plan`}
          width={800}
          height={600}
          className="img-fluid rounded"
          style={{ objectFit: 'contain', cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        />
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-light position-absolute"
          style={{
            bottom: '20px',
            right: '20px',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10
          }}
          title="View Full Master Plan"
        >
          <i className="bi bi-arrows-fullscreen" style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>

      {/* Modal for Full Master Plan */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999 }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-fullscreen">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0 position-absolute" style={{ top: '20px', right: '20px', zIndex: 10000 }}>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                  style={{ fontSize: '1.5rem' }}
                ></button>
              </div>
              <div className="modal-body d-flex align-items-center justify-content-center p-4" onClick={(e) => e.stopPropagation()}>
                <div className="text-center w-100">
                  <Image
                    src={masterPlan}
                    alt={`${projectName} Master Plan - Full View`}
                    width={1600}
                    height={1200}
                    className="img-fluid rounded"
                    style={{ objectFit: 'contain', maxHeight: '90vh' }}
                  />
                  <div className="mt-3">
                    <h4 className="text-white">Master Plan - {projectName}</h4>
                    <p className="text-white-50">Click anywhere to close</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MasterPlanImage;

