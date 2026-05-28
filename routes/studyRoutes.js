

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const multer = require('multer');

const studyController = require('../controllers/studyController');

// DEBUG
console.log(studyController);

// MULTER

const upload = multer({
  storage: multer.memoryStorage()
});

//  VERIFY TOKEN 

const verifyToken = (req, res, next) => {

  try {

    const token =
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: "No token provided"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      error: "Invalid token"
    });
  }
};

//  AUTH ROUTES 

router.post(
  '/auth/signup',
  studyController.signup
);

router.post(
  '/auth/login',
  studyController.login
);

//  PDF GENERATE 

router.post(
  '/generate',
  verifyToken,
  upload.single('pdf'),
  studyController.uploadAndProcessAll
);

// AI QUESTION

router.post(
  '/ask-question',
  verifyToken,
  studyController.askQuestion
);
// HISTORY

router.get(
  '/history',
  verifyToken,
  studyController.getStudyHistory
);

module.exports = router;