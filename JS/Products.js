// Getting products
export class Products {
  async getProducts() {
    try {
      const result = await fetch("../json/products.json");
      const data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.Fields;
        const { id } = item.sys;
        const image = item.Fields.image.Fields.file.url;
        return { title, id, price, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
