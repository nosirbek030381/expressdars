import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import userMiddleware from '../middleware/user.js';
import Product from '../models/product.js';

const router = Router();

router.get('/', async (req, res) => {
	const products = await Product.find().lean();
	res.render('index', {
		title: 'Boom Shop',
		products: products.reverse(),
		userId: req.userId ? req.userId.toString() : null,
	});
});

router.get('/products', async (req, res) => {
	const user = req.userId ? req.userId.toString() : null;
	const myProduct = await Product.find({ user: req.userId }).populate('user').lean();

	res.render('products', {
		title: 'Products ',
		isProduct: true,
		myProduct: myProduct.reverse(),
	});
});

router.get('/product/:id', async (req, res) => {
	const id = req.params.id;
	const product = await Product.findById(id).populate('user').lean();
	res.render('product', {
		title: ` ${product.title}`,
		product,
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

router.get('/edit/:id', async (req, res) => {
	const id = req.params.id;
	const product = await Product.findById(id).populate('user').lean();
	res.render('edit', {
		title: ` ${product.title}`,
		product,
		errorEditProduct: req.flash('errorEditProduct'),
	});
});

router.post('/edit/:id', async (req, res) => {
	const { title, description, image, price } = req.body;
	const id = req.params.id;
	if (!title || !description || !image || !price) {
		req.flash('errorEditProduct', 'All fields is required');
		res.redirect(`/edit/${id}`);
		return;
	}

	await Product.findByIdAndUpdate(id, req.body, { new: true });
	res.redirect('/products');
});

router.post('/delete/:id', async (req, res) => {
	const id = req.params.id;

	await Product.findByIdAndDelete(id);
	res.redirect('/');
});

export default router;
