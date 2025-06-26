import React from 'react';

const TermsOfUse = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
            <p className="italic mb-4">Effective Date: 26 May 2025</p>

            {[{
                title: '1. Eligibility',
                content: [
                    'You must be at least 18 years old to use Lumore. By using the App, you confirm that you are at least 18 years of age.'
                ]
            }, {
                title: '2. User Conduct',
                content: [
                    'Use the App for any unlawful or harmful purpose',
                    'Harass, abuse, defame, threaten, or impersonate others',
                    'Post or share content that is obscene, pornographic, or discriminatory',
                    'Attempt to collect or misuse other users&apos; data',
                    'Circumvent any security or moderation features',
                    'We reserve the right to suspend or terminate your account at our discretion for violations of these Terms or for conduct we determine to be harmful or inappropriate.'
                ]
            }, {
                title: '3. No Liability for User Interactions',
                content: [
                    'Lumore provides a platform to connect users but is not responsible for the actions, conduct, or outcomes of interactions between users, whether online or offline.',
                    'We do not perform background checks on users',
                    'We make no guarantees regarding user identity or intentions',
                    'We disclaim all liability arising from user interactions, including meetings, relationships, or harm of any kind',
                    'You are solely responsible for your interactions with other users. Exercise caution and use common sense when communicating or meeting in person.'
                ]
            }, {
                title: '4. Disclaimers and Limitation of Liability',
                content: [
                    'The App is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind.',
                    'To the fullest extent permitted by law, Lumore disclaims all warranties, express or implied, including but not limited to:',
                    'The accuracy or reliability of user profiles or content',
                    'That the App will operate without interruption or error',
                    'That any user connection will be safe or lead to a successful relationship',
                    'In no event shall Lumore or its affiliates be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use the App or resulting from interactions with other users.'
                ]
            }, {
                title: '5. Intellectual Property',
                content: [
                    'All content, trademarks, logos, and intellectual property on the App are the property of Lumore or its licensors.',
                    'You may not use or reproduce any content without our express written permission.'
                ]
            }, {
                title: '6. Governing Law and Jurisdiction',
                content: [
                    'These Terms are governed by and construed in accordance with the laws of India.',
                    'Any disputes arising from these Terms or your use of the App shall be subject to the exclusive jurisdiction of the courts located in [Insert city], India.'
                ]
            }, {
                title: '7. Contact Us',
                content: [
                    <span key="email">If you have any questions about these Terms, please contact us at: <a href="mailto:contact@lumore.xyz" className="text-blue-600 underline">contact@lumore.xyz</a></span>
                ]
            }].map(({ title, content }, idx) => (
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
                By using Lumore, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
            </div>
        </div>
    );
};

export default TermsOfUse;
