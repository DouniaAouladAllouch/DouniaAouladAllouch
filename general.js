const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
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

// Route pour récupérer la liste des livres
public_users.get('/books', async function (req, res) {
    try {
        const bookList = await getBookList();
        return res.status(200).json({ books: bookList });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    }
});

// Route pour récupérer les détails du livre basés sur l'ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const bookDetails = await getBookDetailsByISBN(isbn);
        return res.status(200).json({ book: bookDetails });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

// Route pour récupérer les détails du livre basés sur l'auteur
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const bookDetails = await getBookDetailsByAuthor(author);
        return res.status(200).json({ books: bookDetails });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details by author" });
    }
});

// Route pour récupérer les détails du livre basés sur le titre
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const bookDetails = await getBookDetailsByTitle(title);
        return res.status(200).json({ books: bookDetails });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details by title" });
    }
});

// Get book details based on Title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const bookList = await getBooksByTitle(title);
        return res.status(200).json({ books: bookList });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

// Fonction pour récupérer les livres basés sur le titre
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        const titleBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
        resolve(titleBooks);
    });
}

// Fonction pour récupérer la liste des livres disponibles dans la boutique
function getBookList() {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:5000/books')
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
    });
}

// Fonction pour récupérer les détails du livre basés sur l'ISBN
function getBookDetailsByISBN(isbn) {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:5000/isbn/${isbn}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Fonction pour récupérer les détails du livre basés sur l'auteur
function getBookDetailsByAuthor(author) {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:5000/author/${author}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Fonction pour récupérer les détails du livre basés sur le titre
function getBookDetailsByTitle(title) {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:5000/title/${title}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports.general = public_users;
