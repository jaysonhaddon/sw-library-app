const gridContainer = document.querySelector(".grid-container");
const newBtn = document.querySelector(".new-btn");
const closeBtn = document.querySelector(".close-btn");
const newBookForm = document.querySelector("#new-book-form");
const overlay = document.querySelector("#overlay");
const modal = document.querySelector("#modal");

let library = [];

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
  library.push(newBook);
  createBookCard(newBook);
}

newBtn.addEventListener("click", () => {
  console.log("Add button was clicked!");
  toggleModal();
});

closeBtn.addEventListener("click", () => {
  toggleModal();
  resetForm(newBookForm);
});

newBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("New Book form was submitted");
  console.log(newBookForm.elements);
  let validForm = validateForm(newBookForm);
  if (validForm) {
    addBookToLibrary(newBookForm.elements);
    toggleModal();
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

function toggleModal() {
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
  cardText[0].textContent = `Title: ${book.title}`;
  cardText[1].textContent = `Author: ${book.author}`;
  cardText[2].textContent = `Timeline: ${book.timeline}`;
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

  card.append(textDiv, buttonDiv);
  gridContainer.appendChild(card);
}
