const gridContainer = document.querySelector(".grid-container");
const newBtn = document.querySelector(".new-btn");
const closeBtn = document.querySelector(".close");
const newBookForm = document.querySelector("#new-book-form");
const overlay = document.querySelector("#overlay");
const modal = document.querySelector("#modal");

let library = [];

function Book(title, author, era, read) {
  this.title = title;
  this.author = author;
  this.era = era;
  this.read = read;
}

// Called by create button in pop up
function addBookToLibrary(elements) {
  newBook = new Book(elements[0].value, elements[1].value, elements[2].value);
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
  for (let i = 1; i < 5; i++) {
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
  const sections = [];
  for (let i = 0; i < 4; i++) {
    let temp = document.createElement("p");
    sections.push(temp);
  }
  sections[0].textContent = `Title: ${book.title}`;
  sections[1].textContent = `Author: ${book.author}`;
  sections[2].textContent = `Era: ${book.era}`;
  sections[3].textContent = `Read: ${book.read}`;
  sections.forEach((element) => {
    card.appendChild(element);
  });
  gridContainer.appendChild(card);
}
