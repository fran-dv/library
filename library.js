// Book constructor
function Book(name, author, pages, status) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

const books = [new Book('The Republic', 'Plato', 340, 'reading'), new Book('The pragmatic programmer', 'Andy Hunt, Dave Thomas', 300, 'finished'), new Book('Eloquent JavaScript', 'Haverbeke', 412, 'to read'), new Book('Organon', 'Aristotle', 500, 'to read')];
const statusOptions = ['to read', 'finished', 'reading'];
const maxLengthToDisplay = {'toAuthors' : 15, 'toTitlePerWord' : 12, 'toTitlesTotal' : 21, 'maxWords' : 3};

function addBookToLibrary(name, author, pages, status) {
    if (!statusOptions.includes(String(status).toLowerCase())) {
        status = statusOptions[0]; // To read is the default status if wrong specified
    }
    books.push(new Book(name, author, pages, status));
}

const readingSection = document.querySelector('.section.reading');
const toReadSection = document.querySelector('.section.to-read');
const finishedSection = document.querySelector('.section.finished');

function displayBook(book, section) {
    const newBook = document.createElement('div');
    newBook.setAttribute('class', 'book');
    const author = document.createElement('p');
    author.setAttribute('class', 'author');
    author.textContent = book.author;
    const title = document.createElement('h1');
    title.setAttribute('class', 'title');
    title.textContent = book.name;
    const editButton = document.createElement('img');
    editButton.setAttribute('class', 'edit');
    editButton.setAttribute('src', './images/edit.svg');
    editButton.setAttribute('alt', 'Edit book information');

    newBook.appendChild(author);
    newBook.appendChild(title);
    newBook.appendChild(editButton);

    if (typeof(section) === 'object') {
        section.appendChild(newBook);
    } else {
        console.log('Error on displayBook function');
        console.log(`The section '${section}' is not a DOM element`);
    }
}


function addBookToBookshelf(book) {

    if (book.status.toLowerCase() === statusOptions[2]){
        displayBook(book, readingSection);
    } else if (book.status.toLowerCase() === statusOptions[1]){
        displayBook(book, finishedSection);
    } else if 
              ((book.status.toLowerCase() === statusOptions[0]) ||
              (!statusOptions.includes(book.status.toLowerCase())))
            {
        displayBook(book, toReadSection);
    }
}

function updateLibrary() {
    books.forEach((book) => {
        addBookToBookshelf(book);
    });
}

updateLibrary();

const newBook = document.querySelector('.newBook');
const bookInfo = document.querySelector('.book-info-dialog');
const closeDialog = document.querySelector('.close-dialog');
const form = document.querySelector('.edit-book-info');

newBook.addEventListener('click', function(){
    bookInfo.showModal();
})

closeDialog.addEventListener('click', () => {
    bookInfo.close();
})

form.addEventListener('submit', function (event) {
    event.preventDefault();

    bookInfo.close();
    
    const bookData = new FormData(form);

    let newBookTitle = bookData.get('title');
    let newBookAuthor = bookData.get('author')
    let newBookPages = bookData.get('pages');
    let newBookStatus = bookData.get('status');

    addBookToLibrary(newBookTitle, newBookAuthor, newBookPages, newBookStatus);
    
    addBookToBookshelf(books[books.length - 1]);
    form.reset();

})