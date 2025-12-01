const Book = require('../models/Book');

getAllBooks = async (request, response) => {
    try {
        const books = await Book.find();
        response.status(200).json({ books });
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
}

getBooksbyID = async (request, response) => {
    try {
        const foundBook = await Book.findById(request.params.id);
        if (!foundBook) {
            return response.status(404).json({ message: 'Book not found' });
        }
        response.status(200).json({ book: foundBook });
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
}

createBook = async (request, response) => {
    try {
        const { title, author, publishedYear, price, quantity } = request.body;
        if (!title || !author || publishedYear === undefined || price === undefined || quantity === undefined) {
            return response.status(400).json({ message: 'Please send the fields properly' });
        }

        const newBook = await Book.create({
            title,
            author,
            publishedYear,
            price,
            quantity,
            status: 'Available'
        });

        response.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
}

updateBook = async (request, response) => {
    try {
        const { title, author, publishedYear, price, quantity } = request.body;

        if (!title || !author || publishedYear === undefined || price === undefined || quantity === undefined) {
            return response.status(400).json({ message: 'Please send the fields properly' });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            request.params.id,
            { title, author, publishedYear, price, quantity },
            { new: true }
        );

        if (!updatedBook) {
            return response.status(404).json({ message: 'Book not found' });
        }

        response.status(200).json({ message: 'Book updated successfully', data: updatedBook });
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
}

deleteBook = async (request, response) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(request.params.id);
        if (!deletedBook) {
            return response.status(404).json({ message: 'Book not found' });
        }
        response.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getAllBooks,
    getBooksbyID,
    createBook,
    updateBook,
    deleteBook
};