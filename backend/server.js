require('dotenv').config();
const { app, connectDB } = require('./app');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`CCR backend running on port ${PORT}`));
});
