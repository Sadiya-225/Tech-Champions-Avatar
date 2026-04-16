import { NextResponse } from "next/server";
import axios from "axios";

const SCRAPINGDOG_API_KEY = "69e10860e6ac9c6b521cb9ad";
const SCRAPINGDOG_URL = "https://api.scrapingdog.com/jobs/";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const location = searchParams.get("location");
    const sortBy = searchParams.get("sortBy") || "date";
    const jobType = searchParams.get("jobType");
    const expLevel = searchParams.get("expLevel");
    const workType = searchParams.get("workType");
    const page = searchParams.get("page") || "1";

    if (!query || !location) {
      return NextResponse.json(
        { error: "Both query and location are required" },
        { status: 400 },
      );
    }

    // Build params object using location directly (cleaner approach)
    const params = {
      api_key: SCRAPINGDOG_API_KEY,
      field: query,
      location: location,
      page: parseInt(page),
      sort_by: sortBy,
    };

    // Add optional filters only if they're provided
    if (jobType) {
      params.job_type = jobType;
    }
    if (expLevel) {
      params.exp_level = expLevel;
    }
    if (workType) {
      params.work_type = workType;
    }

    console.log("Fetching jobs with params:", params);

    const response = await axios.get(SCRAPINGDOG_URL, { params });

    if (response.status === 200) {
      console.log(`Successfully fetched ${response.data.length} jobs`);
      return NextResponse.json(response.data);
    } else {
      console.error(`Failed to fetch jobs with status ${response.status}`);
      return NextResponse.json(
        { error: "Failed to fetch jobs" },
        { status: response.status },
      );
    }
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch jobs: " + error.message },
      { status: 500 },
    );
  }
}
