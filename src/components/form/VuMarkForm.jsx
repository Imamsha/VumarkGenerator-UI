import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateVuMark, resetVuMark } from "../../features/vumarkSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const VuMarkForm = () => {
  const dispatch = useDispatch();
  const vumarkData = useSelector((state) => state.vumark.data);
  const { loading, error } = useSelector((state) => state.vumark);

  const [imageUrl, setImageUrl] = useState("");
  const svgRef = useRef();
  const [id, setId] = useState("");
  const [format, setFormat] = useState("svg");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateVuMark({ id }));
  };

  console.log(imageUrl);
  useEffect(() => {
    if (vumarkData) {
      const svgBlob = new Blob([vumarkData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      setImageUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [vumarkData]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
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

    // ✅ Clear input and Redux state after download
    setId("");
    setImageUrl("");
    dispatch(resetVuMark()); // Clears VuMark data from Redux
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-lg">
      <h1 className="text-3xl text-blue-900 font-semibold text-center mb-4">
        Generate VuMark
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Instance ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate VuMark"}
        </button>
      </form>

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {vumarkData && (
        <div className="mt-4">
          <div ref={svgRef} dangerouslySetInnerHTML={{ __html: vumarkData }} />

          <div className="mt-4">
            <label className="block text-gray-700">Select Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            >
              <option value="svg">SVG</option>
              <option value="png">PNG</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 mt-4 bg-green-500 text-white font-semibold rounded-md"
          >
            Download {format.toUpperCase()}
          </button>
        </div>
      )}
    </div>
  );
};

export default VuMarkForm;
