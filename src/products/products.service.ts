import { Injectable } from '@nestjs/common';

import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  insertProduct(title: string, desc: string, price: number) {
    // console.log(title, desc, price);
    const prodId = new Date().toString();
    const newProduct = new Product(prodId, title, desc, price);
    // console.log(newProduct);
    this.products.push(newProduct);
    return prodId;
  }

  getProducts() {
    return [...this.products];
  }
}
