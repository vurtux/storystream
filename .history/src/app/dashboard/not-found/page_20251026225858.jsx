import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600 p-8 text-center transform transition-all hover:scale-[1.02]">
          {/* Image Container with Animation */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 rounded-full blur-2xl opacity-20 dark:opacity-30 animate-pulse"></div>
            <div className="relative">
              <Image
                src="/images/not-found.png"
                alt="Not Found"
                width={200}
                height={200}
                className="w-48 h-48 mx-auto drop-shadow-lg dark:drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Error Code */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white text-sm font-semibold rounded-full shadow-lg">
              404 Error
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">
            Oops! Nothing Here
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Sorry, the keyword you entered cannot be found. Please check again
            or search with another keyword.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 transform hover:-translate-y-0.5 transition-all duration-200">
              Go Back Home
            </button>
            <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all duration-200">
              Try Again
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-pink-500 dark:bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}