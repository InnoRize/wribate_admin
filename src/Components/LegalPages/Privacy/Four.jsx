import React from 'react';

export default function InformationUsageSection() {
  const usageItems = [
    "Deliver and improve our platform and services",
    "Personalize content and features based on your preferences and activity",
    "Maintain safety and integrity by preventing abuse and enforcing our policies",
    "Provide and measure the effectiveness of ads and promotions",
    "Research and build new features and services",
    "Send important updates like technical notices, invoices, and security alerts",
    "Support you through responsive customer service",
    "Share relevant news and offers (with opt-out options available)",
    "Analyze usage trends to improve overall experience and performance"
  ];

  return (
    <section className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-md">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How We Use Your Information
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            At Wribate, we use the information we collect to:
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <ul className="space-y-4">
            {usageItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-base text-gray-700">{item}</p>
              </li>
            ))}
          </ul>
        </div>
    
      </div>
    </section>
  );
}