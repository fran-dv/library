// Book constructor
function Book(name, author, pages, status) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

const books = [new Book('The Republic', 'Plato', 340, 'reading'), new Book('The pragmatic programmer', 'Andy Hunt, Dave Thomas', 300, 'finished'), new Book('Eloquent JavaScript', 'Haverbeke', 412, 'to read'), new Book('Organon', 'Aristotle', 500, 'to read')];
const statusOptions = ['to read', 'finished', 'reading'];


function addBookToLibrary(name, author, pages, status) {
    if (!statusOptions.includes(String(status).toLowerCase())) {
        status = statusOptions[0]; // To read is the default status if wrong specified
    }
    books.push(new Book(name, author, pages, status));
}

function displayBook(book, section) {
    const bookIndex = books.findIndex(e => e.name === book.name);

    const newBook = document.createElement('div');
    newBook.setAttribute('class', 'book');
    newBook.setAttribute('data-index', String(bookIndex));

    const author = document.createElement('p');
    author.setAttribute('class', 'author');
    author.textContent = book.author;

    const title = document.createElement('h1');
    title.setAttribute('class', 'title');
    title.textContent = book.name;

    const editButton = document.createElement('img');
    editButton.setAttribute('class', 'edit-btn');
    editButton.setAttribute('src', './images/edit.svg');
    editButton.setAttribute('alt', 'Edit book information');
    editButton.setAttribute('data-action', 'edit-book');

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

    const readingSection = document.querySelector('.section.reading');
    const toReadSection = document.querySelector('.section.to-read');
    const finishedSection = document.querySelector('.section.finished');

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

function emptyLibrary() {
    const booksDisplayed = document.querySelectorAll('.book');

    booksDisplayed.forEach((book) => {
        book.remove();
    })
}

function updateLibrary() {

    emptyLibrary();

    books.forEach((book) => {
        addBookToBookshelf(book);
    });
}

updateLibrary();

const newBook = document.querySelector('.newBook');

const closeDialog = document.querySelectorAll('.close-dialog');
const form = document.querySelector('.edit-book-info');

function clickOnNewBook(dialogToDisplay) {
    if (!dialogToDisplay.open) {
        dialogToDisplay.showModal();
    }   
}

function preventDefault(form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
    })
}

// 
function submitNewBookForm(form, dialogToClose) {
    
    
    const bookData = new FormData(form);

    let newBookTitle = bookData.get('title');
    let newBookAuthor = bookData.get('author')
    let newBookPages = bookData.get('pages');
    let newBookStatus = bookData.get('status');

    addBookToLibrary(newBookTitle, newBookAuthor, newBookPages, newBookStatus);
    
    addBookToBookshelf(books[books.length - 1]);
    form.reset();
    if (dialogToClose.open) {
        dialogToClose.close();
    }

}

function clickOnCloseDialog(dialogToClose) {
    if (dialogToClose.open) {
        dialogToClose.close();
    }
}
            
function clickOnEditBook(bookIndex, dialogToDisplay) {
    const editForm = document.querySelector('.book-info-dialog.edit .edit-book-info');
    editForm.setAttribute('data-book-index', String(currentIndex));
    if (bookIndex > -1) {
        const input = {
            'title' : document.querySelector('.book-info-dialog.edit input#title'),
            'author' : document.querySelector('.book-info-dialog.edit input#author'),
            'pages' : document.querySelector('.book-info-dialog.edit input#pages'),
            'status' : document.querySelectorAll('.book-info-dialog.edit input[type="radio"]')
        }

        input.title.value = books[bookIndex].name;
        input.author.value = books[bookIndex].author;
        input.pages.value = books[bookIndex].pages;
        input.status.forEach((option) => {
            if (books[bookIndex].status === option.value) {
                return option.checked = true;
            }
        })
        dialogToDisplay.showModal();
    } else { 
        console.log('Error on `clickOnEditBook` function: Invalid book index')
    }
}

function clickOnUpdateBook(form, bookIndex, dialogToClose) {

    books.splice(bookIndex, 1);
    const bookData = new FormData(form);

    let newBookTitle = bookData.get('title');
    let newBookAuthor = bookData.get('author')
    let newBookPages = bookData.get('pages');
    let newBookStatus = bookData.get('status');

    addBookToLibrary(newBookTitle, newBookAuthor, newBookPages, newBookStatus);
    
    addBookToBookshelf(books[books.length - 1]);
    form.reset();

    updateLibrary();
    if (dialogToClose.open) {
        dialogToClose.close();
    }
}

function clickOnDeleteBook(form, bookIndex, dialogToClose) {
    form.reset();
    books.splice(bookIndex, 1);
    updateLibrary();
    dialogToClose.close();
}

function currentOpenDialog(newBookDialog, editBookDialog) {
    return newBookDialog.open ? newBookDialog
            : editBookDialog.open ? editBookDialog
            : null;
}

function getCurrentBookIndex(editButton) {
    const parent = editButton.parentElement;
    if (parent.getAttribute('class') === 'book') {
        return Math.round(parent.dataset.index);
    } else {
        return -1;
    }
}

let currentIndex;

function valid(index) {
    return index > -1 ? true : false;
}

// general event listener    
document.querySelector('#wrapper').addEventListener('click', function(event) {
    const target = event.target.closest('[data-action]');

    if (target === null) { return };

    const newBookDialog = document.querySelector('.book-info-dialog');
    const editBookDialog = document.querySelector('.book-info-dialog.edit');
    const bookInfoForm = document.querySelector('.edit-book-info');

    console.log(target);


    switch (target.dataset.action) {
        case 'new-book':
            clickOnNewBook(newBookDialog);
            break;
        case 'close-dialog':
            const currentDialog = currentOpenDialog(newBookDialog, editBookDialog);
            if (currentDialog !== null) {
                clickOnCloseDialog(currentDialog);
            }
            break;
        case 'submit-new-book':
            preventDefault(bookInfoForm);
            submitNewBookForm(bookInfoForm, newBookDialog);
            break;
        case 'edit-book':
            currentIndex = getCurrentBookIndex(target);
            clickOnEditBook(currentIndex, editBookDialog);
            
            break;
        case 'update-book':
            const currentForm = document.querySelector(`.book-info-dialog.edit .edit-book-info[data-book-index="${String(currentIndex)}"]`);
            preventDefault(currentForm);
            clickOnUpdateBook(currentForm, currentIndex, editBookDialog);
            break;
        case 'delete-book':
            console.log('hi');
            clickOnDeleteBook(bookInfoForm, currentIndex, editBookDialog);
            break;
    }
})


