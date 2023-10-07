const gallery = document.getElementById("gallery");
const body = document.querySelector("body");
let employees = [];

function getEmployeesData(url) {
    fetch(url)
        .then((res) => res.json())
        // .then(data => console.log(data))
        .then((data) => {
            employees = data.results;
            displayEmployees(employees);
            })
        .catch((err) => console.log(err))
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
    `)
    .join("");
  gallery.insertAdjacentHTML("beforeend", galleryHTML);
}

function showModal(employee) {
    const modalHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employee.email}" alt="${employee.name.first} ${employee.name.last}">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${employee.cell}</p>
                    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                    <p class="modal-text">Birthday: ${employee.dob.date.getMonth + 1}/${employee.dob.date.getDay}/${employee.dob.date.getYear}</p>
                </div>
            </div>

            // IMPORTANT: Below is only for exceeds tasks 
            // <div class="modal-btn-container">
            //     <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            //     <button type="button" id="modal-next" class="modal-next btn">Next</button>
            // </div>
        </div>
    `;
    body.insertAdjacentHTML('beforeend', modalHTML);
}

body.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    const nameTarget = card.querySelector("#name").textContent;

    const employee = employees.find((employee) => employee.name.first + " " + employee.name.last === nameTarget);
    
    showModal(employee);
})

getEmployeesData("https://randomuser.me/api/?results=20");
