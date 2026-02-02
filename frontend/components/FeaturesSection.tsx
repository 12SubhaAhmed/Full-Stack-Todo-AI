export default function FeaturesSection() {
  const features = [
    {
      icon: "✨",
      title: "Pure Precision",
      description: "Crafted with attention to every pixel, delivering a seamless and refined experience.",
    },
    {
      icon: "🔐",
      title: "Enterprise Security",
      description: "Your data is safeguarded with cutting-edge encryption and robust security protocols.",
    },
    {
      icon: "⚡",
      title: "Blink Fast",
      description: "Experience zero lag, instant syncing, and fluid interactions for unparalleled performance.",
    },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-12">
          Why Choose <span className="text-purple-400">Todo App</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-purple-800 transform hover:scale-105 transition duration-300 relative overflow-hidden group"
            >
              {/* Subtle neon glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-transparent opacity-0 group-hover:opacity-20 transition duration-300"></div>
              
              <p className="text-5xl mb-4 relative z-10">{feature.icon}</p>
              <h3 className="text-xl font-bold text-purple-400 mb-3 relative z-10">
                {feature.title}
              </h3>
              <p className="text-gray-300 relative z-10">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
