export default function OrderPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Create an Order</h1>
      <p className="text-gray-700 mb-8">
        Use our price calculator to estimate costs and add items to your cart.
        The full ordering system will be available soon.
      </p>

      <div className="bg-red-50 border-2 border-stevens-maroon rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2 text-stevens-maroon">
          Coming Soon: Price Calculator
        </h2>
        <p className="text-sm text-gray-700">
          Upload your design files, select materials and options, and get an
          instant price quote.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">📄</div>
          <h3 className="font-semibold mb-1">1. Upload Files</h3>
          <p className="text-sm text-gray-600">
            Upload your CAD or design files
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">⚙️</div>
          <h3 className="font-semibold mb-1">2. Configure</h3>
          <p className="text-sm text-gray-600">Choose materials and settings</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">🛒</div>
          <h3 className="font-semibold mb-1">3. Submit Order</h3>
          <p className="text-sm text-gray-600">Review and place your order</p>
        </div>
      </div>
    </section>
  );
}
