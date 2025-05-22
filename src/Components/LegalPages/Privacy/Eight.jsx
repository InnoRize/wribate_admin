"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, Globe, Shield, FileText } from 'lucide-react';

export default function PrivacyPolicyRegional() {
  const [expandedSection, setExpandedSection] = useState("international");
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-6  shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy Regional Compliance</h1>
      
      {/* International Data Transfers Section */}
      <div className="mb-6 border-b pb-2">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection("international")}
        >
          <div className="flex items-center">
            <Globe className="mr-2 text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-700">International Data Transfers</h2>
          </div>
          {expandedSection === "international" ? 
            <ChevronUp className="text-gray-500" /> : 
            <ChevronDown className="text-gray-500" />
          }
        </div>
        
        {expandedSection === "international" && (
          <div className="mt-4 text-gray-600 space-y-4 pl-8">
            <p>
              Wribate is based in India, and your data is processed and stored on servers there, and potentially in other countries. 
              By using Wribate, you consent to the processing and storage of your data in the U.S. and other locations.
            </p>
            <p>
              <strong>Transfers from the EEA, UK, or Switzerland:</strong> For data transfers from these regions, 
              Wribate uses Standard Contractual Clauses approved by the European Commission or other adequate 
              mechanisms as required by law.
            </p>
          </div>
        )}
      </div>
      
      {/* EEA and UK Users Section */}
      <div className="mb-6 border-b pb-2">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection("eea")}
        >
          <div className="flex items-center">
            <Shield className="mr-2 text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-700">Additional Information for EEA and UK Users</h2>
          </div>
          {expandedSection === "eea" ? 
            <ChevronUp className="text-gray-500" /> : 
            <ChevronDown className="text-gray-500" />
          }
        </div>
        
        {expandedSection === "eea" && (
          <div className="mt-4 text-gray-600 space-y-4 pl-8">
            <p>
              If you reside in the European Economic Area (EEA), Wribate.com/IEPL, India is the controller of your 
              information in connection with our platform and this policy. If you're based in the United Kingdom (UK), 
              Wribate.com/IEPL, India is the data controller, and we may have a representative for GDPR purposes.
            </p>
            <p><strong>As an EEA or UK user, you have the following rights regarding your personal data:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access to your personal data</li>
              <li>Rectification or correction of inaccurate data</li>
              <li>Erasure (right to be forgotten)</li>
              <li>Data portability in certain situations</li>
              <li>Restriction of processing</li>
              <li>Objection to processing</li>
              <li>Withdrawal of consent if you previously provided it</li>
            </ul>
            <p>
              These rights can be exercised as detailed in the "Your Rights and Choices" section above. 
              EEA users can also lodge a complaint with your local supervisory authority.
            </p>
            <p><strong>Wribate processes your data only when there is a legal basis to do so. We rely on the following bases:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Contractual necessity: To provide, operate, and improve our services, and for customer support</li>
              <li>Legitimate interests: Such as preventing fraud, ensuring security, research, development, and marketing</li>
              <li>Your consent for specific purposes</li>
              <li>Legal obligations compliance</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* California Users Section */}
      <div className="mb-6">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection("california")}
        >
          <div className="flex items-center">
            <FileText className="mr-2 text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-700">Additional Information for California Users</h2>
          </div>
          {expandedSection === "california" ? 
            <ChevronUp className="text-gray-500" /> : 
            <ChevronDown className="text-gray-500" />
          }
        </div>
        
        {expandedSection === "california" && (
          <div className="mt-4 text-gray-600 space-y-4 pl-8">
            <p>
              Under the California Consumer Privacy Act (CCPA), Wribate provides the following additional 
              information for California residents:
            </p>
            <p>
              In the past 12 months, we may have collected the following categories of personal information from 
              California residents, depending on the services used:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Identifiers: such as username, email, phone number, and IP address</li>
              <li>Commercial information: related to transactions with Wribate</li>
              <li>Internet and network activity: information about your usage of our services</li>
              <li>Geolocation data: based on your IP address</li>
              <li>Communications: messages and interactions with other users</li>
              <li>Audiovisual information: such as images, audio, or video you submit</li>
              <li>Employment and demographic information: if provided (e.g., through job applications)</li>
              <li>Inferences: derived from other data for purposes like content recommendations</li>
            </ul>
            <p>For more details, please refer to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Information we collect: in the "Information We Collect" section</li>
              <li>How we use your information: in the "How We Use Your Information" section</li>
              <li>How we share your information: in the "How We Share Information" section</li>
            </ul>
            <p><strong>California residents have additional rights under the CCPA, such as:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Opting out of any "sale" or "sharing" of your personal information</li>
              <li>Requesting access, deletion, or correction of your personal data</li>
              <li>Protection from discrimination for exercising your privacy rights</li>
            </ul>
            <p>
              Wribate does not "sell" or "share" personal information as defined by the CCPA. We only use and 
              disclose sensitive data as required to provide services or as allowed by the CCPA.
            </p>
            <p>
              To exercise your CCPA rights, please refer to the "Your Rights and Choices" section. Requests will be 
              verified via your account login or additional information when necessary. If an authorized agent submits 
              a request on your behalf, a valid power of attorney or other proof of authorization may be required.
            </p>
            <p>
              For questions or concerns, please contact us at <a href="mailto:dataprivacy@wribate.com" className="text-blue-600 hover:underline">dataprivacy@wribate.com</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}