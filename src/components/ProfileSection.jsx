import React from 'react';

export default function ProfileSection() {
  return (
    <section id="profile" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold mb-4 text-center">Our Profile</h2>
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <img
              src="https://via.placeholder.com/400x300.png?text=Profile+Image"
              alt="profile"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <div>
            <p className="text-gray-600 mb-4">
              Established in 2015 in Bandung, West Java, our company has been continuously evolving as a technology-driven organization focused on Human Resource Management Systems (HRMS). Since our inception, we have been committed to developing innovative HR solutions that adapt to the latest technological advancements and regulatory requirements across different regions, industries, companies, and organizations.

Our HRMS products are designed to grow alongside businesses, ensuring compliance with local regulations while leveraging modern technologies to enhance efficiency, automation, and data-driven decision-making. We continuously refine and expand our solutions to meet the dynamic needs of today’s workforce and organizational structures.
            </p>
            <p className="text-gray-600">
              Our team consists of designers, developers, and strategists who
              work closely with you to bring your vision to life. Let's build
              something amazing together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}