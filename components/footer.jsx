import React from "react";
import Link from "next/link";
import Image from "next/image";
import SocialMediaLinks from "./SocialMediaLinks";

export default function Footer (){
    return(
        <footer className="bg-dark text-white border-top mt-5 p-md-3 mb-0 pb-5" style={{ marginBottom: 0 }}>
<div className="row p-md-5 p-4">
    <div className="col-md-3">
        <Image 
            src="/img/trans.png" 
            alt="Urbanesta" 
            width={150} 
            height={100} 
            className="mb-3" 
            loading="lazy"
            quality={90}
        />
        <h1>Urbanesta</h1>
    </div>
    <div className="col-md-3 ">
        <p className="fw-bold">Our <span className="text-danger">Services</span></p>
        <ul className="list-unstyled d-flex flex-column gap-2">
        <li>
        <Link href="/about" className="text-decoration-none text-white mx-3">About</Link>
        </li>
        <li>
        <Link href="/contact-us" className="text-decoration-none text-white mx-3">Contact US</Link>

        </li>
        <li>
        <Link href="/faq" className="text-decoration-none text-white mx-3">FAQ</Link>

        </li>
        <li>
        <Link href="/terms" className="text-decoration-none text-white mx-3">Terms & Conditions</Link>

        </li>
        <li>
        <Link href="/privacypolicy" className="text-decoration-none text-white mx-3">Privacy Policy</Link>

        </li>
          </ul>
    </div>
    <div className="col-md-3">
        <p className="fw-bold">Contact <span className="text-danger">INFO</span></p>
        <ul className="list-unstyled d-flex flex-column gap-2">

    <li><i className="bi bi-geo-alt-fill text-danger me-2"></i>1154, B2, Spaze I-Tech Park Sector-49, Gurgaon, India 122018</li>
    <li>
        <Link href="tel:+918886589000" className="btn btn-danger text-decoration-none text-white">
            <i className=" bi bi-telephone-fill text-white me-2"></i>+91 88865 89000
        </Link>
    </li>
    <li>
        <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'sales@urbanesta.com'}`} className="text-decoration-none text-white">
            <i className="bi bi-envelope-fill text-danger me-2"></i>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'sales@urbanesta.in'}
        </a>
    </li>
          </ul>
    </div>
    <div className="col-md-3 text-center">
        <p className="fw-bold">Follow <span className="text-danger">Us On</span></p>
        <SocialMediaLinks 
          size="fs-4" 
          color="text-danger" 
          className="justify-content-center" 
        />
    </div>
  
 
</div>
            <p className="m-3 text-center">© 2024 Urbanesta. All rights reserved.</p>
   
        </footer>   
    )
}