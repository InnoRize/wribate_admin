"use client"
import React, { useState } from 'react';

export default function RightsAndChoicesSection() {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 'rights',
      title: 'Your Rights and Choices',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            You have control over your personal information and can choose how it's collected, used, and shared. 
            Depending on your location, you may have the following rights:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-blue-500 font-medium mr-2">•</span>
              <span><span className="font-medium">Access and Correction</span> — You can access and update your personal information.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-medium mr-2">•</span>
              <span><span className="font-medium">Opt-Out</span> — You can opt out of certain advertising practices and data collection.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-medium mr-2">•</span>
              <span><span className="font-medium">Withdraw Consent</span> — If you've previously given consent for data processing, you can withdraw it at any time.</span>
            </li>
          </ul>
          <p className="text-gray-700 italic">
            We do not discriminate against users for exercising these rights.
          </p>
        </div>
      )
    },
    {
      id: 'access',
      title: 'Accessing and Changing Your Information',
      content: (
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-blue-500 font-medium mr-2">•</span>
            <span><span className="font-medium">Access & Update:</span> You can view and update your information through the Services. Check the Help Center for more details.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 font-medium mr-2">•</span>
            <span><span className="font-medium">Requesting Your Data:</span> You can request a copy of your personal information by following the process outlined in the Help Center.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 font-medium mr-2">•</span>
            <span><span className="font-medium">Deleting Your Account:</span> You can delete your account anytime via your user preferences page. After deletion, your profile will no longer be visible, but your posts/comments will still be accessible unless deleted individually. The deletion process may take up to 90 days.</span>
          </li>
        </ul>
      )
    },
    {
      id: 'linked',
      title: 'Controlling Linked Services',
      content: (
        <p className="text-gray-700">
          You can revoke third-party services' access to your account by managing connections in the relevant sections of your Account Settings.
        </p>
      )
    },
    {
      id: 'ads',
      title: 'Controlling Personalized Advertising',
      content: (
        <p className="text-gray-700">
          You can opt out of personalized ads in your Privacy Settings under User Settings.
        </p>
      )
    },
    {
      id: 'cookies',
      title: 'Controlling Cookies',
      content: (
        <p className="text-gray-700">
          You can manage cookie preferences through your browser settings, though this may affect site functionality. Check the Cookie Notice for more details.
        </p>
      )
    },
    {
      id: 'analytics',
      title: 'Controlling Advertising & Analytics',
      content: (
        <p className="text-gray-700">
          You can manage data collection for analytics and personalized ads through specific opt-out mechanisms and tools such as Google Analytics Opt-out Browser Add-on and networks like Nielsen.
        </p>
      )
    },
    {
      id: 'dnt',
      title: 'Do Not Track',
      content: (
        <p className="text-gray-700">
          While we don't respond to the Do Not Track signal, you can manage your information through other tools as described in this policy.
        </p>
      )
    },
    {
      id: 'promo',
      title: 'Controlling Promotional Communications',
      content: (
        <p className="text-gray-700">
          You can opt out of promotional emails by following the instructions in the emails or updating preferences in your account settings.
        </p>
      )
    },
    {
      id: 'mobile',
      title: 'Controlling Mobile Notifications',
      content: (
        <p className="text-gray-700">
          You can manage push notifications in your mobile device's settings.
        </p>
      )
    },
    {
      id: 'location',
      title: 'Controlling Location Information',
      content: (
        <p className="text-gray-700">
          Control location use for customization via the Location Customization setting in Account Settings.
        </p>
      )
    },
    {
      id: 'contact',
      title: 'Contacting for Data Requests',
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">
            If you're unable to submit a request through the available methods, you can email support@wribate.com from your Wribate verified email address.
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Request Verification:</span> Wribate will verify your request by confirming access to your account or verified email. If your request is denied, you can appeal by emailing the same address.
          </p>
        </div>
      )
    }
  ];

  const toggleSection = (id) => {
    if (expandedSection === id) {
      setExpandedSection(null);
    } else {
      setExpandedSection(id);
    }
  };

  return (
    <section className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white  shadow-md">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your Rights and Choices
          </h2>
        </div>
        
        <div className="mt-6 space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              >
                <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                <svg
                  className={`h-5 w-5 text-gray-500 transform ${expandedSection === section.id ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {expandedSection === section.id && (
                <div className="px-6 pb-4 pt-2">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}