"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  Send,
} from "lucide-react";
import axios from "axios";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [jobType, setJobType] = useState("");
  const [expLevel, setExpLevel] = useState("");
  const [workType, setWorkType] = useState("");

  const fetchJobs = async (
    query = "Software Developer",
    loc = "Hyderabad",
    sort = "date",
    type = "",
    exp = "",
    work = "",
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
      let queryString = `/api/jobs?q=${query}&location=${loc}&sortBy=${sort}`;
      if (type) queryString += `&jobType=${type}`;
      if (exp) queryString += `&expLevel=${exp}`;
      if (work) queryString += `&workType=${work}`;

      const response = await axios.get(queryString);

      if (response.data.error) {
        setError(response.data.error);
        setJobs([]);
        return;
      }

      // Sort jobs by posting date (newest first)
      const sortedJobs = response.data.sort((a, b) => {
        const dateA = new Date(a.job_posting_date);
        const dateB = new Date(b.job_posting_date);
        return dateB - dateA;
      });

      setJobs(sortedJobs);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again later.");
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim() || "Software Developer";
    const loc = location.trim() || "Hyderabad";
    fetchJobs(query, loc, sortBy, jobType, expLevel, workType);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Find Your Dream Job</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="space-y-4">
            {/* Main Search Fields */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Job Title, Keywords, or Company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                <Search className="h-4 w-4" />
                Search Jobs
              </Button>
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 border border-fuchsia-900/50 rounded-3xl bg-[#140016] shadow-[0_0_30px_rgba(255,0,180,0.08)]">
              <div className="space-y-2">
                <label
                  htmlFor="sort"
                  className="text-xs font-semibold uppercase tracking-wide"
                >
                  Sort By
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-fuchsia-800/40 rounded-2xl bg-[#1b1128] text-white focus:ring-2 outline-none transition-all"
                >
                  <option value="date">Latest</option>
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="jobType"
                  className="text-xs font-semibold uppercase tracking-wide"
                >
                  Job Type
                </label>
                <select
                  id="jobType"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-fuchsia-800/40 rounded-2xl bg-[#1b1128] text-white focus:ring-2  outline-none transition-all"
                >
                  <option value="">All Types</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="expLevel"
                  className="text-xs font-semibold uppercase tracking-wide"
                >
                  Experience Level
                </label>
                <select
                  id="expLevel"
                  value={expLevel}
                  onChange={(e) => setExpLevel(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-fuchsia-800/40 rounded-2xl bg-[#1b1128] text-white focus:ring-2  outline-none transition-all"
                >
                  <option value="">All Levels</option>
                  <option value="internship">Internship</option>
                  <option value="entry_level">Entry Level</option>
                  <option value="associate">Associate</option>
                  <option value="mid_senior_level">Mid-Senior Level</option>
                  <option value="director">Director</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="workType"
                  className="text-xs font-semibold uppercase tracking-wide"
                >
                  Work Type
                </label>
                <select
                  id="workType"
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-fuchsia-800/40 rounded-2xl bg-[#1b1128] text-white focus:ring-2  outline-none transition-all"
                >
                  <option value="">All Types</option>
                  <option value="remote">Remote</option>
                  <option value="at_work">On-Site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Loading Jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8">
            <p>No Jobs Found. Try Adjusting Your Search Criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.job_id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold mb-2">
                        {job.job_position}
                      </CardTitle>
                      <p className="text-gray-600">{job.company_name}</p>
                    </div>
                    {job.company_logo_url && (
                      <img
                        src={job.company_logo_url}
                        alt={`${job.company_name} logo`}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.job_location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Posted {job.job_posting_date}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => window.open(job.job_link, "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                    View on LinkedIn
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
