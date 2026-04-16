"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Retry logic for transient API failures
async function generateWithRetry(prompt, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      lastError = error;

      // Don't retry on non-transient errors
      if (!error.message?.includes("503") && !error.message?.includes("429")) {
        throw error;
      }

      // Wait before retrying with exponential backoff
      if (attempt < maxRetries) {
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error("Failed to generate AI insights after retries");
}

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }

          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  return generateWithRetry(prompt);
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  if (!user.industryInsight) {
    try {
      const insights = await generateAIInsights(user.industry);

      const industryInsight = await db.industryInsight.create({
        data: {
          industry: user.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return industryInsight;
    } catch (error) {
      // If API rate limited, return default insights instead of crashing
      console.error("Failed to generate insights:", error.message);

      // Create default insights for the industry
      const defaultInsights = {
        salaryRanges: [
          { role: "Junior", min: 30000, max: 50000, median: 40000, location: "General" },
          { role: "Mid-Level", min: 50000, max: 80000, median: 65000, location: "General" },
          { role: "Senior", min: 80000, max: 120000, median: 100000, location: "General" },
          { role: "Lead", min: 100000, max: 150000, median: 125000, location: "General" },
          { role: "Manager", min: 120000, max: 180000, median: 150000, location: "General" }
        ],
        growthRate: 5,
        demandLevel: "Medium",
        topSkills: ["Problem Solving", "Communication", "Teamwork", "Adaptability", "Time Management"],
        marketOutlook: "Positive",
        keyTrends: ["Digital Transformation", "Remote Work", "Continuous Learning", "Automation", "Collaboration Tools"],
        recommendedSkills: ["Leadership", "Technical Skills", "Project Management", "Data Analysis", "Customer Focus"]
      };

      // Store default insights in database
      const industryInsight = await db.industryInsight.create({
        data: {
          industry: user.industry,
          ...defaultInsights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return industryInsight;
    }
  }

  return user.industryInsight;
}
