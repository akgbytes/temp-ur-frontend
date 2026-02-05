"use client";
import React from "react";
import Link from "next/link";

export default function SocialMediaLinks({ 
  size = "fs-4", 
  color = "text-danger", 
  className = "",
  showLabels = false 
}) {
  const socialLinks = [
    {
      name: "YouTube",
      url: "https://www.youtube.com/@URBANESTA_REALTORS",
      icon: "bi-youtube",
      label: "Subscribe to our YouTube channel"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/p/Urbanesta-Realtors-100084916597806/",
      icon: "bi-facebook",
      label: "Follow us on Facebook"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/urbanesta-realtors/",
      icon: "bi-linkedin",
      label: "Connect with us on LinkedIn"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/urbanesta_realtors/",
      icon: "bi-instagram",
      label: "Follow us on Instagram"
    }
  ];

  return (
    <div className={`d-flex gap-3 ${className}`}>
      {socialLinks.map((social) => (
        <Link
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none"
          title={social.label}
        >
          <i className={`bi ${social.icon} ${color} ${size}`}></i>
          {showLabels && (
            <span className="ms-2 small">{social.name}</span>
          )}
        </Link>
      ))}
    </div>
  );
}
