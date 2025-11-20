export default function Home() {
  return (
    <div className="-mt-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stevens-maroon via-stevens-maroon-dark to-stevens-maroon rounded-3xl mb-16">
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
              Fabrication lab for Stevens Visual Art & Technology department,
              offering photo and large-format inkjet printing, scanning, 3D
              printing, laser cutting, vinyl plotting, and equipment checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/order"
                className="px-8 py-4 bg-white text-stevens-maroon rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Place an Order →
              </a>
              <a
                href="/fabrication"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Coming Soon */}
      <section className="mb-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Services
          </h2>
          <p className="text-xl text-gray-600">
            Details coming soon
          </p>
        </div>
      </section>
    </div>
  );
}
