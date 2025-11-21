'use client';

import { useState } from "react";

export default function FabricationPage() {
  const [openSections, setOpenSections] = useState({
    // Cheqroom sections
    whatIs: true,
    rules: false,
    agreement: false,
    equipment: false,
    // Printing sections
    laserPrinting: true,
    largeFormat: false,
    printMishaps: false,
    // Fabrication sections
    laserCutting: true,
    fdmPrinting: false,
    slaPrinting: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCheqroom = () => {
    const cheqroomSections = ['whatIs', 'rules', 'agreement', 'equipment'];
    const allOpen = cheqroomSections.every(key => openSections[key]);
    const newState = { ...openSections };
    cheqroomSections.forEach(key => {
      newState[key] = !allOpen;
    });
    setOpenSections(newState);
  };

  const togglePrinting = () => {
    const printingSections = ['laserPrinting', 'largeFormat', 'printMishaps'];
    const allOpen = printingSections.every(key => openSections[key]);
    const newState = { ...openSections };
    printingSections.forEach(key => {
      newState[key] = !allOpen;
    });
    setOpenSections(newState);
  };

  const toggleFabrication = () => {
    const fabricationSections = ['laserCutting', 'fdmPrinting', 'slaPrinting'];
    const allOpen = fabricationSections.every(key => openSections[key]);
    const newState = { ...openSections };
    fabricationSections.forEach(key => {
      newState[key] = !allOpen;
    });
    setOpenSections(newState);
  };
  return (
    <div className="animate-fadeIn">
      <div className="mb-12 animate-slideDown">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-stevens-maroon transition-all duration-300">
          Services
        </h1>
        <p className="text-xl text-gray-700 leading-relaxed">
          The Fab Lab offers a wide range of fabrication services and equipment.
          View our services, pricing, and policies below.
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .stagger-1 {
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }

        .stagger-2 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .stagger-3 {
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }
      `}</style>

      <div className="space-y-8">
        {/* Cheqroom Section */}
        <div className="card overflow-hidden transition-all duration-300 hover:shadow-xl animate-slideUp stagger-1">
          <div className="bg-linear-to-r from-stevens-maroon to-stevens-maroon-dark p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Cheqroom Equipment Checkout</h2>
              <button
                onClick={toggleCheqroom}
                className="text-sm px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105"
              >
                {['whatIs', 'rules', 'agreement', 'equipment'].every(key => openSections[key]) ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {/* What is Cheqroom? */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all shadow-sm">
              <button
                onClick={() => toggleSection('whatIs')}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stevens-maroon/10 flex items-center justify-center group-hover:bg-stevens-maroon/20 transition-colors">
                    <svg className="w-5 h-5 text-stevens-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">What is Cheqroom?</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${openSections.whatIs ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${openSections.whatIs ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    Cheqroom is an online platform that allows students of the VA+T department to check out equipment they need for their assignments and personal projects.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    In order to use cheqroom you must be a Visual Art+Tech major or currently enrolled in one of the VA+T classes. We require that you have a cheqroom account, which is made upon invitation by a fablab worker using your Stevens email. Once you have a user profile on cheqroom, you can then reserve equipment in advance and keep track of your checkout dates.
                  </p>
                </div>
              </div>
            </div>

            {/* Checkout Rules */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all shadow-sm">
              <button
                onClick={() => toggleSection('rules')}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stevens-maroon/10 flex items-center justify-center group-hover:bg-stevens-maroon/20 transition-colors">
                    <svg className="w-5 h-5 text-stevens-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">Checkout Rules</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${openSections.rules ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${openSections.rules ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100 space-y-5">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-stevens-maroon">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-stevens-maroon">•</span>
                      Checkout Windows
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      All checkouts are facilitated by a Fablab worker, and have a maximum checkout period of 4 days, including weekends. Upon your due date, you must come into the Fablab to either return your items, or request an extension. We ask that you come in person to request extensions, but if need be, you may also do so by emailing fablab@stevens.edu.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-stevens-maroon">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-stevens-maroon">•</span>
                      Check-in Requirements
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      All items must be returned with everything included upon checkout. For example, a mirrorless camera includes a camera case, battery, battery charger, SD card, and SD card reader. If one of these elements is missing from the camera upon return, the camera will be considered incomplete and rejected from check-in.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-stevens-maroon">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-stevens-maroon">•</span>
                      Late Fees
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      If you do not check in your equipment or request an extension by the checkout due date, you will not be able to check out any other equipment until the late equipment is returned and fees are paid. Each day the equipment is late, you will be charged a <strong className="text-stevens-maroon">$5 late fee per item</strong>. Items can only be returned during Fablab open hours, indicated on the schedule posted online and outside the Fablab. The Fablab does not take responsibility for missing attempted returns when it is closed. Exceptions will only be made if a Fablab worker is not present during their shift due to an emergency or sickness.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Agreement */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all shadow-sm">
              <button
                onClick={() => toggleSection('agreement')}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stevens-maroon/10 flex items-center justify-center group-hover:bg-stevens-maroon/20 transition-colors">
                    <svg className="w-5 h-5 text-stevens-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">User Agreement</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${openSections.agreement ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${openSections.agreement ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100">
                  <p className="text-gray-700 mb-4 font-medium">By using Cheqroom, you agree to:</p>
                  <div className="space-y-3">
                    {[
                      'Take caution and care when using checked out equipment',
                      'NOT, under any circumstances, loan equipment to another person or institution',
                      'NOT leave your checked out equipment unattended in hallways & classrooms',
                      'Promptly return your checked out equipment at the end of the borrow period',
                      'Pay all late fees accrued upon late return of equipment',
                      'Pay for any damages or loss of equipment during your time of possession'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
                        <svg className="w-5 h-5 text-stevens-maroon flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all shadow-sm">
              <button
                onClick={() => toggleSection('equipment')}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stevens-maroon/10 flex items-center justify-center group-hover:bg-stevens-maroon/20 transition-colors">
                    <svg className="w-5 h-5 text-stevens-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">Available Equipment</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${openSections.equipment ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${openSections.equipment ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100">
                  <p className="text-gray-700 mb-4 font-medium">Some of the items we offer for checkout include:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      'cameras, lenses, rigs/tripods',
                      'video production equipment',
                      'audio & recording equipment',
                      'speakers',
                      'headphones',
                      'lights, backdrops, studio equipment',
                      'projectors',
                      'monitors, mounts, keyboards, mice',
                      'adapters / cables / dongles',
                      'iPad Pros with apple pencils',
                      'Wacom Intuos Pro Tablets',
                      'GoPros',
                      'VR headsets & Mo-Cap suits',
                      'alienware',
                      'sewing machine & supplies',
                      'book-binding tools',
                      'art history books',
                      'tools, drills, levels, measuring tape'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
                        <svg className="w-4 h-4 text-stevens-maroon flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Printing Section */}
        <div className="card overflow-hidden transition-all duration-300 hover:shadow-xl animate-slideUp stagger-2">
          <div className="bg-linear-to-r from-stevens-maroon to-stevens-maroon-dark p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Printing</h2>
              <button
                onClick={togglePrinting}
                className="text-sm px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105"
              >
                {['laserPrinting', 'largeFormat', 'printMishaps'].every(key => openSections[key]) ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {/* Laser Printing */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all duration-300 shadow-sm hover:shadow-md">
              <button
                onClick={() => toggleSection('laserPrinting')}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stevens-maroon/10 flex items-center justify-center group-hover:bg-stevens-maroon/20 transition-colors">
                    <svg className="w-5 h-5 text-stevens-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">Laser Printing</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${openSections.laserPrinting ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${openSections.laserPrinting ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100">

              {/* Info Card */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Printer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-stevens-maroon/30 hover:scale-[1.01]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">Xerox VersaLink C7100</p>
                      <p className="text-sm text-gray-600">Color Printer & Scanner</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </div>
                      <span className="text-sm font-semibold text-green-800">Operational</span>
                    </div>
                  </div>
                  <a
                    href="https://www.office.xerox.com/latest/VC7EG-01U.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stevens-maroon hover:underline text-sm font-medium transition-all duration-200 hover:text-stevens-maroon-dark"
                  >
                    View User Manual →
                  </a>
                </div>
              </div>

              {/* Available Papers */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Available Papers</h4>
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Paper Type</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Size</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Standard</td>
                        <td className="px-4 py-3 text-gray-700">8.5" × 11"</td>
                        <td className="px-4 py-3 text-gray-700">20 LB</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Premium</td>
                        <td className="px-4 py-3 text-gray-700">8.5" × 11"</td>
                        <td className="px-4 py-3 text-gray-700">24 LB</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Premium Cover</td>
                        <td className="px-4 py-3 text-gray-700">8.5" × 11"</td>
                        <td className="px-4 py-3 text-gray-700">80 LB</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Natural Brown</td>
                        <td className="px-4 py-3 text-gray-700">8.5" × 11"</td>
                        <td className="px-4 py-3 text-gray-700">—</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Standard Tabloid</td>
                        <td className="px-4 py-3 text-gray-700">11" × 17"</td>
                        <td className="px-4 py-3 text-gray-700">20 LB</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Premium Tabloid</td>
                        <td className="px-4 py-3 text-gray-700">11" × 17"</td>
                        <td className="px-4 py-3 text-gray-700">28 LB</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Premium Cover Tabloid</td>
                        <td className="px-4 py-3 text-gray-700">11" × 17"</td>
                        <td className="px-4 py-3 text-gray-700">80 LB</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Pricing</h4>

                {/* B&W Pricing */}
                <div className="mb-4">
                  <h5 className="text-base font-semibold text-gray-900 mb-2">Black & White</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-300 rounded-lg text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Paper Type</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">8.5" × 11"</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">11" × 17"</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-3 text-gray-900">Standard</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.05</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.10</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-3 text-gray-900">Premium</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.05</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.10</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-3 text-gray-900">Premium Cover</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.15</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.20</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Color Pricing */}
                <div className="mb-4">
                  <h5 className="text-base font-semibold text-gray-900 mb-2">Color</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-300 rounded-lg text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Paper Type</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">8.5" × 11"</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">11" × 17"</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-3 text-gray-900">Standard</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.15</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.25</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-3 text-gray-900">Premium</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.15</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.25</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-3 text-gray-900">Premium Cover</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.25</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.35</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Student Supplied Paper */}
                <div>
                  <h5 className="text-base font-semibold text-gray-900 mb-2">Student Supplied Paper</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-300 rounded-lg text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Print Type</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">8.5" × 11"</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">11" × 17"</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-3 text-gray-900">B & W</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.02</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.10</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-3 text-gray-900">Color</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.05</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-medium">$0.20</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Email Requests */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Email Requests</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-300 hover:shadow-sm hover:border-blue-300">
                  <p className="text-gray-700 mb-3">
                    To request a laser print via email, send your file as a <strong>PDF</strong> to{' '}
                    <a href="mailto:fablab@stevens.edu" className="text-stevens-maroon font-semibold hover:underline transition-all duration-200 hover:text-stevens-maroon-dark">
                      fablab@stevens.edu
                    </a>
                  </p>
                  <p className="text-gray-700 mb-2 font-semibold text-sm">Include the following information:</p>
                  <ul className="space-y-1">
                    {[
                      'Specify "Laser Print"',
                      'Your name',
                      'The date',
                      'Paper size (8.5"×11" or 11"×17")',
                      'Paper type (Standard, Premium, Premium Cover, etc.)'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-stevens-maroon font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
                </div>
              </div>
            </div>

            {/* Large-Format Inkjet Printing */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all duration-300 shadow-sm hover:shadow-md">
              <button
                onClick={() => toggleSection('largeFormat')}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stevens-maroon/10 flex items-center justify-center group-hover:bg-stevens-maroon/20 transition-colors">
                    <svg className="w-5 h-5 text-stevens-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">Large-Format Inkjet Printing</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${openSections.largeFormat ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${openSections.largeFormat ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100">

              {/* Info Card */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Printer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-stevens-maroon/30 hover:scale-[1.01]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">Epson Stylus Pro 9900</p>
                      <p className="text-sm text-gray-600">Large-Format Inkjet Printer</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </div>
                      <span className="text-sm font-semibold text-green-800">Operational</span>
                    </div>
                  </div>
                  <a
                    href="https://files.support.epson.com/pdf/pro79_/pro79_ug.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stevens-maroon hover:underline text-sm font-medium transition-all duration-200 hover:text-stevens-maroon-dark"
                  >
                    View User Manual →
                  </a>
                </div>
              </div>

              {/* Available Papers */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Available Papers</h4>
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Paper Type</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Width</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Premium Luster Photo Paper</td>
                        <td className="px-4 py-3 text-gray-700">24" wide</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Premium Luster Photo Paper</td>
                        <td className="px-4 py-3 text-gray-700">44" wide</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Premium Glossy Photo Paper</td>
                        <td className="px-4 py-3 text-gray-700">24" wide</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Premium Glossy Photo Paper</td>
                        <td className="px-4 py-3 text-gray-700">44" wide</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Enhanced Matte</td>
                        <td className="px-4 py-3 text-gray-700">24" wide</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Enhanced Matte</td>
                        <td className="px-4 py-3 text-gray-700">44" wide</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Pricing</h4>
                <div className="bg-stevens-maroon/5 border-l-4 border-stevens-maroon rounded-lg p-5 transition-all duration-300 hover:shadow-md hover:bg-stevens-maroon/10">
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-stevens-maroon mb-1">$3.50 per square foot</p>
                    <p className="text-sm text-gray-600">All prints on the inkjet printer</p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">⚠️ Important Pricing Note:</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      This price accounts for both paper and ink. We charge <strong>$3.50 per square foot of paper used</strong>,
                      NOT just what's printed. We use the roll size that creates the least paper waste.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                    <p className="font-semibold text-gray-900 mb-2">Example Calculation:</p>
                    <p className="text-sm text-gray-700 mb-2">
                      If you want to print a file that is <strong>20"×15"</strong>, we would use the 24" wide roll
                      (to minimize waste).
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      Paper used: <strong>24"×15"</strong> = 2.5 square feet
                    </p>
                    <p className="text-sm text-gray-700">
                      Cost: 2.5 sq ft × $3.50 = <strong className="text-stevens-maroon">$8.75</strong>
                    </p>
                  </div>

                  <div className="text-sm text-gray-700">
                    <p className="mb-2"><strong>Available roll widths:</strong> 24" or 44"</p>
                    <p>
                      Please refer to{' '}
                      <a href="#" className="text-stevens-maroon hover:underline font-medium">
                        this calculator
                      </a>
                      {' '}to estimate your print cost based on our width options.
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Requests */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Email Requests</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-300 hover:shadow-sm hover:border-blue-300">
                  <p className="text-gray-700 mb-3">
                    To request a large-format print via email, send your file in <strong>PDF or AI format</strong> to{' '}
                    <a href="mailto:fablab@stevens.edu" className="text-stevens-maroon font-semibold hover:underline transition-all duration-200 hover:text-stevens-maroon-dark">
                      fablab@stevens.edu
                    </a>
                  </p>
                  <p className="text-gray-700 mb-2 font-semibold text-sm">Include the following information:</p>
                  <ul className="space-y-1">
                    {[
                      'Specify "Large-Format Print"',
                      'Your name',
                      'The date',
                      'Paper size',
                      'Paper type (Premium Luster, Premium Glossy, or Enhanced Matte)'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-stevens-maroon font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
                </div>
              </div>
            </div>

            {/* Print Mishaps Policy */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all duration-300 shadow-sm hover:shadow-md">
              <button
                onClick={() => toggleSection('printMishaps')}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stevens-maroon/10 flex items-center justify-center group-hover:bg-stevens-maroon/20 transition-colors">
                    <svg className="w-5 h-5 text-stevens-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">Print Mishaps Policy</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${openSections.printMishaps ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${openSections.printMishaps ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100">

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Fablab's Responsibility */}
                    <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:bg-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h4 className="font-bold text-green-900">Free Reprint</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">If the issue is from the Fablab's end:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          Misprint
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          Color inaccuracy
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          Smudging
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          Wrong size
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          Wrong paper type
                        </li>
                      </ul>
                      <p className="text-sm font-semibold text-green-800 mt-3">
                        → We will reprint at no charge
                      </p>
                    </div>

                    {/* User's Responsibility */}
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:bg-red-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <h4 className="font-bold text-red-900">You Pay for Reprints</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">If the issue is from your end:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          Typos or errors in content
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          File too small or compressed
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          Incorrect file format
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          Wrong design/layout
                        </li>
                      </ul>
                      <p className="text-sm font-semibold text-red-800 mt-3">
                        → You must pay for original + reprints
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fabrication Section */}
        <div className="card overflow-hidden transition-all duration-300 hover:shadow-xl animate-slideUp stagger-3">
          <div className="bg-linear-to-r from-stevens-maroon to-stevens-maroon-dark p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Fabrication</h2>
              <button
                onClick={toggleFabrication}
                className="text-sm px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105"
              >
                {['laserCutting', 'fdmPrinting', 'slaPrinting'].every(key => openSections[key]) ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {/* Laser Cutting */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all duration-300 shadow-sm hover:shadow-md">
              <button
                onClick={() => toggleSection('laserCutting')}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stevens-maroon/10 flex items-center justify-center group-hover:bg-stevens-maroon/20 transition-colors">
                    <svg className="w-5 h-5 text-stevens-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">Laser Cutting</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${openSections.laserCutting ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${openSections.laserCutting ? 'max-h-[8000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100">

              {/* Info Card */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Machine Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-stevens-maroon/30 hover:scale-[1.01]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">Universal Laser Systems VLS4.60</p>
                      <p className="text-sm text-gray-600">Laser Cutter</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg mb-2">
                        <div className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <span className="text-sm font-semibold text-green-800">Operational</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-yellow-900">Known Issue</p>
                        <p className="text-sm text-yellow-800">Slight sensor issue with opening/closing lid - machine is still functional</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <a href="https://www.jeffreythompson.org/lasercutter/" target="_blank" rel="noopener noreferrer" className="text-stevens-maroon hover:underline font-medium">
                      Material Database →
                    </a>
                    <a href="https://91a4cfd0-6490-4976-8a5a-8e3c46e809e1.filesusr.com/ugd/45daf8_24c12115fcd94bcc98912e43d64fecc2.ai?dn=LaserCutterTemplate.ai" target="_blank" rel="noopener noreferrer" className="text-stevens-maroon hover:underline font-medium">
                      Illustrator Template →
                    </a>
                    <a href="https://cdn.ulsinc.com/assets/pdf/user_guides/5f6bc5e03cc4b231f533ff40/vls_platform_user_guide.pdf" target="_blank" rel="noopener noreferrer" className="text-stevens-maroon hover:underline font-medium">
                      User Manual →
                    </a>
                  </div>
                </div>
              </div>

              {/* Available Materials */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Available Materials</h4>
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-yellow-900">⚠️ All student-supplied materials must be approved first!</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Material</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Size / Specifications</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="bg-gray-50">
                        <td colSpan={2} className="px-4 py-2 font-semibold text-gray-900">Acrylic</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 pl-8 text-gray-900">Clear</td>
                        <td className="px-4 py-2 text-gray-700">8.5" × 15.75" × 0.25"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 pl-8 text-gray-900">Fluorescent Amber</td>
                        <td className="px-4 py-2 text-gray-700">12" × 24" × 0.125"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 pl-8 text-gray-900">Fluorescent Gray</td>
                        <td className="px-4 py-2 text-gray-700">12" × 24" × 0.125"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 pl-8 text-gray-900">Opaque Red</td>
                        <td className="px-4 py-2 text-gray-700">12" × 24" × 0.125"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 pl-8 text-gray-900">Opaque Green</td>
                        <td className="px-4 py-2 text-gray-700">12" × 24" × 0.125"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 pl-8 text-gray-900">Opaque White</td>
                        <td className="px-4 py-2 text-gray-700">12" × 24" × 0.125"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 pl-8 text-gray-900">Opaque Black</td>
                        <td className="px-4 py-2 text-gray-700">12" × 24" × 0.125"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 text-gray-900">Chipboard</td>
                        <td className="px-4 py-2 text-gray-700">18" × 24" × 0.125"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 text-gray-900">Corrugated Cardboard</td>
                        <td className="px-4 py-2 text-gray-700">18" × 24" × 0.15"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 text-gray-900">Rubber Stamp</td>
                        <td className="px-4 py-2 text-gray-700">8" × 12" × 0.09"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Please refer to{' '}
                  <a href="https://www.jeffreythompson.org/lasercutter/" target="_blank" rel="noopener noreferrer" className="text-stevens-maroon hover:underline font-medium">
                    Jeff's Material Database
                  </a>
                  {' '}for setup reference.
                </p>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Pricing</h4>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white border border-gray-300 rounded-lg text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Material Type</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Student-Supplied Material</td>
                        <td className="px-4 py-3 text-center text-green-600 font-bold">Free</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Scrap Material</td>
                        <td className="px-4 py-3 text-center text-green-600 font-bold">Free</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Acrylic (Various Colors)</td>
                        <td className="px-4 py-3 text-center text-gray-700 font-medium">$16 - $17</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Bamboo Plywood</td>
                        <td className="px-4 py-3 text-center text-gray-700 font-medium">$19</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Chipboard</td>
                        <td className="px-4 py-3 text-center text-gray-700 font-medium">$3.25</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-gray-900">Corrugated Cardboard</td>
                        <td className="px-4 py-3 text-center text-gray-700 font-medium">$2.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Email Requests */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Email Requests</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-3">
                    To request a laser cut via email, send your file in <strong>PDF or AI format</strong> to{' '}
                    <a href="mailto:fablab@stevens.edu" className="text-stevens-maroon font-semibold hover:underline transition-all duration-200 hover:text-stevens-maroon-dark">
                      fablab@stevens.edu
                    </a>
                  </p>
                  <p className="text-gray-700 mb-2 font-semibold text-sm">Include the following information:</p>
                  <ul className="space-y-1">
                    {[
                      'Specify "Laser Cut"',
                      'Your name',
                      'The date',
                      'Material type (we will use a new sheet unless you request otherwise)',
                      'Dimensions of cut'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-stevens-maroon font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* File Requirements - CRITICAL */}
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5">
                  <h5 className="text-base font-bold text-red-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    IMPORTANT: File Requirements
                  </h5>
                  <p className="text-sm text-gray-700 mb-3">Your file must follow these laser-cut rules from the AI Template:</p>

                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border-l-4" style={{borderColor: '#FF0000'}}>
                      <p className="font-bold mb-1" style={{color: '#FF0000'}}>CUTS (Red)</p>
                      <p className="text-sm text-gray-700">Stroke width: <code className="bg-gray-100 px-1 py-0.5 rounded">0.001"</code> or <code className="bg-gray-100 px-1 py-0.5 rounded">0.072 pt</code></p>
                      <p className="text-sm text-gray-700">Color: Red (R 255, G 0, B 0) or <code className="bg-gray-100 px-1 py-0.5 rounded">#FF0000</code></p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border-l-4" style={{borderColor: '#0000FF'}}>
                      <p className="font-bold mb-1" style={{color: '#0000FF'}}>VECTOR ENGRAVING (Blue)</p>
                      <p className="text-sm text-gray-700">Stroke width: <code className="bg-gray-100 px-1 py-0.5 rounded">0.001"</code> or <code className="bg-gray-100 px-1 py-0.5 rounded">0.072 pt</code></p>
                      <p className="text-sm text-gray-700">Color: Blue (R 0, G 0, B 255) or <code className="bg-gray-100 px-1 py-0.5 rounded">#0000FF</code></p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border-l-4 border-gray-500">
                      <p className="font-bold text-gray-700 mb-1">RASTER ENGRAVING (Grayscale)</p>
                      <p className="text-sm text-gray-700">Use grayscale colors (darker = deeper engraving)</p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border-l-4 border-gray-700">
                      <p className="font-bold text-gray-900 mb-1">TYPE</p>
                      <p className="text-sm text-gray-700">Must be converted to outlines (<em>Type → Create Outlines</em>)</p>
                    </div>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>

            {/* FDM Printing (PLA) */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all duration-300 shadow-sm hover:shadow-md">
              <button
                onClick={() => toggleSection('fdmPrinting')}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stevens-maroon/10 flex items-center justify-center group-hover:bg-stevens-maroon/20 transition-colors">
                    <svg className="w-5 h-5 text-stevens-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">FDM Printing (PLA)</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${openSections.fdmPrinting ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${openSections.fdmPrinting ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100">

              {/* Info Card */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Printer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-stevens-maroon/30 hover:scale-[1.01]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">Bambu Lab X1-Carbon 3D Printer</p>
                      <p className="text-sm text-gray-600">FDM 3D Printer</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </div>
                      <span className="text-sm font-semibold text-green-800">Operational</span>
                    </div>
                  </div>
                  <a
                    href="https://cdn1.bambulab.com/documentation/Quick%20Start%20Guide%20for%20X1-Carbon%20Combo.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stevens-maroon hover:underline text-sm font-medium transition-all duration-200 hover:text-stevens-maroon-dark"
                  >
                    View User Manual →
                  </a>
                </div>
              </div>

              {/* Available Colors */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Available Colors</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    'Black',
                    'White',
                    'Silver',
                    'Blue',
                    'Tan',
                    'Blue Raspberry',
                    'Raspberry Gold'
                  ].map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200 transition-all duration-200 hover:border-stevens-maroon/40 hover:shadow-sm hover:scale-105 cursor-pointer">
                      <svg className="w-4 h-4 text-stevens-maroon flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{color}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <strong>Student-supplied filament</strong> prints free, but must be <strong>1.75mm</strong> and approved before printing.
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Pricing</h4>
                <div className="bg-stevens-maroon/5 border-l-4 border-stevens-maroon rounded-lg p-5 transition-all duration-300 hover:shadow-md hover:bg-stevens-maroon/10">
                  <p className="text-2xl font-bold text-stevens-maroon mb-1">$0.10 per gram</p>
                  <p className="text-sm text-gray-600">Weight should appear upon slicing your model</p>
                </div>
              </div>

              {/* Email Requests */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Email Requests</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-3">
                    To request an FDM print via email, send your file <strong>pre-sliced as an STL file</strong> to{' '}
                    <a href="mailto:fablab@stevens.edu" className="text-stevens-maroon font-semibold hover:underline transition-all duration-200 hover:text-stevens-maroon-dark">
                      fablab@stevens.edu
                    </a>
                  </p>
                  <p className="text-gray-700 mb-2 font-semibold text-sm">Include the following information:</p>
                  <ul className="space-y-1">
                    {[
                      'Specify "FDM Print"',
                      'Your name',
                      'The date',
                      'Color of filament',
                      'Weight of print, in grams (this information should appear upon slicing)'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-stevens-maroon font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 transition-all duration-300 hover:shadow-sm hover:bg-yellow-100">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-yellow-900">
                      <strong>Important:</strong> Please be sure to check that your model has the proper geometry, raft, and support structures to be printed. Otherwise the print may fail.
                    </p>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>

            {/* SLA Printing (Resin) */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all duration-300 shadow-sm hover:shadow-md">
              <button
                onClick={() => toggleSection('slaPrinting')}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stevens-maroon/10 flex items-center justify-center group-hover:bg-stevens-maroon/20 transition-colors">
                    <svg className="w-5 h-5 text-stevens-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">SLA Printing (Resin)</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${openSections.slaPrinting ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${openSections.slaPrinting ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100">

              {/* Info Card */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Printer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-stevens-maroon/30 hover:scale-[1.01]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">Elegoo Mars 3 Pro 4K 3D Printer</p>
                      <p className="text-sm text-gray-600">SLA Resin Printer</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </div>
                      <span className="text-sm font-semibold text-green-800">Operational</span>
                    </div>
                  </div>
                  <a
                    href="https://download.elegoo.com/04%20LCD%20Printer/05%20Mars%203/Manual/ELEGOO%20MARS%203&MARS%203%20PRO-Manual%20Book-English-20220614.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stevens-maroon hover:underline text-sm font-medium transition-all duration-200 hover:text-stevens-maroon-dark"
                  >
                    View User Manual →
                  </a>
                </div>
              </div>

              {/* Available Colors */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Available Colors</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {[
                    'Smokey Black',
                    'Opaque White'
                  ].map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200 transition-all duration-200 hover:border-stevens-maroon/40 hover:shadow-sm hover:scale-105 cursor-pointer">
                      <svg className="w-4 h-4 text-stevens-maroon flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{color}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> We use <strong>water washable photopolymer resin</strong>
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Pricing</h4>
                <div className="bg-stevens-maroon/5 border-l-4 border-stevens-maroon rounded-lg p-5 transition-all duration-300 hover:shadow-md hover:bg-stevens-maroon/10">
                  <p className="text-2xl font-bold text-stevens-maroon mb-1">$0.10 per gram</p>
                  <p className="text-sm text-gray-600">Weight should appear upon slicing your model</p>
                </div>
              </div>

              {/* Email Requests */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Email Requests</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-3">
                    To request an SLA print via email, send your file <strong>pre-sliced as a CTB (chitubox) file</strong> to{' '}
                    <a href="mailto:fablab@stevens.edu" className="text-stevens-maroon font-semibold hover:underline transition-all duration-200 hover:text-stevens-maroon-dark">
                      fablab@stevens.edu
                    </a>
                  </p>
                  <p className="text-gray-700 mb-2 font-semibold text-sm">Include the following information:</p>
                  <ul className="space-y-1">
                    {[
                      'Specify "SLA Print"',
                      'Your name',
                      'The date',
                      'Color of resin',
                      'Weight of print, in grams (this information should appear upon slicing)'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-stevens-maroon font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 transition-all duration-300 hover:shadow-sm hover:bg-yellow-100">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-yellow-900">
                      <strong>Important:</strong> Please be sure to check that your model has the proper geometry, raft, and support structures to be printed. Otherwise the print may fail.
                    </p>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
