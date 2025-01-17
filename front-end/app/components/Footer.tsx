import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white font-serif flex flex-col justify-center items-center">
      <div className="w-full p-5 flex flex-col lg:flex-row lg:gap-80 gap-6 justify-center items-center bg-gradient-to-b from-[#141925] to-[#0F172A]">
        <div className="flex justify-center">
          <a href="/">
            <img
              className="rounded-md transition-transform duration-500 ease-in-out transform hover:scale-110"
              src="/logo.png"
              alt="logo"
              width={150}
              height={100}
            />
          </a>
        </div>
        <div className="text-center text-white text-lg font-arcade md:text-lg">
          Built with ❤️ by Jitendra Kumar
        </div>
        <div className="flex gap-4 justify-center">
          <a
            href="https://github.com/jitendragangwar123"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-600 transition-all"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://x.com/Jitendr25070341"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-600 transition-all"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/jitendra-gangwar-94353a152/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-600 transition-all"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
