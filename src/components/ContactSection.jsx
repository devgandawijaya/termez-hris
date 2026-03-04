import React from 'react';

export default function ContactSection() {
  return (
    <section id="contacts" className="py-20 bg-indigo-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold mb-4 text-center">Contact Us</h2>
        <p className="text-gray-600 text-center mb-8">
          Have questions or want to collaborate? Reach out through any of the
          channels below.
        </p>
        <div className="flex flex-col md:flex-row md:justify-center gap-6">
          <div className="flex items-start space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 01-8 0 4 4 0 018 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14v7m0 0l3-3m-3 3l-3-3"
              />
            </svg>
            <div>
              <div className="font-semibold">Address</div>
              <div className="text-gray-600">Cibodas, kecamatan ciparay, desa cikoneng. kabupaten bandung</div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 01-8 0 4 4 0 018 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14v7m0 0l3-3m-3 3l-3-3"
              />
            </svg>
            <div>
              <div className="font-semibold">Email</div>
              <div className="text-gray-600">info@termez.com</div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 01-8 0 4 4 0 018 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14v7m0 0l3-3m-3 3l-3-3"
              />
            </svg>
            <div>
              <div className="font-semibold">Phone</div>
              <div className="text-gray-600">+622-727212</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}