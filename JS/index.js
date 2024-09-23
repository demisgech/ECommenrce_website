import { Products } from "./Products.js";
import { Storage } from "./Storage.js";
import { UI } from "./UI.js";

class Main {
  static main() {
    document.addEventListener("DOMContentLoaded", () => {
      const ui = new UI();
      const products = new Products();
      ui.setup();
      products
        .getProducts()
        .then((products) => {
          ui.showProducts(products);
          Storage.saveProducts(products);
        })
        .then(() => {
          ui.getBagButtons();
          ui.cartLogic();
        });
    });
  }
}

Main.main();
