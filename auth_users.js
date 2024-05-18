const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = [];

const isValid = (username) => {
  // Vérifie si le nom d'utilisateur a une longueur minimale de 3 caractères
  // et ne contient que des lettres et des chiffres
  return /^[a-zA-Z0-9]{3,}$/.test(username);
};
  
  const authenticatedUser = (username,password)=>{ 
    // Recherche de l'utilisateur correspondant au nom d'utilisateur fourni
  const user = users.find(user => user.username === username);

  // Vérification si un utilisateur correspondant a été trouvé et si le mot de passe correspond
  return user && user.password === password;
  }



// Customer login
regd_users.post("/login", (req, res) => {

  const { username, password } = req.body;

    // Vérifier si le nom d'utilisateur ou le mot de passe est manquant
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Vérifier si le nom d'utilisateur et le mot de passe correspondent
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    // Stocker le nom d'utilisateur dans la session
    req.session.username = username;

    // Générer le token JWT
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

    // Retourner le token JWT
    return res.status(200).json({ token });
});





// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  //const username = req.session.username;
  const username = req.session.username;

  // Vérifier si l'utilisateur est connecté
  if (!authenticatedUser(username, req.body.password)) {
    return res.status(401).json({ message: "User not logged in or invalid credentials" });
  }

  // Vérifier si la critique est fournie
  if (!review) {
    return res.status(400).json({ message: "Revieww is required" });
  }

  // Rechercher la critique existante pour cet ISBN et cet utilisateur
  const existingReviewIndex = books.findIndex(book => book.isbn === isbn && book.username === username);

  // Si une critique existe déjà pour cet utilisateur et cet ISBN, la modifier
  if (existingReviewIndex !== -1) {
    books[existingReviewIndex].review = review;
    return res.status(200).json({ message: "Review modified successfully" });
  }

  // Sinon, ajouter une nouvelle critique
  books.push({ isbn, username, review });
  return res.status(200).json({ message: "Review added successfully" });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  
  
  const username = req.session.username;

  // Vérifier si l'utilisateur est connecté
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Rechercher le livre correspondant à l'ISBN
  const book = books.find(book => book.isbn == isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Vérifier si la critique de l'utilisateur existe
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Supprimer la critique de l'utilisateur
  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});


  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
app.use('/customer', regd_users);







