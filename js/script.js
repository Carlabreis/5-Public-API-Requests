const gallery = document.getElementById("gallery");
const body = document.querySelector("body");
let modalContainer;

let employees = [];

const url = "https://randomuser.me/api/?nat=us&results=12";

function getEmployeesData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      employees = data.results;
      displayEmployees(employees);
    })
    .catch((err) => console.log(err));
}

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

function showModal(employee) {
  function normalize(phone) {
    //normalize string and remove all unnecessary characters
    phone = phone.replace(/[^\d]/g, "");

    //check if number length equals to 10
    if (phone.length == 10) {
      //reformat and return phone number
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  }

  const birthday = new Date(employee.dob.date);

  const modalHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${
                      employee.picture.thumbnail
                    }" alt="${employee.name.first} ${employee.name.last}">
                    <h3 id="name" class="modal-name cap">${
                      employee.name.first
                    } ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${normalize(employee.cell)}</p>
                    <p class="modal-text">${employee.location.street.number} ${
    employee.location.street.name
  }, ${employee.location.city}, ${employee.location.state} ${
    employee.location.postcode
  }</p>
                    <p class="modal-text">Birthday: ${
                      birthday.getMonth() + 1
                    }/${birthday.getDay()}/${birthday.getYear()}</p>
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

/*
 * EVENT LISTENERS
 */

window.onload = () => {
  const searchHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
        `;
  document.querySelector(".search-container").innerHTML = searchHTML;
};

//search input
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

//show modal on card click
gallery.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  const nameCard = card.querySelector("#name").textContent;

  const employee = employees.find(
    (employee) => employee.name.first + " " + employee.name.last === nameCard
  );

  showModal(employee);
});

/*
 * modal next and prev button handlers
 * modal close on close button and outside card click
 */
body.addEventListener("click", (e) => {
  const nameModal = modalContainer.querySelector("#name").textContent;
  const employee = employees.find(
    (employee) => employee.name.first + " " + employee.name.last === nameModal
  );

  if (e.target.closest("#modal-next")) {
    if (employees.indexOf(employee) < employees.length - 1) {
      modalContainer.remove();
      showModal(employees[employees.indexOf(employee) + 1]);
    }
  } else if (e.target.closest("#modal-prev")) {
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

getEmployeesData(url);
