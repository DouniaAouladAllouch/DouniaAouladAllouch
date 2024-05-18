const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  // Vérifier si le nom d'utilisateur ou le mot de passe est manquant
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Vérifier si le nom d'utilisateur existe déjà
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  
  // Ajouter le nouvel utilisateur à la liste
  users.push({ username, password });

  // Retourner un message de succès
  return res.status(200).json({ message: "User registered succes", username: username });
  
  
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Renvoyer la liste des livres au format JSON
    
    return res.status(200).json({ books: Object.values(books) });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Récupérer l'ISBN à partir des paramètres de la requête
    const isbn = req.params.isbn;

    // Vérifier si le livre correspondant à l'ISBN existe dans la base de données
    if (books[isbn]) {
        // Si le livre existe, renvoyer les détails du livre au format JSON
        return res.status(200).json({ book: books[isbn] });
    } else {
        // Si le livre n'existe pas, renvoyer un message d'erreur au format JSON
        return res.status(404).json({ message: "Book not found" });
    }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const authorBooks = [];
  
  // Iterate through the books and find the ones authored by the provided author
  for (const key in books) {
      if (books.hasOwnProperty(key)) {
          const book = books[key];
          if (book.author === authorName) {
              authorBooks.push(book);
          }
      }
  }

  // Check if any books were found for the author
  if (authorBooks.length > 0) {
      // If books are found, return them in JSON format
      return res.status(200).json({ books: authorBooks });
  } else {
      // If no books are found for the author, return a message
      return res.status(404).json({ message: "No books found for the author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  // Rechercher les critiques associées à l'ISBN fourni
  if (books[isbn] && books[isbn].reviews) {
      const reviews = books[isbn].reviews;
      return res.status(200).json({ reviews: reviews });
  } else {
      return res.status(404).json({ message: "No reviews found for the specified ISBN" });
  }
});


//module.exports.general = public_users;
module.exports.general = general;

