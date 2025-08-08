import { Brand } from './Brand.model';
import { Product } from './Product.model';

export const associateModels = () => {
  Brand.hasMany(Product, { foreignKey: 'brand_id' });
  Product.belongsTo(Brand, { foreignKey: 'brand_id' });
};

