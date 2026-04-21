const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: String, required: true },
  semester: { type: String, required: true },
  department: { type: String, required: true },
  subject: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Reviewed', 'Rejected'], 
    default: 'Pending' 
  },
  aiReport: {
    missingHeadings: [String],
    grammarIssues: [String],
    incompleteSteps: [String],
    suggestions: [String],
    summary: String
  },
  facultyComments: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
