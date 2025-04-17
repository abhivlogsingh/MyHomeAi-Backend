/** @format */

const fs = require('fs');
const path = require('path');
const Blog = require('../models/blog.model'); // Import the Blog model

// Create a new blog entry with optional cover image upload
const createBlog = async (req, res) => {
	const { post_title, content, description } = req.body;
	let cover_img = null;

	try {
		// Check if a cover image file was uploaded
		if (req.files && req.files.cover_img) {
			const coverImgFile = req.files.cover_img;
			const uploadDir = path.join(__dirname, '../uploads'); // Ensure this folder exists
			const uploadPath = path.join(uploadDir, coverImgFile.name);

			// Move the file to the uploads folder
			await coverImgFile.mv(uploadPath);

			// Save the file path or URL to the database
			cover_img = `/uploads/${coverImgFile.name}`;
		}

		// Create a new blog entry in the database
		const blog = await Blog.create({
			post_title,
			content,
			cover_img,
			description,
		});

		res.status(201).json(blog); // Respond with the created blog entry
	} catch (err) {
		console.error('Error creating blog entry:', err);
		res.status(500).send('Server error');
	}
};

// Get all blog entries
const getAllBlogs = async (req, res) => {
	try {
		const blogs = await Blog.findAll();
		res.json(blogs);
	} catch (err) {
		console.error('Error fetching blogs:', err);
		res.status(500).send('Server error');
	}
};

// Get a blog entry by its ID
const getBlogById = async (req, res) => {
	const { id } = req.params;
	try {
		const blog = await Blog.findByPk(id);
		if (!blog) return res.status(404).send('Blog entry not found');
		res.json(blog);
	} catch (err) {
		console.error('Error fetching blog entry:', err);
		res.status(500).send('Server error');
	}
};

// Update a blog entry by its ID, including optional cover image update
const updateBlog = async (req, res) => {
	const { id } = req.params;
	const { post_title, content, description } = req.body;

	try {
		const blog = await Blog.findByPk(id);
		if (!blog) return res.status(404).send('Blog entry not found');

		let cover_img = blog.cover_img; // Retain the current image path by default

		// Check if a new cover image file was uploaded
		if (req.files && req.files.cover_img) {
			const coverImgFile = req.files.cover_img;
			const uploadDir = path.join(__dirname, '../uploads');
			const uploadPath = path.join(uploadDir, coverImgFile.name);

			// Delete the old file if it exists
			if (cover_img) {
				const oldFilePath = path.join(__dirname, '..', cover_img);
				if (fs.existsSync(oldFilePath)) {
					fs.unlinkSync(oldFilePath);
				}
			}

			// Move the new file to the uploads folder
			await coverImgFile.mv(uploadPath);
			cover_img = `/uploads/${coverImgFile.name}`; // Update to the new file path
		}

		// Update the blog entry in the database
		await blog.update({ post_title, content, cover_img, description });
		res.json({ message: 'Blog entry updated successfully' });
	} catch (err) {
		console.error('Error updating blog entry:', err);
		res.status(500).send('Server error');
	}
};

// Delete a blog entry by its ID and remove the associated cover image
const deleteBlog = async (req, res) => {
	const { id } = req.params;
	try {
		const blog = await Blog.findByPk(id);
		if (!blog) return res.status(404).send('Blog entry not found');

		// Delete the associated cover image file if it exists
		if (blog.cover_img) {
			const filePath = path.join(__dirname, '..', blog.cover_img);
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
				console.log(`Successfully deleted file: ${filePath}`);
			} else {
				console.warn(`File not found: ${filePath}`);
			}
		}

		// Delete the blog entry from the database
		await blog.destroy();
		res.json({
			message: 'Blog entry and associated file deleted successfully',
		});
	} catch (err) {
		console.error('Error deleting blog entry:', err);
		res.status(500).send('Server error');
	}
};

// Export the functions for use in other parts of the application
module.exports = {
	createBlog,
	getAllBlogs,
	getBlogById,
	updateBlog,
	deleteBlog,
};
