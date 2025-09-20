// server.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";


dotenv.config();

const app = express();
app.use(express.json());
const client = new OpenAI();
app.use(cors({ origin: "http://localhost:5173" }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", async (req, res) => {
  const { job, resume } = req.body;
  try {
    const response = await client.responses.create({
      model: "gpt-5-nano-2025-08-07",
      input: `
        Job Listing:
        ${JSON.stringify(job, null, 2)}

        Resume:
        ${resume}

        Task: First, find the applicant's email from their resume. Then write a personalized, funny email rejecting this candidate based on their Resume and the Job Listing. This is not professional. This rejection email is meant only to be a joke. Make fun of the applicant's credentials and insult them for even applying for this job. Never compliment or praise the applicant. Return the rejection email in this JSON schema {"applicant_email": "", "subject" : "", "content": ""}. It is critical that your response is valid JSON.
      `
    });
    const emailData = JSON.parse(response.output_text);

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailData.applicant_email,
      subject: emailData.subject,
      text: emailData.content,
    });
    res.json({ success: true, email: emailData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
