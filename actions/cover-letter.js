"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { selectCoverLetterTemplate } from "@/lib/coverLetterTemplates";

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // Select appropriate template based on job title
    const templateGenerator = selectCoverLetterTemplate(data.jobTitle);

    // Generate cover letter using template
    const content = templateGenerator({
      name: user.name || "Applicant",
      email: user.email,
      phone: user.phone || undefined,
      role: data.jobTitle,
      companyName: data.companyName,
      companyAddress: data.companyAddress || undefined,
      experience: user.experience
        ? `${user.experience} years of experience`
        : "several years of experience",
      skills: user.skills?.join(", ") || "various professional skills",
      bio: user.bio || "a strong professional background",
      jobDescription: data.jobDescription,
    });

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
