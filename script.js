const gridContainer = document.querySelector(".grid-container");
const newBtn = document.querySelector(".new-btn");
const closeBtn = document.querySelector(".close-btn");
const newBookForm = document.querySelector("#new-book-form");
const overlay = document.querySelector("#overlay");
const newBookModal = document.querySelector("#nb-modal");
const deleteModal = document.querySelector("#delete-modal");
const backBtns = document.querySelectorAll(".back-btn");
const deleteBtn = document.querySelector(".delete-btn");

let cardID = 0;
let activeBookCard;

function Book(title, author, timeline, category, read) {
  this.title = title;
  this.author = author;
  this.timeline = timeline;
  this.category = category;
  this.read = read;
}

// Called by create button in pop up
function addBookToLibrary(elements) {
  newBook = new Book(
    elements["book-title"].value,
    elements["book-author"].value,
    elements["book-timeline"].value,
    elements["book-cat"].value,
    elements["book-read"].value
  );
  const bookCard = createBookCard(newBook);
  bookCard.setAttribute("data-id", cardID);
  cardID++;
  console.log(cardID);
}

function deleteBookFromLibrary(bookCard) {
  const index = +bookCard.getAttribute("data-id");

  // Use fetch to delete record from SQL database based on ID
  bookCard.remove();
}

function editBookInLibrary(bookCard) {
  const index = +bookCard.getAttribute("data-id");
  // display a modal pop up to edit values
  // validate values
  // Use fetch to edit record from SQL database based on ID
  // update card on screen
}

newBtn.addEventListener("click", () => {
  console.log("Add button was clicked!");
  toggleModal(newBookModal);
});

closeBtn.addEventListener("click", () => {
  toggleModal(newBookModal);
  resetForm(newBookForm);
});

deleteBtn.addEventListener("click", () => {
  deleteBookFromLibrary(activeBookCard);
  toggleModal(deleteModal);
});

newBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("New Book form was submitted");
  console.log(newBookForm.elements);
  let validForm = validateForm(newBookForm);
  if (validForm) {
    addBookToLibrary(newBookForm.elements);
    toggleModal(newBookModal);
    resetForm(newBookForm);
  } else {
    // Display errors in the modal
  }
});

function validateForm(form) {
  for (let i = 1; i < 6; i++) {
    let current = form.elements[i].value;
    console.log(current);
    if (current.trim().length == 0 || current == undefined || current == null) {
      console.log("Field data is not valid");
      return false;
    }
  }
  return true;
}

function resetForm(form) {
  for (let i = 1; i < 5; i++) {
    console.log(`i: ${i}  ${form.elements[i].value}`);
    if (i == 3) {
      form.elements[i].checked = false;
    } else {
      form.elements[i].value = "";
    }
  }
}

function toggleModal(modal) {
  overlay.classList.toggle("active");
  modal.classList.toggle("active");
}

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
  cardText[1].textContent = `Author: ${titleCase(book.author)}`;
  cardText[2].textContent = `Timeline: ${titleCase(book.timeline)}`;
  cardText[3].textContent = `Category: ${book.category}`;
  cardText[4].textContent = `Read: ${book.read}`;
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

function setActiveBookCard(bookCard) {
  activeBookCard = bookCard;
  console.log(activeBookCard);
}

// Function used to format string into title case
function titleCase(sentence) {
  let tmp = sentence.toLowerCase().split(" ");
  let corrected = tmp.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  });
  return corrected.join(" ");
}
