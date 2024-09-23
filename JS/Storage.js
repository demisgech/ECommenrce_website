// Local Storage

export class Storage {
  static saveProducts(products = []) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((item) => item.id === id);
  }
  static saveCart(cart = []) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCartItem() {
    const cartItem = localStorage.getItem("cart");
    return cartItem ? JSON.parse(cartItem) : [];
  }
}
