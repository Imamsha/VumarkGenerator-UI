import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateVuMark, clearError, clearImage } from "../../features/vumarkSlice";
import { jsPDF } from "jspdf";

const VuMarkForm = () => {
  const dispatch = useDispatch();
  const { imageUrl, loading, error } = useSelector((state) => state.vumark);

  const [id, setId] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("png");

  const handleGenerateVuMark = () => {
    if (!id) {
      alert("Please enter an instance ID.");
      return;
    }
    dispatch(generateVuMark(id));
  };


useEffect(() => {
  if (error) {
    const timer = setTimeout(() => {
      dispatch(clearError());
      dispatch(clearImage()); 
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [error, dispatch]);

  const handleDownload = () => {
    if (!imageUrl) {
      alert("No VuMark available for download.");
      return;
    }

    if (downloadFormat === "png" || downloadFormat === "svg") {
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = `vumark-${id}.${downloadFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (downloadFormat === "pdf") {
      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = "anonymous"; 
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 160);
        pdf.save(`vumark-${id}.pdf`);
      };
    }
    setTimeout(() => {
      setId("");
      dispatch(clearImage());
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">VuMark Generator</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Instance ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleGenerateVuMark}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full transition-all"
        >
          {loading ? "Generating..." : "Generate VuMark"}
        </button>
        {error ? (
          <div className="mt-3 bg-red-100 text-red-600 p-3 rounded shadow">
            ❌ {error}
          </div>
        ) : imageUrl ? (
          <div className="mt-4">
            <img src={imageUrl} alt="Generated VuMark" className="w-full max-h-64 object-contain mb-3" />
            <label className="block mt-3 font-semibold">Select Download Format:</label>
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className="border rounded p-2 w-full mt-1"
            >
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
              <option value="pdf">PDF</option>
            </select>

            <button
              onClick={handleDownload}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 w-full transition-all"
            >
              Download Image
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VuMarkForm;
