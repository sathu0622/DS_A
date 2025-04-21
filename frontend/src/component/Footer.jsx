import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-8">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Footer Sections */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>Features</li>
            <li>Food Menu</li>
            <li>Offer</li>
            <li>Review</li>
            <li>Rider</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Get to Know Us</h4>
          <ul className="space-y-2">
            <li>Gift Cards</li>
            <li>DoorDash Stories</li>
            <li>LinkedIn</li>
            <li>Glassdoor</li>
            <li>Accessibility</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">News</h4>
          <ul className="space-y-2">
            <li>Blog</li>
            <li>FAQ</li>
            <li>Lift Media</li>
            <li>Press</li>
            <li>Press Kit</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2">
            <li>WhatsApp</li>
            <li>Support 24</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-sm mb-4">&#169; 2025. All rights reserved</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
          <a href="/privacy" className="hover:text-white">Privacy</a>
          <a href="/policy" className="hover:text-white">Policy</a>
          <a href="/terms" className="hover:text-white">Terms</a>
          <a href="/services" className="hover:text-white">Services</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;