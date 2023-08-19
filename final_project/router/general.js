const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  if (req.body) {
    const {
      username,
      password
    } = req.body

    const user = users.filter((user) => user.username === username)
    console.log(user);
    if (user.length > 0) {
      return res.status(400).json({
        error: "this username already exist"
      })
    } else {
      users.push({
        username,
        password
      })
      console.log(`${users} all users`)
      return res.status(201).json({
        message: "user registered"
      })
    }

  }

  return res.status(400).json({
    message: "username/password not provided"
  });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  const allBooks = await books
  return res.status(201).json(allBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const store = await books
  const book = store[isbn]
  return res.status(201).json(
    book
  );
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  let book = {}
  const author = req.params.author
  const store = await books
  const bookArr = Object.values(store).filter((user) => user.author == author)
  book = bookArr[0]
  return res.status(201).json(
    book
  );
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  let book = {}
  const title = req.params.title
  const store = await books
  const bookArr = Object.values(store).filter((user) => user.title == title)
  book = bookArr[0]
  return res.status(201).json(
    book
  );
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const reviews = books[isbn].reviews
  return res.status(201).json(
    reviews
  );
});

module.exports.general = public_users;