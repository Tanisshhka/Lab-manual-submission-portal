const multer = require('multer');
const path = require('path');
const fs = require('fs');

// On Vercel, the filesystem is read-only except for /tmp
// Use /tmp for uploads when in production, local uploads dir otherwise
const isVercel = !!process.env.VERCEL;
const uploadDir = isVercel
  ? '/tmp/uploads'
  : path.join(__dirname, '../uploads');

// Safely create upload directory
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create upload directory:', e.message);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF, DOC, and DOCX are allowed.'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = { upload };
