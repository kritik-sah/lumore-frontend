import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="italic mb-4">Effective Date: 26 may 2025</p>
            <p className="mb-6">Lumore (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (&quot;App&quot;). By using Lumore, you agree to the practices described in this Privacy Policy.</p>

            {[
                {
                    title: '1. Information We Collect',
                    content: [
                        'Personal Information: Name, email address, age, gender, profile photos, preferences, and social media login credentials.',
                        'Location Data: Real-time geographic location (updated approximately every 10 minutes).',
                        'Sensitive Information: Sexual orientation, health-related information (including smoking and drinking habits, blood group), religious beliefs, and ethnicity, as provided voluntarily.',
                        'User-Generated Content: Messages, photos, profile details, and other information shared voluntarily by users.',
                        'Device and Usage Information: IP address, device identifiers, operating system, mobile network, and app usage statistics.'
                    ]
                },
                {
                    title: '2. How We Use Your Information',
                    content: [
                        'Provide matchmaking and personalized user experiences',
                        'Ensure user safety and maintain the integrity of the platform',
                        'Operate, maintain, and improve the App',
                        'Monitor and analyze trends and usage patterns (via Google Analytics)',
                        'Manage payments (via Google Play)',
                        'Serve relevant advertisements (via Google Ads)'
                    ]
                },
                {
                    title: '3. Sharing of Information',
                    content: [
                        'Third-party service providers including Google Analytics, Google Ads, and Google Play for payments, analytics, and advertising',
                        'Law enforcement or regulatory bodies when required by law',
                        'Cloud hosting and infrastructure providers involved in operating our service',
                        'We do not sell your personal data.'
                    ]
                },
                {
                    title: '4. Location Tracking',
                    content: [
                        'We collect your real-time location data approximately every 10 minutes to support location-based features within the App. You may disable location tracking through your device settings, but this may affect functionality.'
                    ]
                },
                {
                    title: "5. Children's Privacy",
                    content: [
                        'The App is intended for users 18 years and older. We do not knowingly collect or solicit data from anyone under the age of 18. Users cannot register or select an age below 18 in the app.'
                    ]
                },
                {
                    title: '6. Child Safety Policy',
                    content: [
                        'Lumore is strictly intended for adult users aged 18 and above. We do not target or serve any content, features, or functionality designed for children under the age of 18.',
                        'We implement age screening mechanisms during registration to prevent children from accessing the platform.',
                        'We do not knowingly collect, solicit, or store any personal data from users under the age of 18.',
                        'If we become aware that we have inadvertently collected personal data from a user under the age of 18, we will delete such information immediately.',
                        <span key="link">We comply with <a href="https://support.google.com/googleplay/android-developer/answer/14747720" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Google Play&apos;s Families Policy Requirements</a> and the applicable user data and content standards.</span>,
                        <span key="email">If you believe a child has used Lumore in violation of this policy, please contact us immediately at <a href="mailto:contact@lumore.xyz" className="text-blue-600 underline">contact@lumore.xyz</a> so we can take appropriate action.</span>
                    ]
                },
                {
                    title: '7. Data Retention',
                    content: [
                        'Messages are retained for a maximum of 24 hours before being deleted automatically.',
                        'Other personal data is stored securely in servers located in India, the US, and other jurisdictions.'
                    ]
                },
                {
                    title: '8. Data Security',
                    content: [
                        'End-to-end encryption for chat messages',
                        'Encrypted storage of passwords',
                        'Access control and secure data storage practices'
                    ]
                },
                {
                    title: '9. Your Rights',
                    content: [
                        'Access, correct, or delete your personal data',
                        'Object to or restrict certain types of data processing',
                        'Withdraw consent for data collection (where applicable)',
                        <span key="email2">To exercise these rights, contact us at: <a href="mailto:contact@lumore.xyz" className="text-blue-600 underline">contact@lumore.xyz</a></span>
                    ]
                },
                {
                    title: '10. Changes to This Policy',
                    content: [
                        'We reserve the right to modify this Privacy Policy at any time. Changes will be posted in the App and will take effect upon posting. Continued use of the App indicates your acceptance of the revised policy.'
                    ]
                },
                {
                    title: '11. Contact Us',
                    content: [
                        <span key="email3">If you have questions or concerns about this Privacy Policy or your data, please contact us at: <strong>Email</strong>: <a href="mailto:contact@lumore.xyz" className="text-blue-600 underline">contact@lumore.xyz</a></span>
                    ]
                }
            ].map(({ title, content }, idx) => (
                <section key={idx} className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{title}</h2>
                    <ul className="list-disc ml-5 space-y-1">
                        {content.map((item, subIdx) => (
                            <li key={subIdx} className="text-gray-700">{item}</li>
                        ))}
                    </ul>
                </section>
            ))}

            <div className="mt-10 border-t pt-6 text-sm italic text-gray-600">
                We recommend that you review this Privacy Policy regularly. Your continued use of Lumore signifies acceptance of our practices.
            </div>
        </div>
    );
};

export default PrivacyPolicy;
