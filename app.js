const express = require('express');
const path = require('path');
const auth_router = require('./routes/auth');
const user_router = require('./routes/users');
const book_router = require('./routes/books');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssclean = require('xss-clean');
const ratelimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
//birnging in db
const { connect_db, connection } = require('./db');
//express file upload for uploading files
const expressfileupload = require('express-fileupload');
//requiring custom error handler
const errorHandler = require('./middlewares/errorHandler');
const app = express();
//for coloring text
require('colors');
//helmet
app.use(helmet());
//json middleware
app.use(express.json());
//logger middleware
const morgan = require('morgan');
//cookie parser middleware
const cookieParser = require('cookie-parser');
//setting env variables
require('dotenv').config({
    path: './config/config.env'
});
//mounting router a some root
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
//exposing static files
app.use(express.static(path.join(__dirname, 'public')));
//file upload middleware
app.use(expressfileupload());
//cookie parser
app.use(cookieParser());
//mogno sanitize
app.use(mongoSanitize());
//xssclean
app.use(xssclean());
//rate limiting
const limiter = ratelimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});
app.use(limiter);
//http params pollution
app.use(hpp());
//enable cors
app.use(cors());
//mounting router to app
app.use('/api/v1/auth/', auth_router);
app.use('/api/v1/users/', user_router);
app.use('/api/v1/books/', book_router);
//error handler middleware should be used after router
//this is universal error handler
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
(async function () {
    await connect_db();
    const server = app.listen(PORT, () => console.log(`listening at ${PORT} env: ${process.env.NODE_ENV}`.yellow.italic.underline));
    process.on('unhandledRejection', async (err) => {
        console.log(`${err.message}`.red);
        server.close(() => {
            console.log('server closed');
            process.exit(1);
        });
        await connection.close();
    });
})();

process.on('SIGTERM', () => {
    connection.disconnect();
    server.close(() => {
        console.log('server closed');
        process.exit(1);
    });
});