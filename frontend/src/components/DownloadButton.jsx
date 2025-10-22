import { useState, useEffect, useRef } from "react";
import { downloadCSV, downloadPDF } from "../api";
import "../styles/styles.css";

export default function DownloadButton() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleDownloadCSV = async () => {
    try {
      const response = await downloadCSV();
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "account_report.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setShowMenu(false);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download CSV report");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await downloadPDF();
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "account_report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setShowMenu(false);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF report");
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="download-container" ref={menuRef}>
      <button
        className="download-btn"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        Download
      </button>

      {showMenu && (
        <div className="download-menu">
          <button className="download-option" onClick={handleDownloadCSV}>
            Download CSV
          </button>
          <button className="download-option" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
