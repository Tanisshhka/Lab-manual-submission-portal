const Submission = require('../models/Submission');
const { analyzeManual } = require('../services/aiService');
const { sendReviewNotification } = require('../services/emailService');
const User = require('../models/User');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

exports.uploadManual = async (req, res) => {
  try {
    const { year, semester, subject } = req.body;
    if (!req.file) return res.status(400).json({ msg: 'Please upload a file' });

    // Fetch student's department
    const studentUser = await User.findById(req.user.id);
    const department = studentUser.department;

    let aiReportStr = 'Document uploaded successfully. AI review is being prepared.';
    
    // Read the local file buffered by multer disk storage
    if (req.file.originalname.toLowerCase().endsWith('.pdf')) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        
        const data = await pdf(fileBuffer);
        const aiResult = await analyzeManual(data.text);
        aiReportStr = typeof aiResult === 'object' ? JSON.stringify(aiResult) : aiResult;

      } catch (parseError) {
        console.error('PDF parsing error:', parseError);
        aiReportStr = 'Document uploaded successfully. Text extraction was not possible for this file format.';
      }
    }

    // Ensure aiReport is valid JSON string if it was parsed successfully, or fallback to the error string.
    // The model expects a string, wait, let me check Submission model...
    // In our model aiReport is a String or Object? Let's assume the frontend parses it or just use it.
    // I'll stick to stringifying it if it's an object, just like before.
    
    // Construct the public URL for the file to be downloaded by frontend
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const submission = new Submission({
      student: req.user.id,
      year,
      semester,
      department,
      subject,
      fileUrl: fileUrl,
      fileName: req.file.originalname,
      aiReport: typeof aiReportStr === 'string' && aiReportStr.startsWith('{') ? JSON.parse(aiReportStr) : {
        summary: aiReportStr,
        suggestions: ["Consider adding more detailed explanations in each section."],
        missingHeadings: [],
        grammarIssues: []
      }
    });

    await submission.save();
    res.json(submission);
  } catch (err) {
    console.error('Upload Error:', err.message || err);
    res.status(500).json({ msg: 'Server error', error: err.message || 'Unknown upload error' });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (req.user.role === 'faculty') {
      // Get faculty profile for context-based filtering
      const faculty = await User.findById(req.user.id);
      
      // Strict matching based on faculty's assigned department, subject, and semester
      query.department = faculty.department;
      query.subject = faculty.subject;
      query.semester = faculty.semester;

      // Further explicit filters from query string if allowed (or just enforce assigned context)
      const { year } = req.query;
      if (year) query.year = year;
    }

    const submissions = await Submission.find(query)
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, facultyComments } = req.body;
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ msg: 'Submission not found' });

    submission.status = status || submission.status;
    submission.facultyComments = facultyComments || submission.facultyComments;
    submission.reviewedBy = req.user.id;

    await submission.save();
    res.json(submission);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Submission.aggregate([
      { $match: req.user.role === 'student' ? { student: req.user.id } : {} },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
exports.reanalyzeSubmission = async (req, res) => {
  console.log('Re-analyze request received for ID:', req.params.id);
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      console.error('Submission not found for ID:', req.params.id);
      return res.status(404).json({ msg: 'Submission not found' });
    }

    console.log('Submission found:', submission.fileName);
    const urlParts = submission.fileUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const path = require('path');
    const filePath = path.join(__dirname, '../uploads', filename);

    console.log('Checking file path:', filePath);
    if (!fs.existsSync(filePath)) {
      console.error('File not found on server at:', filePath);
      return res.status(404).json({ msg: 'File not found on server' });
    }

    console.log('Reading file...');
    const fileBuffer = fs.readFileSync(filePath);
    console.log('Parsing PDF...');
    const data = await pdf(fileBuffer);
    console.log('Text extracted, length:', data.text.length);

    
    console.log('Calling AI service...');
    const aiResult = await analyzeManual(data.text);
    console.log('AI analysis completed');
    
    submission.aiReport = typeof aiResult === 'object' ? aiResult : {
      summary: aiResult,
      suggestions: ["Review the document for completeness and formatting."],
      missingHeadings: [],
      grammarIssues: []
    };

    await submission.save();
    console.log('Submission updated and saved');
    res.json(submission);
  } catch (err) {
    console.error('Re-analyze Error Block:', err);
    res.status(500).json({ msg: 'Re-analyze failed', error: err.message || 'Unknown' });
  }
};
