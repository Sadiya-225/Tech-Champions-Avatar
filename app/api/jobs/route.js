import { NextResponse } from "next/server";
import axios from "axios";

const SCRAPINGDOG_API_KEY = "6809302bba78811cf9a68a62";
const SCRAPINGDOG_URL = "https://api.scrapingdog.com/linkedinjobs/";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const location = searchParams.get("location");

    if (!query || !location) {
      return NextResponse.json({ error: "Both query and location are required" }, { status: 400 });
    }

    const params = {
      api_key: SCRAPINGDOG_API_KEY,
      field: query,
      geoid: location,
      page: 1,
      sortBy: "date",
      jobType: "",
      expLevel: "",
      workType: "",
      filterByCompany: "",
    };

    const response = await axios.get(SCRAPINGDOG_URL, { params });

    if (response.status === 200) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        { error: "Failed to fetch jobs" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
