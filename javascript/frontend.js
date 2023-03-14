// Grabs all the Elements by their IDs which we had given them
import handleLocalStorage from './localStorage.js';
import { makeCardComponent } from './makeComponent.js';
import DEFAULT_BOOK from './mock-data.js';

const RENDER_EVENT = 'render-book';
// Search book
const searchBookHtml = document.getElementById('search-book');
// Filter book
const filterAllBookHtml = document.getElementById('filter-all-book');
const filterCompleteBookHtml = document.getElementById('filter-complete-book');
const filterReadingBookHtml = document.getElementById('filter-reading-book');
let modal = document.getElementById('my-modal');
let btn = document.getElementById('open-btn');
let submitButton = document.getElementById('submit-btn');
// Form
let modalHeader = document.getElementById('modal-header');
let modalBookForm = document.getElementById('modal-book');
let idBookForm = document.getElementById('id-book');
let titleForm = document.getElementById('title');
let authorForm = document.getElementById('author');
let yearForm = document.getElementById('year');
let completeCheckbox = document.getElementById('complete-checkbox');

// State
let [books, setBook] = handleLocalStorage('book', DEFAULT_BOOK);
let filterBook = 'all-book';
let inputSearchBook = '';

// Handle first event
filterAllBookHtml.addEventListener('click', () => filterBooks('all-book'));
filterCompleteBookHtml.addEventListener('click', () =>
	filterBooks('complete-book')
);
filterReadingBookHtml.addEventListener('click', () =>
	filterBooks('reading-book')
);

// Render all components
document.addEventListener('DOMContentLoaded', function () {
	document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(RENDER_EVENT, function () {
	let filteredBook = renderFilteredBooks();
	filteredBook = filteredBook.filter((book) => {
		return book.title.toLowerCase().includes(inputSearchBook.toLowerCase());
	});
	makeCardComponent(filteredBook);
});

// All functions

function renderFilteredBooks() {
	switch (filterBook) {
		case 'all-book':
			return books;
		case 'reading-book':
			return books.filter((book) => book.isComplete === false);
		case 'complete-book':
			return books.filter((book) => book.isComplete === true);
		default:
			return books;
	}
}

function removeActiveClassInFilterBook() {
	filterAllBookHtml.classList.remove('text-blue-500');
	filterCompleteBookHtml.classList.remove('text-blue-500');
	filterReadingBookHtml.classList.remove('text-blue-500');
}

function filterBooks(filter) {
	filterBook = filter;
	switch (filterBook) {
		case 'all-book':
			removeActiveClassInFilterBook();
			filterAllBookHtml.classList.add('text-blue-500');
			break;
		case 'reading-book':
			removeActiveClassInFilterBook();
			filterReadingBookHtml.classList.add('text-blue-500');
			break;
		case 'complete-book':
			removeActiveClassInFilterBook();
			filterCompleteBookHtml.classList.add('text-blue-500');
			break;
		default:
			return books;
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function resetFormInput() {
	// Reset ID input
	idBookForm.value = '';
	titleForm.value = '';
	titleForm.innerText = '';
	authorForm.value = '';
	authorForm.innerText = '';
	yearForm.value = '';
	yearForm.innerText = '';
	completeCheckbox.checked = false;
}

function handleModalBook() {
	// We want the modal to open when the Open button is clicked
	btn.onclick = function () {
		modalHeader.innerText = 'Create New Book';
		modal.style.display = 'block';
		btn.style.display = 'none';

		// Reset ID input
		resetFormInput();
	};

	// We want the modal to close when the OK button is clicked
	submitButton.onclick = function () {
		modal.style.display = 'none';
		btn.removeAttribute('style');
	};

	// The modal will close when the user clicks anywhere outside the modal
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = 'none';
			btn.removeAttribute('style');
		}
	};
}

function getDataForm(form) {
	let formData = new FormData(form);

	// iterate through entries...
	const formProps = Object.fromEntries(formData);
	return formProps;
}

function handleSearchBook() {
	searchBookHtml.addEventListener('submit', function (e) {
		e.preventDefault();
		let form = getDataForm(e.target);
		inputSearchBook = form.searchBook;
		document.dispatchEvent(new Event(RENDER_EVENT));
	});
}

function handleBook() {
	modalBookForm.addEventListener('submit', function (e) {
		e.preventDefault();
		let form = getDataForm(e.target);
		let resultBooks = books;

		// Check if ID exist then EDIT
		if (form.id) {
			form = {
				...form,
				id: Number(form.id),
				isComplete: completeCheckbox.checked,
			};
			resultBooks = resultBooks.map((book) => {
				if (book.id == form.id) return { ...form };
				return book;
			});
		} else {
			form = {
				...form,
				id: +new Date(),
				isComplete: completeCheckbox.checked,
			};
			resultBooks.push(form);
		}
		books = setBook(resultBooks);
		document.dispatchEvent(new Event(RENDER_EVENT));
	});
}

function changeIsCompleteBook(id) {
	const newBooks = books.map((book) => {
		if (book.id === id)
			return {
				...book,
				isComplete: !book.isComplete,
			};
		return book;
	});
	if (newBooks == null) return;

	books = setBook(newBooks);
	document.dispatchEvent(new Event(RENDER_EVENT));
}
function editBook(id) {
	let book = books.find((book) => book.id === id);

	// Display modal
	modal.style.display = 'block';
	btn.style.display = 'none';
	modalHeader.innerText = 'Edit Book';

	// Fill Form
	idBookForm.value = book.id;
	titleForm.value = book.title;
	titleForm.innerText = book.title;
	authorForm.value = book.author;
	authorForm.innerText = book.author;
	yearForm.value = book.year;
	yearForm.innerText = book.year;
	completeCheckbox.checked = book.isComplete;
}

function deleteBook(id) {
	let filterBooks = books.filter((book) => book.id !== id);

	books = setBook(filterBooks);
	document.dispatchEvent(new Event(RENDER_EVENT));
}

handleBook();
handleSearchBook();
handleModalBook(books);

export { editBook, deleteBook, changeIsCompleteBook };
