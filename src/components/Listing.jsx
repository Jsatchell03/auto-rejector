import React, { useRef, useState } from "react";
import { extractTextFromPDF } from "../scripts/pdfUtils";

export default function Listing({ index, setJobs, jobs }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const job = jobs[index];

  const sendRejectionEmail = async (job, resume) => {
    const res = await fetch("http://localhost:3001/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job, resume }),
    });
    const data = await res.json();
    console.log(data.email);
  };

  const handleApplyClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      e.target.value = null;
      return;
    }

    setSelectedFile(file);
    setPdfText("");
    setShowModal(true);
    e.target.value = null;
    extractTextFromPDF(file)
      .then((text) => {
        setPdfText(text);
        sendRejectionEmail(job, text);
      })
      .catch((err) => {
        console.error("PDF parsing error:", err);
        setPdfText("Failed to extract PDF text.");
      });
  };

  const handleModalClose = async () => {
    setShowModal(false);
    setSelectedFile(null);
    setPdfText("");
    setJobs(
      jobs.filter(function (item) {
        return item !== job;
      })
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 hover:shadow-lg transition duration-300">
      <h2 className="text-xl font-bold mb-1">{job.title}</h2>
      <p className="text-gray-600 font-medium mb-2">{job.companyName}</p>
      <p className="text-gray-500 mb-3">{job.companyDesc}</p>
      <p className="mb-2">
        <span className="font-semibold">Salary:</span> {job.salaryRange}
      </p>
      <p className="mb-3">{job.jobDescription}</p>
      <ul className="list-disc pl-5 mb-4 text-gray-700">
        {job.qualifications.map((qual, index) => (
          <li key={index}>{qual}</li>
        ))}
      </ul>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleApplyClick}
      >
        Apply
      </button>

      {selectedFile && (
        <p className="mt-2 text-green-600 font-medium">
          Selected file: {selectedFile.name}
        </p>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          {pdfText ? (
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Resume Submitted!</h3>
              <p className="mb-4">
                You have successfully submitted{" "}
                <span className="font-semibold">{selectedFile.name}</span> for{" "}
                <span className="font-semibold">{job.title}</span> at{" "}
                <span className="font-semibold">{job.companyName}</span>.
              </p>
              <p className="mb-4">
                Thanks to the power of AI, our comprehensive background check,
                and the data we bought from your ISP you will receive an instant
                response to your application.
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Resume Processing!</h3>
              <p>Please wait while we extract text from your PDF…</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
