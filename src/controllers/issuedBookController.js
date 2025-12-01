const IssueBook = require('../models/IssueBook');
const Book = require('../models/Book');
const User = require('../models/User');

const issueBook = async (request, response) => {
    try {
        const { bookId, studentId, studentName, issueDate, returnDate } = request.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return response.status(404).json({ message: 'Book not found' });
        }

        const student = await User.findById(studentId);
        if (!student) {
            return response.status(404).json({ message: 'Student not found' });
        }

        if (book.quantity < 1) {
            return response.status(400).json({ message: 'Book not available' });
        }

        const newIssue = await IssueBook.create({
            bookId,
            bookName: book.title,
            studentId,
            studentName,
            issueDate,
            returnDate
        });

        // decrement book quantity
        book.quantity = book.quantity - 1;
        await book.save();

        response.status(201).json({ message: 'Book issued successfully', data: newIssue });
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
}

const returnBook = async (request, response) => {
    try {
        const { issueId } = request.params;

        const issue = await IssueBook.findById(issueId);
        if (!issue) {
            return response.status(404).json({ message: 'Issue record not found' });
        }

        if (issue.status === 'Returned') {
            return response.status(400).json({ message: 'Book already returned' });
        }

        issue.status = 'Returned';
        await issue.save();

        const book = await Book.findById(issue.bookId);
        book.quantity = book.quantity + 1;
        await book.save();

        response.status(200).json({ message: 'Book returned successfully', data: issue });
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { issueBook, returnBook };