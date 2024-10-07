document.addEventListener('DOMContentLoaded', () => {
    const addBookBtn = document.getElementById('addBookBtn');
    const bookList = document.getElementById('bookList');

    // Function to simulate fetching books from the server
    function fetchBooks() {
        return [
            { id: 1, title: 'Book One', unlocked: true },
            { id: 2, title: 'Book Two', unlocked: false }
        ];
    }

    // Function to render books in the list
    function renderBooks(books) {
        bookList.innerHTML = ''; // Clear existing list
        books.forEach(book => {
            const li = document.createElement('li');
            li.textContent = book.title;
            if (book.unlocked) {
                li.textContent += ' (Unlocked)';
            }
            bookList.appendChild(li);
        });
    }

    // Event listener for the add book button
    addBookBtn.addEventListener('click', () => {
        // Redirect to the add book page
        window.location.href = 'add-book.html';
    });

    // Fetch and render books
    const books = fetchBooks();
    renderBooks(books);
});
