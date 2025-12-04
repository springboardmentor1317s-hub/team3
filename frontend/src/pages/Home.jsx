import Navbar from "../components/Navbar";
import '../styles/index.css'
export default function Home() {
  return (
    <div className="page-content">
    <div className="min-h-screen text-white relative overflow-x-hidden bg-gradient-to-br from-[#0f0720] via-[#1a0f3f] to-[#0f0720]">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="orb absolute top-[5%] left-[-10%]"></div>
        <div className="orb absolute top-[40%] left-[50%]"></div>
        <div className="orb absolute top-[60%] left-[80%]"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="text-center mt-40 px-6">
        <h1 className="text-[72px] font-extrabold leading-[90px] opacity-0 animate-[titleReveal_1.2s_forwards] font-[Syne] bg-gradient-to-tr from-white to-gray-300 text-transparent bg-clip-text">
          Discover Amazing <br /> Campus Events
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mx-auto mt-5 opacity-0 animate-[fadeIn_1.2s_forwards_0.2s] leading-relaxed">
          Connect with peers, explore opportunities, and make unforgettable
          memories across your campus ecosystem.
        </p>

        <a
          href="/events"
          className="inline-block mt-10 px-12 py-4 rounded-xl text-lg font-semibold transition transform duration-300 
          bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)]"
        >
          Browse Events
        </a>
      </section>

      {/* Event Cards */}
      <div className="flex justify-center flex-wrap gap-10 mt-24 pb-32">
        {[
          {
            title: "Hackathons",
            desc: "24-hour innovation marathons where brilliant minds code solutions to real-world problems.",
            link: "#",
          },
          {
            title: "Sports Championships",
            desc: "High-energy competitions across cricket, football, and athletics. Showcase your talent.",
            link: "#",
          },
          {
            title: "Cultural Festivals",
            desc: "Celebrate creativity through music, dance, art, and theater. Your stage awaits.",
            link: "#",
          },
        ].map((event, index) => (
          <div
            key={index}
            className="w-[340px] p-8 bg-white/5 border border-indigo-500/30 rounded-2xl 
              backdrop-blur-2xl hover:-translate-y-3 transition duration-500 relative overflow-hidden shadow-lg 
              hover:border-purple-500/60 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)]"
          >
            <h3 className="text-2xl font-semibold text-white font-[Syne]">
              {event.title}
            </h3>
            <p className="text-gray-300 text-sm mt-3 leading-relaxed">
              {event.desc}
            </p>
            <a
              href={event.link}
              className="inline-block mt-5 text-indigo-400 font-semibold hover:text-purple-400 transition duration-300"
            >
              {index === 0 ? "Learn More" : index === 1 ? "Join Now" : "Explore"} →
            </a>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
