import { prisma } from "../../config/prisma";

export const seedCurrencies = async () => {
  const currencies = [
    {
      code: "TRY",
      symbol: "₺",
    },
    {
      code: "USD",
      symbol: "$",
    },
    {
      code: "EUR",
      symbol: "€",
    },
  ];

  await prisma.currency.createMany({
    data: currencies,
  });
};
