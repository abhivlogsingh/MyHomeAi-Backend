/** @format */

const jwt = require('jsonwebtoken');

const generateToken = (user) => {
	return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
		expiresIn: '24h',
	});
};

module.exports = { generateToken };
