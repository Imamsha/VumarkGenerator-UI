const Footer = () => {
    const currentYear = new Date().getFullYear(); // Dynamically get the current year
  
    return (
      <footer className="w-full bg-blue-900 fixed bottom-0 text-white p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm sm:text-base">
            &copy; {currentYear} Visual Smart DC. All rights reserved.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;