const body = document.querySelector("body");
const gallery = document.getElementById("gallery");
let modalContainer;
let employees = [];

// Random employees API -> return a list of 12 employees, and only in the English alphabet
const url = "https://randomuser.me/api/?nat=us&results=12";

// FUNCTIONS

// API request
// Get data from url and store as an array of objects in employees variable
// Call displayEmployees func to dynamically display employees on the DOM
function getEmployeesData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      employees = data.results;
      displayEmployees(employees);
    })
    .catch((err) => console.log(err));
}

// Displays employees on the DOM
function displayEmployees(data) {
  const galleryHTML = data
    .map(
      (employee) => `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.thumbnail}" alt="${employee.name.first} ${employee.name.last}">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p id="email" class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        </div>
    `
    )
    .join("");
  gallery.insertAdjacentHTML("beforeend", galleryHTML);
}

// Display modal container with selected employee info
function showModal(employee) {
  function normalize(phone) {
    // normalize string and remove all unnecessary characters
    phone = phone.replace(/[^\d]/g, "");

    // check if number length equals to 10
    if (phone.length == 10) {
      // reformat and return phone number
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  }

  const employeeName = employee.name.first + " " + employee.name.last;
  const birthday = new Date(employee.dob.date);
  const employeeBirthday = `${
    birthday.getMonth() + 1
  }/${birthday.getDay()}/${birthday.getYear()}`;
  const employeeAddress = `${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}`;
  const modalHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${
                      employee.picture.thumbnail
                    }" alt="${employeeName}">
                    <h3 id="name" class="modal-name cap">${employeeName}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${normalize(employee.cell)}</p>
                    <p class="modal-text">${employeeAddress}</p>
                    <p class="modal-text">Birthday: ${employeeBirthday}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;

  body.insertAdjacentHTML("beforeend", modalHTML);

  modalContainer = document.querySelector(".modal-container");
}

// EVENT LISTENERS

// Display search bar on page load
window.onload = () => {
  const searchHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
        `;
  document.querySelector(".search-container").innerHTML = searchHTML;
};

// Search input on keyup and shows only results that match users input
body.addEventListener("keyup", (e) => {
  if (e.target.closest("#search-input")) {
    let currentValue = e.target.value.toLowerCase();
    let employees = document.querySelectorAll("h3.card-name");
    employees.forEach((employee) => {
      if (employee.textContent.toLowerCase().includes(currentValue)) {
        employee.parentNode.parentNode.style.display = "flex";
      } else {
        employee.parentNode.parentNode.style.display = "none";
      }
    });
  }
});

// Show modal on card click
gallery.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  const nameCard = card.querySelector("#name").textContent;

  const employee = employees.find(
    (employee) => employee.name.first + " " + employee.name.last === nameCard
  );

  showModal(employee);
});

// Modal next and prev button handlers
// Modal close on close button or outside card click
body.addEventListener("click", (e) => {
  const nameModal = modalContainer.querySelector("#name").textContent;
  const employee = employees.find(
    (employee) => employee.name.first + " " + employee.name.last === nameModal
  );

  if (e.target.closest("#modal-next")) {
    // if current employee is not the last on the list, show next
    if (employees.indexOf(employee) < employees.length - 1) {
      modalContainer.remove();
      showModal(employees[employees.indexOf(employee) + 1]);
    }
  } else if (e.target.closest("#modal-prev")) {
    // if current employee is not the first on the list, show previous
    if (employees.indexOf(employee) > 0) {
      modalContainer.remove();
      showModal(employees[employees.indexOf(employee) - 1]);
    }
  } else if (e.target.closest("#modal-close-btn")) {
    modalContainer.remove();
  } else if (
    e.target.closest(".modal-container") &&
    !e.target.closest(".modal") &&
    !e.target.closest(".modal-btn-container")
  ) {
    modalContainer.remove();
  }
});

// Call function to retrieve data from the API
getEmployeesData(url);
