import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title: title,
      description: desc,
      price: price,
    });
    const result = await newProduct.save();
    return result.id as string;
  }

  async getProducts() {
    const products = await this.productModel.find().exec();
    return products as Product[];
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return product;
  }

  // updateProduct(
  //   productId: string,
  //   title: string,
  //   description: string,
  //   price: number,
  // ) {
  //   const [product, index] = this.findProduct(productId);
  //   const updatedProduct = { ...product };
  //   if (title) {
  //     updatedProduct.title = title;
  //   }
  //   if (description) {
  //     updatedProduct.description = description;
  //   }
  //   if (price) {
  //     updatedProduct.price = price;
  //   }

  //   this.products[index] = updatedProduct;
  // }

  deleteProduct(productId: string) {
    const index = this.findProduct(productId)[1];
    this.products.splice(index, 1);
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find product');
    }
    if (!product) {
      throw new NotFoundException('Could not find product');
    }
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }
}
