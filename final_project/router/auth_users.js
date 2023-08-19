const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  const user = users.find((user) => user.username === username);
  return !!user; // Returns true if user is found, false otherwise
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find((user) => user.username === username && user.password === password);
  return !!user; // Returns true if user is found, false otherwise
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  // return console.log(`all users ${users}`);
  const {
    username,
    password
  } = req.body
  console.log(`user: ${username}`)
  if (isValid(username)) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', {
        expiresIn: 60 * 60
      });
      req.session.authorization = {
        accessToken,
        username
      }
      return res.status(201).json({
        message: "user logged in"
      });
    }

    return res.status(400).json({
      error: "password is not valid"
    });

  } else {
    return res.status(400).json({
      error: "username is not valid"
    });
  }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve the ISBN from the URL parameter
  const {
    username
  } = req.session.authorization;
  const review = req.query.review; // Retrieve the review from the query parameter
  if (!books[isbn].reviews.hasOwnProperty(username)) {
    books[isbn].reviews[username] = review;
  } else {
    books[isbn].reviews[username] = review;
  }
  // if (books[isbn]) {
  //   console.log("no review from this user");
  // }
  return res.status(200).json({
    message: `review added to the book ${books[isbn].title}`,
    books
  })
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve the ISBN from the URL parameter
  const {
    username
  } = req.session.authorization;
  if (!books[isbn].reviews.hasOwnProperty(username)) {
    return res.status(200).json({
      message: `no review found to the book ${books[isbn].title}`
    })
  } else {
    delete books[isbn].reviews[username]
    return res.status(200).json({
      message: `review deleted to the book ${books[isbn].title}`,
      books
    })
  }
  // if (books[isbn]) {
  //   console.log("no review from this user");
  // }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;