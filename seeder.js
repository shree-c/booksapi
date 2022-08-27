//seperate script to import and delete data
//use option -d for deleting and -c for adding data
const fs = require('fs');
const mongoose = require('mongoose');
const Book = require('./models/Book');
const Users = require('./models/User');
require('colors');
require('dotenv').config({
    path: './config/config.env'
});

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_U);
    console.log(`connected to db ${conn.connection.host}`.green);
};

const delete_books = async () => {
    try {
        await Book.deleteMany();
        console.log(`deleted all books`.red);
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const add_books = async () => {
    try {
        await Book.create(JSON.parse(fs.readFileSync(`${__dirname}/seeddata/books.json`)));
        console.log(`added all books`.green.inverse);
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};


const add_users = async () => {
    try {
        await Users.create(JSON.parse(fs.readFileSync(`${__dirname}/seeddata/users.json`)));
        console.log(`added all users`.green.inverse);
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const delete_users = async () => {
    try {
        await Users.deleteMany();
        console.log(`deleted all users`.red);
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const arg_str = process.argv.slice(2);
if (!arg_str.length) {
    console.log('no options provided\n -cb -> create books -db ->delete books -cu -> create users -du -> delete users');
}
console.log(arg_str);
arg_str.forEach(async (val, ind) => {
    console.log(`option ${ind + 1} : ${val}:`.yellow);
    switch (val) {
        case '-db':
            await connectDB().then(() => {
                delete_books();
            });
            break;
        case '-cb':
            connectDB().then(() => {
                add_books();
            });
            break;
        case '-cu':
            await connectDB().then(() => {
                add_users();
            });
            break;
        case '-du':
            await connectDB().then(() => {
                delete_users();
            });
            break;
        default:
            console.log('unknown operation'.red.underline);
            break;
    }
});