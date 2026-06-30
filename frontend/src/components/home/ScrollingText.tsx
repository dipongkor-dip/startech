"use client";

const announcements = [
  "🔥 Summer Sale: Up to 30% off on selected items!",
  "🎮 New Gaming PCs now available with RTX 4090!",
  "📱 iPhone 15 Pro Max in stock - Limited quantity!",
  "💻 MacBook Pro M3 available for pre-order!",
  "🎁 Free shipping on orders above ৳10,000!",
  "⚡ Express delivery available in Dhaka!",
  "🛡️ 2 years official warranty on all products!",
  "💰 EMI available with 0% interest!",
];

export function ScrollingText() {
  return (
    <div className="w-full bg-gradient-to-r mb-5 from-gray-100 dark:from-gray-800 to-gray-200 dark:to-gray-700 text-gray-900 dark:text-gray-100 py-2 overflow-hidden py-10">
      <div className="relative">
        {/* CSS-based scrolling animation */}
        <div className="flex whitespace-nowrap animate-scroll">
          {/* Duplicate announcements for seamless scrolling */}
          {[...announcements, ...announcements].map((announcement, index) => (
            <span key={index} className="inline-block md:px-8 xl:text-sm text-xs px-3 font-medium">
              {announcement}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        /* Pause animation on hover */
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
