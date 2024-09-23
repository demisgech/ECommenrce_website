import { getCartItems } from "./getCartItems.js";
import { Storage } from "./Storage.js";
import { Toggler } from "./Toggler.js";

// Display products
export class UI {
  #buttonsDOM = [];
  #cartButton = document.querySelector(".cart__button");
  #menu = document.querySelector(".menu");
  #cartItemsBadge = document.querySelector(".cart-items");
  #totalPrice = document.querySelector(".total__price");
  #closeCartBtn = document.querySelector(".close--cart");
  #clearCartBtn = document.querySelector(".clear-cart");
  #cartContent = document.querySelector(".cart__content");
  #cartItems = getCartItems();

  showProducts(products = []) {
    const productsDOM = document.querySelector(".products-center");
    let result = "";
    products.forEach((product) => {
      result += `
         <section class="card">
                <div class="card__header">
                    <img src=${product.image} alt="" class="card__image">
                </div>
                <div class="card__body">
                    <p class="card__title">${product.title}</p>
                    <span class="card__price">$${product.price}</span>
                    <button class="btn btn--primary btn--block btn--bag" data-id=${product.id}>Add to Cart</button>
                </div>
            </section>
        `;
    });
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".btn--bag")];
    this.#buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      const inCart = this.#cartItems.find((item) => item.id === id);

      if (inCart) {
        button.textContent = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.textContent = "In Cart";
        event.target.disabled = true;
        // get product from products
        let cartItem = Storage.getProducts(id);
        cartItem = { ...cartItem, amount: 1 };

        // add product to the cart
        this.#cartItems = [...this.#cartItems, cartItem];

        // save cart in to localStorage
        Storage.saveCart(this.#cartItems);

        // set cart values
        this.setCartValues(this.#cartItems);

        // dispaly cart item
        this.addCartItem(cartItem);
        // show thecart
        this.showCart();
      });
    });
  }
  setCartValues(cartItems) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cartItems.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    this.#totalPrice.textContent = parseFloat(tempTotal.toFixed(2));
    this.#cartItemsBadge.textContent = parseFloat(itemsTotal);
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart__item");
    div.classList.add("grid");
    div.classList.add("grid--1x3");
    div.innerHTML = `
    <img src=${item.image} alt="" class="cart__image">
    <div class="cart__item__body">
        <p class="cart__title">${item.title}</p>
        <span class="cart__price">$${item.price}</span>
        <button class="btn btn--accent btn--small remove__item" data-id=${item.id}>Remove</button>
    </div>
    <div class="cart__btn">
        <button class="increase badge badge--primary" data-id=${item.id}>+</button>
        <p class="cart__item__length same__item__count">${item.amount}</p>
        <button class="badge badge badge--secondary decrease" data-id=${item.id}>-</button>
    </div>
    `;
    this.#cartContent.appendChild(div);
    this.showCart();
  }
  showCart() {
    Toggler.open();
  }
  setup() {
    this.#cartItems = Storage.getCartItem();
    this.setCartValues(this.#cartItems);
    this.populateCart(this.#cartItems);
    this.#cartButton.addEventListener("click", this.showCart);
    this.#menu.addEventListener("click", this.showCart);
    this.#closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  hideCart() {
    Toggler.close();
  }

  cartLogic() {
    // clear cart btn
    this.#clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // cart functionality
    this.#cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove__item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        const cartItemDiv = removeItem.parentElement.parentElement;
        this.#cartContent.removeChild(cartItemDiv);
        this.removeItem(id);
        if (this.#cartItems.length === 0) {
          this.hideCart();
        }
      } else if (event.target.classList.contains("increase")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let currentCartItem = this.#cartItems.find((item) => item.id === id);
        currentCartItem.amount += 1;
        Storage.saveCart(this.#cartItems);
        this.setCartValues(this.#cartItems);
        addAmount.nextElementSibling.innerText = currentCartItem.amount;
      } else if (event.target.classList.contains("decrease")) {
        let subtractAmount = event.target;
        let id = subtractAmount.dataset.id;
        let currentCartItem = this.#cartItems.find((item) => item.id === id);
        currentCartItem.amount -= 1;
        Storage.saveCart(this.#cartItems);
        this.setCartValues(this.#cartItems);
        if (currentCartItem.amount === 0) {
          const cartItemDiv = subtractAmount.parentElement.parentElement;
          this.#cartContent.removeChild(cartItemDiv);
          this.removeItem(id);
        }

        subtractAmount.previousElementSibling.textContent =
          currentCartItem.amount;
      }
      if (this.#cartItems.length === 0) {
        this.hideCart();
      }
    });
  }

  clearCart() {
    // console.log(this);

    let cartItems = this.#cartItems.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    // console.log(this.#cartContent);
    while (this.#cartContent.children.length > 0) {
      this.#cartContent.removeChild(this.#cartContent.childNodes[0]);
    }

    this.hideCart();
  }

  removeItem(id) {
    this.#cartItems = this.#cartItems.filter((item) => item.id !== id);
    this.setCartValues(this.#cartItems);
    Storage.saveCart(this.#cartItems);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.textContent = "Add to Cart";
  }

  getSingleButton(id) {
    return this.#buttonsDOM.find((button) => button.dataset.id === id);
  }
}
