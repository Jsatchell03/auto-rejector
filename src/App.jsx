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
          <h1 className="text-4xl font-bold text-center mb-10">
            Behold The Future Of Job Applications
          </h1>
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
