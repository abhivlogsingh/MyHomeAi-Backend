/** @format */

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');

// Define routes for CRUD operations

// Route to create a new blog
router.post('/', blogController.createBlog);

// Route to get all blogs
router.get('/', blogController.getAllBlogs);

// Route to get single blog
router.get('/:id', blogController.getBlogById);

// Route to update blog
router.put('/:id', blogController.updateBlog);

// Route to delete blog
router.delete('/:id', blogController.deleteBlog);

module.exports = router;


