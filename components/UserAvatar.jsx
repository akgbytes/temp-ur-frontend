"use client";

import React from "react";
import Link from "next/link";

const UserAvatar = ({ user }) => {
  if (!user) {
    return null;
  }

  // Get first name from full name
  const firstName = user.name ? user.name.split(' ')[0] : 'User';
  const initials = firstName.charAt(0).toUpperCase();

  return (
    <Link
      href="/user"
      className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
      style={{
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        padding: '0',
        border: '2px solid #dc3545',
        color: '#dc3545',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: 'transparent'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#dc3545';
        e.target.style.color = 'white';
        e.target.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.color = '#dc3545';
        e.target.style.transform = 'translateY(0)';
      }}
      title={`${user.name} (${user.city}) - Click to view profile`}
    >
      {initials}
    </Link>
  );
};

export default UserAvatar;
