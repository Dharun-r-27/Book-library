const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/booklibrary', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  year: Number,
});
const Book = mongoose.model('Book', bookSchema);

// Routes
app.get('/books', async (req, res) => {
    try{
        const books = await Book.find();
        res.json(books);
    }catch (error) { 
     res.status(500).send(error.message);
    }
});

app.post('/books', async (req, res) => {
    try{
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    }catch (error) { 
        res.status(500).send(error.message);
    }
});

app.put('/books/:id', async (req, res) => {
    try{
        const updateBook= await Book.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new:true}
        );
        res.json(updatedBook);
    }catch (error) { 
        res.status(500).send(error.message);
    }
});

app.delete('/books/:id', async (req, res) => {
    try{
        await Book.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }catch (error) { 
        res.status(500).send(error.message);
    }
});

const PORT = 4000;
app.listen(PORT, () =>  console.log(`Server running on port ${PORT}`));
