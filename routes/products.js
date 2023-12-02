import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import userMiddleware from '../middleware/user.js';
import Product from '../models/product.js';

const router = Router();

router.get('/', async (req, res) => {
	const products = await Product.find().lean();
	res.render('index', {
		title: 'Boom Shop',
		products: products,
	});
});

router.get('/product', (req, res) => {
	res.render('product', {
		title: 'Products ',
		isProduct: true,
	});
});

router.get('/add', authMiddleware, (req, res) => {
	res.render('add', {
		title: 'Add Product',
		isAdd: true,
		errorAddProduct: req.flash('errorAddProduct'),
	});
});

router.post('/add-products', userMiddleware, async (req, res) => {
	const { title, description, image, price } = req.body;
	if (!title || !description || !image || !price) {
		req.flash('errorAddProduct', 'All fields is required');
		res.redirect('/add');
		return;
	}

	await Product.create({ ...req.body, user: req.userId });
	res.redirect('/');
});

export default router;
