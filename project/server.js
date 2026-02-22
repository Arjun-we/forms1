const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Temporary in-memory storage for submitted feedback.
// This array lives only while the Node.js process is running.
// Each new form submission is pushed into this array.
const submissions = [];

// Middleware to parse form data sent with application/x-www-form-urlencoded.
app.use(express.urlencoded({ extended: true }));

// Configure EJS as the view engine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Render the feedback form.
app.get('/', (req, res) => {
  res.render('index');
});

// Handle form submission.
app.post('/submit', (req, res) => {
  const { name, email, course, feedback } = req.body;

  // Save this submission into temporary memory (no database used).
  submissions.push({
    name,
    email,
    course,
    feedback,
    submittedAt: new Date().toLocaleString()
  });

  // Redirect to page that displays all submissions collected so far.
  res.redirect('/submissions');
});

// Display all submissions.
app.get('/submissions', (req, res) => {
  res.render('submissions', { submissions });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  // Why data disappears after restart:
  // The `submissions` array is stored in RAM only.
  // When the server restarts, process memory is cleared, so the array resets.
});
