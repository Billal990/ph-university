import express, { Application } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFoundRoute } from './app/middlewares/notFoundRoute';
import router from './app/routes/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

//parser
app.use(cors({
    origin:['localhost:5173']
}));
app.use(express.json());
app.use(cookieParser());

//Application routes
app.use('/api/v1', router);


//Global Error Handler
app.use(globalErrorHandler)

//Handle not found route
app.use(notFoundRoute)

app.use(express.json());

export default app;
