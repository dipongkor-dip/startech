export default function DesktopServicePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Desktop Service
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Professional desktop repair and maintenance services
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Hardware Repair</h3>
          <p className="text-gray-600 dark:text-gray-300">Motherboard, CPU, RAM repairs</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Software Support</h3>
          <p className="text-gray-600 dark:text-gray-300">OS installation and troubleshooting</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Custom Builds</h3>
          <p className="text-gray-600 dark:text-gray-300">Professional PC assembly</p>
        </div>
      </div>
    </div>
  );
}