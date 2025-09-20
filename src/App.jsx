import { useState, useEffect } from "react";
import "./App.css";
import Listing from "./components/Listing";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/jobs.json")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="min-h-screen bg-gray-100 py-10">
          <div className="flex justify-center flex-col">
            <h1 className="text-4xl font-bold text-center mb-2">
              Behold The Future Of Job Applications
            </h1>
            <div className="w-[600px] mx-auto">
              <p className="text-center mb-10">
                Long wait times, multi-stage interview processes, cover letters,
                and take-home exams are all a thing of the past! Rejectify uses
                AI and data gathered from questionable sources to instantly
                handle your application.
              </p>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-4">
            {jobs.map((job, index) => (
              <Listing
                key={index}
                index={index}
                setJobs={setJobs}
                jobs={jobs}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
