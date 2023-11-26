import flash from 'connect-flash';
import dotenv from 'dotenv';
import express from 'express';
import { create } from 'express-handlebars';
import session from 'express-session';
import mongoose from 'mongoose';
// Routes
import AuthRoutes from './routes/auth.js';
import ProductRoutes from './routes/products.js';

dotenv.config();

const app = express();

const hbs = create({ defaultLayout: 'main', extname: 'hbs' });

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'Nosirbek', resave: false, saveUninitialized: false }));
app.use(flash());

app.use(AuthRoutes);
app.use(ProductRoutes);

const PORT = process.env.PORT || 4100;
mongoose.set('strictQuery', false);
async function startServer() {
	try {
		await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
		console.log('MongoDB connected');
		app.listen(PORT, () => console.log(`Server is running project: ${PORT}`));
	} catch (error) {
		console.error('Error connecting to MongoDB:', error.message);
	}
}

startServer();
// mongodb+srv://nossi:<password>@cluster0.req0syp.mongodb.net/?retryWrites=true&w=majority
