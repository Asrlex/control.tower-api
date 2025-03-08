import { CreateStockProductDto } from '@/api/entities/dtos/home-management/stock-product.dto';
import { SearchCriteriaI } from '@/api/entities/interfaces/api.entity';
import {
  ShoppingListProductI,
  StockProductI,
} from '@/api/entities/interfaces/home-management.entity';
import {
  STOCK_PRODUCT_REPOSITORY,
  StockProductRepository,
} from '@/repository/home-management/stock.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class StockProductService {
  constructor(
    @Inject(STOCK_PRODUCT_REPOSITORY)
    private readonly stockProductRepository: StockProductRepository,
  ) {}

  /**
   * Método para verificar si el endpoint de productos esta funcionando
   * @returns string - mensaje indicando que el endpoint de productos esta funcionando
   */
  async status() {
    return {
      statusCode: 200,
      message: 'Stock endpoint is working',
    };
  }

  /**
   * Método para obtener todos los productos
   * @returns string - todos los productos
   */
  async getAllProducts(): Promise<{
    entities: StockProductI[];
    total: number;
  }> {
    return await this.stockProductRepository.findAll();
  }

  /**
   * Método para obtener lista de productos filtrados
   * @returns string - lista de productos filtrados
   */
  async getProducts(
    page: number,
    limit: number,
    searchCriteria: SearchCriteriaI,
  ): Promise<{
    entities: StockProductI[];
    total: number;
  }> {
    return await this.stockProductRepository.find(page, limit, searchCriteria);
  }

  /**
   * Método para obtener un producto por su id
   * @param id - id del producto
   * @returns string
   */
  async getProductById(id: string): Promise<StockProductI> {
    return await this.stockProductRepository.findById(id);
  }

  /**
   * Metodo para crear un nuevo producto
   * @returns string - producto creado
   */
  async createProduct(dto: CreateStockProductDto): Promise<StockProductI> {
    return await this.stockProductRepository.create(dto);
  }

  /**
   * Método para actualizar un producto
   * @param id - id del producto
   * @param customer - producto
   * @returns string - producto actualizado
   */
  async updateProduct(id: string, customer: CreateStockProductDto) {
    return await this.stockProductRepository.modify(id, customer);
  }

  /**
   * Método para comprar un producto
   * @param productId - id del producto
   * @returns string - producto comprado
   */
  async addProductToShoppingList(
    productId: string,
  ): Promise<ShoppingListProductI> {
    return await this.stockProductRepository.addProductToShoppingList(
      productId,
    );
  }

  /**
   * Método para modificar la cantidad de un producto
   * @param productId - id del producto
   * @param amount - cantidad
   * @returns string - producto modificado
   */
  async modifyAmount(productId: string, amount: number): Promise<void> {
    await this.stockProductRepository.modifyAmount(productId, amount);
  }

  /**
   * Método para eliminar un producto
   * @param id - id del producto
   * @returns null - producto eliminado
   */
  async deleteProduct(id: string) {
    await this.stockProductRepository.delete(id);
  }
}
