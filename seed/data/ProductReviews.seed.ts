import { USER_ROLE } from "@prisma/client";
import { prisma } from "../../config/prisma";

const ONE_SENTENCE_COMMENTS = [
  "Great product, totally worth the price.",
  "Quality is decent for everyday use.",
  "Does the job as expected.",
  "Pretty satisfied with this purchase.",
  "Solid product overall.",
];

const MULTI_SENTENCE_COMMENTS = [
  "I have been using this product for a while and it performs really well. The build quality feels premium and reliable. I would definitely recommend it.",
  "Overall I am quite happy with the purchase. The performance meets my expectations and the design looks nice. Could be slightly cheaper but still good.",
  "The product works exactly as described. I liked the quality and packaging as well. It is a good option in this price range.",
  "After a few days of use I can say that it is a dependable product. It delivers consistent performance and feels durable. Satisfied so far.",
  "I bought this recently and it exceeded my expectations. The usability is great and everything functions smoothly. Would buy again.",
];

const rand = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const seedProductReviews = async () => {
  console.log("🌱 Seeding product reviews (fixed 2 reviews per product)");

  const products = await prisma.product.findMany({
    select: { id: true },
  });

  const users = await prisma.user.findMany({
    where: { role: USER_ROLE.USER },
    select: { id: true },
  });

  // 🔒 En az 2 user zorunlu
  if (users.length < 2) {
    throw new Error(
      "❌ At least 2 USER role accounts are required to seed product reviews.",
    );
  }

  const reviewData: {
    productId: number;
    userId: number;
    rating: number;
    comment: string;
  }[] = [];

  for (const product of products) {
    // Her ürün için 2 farklı user seç
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffledUsers.slice(0, 2);

    // 1 uzun yorum
    reviewData.push({
      productId: product.id,
      userId: selectedUsers[0].id,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: rand(MULTI_SENTENCE_COMMENTS),
    });

    // 1 kısa yorum
    reviewData.push({
      productId: product.id,
      userId: selectedUsers[1].id,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: rand(ONE_SENTENCE_COMMENTS),
    });
  }

  await prisma.productReview.createMany({
    data: reviewData,
  });

  console.log("✅ Product reviews seeding completed");
};
