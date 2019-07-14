import { Controller, Post, Body, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products') // Filter for requests that start at /products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post() // Decorator -- provides configuration for handling post request
  addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    // console.log(prodTitle);
    const generatedId = this.productsService.insertProduct(
      prodTitle,
      prodDesc,
      prodPrice,
    );
    return { id: generatedId };
  }

  @Get()
  getAllProducts() {
    return this.productsService.getProducts();
  }
}
