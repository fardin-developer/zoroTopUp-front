'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSiteConfig } from '../utils/siteConfig'

const Footer = () => {
  const [siteConfig, setSiteConfig] = useState({ name: 'Zennova', logo: '/zoro-logo.png' })
  const [isClient, setIsClient] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    // Mark as client-side to prevent hydration mismatch
    setIsClient(true)
    // Update site config on client side
    setSiteConfig(getSiteConfig())
    // Reset logo error when site config changes
    setLogoError(false)
  }, [])

  return (
    <footer className="hidden lg:block bg-[rgba(15,15,35,0.98)] backdrop-blur-xl border-t border-[rgba(100,255,218,0.12)] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {!logoError && siteConfig.logo ? (
                <img 
                  className="w-16 h-auto"
                  src={siteConfig.logo} 
                  alt={`${siteConfig.name} Logo`}
                  onError={() => setLogoError(true)}
                  onLoad={() => setLogoError(false)}
                />
              ) : (
                <h3 className="text-2xl font-bold text-[#64ffda]">{siteConfig.name}</h3>
              )}
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
            We provide a secure and efficient platform for gamers to instantly acquire diamonds, coins, and in-game credits at competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/50 hover:text-[#64ffda] transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-white/50 hover:text-[#64ffda] transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-white/50 hover:text-[#64ffda] transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-[#64ffda] transition-colors duration-300 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-white/70 hover:text-[#64ffda] transition-colors duration-300 text-sm">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/topup" className="text-white/70 hover:text-[#64ffda] transition-colors duration-300 text-sm">
                  Top Up
                </Link>
              </li>
              <li>
                <Link href="/feed" className="text-white/70 hover:text-[#64ffda] transition-colors duration-300 text-sm">
                  Feed
                </Link>
              </li>
              <li>
                <Link href="/wallet" className="text-white/70 hover:text-[#64ffda] transition-colors duration-300 text-sm">
                  Wallet
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact-us" className="text-white/70 hover:text-[#64ffda] transition-colors duration-300 text-sm">
                 Contact Us
                </Link>
              </li>

              <li>
                <Link href="/user-terms" className="text-white/70 hover:text-[#64ffda] transition-colors duration-300 text-sm">
                  Terms of Users
                </Link>
              </li>
              <li>
                <Link href="/terms-website" className="text-white/70 hover:text-[#64ffda] transition-colors duration-300 text-sm">
                  Terms of Website
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-white/70 hover:text-[#64ffda] transition-colors duration-300 text-sm">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-white/70 hover:text-[#64ffda] transition-colors duration-300 text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#64ffda] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-white/70 text-sm">
                    support@{isClient ? window.location.hostname.replace(/^www\./, '') : 'zennova.in'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#64ffda] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-white/70 text-sm">24/7 Customer Support</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#64ffda] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-white/70 text-sm">Secure & Safe Transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[rgba(100,255,218,0.12)] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/50 text-sm">
              © 2024 {siteConfig.name}. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-[#64ffda]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-white/70 text-sm">SSL Protected</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-[#64ffda]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-white/70 text-sm">Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer