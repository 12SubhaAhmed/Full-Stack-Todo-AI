export default function HeroSection() {
  return (
    <section className="bg-gray-900 text-white py-20 md:py-32 text-center relative overflow-hidden">
      {/* Neon glowing effect background */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        background: 'radial-gradient(circle at 15% 50%, #8A2BE2 0%, transparent 50%), radial-gradient(circle at 85% 50%, #4B0082 0%, transparent 50%), radial-gradient(circle at 50% 100%, #6A0DAD 0%, transparent 50%)',
      }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-5xl md:text-8xl font-extrabold leading-tight mb-6">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-xy transition-colors duration-500">
           Manage Your Time, <br></br>
          </span>{" "}
          Master Your Life.
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-gray-300">
          A beautifully designed, lightning-fast, and intuitive task manager
          that helps you stay productive and achieve your goals with ease.
        </p>
        <div className="space-x-4 flex justify-center">
          <a
            href="/signup"
            className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300 transform hover:scale-105 shadow-xl"
          >
            Start for Free
          </a>
          <a
            href="/login"
            className="border-2 border-purple-500 text-purple-400 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-500 hover:text-white transition duration-300 transform hover:scale-105 shadow-xl"
          >
            Live Demo
          </a>
        </div>
      </div>
    </section>
  );
}
