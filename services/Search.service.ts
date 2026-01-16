import { BrandsService } from "./Brands.service";
import { CategoriesService } from "./Categories.service";
import { ProductsService } from "./Products.service";

export class SearchService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly brandsService: BrandsService,
    private readonly categoriesService: CategoriesService
  ) {}

  async search(query: string) {
    if (query.length < 2) {
      return {
        brands: [],
        categories: [],
        suggestions: [],
      };
    }

    const [brands, categories, productNames] = await Promise.all([
      this.brandsService.searchByName(query),
      this.categoriesService.searchByName(query),
      this.productsService.searchNamesByText(query, 10),
    ]);

    const suggestions = Array.from(new Set(productNames)).slice(0, 7);

    return {
      brands,
      categories,
      suggestions,
    };
  }
}
