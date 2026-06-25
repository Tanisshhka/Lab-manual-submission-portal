const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/upload', auth, upload.single('manual'), submissionController.uploadManual);
router.get('/', auth, submissionController.getSubmissions);
router.get('/stats', auth, submissionController.getStats);
router.patch('/:id', auth, submissionController.updateStatus);
router.post('/:id/reanalyze', auth, submissionController.reanalyzeSubmission);

module.exports = router;
