

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateVuMark, resetVuMark } from "../../features/vumarkSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion } from "framer-motion";

const VuMarkForm = () => {
  const dispatch = useDispatch();
  const vumarkData = useSelector((state) => state.vumark.data);
  const { loading, error } = useSelector((state) => state.vumark);

  const [imageUrl, setImageUrl] = useState("");
  const svgRef = useRef();
  const [id, setId] = useState("");
  const [format, setFormat] = useState("svg");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateVuMark({ id }));
  };

  useEffect(() => {
    if (vumarkData) {
      const svgBlob = new Blob([vumarkData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      setImageUrl(url);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return () => URL.revokeObjectURL(url);
    }
  }, [vumarkData]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      const timer = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDownload = async () => {
    if (!vumarkData) {
      alert("No image available to download!");
      return;
    }

    if (format === "svg") {
      const blob = new Blob([vumarkData], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `vumark_${id}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const element = svgRef.current;
      if (!element) return;

      try {
        const canvas = await html2canvas(element);
        if (format === "png") {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = `vumark_${id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (format === "pdf") {
          const pdf = new jsPDF();
          pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, 180, 160);
          pdf.save(`vumark_${id}.pdf`);
        }
      } catch (err) {
        console.error("Error generating image:", err);
        alert("Failed to generate the image. Please try again.");
      }
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setId("");
      setImageUrl("");
      dispatch(resetVuMark());
    }, 2000);
  };

  const formatOptions = [
    { value: "svg", label: "SVG" },
    { value: "png", label: "PNG" },
    { value: "pdf", label: "PDF" }
  ];

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg bg-white p-8 rounded-xl shadow-xl relative overflow-hidden"
      >
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md"
          >
            Success!
          </motion.div>
        )}
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
        
        <h1 className="text-2xl sm:text-3xl text-blue-900 font-bold text-center mb-6 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Generate VuMark
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Instance ID
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter an identifier..."
              required
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:from-blue-300 disabled:to-indigo-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                <span>Generate VuMark</span>
              </>
            )}
          </motion.button>
        </form>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-md"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </div>
          </motion.div>
        )}

        {vumarkData && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-8 space-y-6 pt-6 border-t border-gray-200"
          >
            <div className="bg-gray-50 p-4 rounded-lg overflow-hidden">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                ref={svgRef}
                className="w-full flex justify-center p-4"
                dangerouslySetInnerHTML={{ __html: vumarkData }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Export Format
                </label>
                <div className="flex gap-2">
                  {formatOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormat(option.value)}
                      className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 text-sm font-medium ${
                        format === option.value
                          ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-400"
                          : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download {format.toUpperCase()}
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VuMarkForm;
