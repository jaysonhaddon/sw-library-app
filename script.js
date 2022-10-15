const gridContainer = document.querySelector(".grid-container");
const newBtn = document.querySelector(".new-btn");
const closeBtn = document.querySelector(".close-btn");
const newBookForm = document.querySelector("#new-book-form");
const overlay = document.querySelector("#overlay");
const newBookModal = document.querySelector("#nb-modal");
const deleteModal = document.querySelector("#delete-modal");
const backBtns = document.querySelectorAll(".back-btn");
const deleteBtn = document.querySelector(".delete-btn");
const API_URL = "http://127.0.0.1:3000/api";
let activeBookCard;
let selectOptions = [];

// Initial queries for exisiting books and form selection fields
querySelectionData();
queryAllBooks();

// Constructor for Book object that will be used to create book cards and POST data
function Book(title, author, timeline, category, read, id) {
  this.title = title;
  this.author = author;
  this.timeline = timeline;
  this.category = category;
  this.read = read;
  this.id = id;
}

// Builds the option elements for the new book form drop down menus
function buildFormMenus(formData) {
  const authorMenu = document.querySelector("#book-author");
  const timelineMenu = document.querySelector("#book-timeline");
  const categoryMenu = document.querySelector("#book-cat");

  formData[0].forEach((item) => {
    const option = document.createElement("option");
    option.setAttribute("value", item.id);
    option.textContent = `${item.first_name} ${item.last_name}`;
    authorMenu.appendChild(option);
  });

  formData[1].forEach((item) => {
    const option = document.createElement("option");
    option.setAttribute("value", item.id);
    option.textContent = item.time_period;
    timelineMenu.appendChild(option);
  });

  formData[2].forEach((item) => {
    const option = document.createElement("option");
    option.setAttribute("value", item.id);
    option.textContent = item.category;
    categoryMenu.appendChild(option);
  });
}

// Called when app runs to query drop down menu values and build options for form fields
async function querySelectionData() {
  const selectionData = [];
  const options = {
    method: "GET",
  };
  const authorResponse = await fetch(`${API_URL}/authors`, options);
  const authors = await authorResponse.json();
  selectionData.push(authors);

  const timelineResponse = await fetch(`${API_URL}/timeline`, options);
  const timeline = await timelineResponse.json();
  selectionData.push(timeline);

  const genreResponse = await fetch(`${API_URL}/genre`, options);
  const genre = await genreResponse.json();
  selectionData.push(genre);

  selectionData.forEach((item) => {
    selectOptions.push(item);
  });
  buildFormMenus(selectionData);
}

// Called when app runs to retrieve all stored book data and create cards
async function queryAllBooks() {
  const options = {
    method: "GET",
  };
  const response = await fetch(`${API_URL}/all`, options);
  const bookData = await response.json();
  bookData.forEach((book) => {
    const newBook = new Book(
      book.title,
      `${book.first_name} ${book.last_name}`,
      book.time_period,
      book.category,
      book.read,
      book.id
    );
    const bookCard = createBookCard(newBook);
    bookCard.setAttribute("data-id", newBook.id);
  });
}

// Called by create button in pop up
async function addBookToLibrary(elements) {
  // Creates book object that with values that will be sent to database
  const newBook = new Book(
    elements["book-title"].value,
    +elements["book-author"].value,
    +elements["book-timeline"].value,
    +elements["book-cat"].value,
    elements["book-read"].value
  );

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBook),
  };

  const response = await fetch(`${API_URL}/new-book`, options);
  const bookID = await response.json();

  // Update values of book object to corresponding character data
  const authorObject = findSelectionValue(
    selectOptions[0],
    +elements["book-author"].value
  );
  const authorName = `${authorObject.first_name} ${authorObject.last_name}`;
  newBook.author = authorName;
  newBook.timeline = findSelectionValue(
    selectOptions[1],
    newBook.timeline
  ).time_period;
  newBook.category = findSelectionValue(
    selectOptions[2],
    newBook.category
  ).category;
  newBook.id = bookID.data;

  // Create book card element for DOM
  const bookCard = createBookCard(newBook);
  bookCard.setAttribute("data-id", newBook.id);
}

// Called by delete modal button to remove the book from database
async function deleteBookFromLibrary(bookCard) {
  const bookID = +bookCard.getAttribute("data-id");

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: bookID }),
  };

  const response = await fetch(`${API_URL}/delete-book`, options);
  const message = await response.json();
  console.log(message);
  bookCard.remove();
}

function editBookInLibrary(bookCard) {
  const index = +bookCard.getAttribute("data-id");
  // display a modal pop up to edit values
  // validate values
  // Use fetch to edit record from SQL database based on ID
  // update card on screen
}

// NEW BOOK button in DOM
newBtn.addEventListener("click", () => {
  console.log("Add button was clicked!");
  toggleModal(newBookModal);
});

// [x] button that closes the new book modal
closeBtn.addEventListener("click", () => {
  toggleModal(newBookModal);
  resetForm(newBookForm);
});

// Delete button in the delete modal
deleteBtn.addEventListener("click", () => {
  deleteBookFromLibrary(activeBookCard);
  toggleModal(deleteModal);
});

// Submit button on the new book form modal
newBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("New Book form was submitted");
  const validForm = validateForm(newBookForm);
  if (validForm) {
    addBookToLibrary(newBookForm.elements).catch((error) => {
      alert(error);
      return;
    });
    toggleModal(newBookModal);
    resetForm(newBookForm);
  } else {
    // Display errors in the modal
  }
});

// Validates the user inputs in the form
function validateForm(form) {
  const numFields = 5;
  for (let i = 1; i <= numFields; i++) {
    let current = form.elements[i].value;
    console.log(typeof current);
    if (current.trim().length == 0 || current == undefined || current == null) {
      console.log("Field data is not valid");
      return false;
    }
  }
  return true;
}

// Resets the form values back to default
function resetForm(form) {
  console.log("Reseting new book form");
  form.elements["book-title"].value = "";
}

// Enables/Disables a modal and overlay
function toggleModal(modal) {
  overlay.classList.toggle("active");
  modal.classList.toggle("active");
}

// Created the DOM element for each book
function createBookCard(book) {
  const card = document.createElement("div");
  card.classList.add("card");

  const textDiv = document.createElement("div");
  textDiv.classList.add("card-text");
  const cardText = [];
  for (let i = 0; i < 5; i++) {
    let temp = document.createElement("p");
    cardText.push(temp);
  }
  cardText[0].textContent = `Title: ${titleCase(book.title)}`;
  cardText[1].textContent = `Author: ${book.author}`;
  cardText[2].textContent = `Timeline: ${book.timeline}`;
  cardText[3].textContent = `Category: ${book.category}`;
  cardText[4].textContent = `Read: ${titleCase(book.read)}`;
  cardText.forEach((element) => {
    textDiv.appendChild(element);
  });

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("card-btn");
  const editBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");
  editBtn.textContent = "EDIT";
  deleteBtn.textContent = "DELETE";
  buttonDiv.append(editBtn, deleteBtn);

  editBtn.addEventListener("click", () => {
    console.log("You clicked the edit button!");
  });

  deleteBtn.addEventListener("click", () => {
    console.log("You clicked the delete button!");
    deleteModal.children[2].textContent = ` ${cardText[0].textContent}`;
    toggleModal(deleteModal);
    setActiveBookCard(card);
  });

  card.append(textDiv, buttonDiv);
  gridContainer.appendChild(card);
  return card;
}

// Sets the active book card to the DOM element that was clicked
function setActiveBookCard(bookCard) {
  activeBookCard = bookCard;
  console.log(activeBookCard);
}

// Used to find the corresponding dictionary for form selection fields, based on the chosen field value
function findSelectionValue(optionArray, fieldID) {
  let match;
  optionArray.forEach((item) => {
    if (item.id == fieldID) {
      match = item;
    }
  });
  return match;
}

// Helper function used to format string into title case
function titleCase(sentence) {
  let tmp = sentence.toLowerCase().split(" ");
  let corrected = tmp.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  });
  return corrected.join(" ");
}
