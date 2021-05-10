import jwt from 'jsonwebtoken';

const generateToken = (id) => {
	const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1 days' });
	return token;
};

export default generateToken;
