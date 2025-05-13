import React from 'react'

const PrivacyPolicy = () => {
    return (
        <div className='max-w-5xl mx-auto my-6'>
            <section className='p-3'>
                <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
                <div className="prose space-y-2">
                    <div><strong>Data Collected:</strong> We collect name, age, gender, interests, chats, location, and optional wallet addresses.</div>
                    <div><strong>Use of Data:</strong> Used for matchmaking, safety, UX, and analytics.</div>
                    <div><strong>Data Sharing:</strong> We do not sell data. Shared only with necessary third-party providers under strict terms.</div>
                    <div><strong>Profile Visibility:</strong> You control what profile data is shown. Profile is fully visible only after consent.</div>
                    <div><strong>Data Retention:</strong> Data is retained as needed or by law. You can request deletion.</div>
                    <div><strong>User Rights:</strong> You may access, correct, delete your data, or file privacy complaints.</div>
                    <div><strong>Security:</strong> We use encryption and access controls to protect data.</div>
                    <div><strong>Reporting:</strong> Harm or scams must be reported in-app. We investigate and ban offenders.</div>
                    <div><strong>Children:</strong> No data collected from users under 18. App not intended for minors.</div>
                    <div><strong>Policy Updates:</strong> Changes are announced via app or email. Continued use means acceptance.</div>
                </div>
            </section>
        </div>
    )
}

export default PrivacyPolicy