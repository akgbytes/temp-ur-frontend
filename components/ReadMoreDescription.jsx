"use client";

import { useState, useEffect, useRef } from 'react';

const ReadMoreDescription = ({ description, maxLines = 12 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      // Check if text is truncated
      const height = textRef.current.scrollHeight;
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
      const numberOfLines = height / lineHeight;
      
      setShouldShowButton(numberOfLines > maxLines);
    }
  }, [description, maxLines]);

  if (!description || description.trim() === 'No description available for this project.') {
    return (
      <p className="fs-5 text-muted mb-4">
        No description available for this project.
      </p>
    );
  }

  return (
    <div>
      <div
        ref={textRef}
        className="fs-5 text-muted mb-2"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: isExpanded ? 'visible' : 'hidden',
          textOverflow: isExpanded ? 'unset' : 'ellipsis',
          lineHeight: '1.6',
          wordBreak: 'break-word'
        }}
      >
        {description}
      </div>
      
      {shouldShowButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-link text-danger p-0 text-decoration-none mt-2"
          style={{ fontSize: '0.95rem', fontWeight: '500' }}
        >
          {isExpanded ? (
            <>
              <i className="bi bi-chevron-up me-1"></i>
              Read Less
            </>
          ) : (
            <>
              <i className="bi bi-chevron-down me-1"></i>
              Read More
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ReadMoreDescription;

