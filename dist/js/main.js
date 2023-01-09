const menuBtn = document.querySelector(".menu-btn");
const hamburger = document.querySelector(".menu-btn__burger");
const nav = document.querySelector(".nav");
const menuNav = document.querySelector(".menu-nav");
const homeLink = document.querySelector(".homelink");
const cartBtn = document.querySelector(".cart-container");
const addBtn = document.querySelector(".add-btn");
const finalTotal = document.getElementById("final-total");
const grandTotal = document.getElementById("grand-total");
const overlay = document.createElement("div");
const body = document.querySelector("body");
const backBtn = document.querySelector(".back-btn");
let count = 0;
cartBtn.dataset["count"] = count;
if (!count) {
  cartBtn.classList.add("empty");
}
backBtn?.addEventListener("click", () => {
  window.history.go(-1);
});
overlay.classList.add("overlay");
if (location.pathname === "/dist/index.html") {
  document.getElementById("index-header").style.backgroundColor =
    "rgba(0, 0, 0, 0.9)";
}
let showMenu = false;
menuBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  if (!showMenu) {
    hamburger.classList.add("open");
    nav.classList.add("open");
    menuNav.classList.add("open");
    homeLink.style.display = "none";
    showMenu = true;
    body.appendChild(overlay);
  } else {
    hamburger.classList.remove("open");
    nav.classList.remove("open");
    menuNav.classList.remove("open");
    homeLink.style.display = "inline-block";
    showMenu = false;
    body.removeChild(overlay);
  }
}
//add items to localstorage
addBtn?.addEventListener("click", (e) => {
  count = e.target.previousElementSibling.children[1].childNodes[0].data;
  cartBtn.dataset["count"] = count;
  cartBtn.classList.remove("empty");
  localStorage.setItem(
    `cart-${e.target.id}`,
    JSON.stringify({
      name: e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.childNodes[0].data.trim(),
      price: e.target.parentElement.previousElementSibling.childNodes[0].data,
      quantity: e.target.previousElementSibling.children[1].childNodes[0].data,
    })
  );
});
const cart = document.createElement("div");
cart.classList.add("cart");
const cartHtml = `
<div class="cart__headline"></div>
<button type="button" class="cart__remove">Remove all</button>
<div class="cart__content">
</div>
<div class="cart__total">
  <span>TOTAL</span>
  <span class="cart__total__amount"></span>
</div>
<a href="./checkout.html" class="cart__checkout">CHECKOUT</a>
`;
const emptyCartHtml = `
<div class="empty-cart">
    <div class="empty-cart__text">Your cart is empty</div>
    <img src="./assets/cart/Combined Shape 2.png" alt="" class="empty-cart__img" />
  </div>
`;
let totalAmount = 0;
let amountOfItemsInCart = 0;
cartBtn.addEventListener("click", () => {
  let localstorageKeys = [];
  // let amountOfItemsInCart = 0;
  for (let i = 0; i < localStorage.length; i++) {
    localstorageKeys.push(localStorage.key(i).split("-")[0]);
  }
  if (!localstorageKeys.includes("cart")) {
    cart.innerHTML = emptyCartHtml;
    body.appendChild(overlay);
    body.appendChild(cart);
  } else {
    cart.innerHTML = cartHtml;
  }
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.includes("cart")) {
      body.appendChild(overlay);
      body.appendChild(cart);
      const cartContent = document.querySelector(".cart__content");
      const removeAll = document.querySelector(".cart__remove");

      removeAll?.addEventListener("click", () => {
        localStorage.clear();
        amountOfItemsInCart = 0;
        totalAmount = 0;
        count = 0;
        cartBtn.dataset["count"] = count;
        if (!count) {
          cartBtn.classList.add("empty");
        }
        cart.innerHTML = emptyCartHtml;
      });

      amountOfItemsInCart += Number(
        JSON.parse(localStorage.getItem(key)).quantity
      );
      cartContent.innerHTML += `
        <div class="cart__item">
        <img
          class="cart__item__img"
          src="./assets/cart/image-${JSON.parse(localStorage.getItem(key))
            .name.toLowerCase()
            .replaceAll(" ", "")}.jpg"
          alt=""
        />
        <div class="cart__item__info">
          <div class="cart__item__headline">${
            JSON.parse(localStorage.getItem(key)).name.split(" ")[0]
          }</div>
          <div class="cart__item__price">${
            JSON.parse(localStorage.getItem(key)).price
          }</div>
        </div>
        <div class="cart__item__amount">
          <span class="cart__item__amount__minus minus-cart">&#8722;</span>
          <span class="cart__item__amount__number">${
            JSON.parse(localStorage.getItem(key)).quantity
          }</span>
          <span class="cart__item__amount__plus plus-cart">&#43;</span>
        </div>
      </div>
        `;
      totalAmount +=
        Number(JSON.parse(localStorage.getItem(key)).quantity) *
        Number(
          JSON.parse(localStorage.getItem(key)).price.replace(/[^0-9]/g, "")
        );
      // total.innerText = `$${totalAmount}`;
      // cartHeadline.innerText = `Cart(${amountOfItemsInCart})`;
    }
    const total = document.querySelector(".cart__total__amount");
    const cartHeadline = document.querySelector(".cart__headline");
    cartHeadline
      ? (cartHeadline.innerText = `Cart(${amountOfItemsInCart})`)
      : null;
    total ? (total.innerText = `$${totalAmount}`) : null;
    const plusSignsInCart = document.querySelectorAll(".plus-cart");
    const minusSignsInCart = document.querySelectorAll(".minus-cart");
    plusSignsInCart.forEach((sign) => {
      sign.addEventListener("click", (e) => {
        e.target.previousElementSibling.childNodes[0].data++;
        totalAmount += parseInt(
          e.target.parentElement.previousElementSibling.lastElementChild.childNodes[0].data.replace(
            /[^0-9]/g,
            ""
          )
        );
        total.innerHTML = `$${totalAmount}`;
        amountOfItemsInCart++;
        cartHeadline.innerText = `Cart(${amountOfItemsInCart})`;
        count++;
        cartBtn.dataset["count"] = count;
      });
    });
    minusSignsInCart.forEach((sign) => {
      sign.addEventListener("click", (e) => {
        e.target.nextElementSibling.childNodes[0].data > 1
          ? e.target.nextElementSibling.childNodes[0].data--
          : e.target.nextElementSibling.childNodes[0].data;
        totalAmount >=
        parseInt(
          e.target.parentElement.previousElementSibling.lastElementChild.childNodes[0].data.replace(
            /[^0-9]/g,
            ""
          )
        )
          ? (totalAmount -=
              e.target.parentElement.previousElementSibling.lastElementChild.childNodes[0].data.replace(
                /[^0-9]/g,
                ""
              ))
          : 0;
        total.innerHTML = `$${totalAmount}`;
        amountOfItemsInCart > 0 ? amountOfItemsInCart-- : null;
        cartHeadline.innerText = `Cart(${amountOfItemsInCart})`;
        count > 0 ? count-- : null;
        cartBtn.dataset["count"] = count;
      });
    });
    localStorage.setItem(
      "total",
      JSON.stringify({ price: totalAmount, amountOfItems: amountOfItemsInCart })
    );
  }
});

overlay.addEventListener("click", () => {
  if (body.contains(cart)) {
    body.removeChild(overlay);
    body.removeChild(cart);
  }
});
//plus minus functionality
const minus = document.querySelector(".minus");
const plus = document.querySelector(".plus");
minus?.addEventListener("click", subtract);
plus?.addEventListener("click", add);
function add(e) {
  e.target.previousElementSibling.childNodes[0].data++;
  // countItemsInCart++;
}
function subtract(e) {
  if (e.target.nextElementSibling.childNodes[0].data > 1) {
    e.target.nextElementSibling.childNodes[0].data--;
    //  countItemsInCart--;
  }
}
//checkout section
const summaryContainer = document.querySelector(".summary__container");
const summaryContent = document.querySelector(".summary__content");
if (location.pathname === "/dist/checkout.html") {
  finalTotal.innerText = `$${JSON.parse(localStorage.getItem("total")).price}`;
  grandTotal.innerHTML = `$${
    +JSON.parse(localStorage.getItem("total")).price + 50 + 1078
  }`;

  for (let i = 0; i < localStorage.length; i++) {
    const keyInLocalstorage = localStorage.key(i);
    if (keyInLocalstorage.includes("cart")) {
      summaryContent.innerHTML += `
  <div class="cart__item">
        <img
          class="cart__item__img"
          src="./assets/cart/image-${JSON.parse(
            localStorage.getItem(keyInLocalstorage)
          )
            .name.toLowerCase()
            .replaceAll(" ", "")}.jpg"
          alt=""
        />
        <div class="cart__item__info">
          <div class="cart__item__headline">${
            JSON.parse(localStorage.getItem(keyInLocalstorage)).name.split(
              " "
            )[0]
          }</div>
          <div class="cart__item__price">${
            JSON.parse(localStorage.getItem(keyInLocalstorage)).price
          }</div>
        </div>
        <div class="cart__item__amount">
          <span class="cart__item__amount__number">x${
            JSON.parse(localStorage.getItem(keyInLocalstorage)).quantity
          }</span>
        </div>
      </div>
  `;
    }
  }
  const payBtn = document.querySelector(".summary__pay");
  const orderSection = document.createElement("section");
  orderSection.classList.add("order");
  orderSection.innerHTML = `
  <div class="order__container">
        <img
          src="./assets/checkout/icon-order-confirmation.svg"
          alt="order-confirmation"
          class="order__img"
        />
        <div class="order__gratitude">THANK YOU FOR YOUR ORDER</div>
        <p class="order__paragraph">
          You will receive an email confirmation shortly.
        </p>
        <div class="order__info">
          <div class="order__items"></div>
          <div class="order__grand-total">
            <div class="order__grand-total__headline">GRAND TOTAL</div>
            <div class="order__grand-total__number"></div>
          </div>
        </div>
        <a href="./index.html" class="order__back-btn">BACK TO HOME</a>
      </div>
  `;
  payBtn.addEventListener("click", () => {
    body.appendChild(overlay);
    body.appendChild(orderSection);
    //order confirmation
    const orderItems = document.querySelector(".order__items");
    const hr = document.createElement("div");
    const viewBtn = document.createElement("div");
    const grandTotalOrder = document.querySelector(
      ".order__grand-total__number"
    );
    grandTotalOrder.innerHTML = grandTotal.innerHTML;
    hr.classList.add("hr");
    viewBtn.classList.add("order__view");
    for (let i = 0; i < localStorage.length; i++) {
      const orderKey = localStorage.key(i);
      if (orderKey.includes("cart")) {
        orderItems.innerHTML += `
    <div class="order__item" id="${i}">
    <img
    class="order__item__img"
    src="./assets/cart/image-${JSON.parse(localStorage.getItem(orderKey))
      .name.toLowerCase()
      .replaceAll(" ", "")}.jpg"
    alt=""
  />
  <div class="order__item__info">
    <div class="order__item__headline">${
      JSON.parse(localStorage.getItem(orderKey)).name.split(" ")[0]
    }</div>
    <div class="order__item__price">${
      JSON.parse(localStorage.getItem(orderKey)).price
    }</div>
  </div>
  <div class="order__item__amount">
    <span class="order__item__amount__number">x${
      JSON.parse(localStorage.getItem(orderKey)).quantity
    }</span>
  </div>
    </div>
    `;
      }
    }
    orderItems.insertAdjacentElement("beforeend", hr);
    orderItems.insertAdjacentElement("beforeend", viewBtn);
    viewBtn.innerText = `and ${
      +JSON.parse(localStorage.getItem("total")).amountOfItems - 1
    } other item(s)`;
    const orderItemList = document.querySelectorAll(".order__item");
    orderItemList.forEach((elem) => {
      if (elem.id != 1) {
        elem.classList.add("nonactive");
      }
    });
    viewBtn.addEventListener("click", () => {
      orderItemList.forEach((elem) => {
        if (elem.id != 1) {
          console.log(elem);
          elem.classList.toggle("nonactive");
        }
      });
    });
  });
  overlay.addEventListener("click", () => {
    if (body.contains(orderSection)) {
      body.removeChild(orderSection);
      body.removeChild(overlay);
    }
  });
}
