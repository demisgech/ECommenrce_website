export class Toggler {
  static #cartOverlay = document.querySelector(".cart-overlay");
  static #cart = document.querySelector(".cart-plans");
  static #isToggled = false;
  constructor() {}
  static open() {
    Toggler.#cartOverlay.style.visibility = "visible";
    Toggler.#cartOverlay.style.background = "#a182b886";
    Toggler.#cart.style.transform = "translateX(0%)";
  }
  static close() {
    Toggler.#cartOverlay.style.visibility = "hidden";
    Toggler.#cart.style.transform = "translateX(100%)";
  }
  static click() {
    const menu = document.querySelector(".menu");
    const closeCart = document.querySelector(".close--cart");
    if (!Toggler.#isToggled) {
      menu.addEventListener("click", Toggler.open);
      Toggler.#isToggled = true;
    }
    if (Toggler.#isToggled) {
      closeCart.addEventListener("click", Toggler.close);
      Toggler.#isToggled = false;
    }
    // console.log(Toggler.#isToggled);
  }
}
