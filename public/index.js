const btn = document.querySelector(".refresh");
const delBtn = document.querySelector(".btn-danger");
const addBtn = document.querySelector(".btn-add");
const listProducts = document.querySelector(".first-list");
const productDescriptionBox = document.querySelector(".box");
const ordersList = document.querySelector(".list-group-horizontal");
const addProductName = document.querySelector("#product-name");
const addProductDescription = document.querySelector("#product-description");

let activeProductName;

////getting data from app.js

function fetchData() {
  fetch("/getData", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json({ email: "formInput.value" }))
    .then((data) => {
      let products = {};
      data.forEach((item) => (products[item.Name] = item.Description));
      console.log(data);
      renderProductData(products);
    });
}

fetchData();

//// rendering product data
function renderProductData(products) {
  const keys = Object.keys(products);
  listProducts.innerHTML = "";
  keys.forEach((key) => {
    listProducts.insertAdjacentHTML(
      "afterbegin",
      `<a href="#" class="list-group-item list-group-item-action product-links"
  >${key}</a
>`
    );
  });
  const productLinks = document.querySelectorAll(".product-links");
  renderProductDescription(productLinks, products);
}

////Rendering product description on click
function renderProductDescription(links, products) {
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      btn.classList.remove("btn-outline-secondary");
      btn.classList.add("btn-success");
      e.preventDefault();
      if (document.querySelector(".active"))
        document.querySelector(".active").classList.remove("active");

      let activeProduct = e.target;
      activeProduct.classList.add("active");
      activeProductName = e.target.innerHTML;
      productDescriptionBox.innerHTML = products[activeProductName];
    });
  });
}

////Add orders to list

function getDate() {
  var today = new Date();
  let time = today.getHours() + ":" + today.getMinutes();
  let date = "Today at: " + time;
  return date;
}

getDate();

btn.addEventListener("click", (e) => {
  e.preventDefault();
  let date = getDate();
  ordersList.insertAdjacentHTML(
    "afterend",
    `<ul class="list-group list-group-horizontal">
    <li class="list-group-item">${activeProductName}</li>
    <li class="list-group-item">${date}</li>
  </ul>`
  );
});

////Delete product
delBtn.addEventListener("click", () => {
  const data = { name1: activeProductName };
  if (activeProductName) {
    fetch("/delData", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      console.log(response);
      fetchData();
    });
  }
});

///Add product
addBtn.addEventListener("click", (e) => {
  const data = {
    Name: addProductName.value,
    Description: addProductDescription.value,
  };

  e.preventDefault();
  fetch("/postData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    console.log(response);
    fetchData();
  });
});
