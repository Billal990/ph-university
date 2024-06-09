import express, { Application } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFoundRoute } from './app/middlewares/notFoundRoute';
import router from './app/routes/routes';
const app: Application = express();

//parser
app.use(cors());
app.use(express.json());

//Application routes
app.use('/api/v1', router);


//Global Error Handler
app.use(globalErrorHandler)

//Handle not found route
app.use(notFoundRoute)

app.use(express.json());

export default app;
