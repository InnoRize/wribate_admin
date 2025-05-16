export default function PublicPlatformSection() {
    return (
      <div className="max-w-4xl mx-auto bg-white ">
        <div className="px-6 py-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Wribate is a Public Platform
          </h2>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            Much of what you share on Wribate.com is public by default and visible to anyone—even without an account.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            When you post content (like wribates, arguments, written debates, comments, or messages) in public areas, 
            it may be viewed by other users, visitors, or appear in search engines (e.g., Google) or AI responses 
            (e.g., ChatGPT). Your username, post date/time, and public profile will be visible alongside that content.
          </p>
          
          {/* Profile Information Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Your Wribate profile may include:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Username and profile picture</li>
              <li>Public posts and debates</li>
              <li>Join date and other activity info</li>
            </ul>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            We also provide social sharing options that let you share Wribate content externally 
            (e.g., on X, LinkedIn, Facebook). Please review those platforms' privacy settings when 
            using these features.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Additionally, Wribate content may be accessible through moderation tools, APIs, or 
            developer integrations for approved third parties.
          </p>
          
          {/* Important Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex mb-2">
            <div className="mr-3">
              <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 font-medium">
                Be mindful of what you post—Wribate is built for open, thoughtful dialogue, and your 
                content may be visible far beyond the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }