const pdfParse = require('pdf-parse');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const ai = require('../config/gemini');

const User = require('../models/User');

const StudySession = require('../models/StudySession');

// SIGNUP 

exports.signup = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });
  }
};

// LOGIN

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    const isMatch =
      await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid password"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });
  }
};

// PDF PROCESS 

exports.uploadAndProcessAll = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        error: "No PDF uploaded"
      });
    }

    const parsedPdf =
      await pdfParse(req.file.buffer);

    const extractedText =
      parsedPdf.text.trim();

    if (extractedText.length < 50) {
      return res.status(400).json({
        error: "PDF too small"
      });
    }

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `
You are an AI study assistant.

Analyze the notes carefully.

Generate STRICTLY VALID JSON ONLY.

DO NOT write markdown.
DO NOT write explanation outside JSON.
DO NOT use triple backticks.

Return EXACTLY this structure:

{
  "title": "string",
  "category": "string",
  "summary": "string",
  "flashcards": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "quizQuestions": [
    {
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "answer": "string",
      "explanation": "string"
    }
  ]
}

IMPORTANT:
- Generate EXACTLY 20 quiz questions.
- Every question MUST contain exactly 4 options.
- answer MUST exactly match one option.
- quizQuestions MUST be an array.

Study Notes:
${extractedText.substring(0, 30000)}
`;

    // const result =
    //   await model.generateContent(prompt);

    const result =
      await model.generateContent(prompt);

    console.log(result);

    let rawText =
      result.response.text();

    console.log("RAW GEMINI => ", rawText);

    // let rawText =
    //   result.response.text();

    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // const aiResponse =
    //   JSON.parse(rawText);

    let aiResponse;

    try {

      aiResponse = JSON.parse(rawText);

    } catch (jsonError) {

      console.log("JSON PARSE ERROR => ", jsonError);

      console.log("RAW TEXT => ", rawText);

      return res.status(500).json({
        error: "Invalid AI JSON response"
      });
    }

    const session = new StudySession({

      userId: req.user.userId,

      title:
        aiResponse.title ||
        req.file.originalname,

      category:
        aiResponse.category || "General",

      rawInputNotes:
        extractedText,

      flashcards:
        aiResponse.flashcards || [],

      quiz: {
        questions:
          aiResponse.quizQuestions || []
      },

      summary:
        aiResponse.summary || ""

    });

    await session.save();

    res.status(200).json(session);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });
  }
};

//  ASK QUESTION 

exports.askQuestion = async (req, res) => {

  try {

    const { question } = req.body;

    res.status(200).json({
      answer: `AI Response: ${question}`
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

//  HISTORY

exports.getStudyHistory = async (req, res) => {

  try {

    const history =
      await StudySession.find({
        userId: req.user.userId
      });

    res.status(200).json(history);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};