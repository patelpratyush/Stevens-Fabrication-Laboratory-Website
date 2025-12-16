'use client';

import { useState } from 'react';

export default function Home() {
  const [open, setOpen] = useState({
    printing: true,
    fabrication: false,
    policies: false,
    laserPrinting: false,
    largeFormat: false,
    printMishaps: false,
    laserCutting: false,
    fdmPrinting: false,
    slaPrinting: false,
  });

  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const toggleGroup = (groupKeys) => {
    const allOpen = groupKeys.every((k) => open[k]);
    const next = { ...open };
    groupKeys.forEach((k) => (next[k] = !allOpen));
    setOpen(next);
  };

  return (
    <div className="-mt-6 animate-fadeIn">
      {/* Hero Section */}
      
      <section className="relative overflow-hidden bg-linear-to-br from-stevens-maroon via-stevens-maroon-dark to-stevens-maroon rounded-3xl mb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="relative px-6 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6">
              Stevens Institute of Technology
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              VA+T FabLab
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Photo & large-format inkjet printing, scanning, 3D printing, laser cutting,
              vinyl plotting, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                className="px-8 py-4 bg-white text-stevens-maroon rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Place an Order →
              </a>
              <a
                href="/services"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      {/* Quick Services */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Services
          </h2>
          <p className="text-xl text-gray-600">
            Quick overview (full details on the Services page)
          </p>
        </div>


        {/* Equipment Checkout */}
<div className="card overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="bg-linear-to-r from-stevens-maroon to-stevens-maroon-dark p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-white">Equipment Checkout</h3>
      <button
        onClick={() => toggleGroup(['checkoutRules', 'checkoutPolicy'])}
        className="text-sm px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all backdrop-blur-sm border border-white/30"
      >
        {['checkoutRules', 'checkoutPolicy'].every((k) => open[k]) ? 'Collapse All' : 'Expand All'}
      </button>
    </div>
  </div>

  <div className="p-6 space-y-3">
    <Dropdown
      title="Checkout Rules"
      open={open.checkoutRules}
      onToggle={() => toggle('checkoutRules')}
    >
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border-l-4 border-stevens-maroon">
          <h5 className="font-semibold text-gray-900 mb-2">Checkout Window</h5>
          <p className="text-gray-700 leading-relaxed">
            Equipment is checked out through the Fab Lab system and facilitated by a Fab Lab worker.
            The maximum checkout period is <strong>4 days (including weekends)</strong>. On your due date,
            return items or request an extension during open hours. If needed, email{' '}
            <a href="mailto:fablab@stevens.edu" className="text-stevens-maroon font-semibold hover:underline">
              fablab@stevens.edu
            </a>.
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border-l-4 border-stevens-maroon">
          <h5 className="font-semibold text-gray-900 mb-2">Check-in Requirements</h5>
          <p className="text-gray-700 leading-relaxed">
            All items must be returned with <strong>everything included</strong> at checkout (cases, chargers,
            cables, SD cards, etc.). Missing components may result in the return being rejected.
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border-l-4 border-stevens-maroon">
          <h5 className="font-semibold text-gray-900 mb-2">Late Fees</h5>
          <p className="text-gray-700 leading-relaxed">
            If you don’t return equipment or request an extension by the due date, you won’t be able to check out
            additional items until late items are returned and fees are paid. Late fee is{' '}
            <strong className="text-stevens-maroon">$5 per item per day</strong>. Returns are only accepted during
            open hours.
          </p>
        </div>
      </div>
    </Dropdown>

    <Dropdown
      title="Checkout Agreement"
      open={open.checkoutPolicy}
      onToggle={() => toggle('checkoutPolicy')}
    >
      <div className="space-y-3">
        {[
          'Handle checked out equipment with care',
          'Do not loan equipment to another person or institution',
          'Do not leave checked out equipment unattended in hallways or classrooms',
          'Return items promptly by the due date',
          'Pay any late fees accrued',
          'Pay for damages or loss during your possession',
        ].map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
            <span className="text-stevens-maroon font-bold">•</span>
            <span className="text-gray-700">{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <a href="/equipment" className="text-stevens-maroon font-semibold hover:underline">
          Go to Equipment Checkout →
        </a>
      </div>
    </Dropdown>
  </div>
</div>



        <div className="space-y-8">
          {/* Printing */}
          <div className="card overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-linear-to-r from-stevens-maroon to-stevens-maroon-dark p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Printing</h3>
                <button
                  onClick={() => toggleGroup(['laserPrinting', 'largeFormat', 'printMishaps'])}
                  className="text-sm px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all backdrop-blur-sm border border-white/30"
                >
                  {['laserPrinting', 'largeFormat', 'printMishaps'].every((k) => open[k])
                    ? 'Collapse All'
                    : 'Expand All'}
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {/* Laser Printing */}
              <Dropdown
                title="Laser Printing"
                open={open.laserPrinting}
                onToggle={() => toggle('laserPrinting')}
              >
                <ul className="text-gray-700 space-y-2">
                  <li>• Xerox VersaLink C7100 (color printer/scanner)</li>
                  <li>• Pricing starts at $0.05 (B&W) and $0.15 (color) depending on paper</li>
                  <li>
                    • Email requests: send PDF to{' '}
                    <a className="text-stevens-maroon font-semibold hover:underline" href="mailto:fablab@stevens.edu">
                      fablab@stevens.edu
                    </a>
                  </li>
                </ul>
                <div className="mt-4">
                  <a href="/services" className="text-stevens-maroon font-semibold hover:underline">
                    View full printing details →
                  </a>
                </div>
              </Dropdown>

              {/* Large Format */}
              <Dropdown
                title="Large-Format Inkjet Printing"
                open={open.largeFormat}
                onToggle={() => toggle('largeFormat')}
              >
                <ul className="text-gray-700 space-y-2">
                  <li>• Epson Stylus Pro 9900</li>
                  <li>• $3.50 per square foot of paper used (not just printed area)</li>
                  <li>
                    • Email requests: PDF/AI to{' '}
                    <a className="text-stevens-maroon font-semibold hover:underline" href="mailto:fablab@stevens.edu">
                      fablab@stevens.edu
                    </a>
                  </li>
                </ul>
                <div className="mt-4">
                  <a href="/services" className="text-stevens-maroon font-semibold hover:underline">
                    View full large-format details →
                  </a>
                </div>
              </Dropdown>

              {/* Print Mishaps */}
              <Dropdown
                title="Print Mishaps Policy"
                open={open.printMishaps}
                onToggle={() => toggle('printMishaps')}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                    <p className="font-bold text-green-900 mb-2">Free Reprint</p>
                    <p className="text-sm text-gray-700">
                      If the issue is on our end (misprint, wrong size, wrong paper, etc.), we reprint at no charge.
                    </p>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                    <p className="font-bold text-red-900 mb-2">You Pay for Reprints</p>
                    <p className="text-sm text-gray-700">
                      If the issue is on your end (typos, wrong format, low-res file, etc.), you pay for original + reprint.
                    </p>
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>

          {/* Fabrication */}
          <div className="card overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-linear-to-r from-stevens-maroon to-stevens-maroon-dark p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Fabrication</h3>
                <button
                  onClick={() => toggleGroup(['laserCutting', 'fdmPrinting', 'slaPrinting'])}
                  className="text-sm px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all backdrop-blur-sm border border-white/30"
                >
                  {['laserCutting', 'fdmPrinting', 'slaPrinting'].every((k) => open[k])
                    ? 'Collapse All'
                    : 'Expand All'}
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <Dropdown
                title="Laser Cutting"
                open={open.laserCutting}
                onToggle={() => toggle('laserCutting')}
              >
                <ul className="text-gray-700 space-y-2">
                  <li>• Universal Laser Systems VLS4.60</li>
                  <li>• Student-supplied & scrap materials are free (must be approved)</li>
                  <li>
                    • Email requests: PDF/AI to{' '}
                    <a className="text-stevens-maroon font-semibold hover:underline" href="mailto:fablab@stevens.edu">
                      fablab@stevens.edu
                    </a>
                  </li>
                </ul>
                <div className="mt-4">
                  <a href="/services" className="text-stevens-maroon font-semibold hover:underline">
                    View laser cutting requirements →
                  </a>
                </div>
              </Dropdown>

              <Dropdown
                title="FDM Printing (PLA)"
                open={open.fdmPrinting}
                onToggle={() => toggle('fdmPrinting')}
              >
                <ul className="text-gray-700 space-y-2">
                  <li>• Bambu Lab X1-Carbon</li>
                  <li>• $0.10 per gram</li>
                  <li>
                    • Email requests: STL + details to{' '}
                    <a className="text-stevens-maroon font-semibold hover:underline" href="mailto:fablab@stevens.edu">
                      fablab@stevens.edu
                    </a>
                  </li>
                </ul>
              </Dropdown>

              <Dropdown
                title="SLA Printing (Resin)"
                open={open.slaPrinting}
                onToggle={() => toggle('slaPrinting')}
              >
                <ul className="text-gray-700 space-y-2">
                  <li>• Elegoo Mars 3 Pro</li>
                  <li>• $0.10 per gram</li>
                  <li>
                    • Email requests: CTB + details to{' '}
                    <a className="text-stevens-maroon font-semibold hover:underline" href="mailto:fablab@stevens.edu">
                      fablab@stevens.edu
                    </a>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>

          {/* Footer link */}
          <div className="text-center">
            <a
              href="/services"
              className="inline-block px-6 py-3 bg-stevens-maroon text-white rounded-xl font-bold hover:bg-stevens-maroon-dark transition-all"
            >
              See Full Services Page →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Dropdown({ title, open, onToggle, children }) {
  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-stevens-maroon/30 transition-all shadow-sm">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
      >
        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-stevens-maroon transition-colors">
          {title}
        </h4>
        <svg
          className={`w-5 h-5 text-stevens-maroon transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`transition-all duration-300 ease-in-out ${open ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 py-5 bg-gray-50/50 border-t-2 border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
