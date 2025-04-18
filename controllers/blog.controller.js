/** @format */

const fs = require('fs');
const path = require('path');
const Blog = require('../models/blog.model');

// ✅ Helper function to clean file names
const sanitizeFileName = (fileName) => {
	const extension = path.extname(fileName);
	const baseName = path.basename(fileName, extension);

	const safeName = baseName
		.replace(/\s+/g, '_') // spaces → _
		.replace(/[^a-zA-Z0-9_-]/g, ''); // remove special chars

	return `${safeName}_${Date.now()}${extension}`;
};

// ✅ Create Blog
const createBlog = async (req, res) => {
	const { post_title, content, description } = req.body;
	let cover_img = null;

	try {
		if (req.files && req.files.cover_img) {
			const coverImgFile = req.files.cover_img;
			const uploadDir = path.join(__dirname, '../uploads');
			const finalFileName = sanitizeFileName(coverImgFile.name);
			const uploadPath = path.join(uploadDir, finalFileName);

			await coverImgFile.mv(uploadPath);
			cover_img = `/uploads/${finalFileName}`;
		}

		const blog = await Blog.create({
			post_title,
			content,
			cover_img,
			description,
		});

		res.status(201).json(blog);
	} catch (err) {
		console.error('Error creating blog entry:', err);
		res.status(500).send('Server error');
	}
};

// ✅ Get All Blogs
const getAllBlogs = async (req, res) => {
	try {
		const blogs = await Blog.findAll();
		res.json(blogs);
	} catch (err) {
		console.error('Error fetching blogs:', err);
		res.status(500).send('Server error');
	}
};

// ✅ Get Blog By ID
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

// ✅ Update Blog
const updateBlog = async (req, res) => {
	const { id } = req.params;
	const { post_title, content, description } = req.body;

	try {
		const blog = await Blog.findByPk(id);
		if (!blog) return res.status(404).send('Blog entry not found');

		let cover_img = blog.cover_img;

		if (req.files && req.files.cover_img) {
			const coverImgFile = req.files.cover_img;
			const uploadDir = path.join(__dirname, '../uploads');
			const finalFileName = sanitizeFileName(coverImgFile.name);
			const uploadPath = path.join(uploadDir, finalFileName);

			// delete old file
			if (cover_img) {
				const oldFilePath = path.join(__dirname, '..', cover_img);
				if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
			}

			await coverImgFile.mv(uploadPath);
			cover_img = `/uploads/${finalFileName}`;
		}

		await blog.update({ post_title, content, cover_img, description });
		res.json({ message: 'Blog entry updated successfully' });
	} catch (err) {
		console.error('Error updating blog entry:', err);
		res.status(500).send('Server error');
	}
};

// ✅ Delete Blog
const deleteBlog = async (req, res) => {
	const { id } = req.params;
	try {
		const blog = await Blog.findByPk(id);
		if (!blog) return res.status(404).send('Blog entry not found');

		if (blog.cover_img) {
			const filePath = path.join(__dirname, '..', blog.cover_img);
			if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
		}

		await blog.destroy();
		res.json({ message: 'Blog entry and associated file deleted successfully' });
	} catch (err) {
		console.error('Error deleting blog entry:', err);
		res.status(500).send('Server error');
	}
};

module.exports = {
	createBlog,
	getAllBlogs,
	getBlogById,
	updateBlog,
	deleteBlog,
};
