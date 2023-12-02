import bcrypt from 'bcrypt';
import { Router } from 'express';
import signMiddleware from '../middleware/sign.js';
import User from '../models/user.js';
import generateJWTToken from '../service/token.js';

const router = Router();

router.get('/login', signMiddleware, (req, res) => {
	res.render('login', {
		title: 'Login',
		isLogin: true,
		loginError: req.flash('loginError'),
	});
});

router.get('/register', signMiddleware, (req, res) => {
	res.render('register', {
		title: 'Register',
		isRegister: true,
		registerError: req.flash('registerError'),
	});
});

router.get('/logout', (req, res) => {
	res.clearCookie('token');
	res.redirect('/');
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		req.flash('loginError', 'All fields is required');
		res.redirect('/login');
		return;
	}

	const existUser = await User.findOne({ email });
	if (!existUser) {
		req.flash('loginError', 'User not found');
		res.redirect('/login');
		return;
	}

	const isPassEqual = await bcrypt.compare(password, existUser.password);
	if (!isPassEqual) {
		req.flash('loginError', 'Password wrong');
		res.redirect('/login');
		return;
	}
	const token = generateJWTToken(existUser._id);
	res.cookie('token', token, { httpOnly: true, secure: true });
	res.redirect('/');
});

router.post('/register', async (req, res) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const { firstname, lastname, email, password } = req.body;
	if (!firstname || !lastname || !email || !password) {
		req.flash('registerError', 'All fields is required');
		res.redirect('/register');
		return;
	}

	const condidate = await User.findOne({ email });
	if (condidate) {
		req.flash('registerError', 'User email already exists');
		res.redirect('/register');
		return;
	}
	const userData = {
		firstName: firstname,
		lastName: lastname,
		email: email,
		password: hashedPassword,
	};
	const user = await User.create(userData);
	const token = generateJWTToken(user._id);
	res.cookie('token', token, { httpOnly: true, secure: true });
	res.redirect('/');
});

export default router;
