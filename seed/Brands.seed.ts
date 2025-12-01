import { Brand } from "../models/Brand.model";

export const seedBrands = async () => {
  await Brand.bulkCreate([
    { name: "Apple" },
    { name: "Samsung" },
    { name: "Lenovo" },
  ]);
};
