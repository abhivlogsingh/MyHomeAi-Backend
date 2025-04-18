/** @format */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const fileUpload = require('express-fileupload'); // Middleware for handling file uploads

const sequelize = require('./db/connection'); // DB connection file
const authRoutes = require('./routes/auth.routes');
const blogRoutes = require('./routes/blog.route'); // Routes for blog management

const app = express();

// ✅ Middleware
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' })); // Temporary directory for storing files
app.use(express.json()); // Parse incoming JSON data
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes); // Routes for handling blogs

// ✅ Sequelize Connection Check
sequelize
	.authenticate()
	.then(() => console.log('✅ MySQL DB connected successfully!'))
	.catch((err) => console.error('❌ DB connection failed:', err));

// ✅ Sequelize Model Sync
sequelize
	.sync({ alter: true }) // or use { force: false } in prod
	.then(() => console.log('✅ DB models synced successfully!'))
	.catch((err) => console.error('❌ Model sync error:', err));

// ✅ 404 Handler
app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
	console.error('❌ Global Error:', err.message || err);
	res.status(err.status || 500).json({
		error: err.message || 'Internal Server Error',
	});
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
