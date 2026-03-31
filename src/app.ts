import express , {Application} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import cookieParser from 'cookie-parser';



const app: Application = express();

app.use(cookieParser());

app.use(morgan('combined'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: ['*', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// auth routes 
app.use('/api/auth', authRoutes);

// user routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  const serverinfo = {
    name: 'User Management API',
    version: '1.0.0',
    description: 'API for managing users with authentication and authorization',
    ip: req.ip,
    port: req.socket.localPort,
    user_agent: req.headers['user-agent'] || 'Unknown',
    
  };
  res.status(200).json({ status: 'OK', data: serverinfo });
});


export default app;