import { editBook, deleteBook, changeIsCompleteBook } from './frontend.js';

const renderCard = document.getElementById('render-card');

function htmlToElement(html) {
	let template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

function createArticleComponent() {
	const ARTICLE_HTML = document.createElement('article');
	// Set css
	ARTICLE_HTML.setAttribute(
		'class',
		'rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300'
	);

	return ARTICLE_HTML;
}

function createHeaderCardComponent() {
	const DIV_1_HTML = document.createElement('div');
	DIV_1_HTML.setAttribute(
		'class',
		'relative flex items-end overflow-hidden rounded-xl'
	);
	const IMG_HTML = document.createElement('img');
	IMG_HTML.setAttribute('class', 'object-cover');
	IMG_HTML.setAttribute('src', 'https://picsum.photos/240/160');

	DIV_1_HTML.append(IMG_HTML);
	return DIV_1_HTML;
}

function createIconCardComponent(name, id = null) {
	const LIST_ICON = [
		{ name: 'complete', icon: 'bx-book', color: 'blue-500' },
		{ name: 'reading', icon: 'bx-book-open', color: 'blue-500' },
		{ name: 'edit', icon: 'bx-edit', color: 'green-500' },
		{ name: 'delete', icon: 'bx-trash', color: 'red-500' },
	];

	//Button
	const BUTTON_HTML = document.createElement('button');
	BUTTON_HTML.setAttribute('type', 'button');
	BUTTON_HTML.setAttribute(
		'class',
		`flex items-center space-x-1.5 rounded-lg px-1 text-white `
	);
	BUTTON_HTML.addEventListener('click', function () {
		switch (name) {
			case 'edit':
				editBook(id);
				break;
			case 'delete':
				deleteBook(id);
				break;
			default:
				changeIsCompleteBook(id);
				break;
		}
	});

	// icon
	const FIND_ICON = LIST_ICON.find((item) => item.name === name);
	const ICON_HTML = htmlToElement(
		`<i class="bx ${FIND_ICON.icon} text-${FIND_ICON.color} text-3xl"></i>`
	);

	BUTTON_HTML.append(ICON_HTML);

	return BUTTON_HTML;
}

function buttonIconCardComponent(book) {
	const DIV_1_HTML = document.createElement('div');
	DIV_1_HTML.setAttribute('class', 'mt-3 flex items-end justify-between');

	const P_HTML = document.createElement('p');
	P_HTML.setAttribute('class', 'text-lg font-bold text-blue-500');
	P_HTML.innerText = book.year;

	const DIV_2_HTML = document.createElement('div');
	DIV_2_HTML.setAttribute('class', 'flex justify-between');

	// Icon
	const ICON_BOOK_HTML = createIconCardComponent(
		book.isComplete ? 'complete' : 'reading',
		book.id
	);
	const ICON_DELETE_HTML = createIconCardComponent('delete', book.id);
	const ICON_EDIT_HTML = createIconCardComponent('edit', book.id);

	DIV_1_HTML.append(P_HTML);
	DIV_2_HTML.append(ICON_EDIT_HTML, ICON_BOOK_HTML, ICON_DELETE_HTML);
	DIV_1_HTML.append(DIV_2_HTML);

	return DIV_1_HTML;
}

function createBodyCardComponent(book) {
	const DIV_1_HTML = document.createElement('div');
	DIV_1_HTML.setAttribute('class', 'mt-1 p-2');
	const TITLE_HTML = htmlToElement(
		`<h2 class="text-slate-700">${book.title}</h2>`
	);
	const AUTHOR_HTML = htmlToElement(
		`<p class="mt-1 text-sm text-slate-400">${book.author}</p>`
	);
	const IS_COMPLETE_HTML = htmlToElement(
		`<p class="mt-1 text-sm text-sky-700">${
			book.isComplete ? 'Sudah Selesai' : 'Sedang Dibaca'
		}</p>`
	);

	const BOTTOM_CARD_HTML = buttonIconCardComponent(book);

	DIV_1_HTML.append(TITLE_HTML);
	DIV_1_HTML.append(AUTHOR_HTML);
	DIV_1_HTML.append(IS_COMPLETE_HTML);
	DIV_1_HTML.append(BOTTOM_CARD_HTML);
	return DIV_1_HTML;
}

function makeCardComponent(books) {
	renderCard.innerHTML = '';
	books.map((book, index) => {
		const ARTICLE_HTML = createArticleComponent();
		const HEADER_CARD_HTML = createHeaderCardComponent();
		const BODY_CARD_HTML = createBodyCardComponent(book);

		ARTICLE_HTML.append(HEADER_CARD_HTML);
		ARTICLE_HTML.append(BODY_CARD_HTML);
		// ARTICLE_HTML.innerText = index;

		renderCard.append(ARTICLE_HTML);
	});
}

export { makeCardComponent };
