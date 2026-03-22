import express , {Application} from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';


const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


export default app;