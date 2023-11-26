import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	res.render('index', {
		title: 'Boom Shop',
	});
});

router.get('/product', (req, res) => {
	res.render('product', {
		title: 'Products ',
		isProduct: true,
	});
});

router.get('/add', (req, res) => {
	res.render('add', {
		title: 'Add Product',
		isAdd: true,
	});
});

export default router;
