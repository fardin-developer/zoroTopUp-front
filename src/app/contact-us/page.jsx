'use client'
import React from 'react'

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-6 md:px-20">
      <div className="max-w-4xl mx-auto bg-gray-200 shadow-xl rounded-2xl p-10">
        <h1 className="text-3xl font-bold text-center text-primary mb-4">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-10">
          We'd love to hear from you. Whether you have a question about top-ups, features, pricing, or anything else — our team is ready to help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">Business Information</h2>
            <div className="text-gray-700 space-y-4">
              <div>
                <p className="font-medium">Company Name:</p>
                <p>ONESTEPLINK (OPC) PRIVATE LIMITED</p>
              </div>
              <div>
                <p className="font-medium">CIN:</p>
                <p>U82990AS2023OPC025559</p>
              </div>
              <div>
                <p className="font-medium">Registered Address:</p>
                <p>
                  House No. 451, Palash Basti Road,<br />
                  Barsala, Bogipukhuri, Sonitpur,<br />
                  Alisinga, Assam – 784112, India
                </p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>support@zeonnova.in</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl mb-4 text-gray-600">Send a Message</h2>
            <form className="space-y-5 text-gray-600">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  rows="4"
                  placeholder="Write your message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
