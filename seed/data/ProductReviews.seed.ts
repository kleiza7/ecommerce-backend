import { USER_ROLE } from "@prisma/client";
import { prisma } from "../../config/prisma";

const ONE_SENTENCE_COMMENTS = [
  "Great product, totally worth the price.",
  "Quality is decent for everyday use.",
  "Does the job as expected.",
  "Pretty satisfied with this purchase.",
  "Solid product overall.",
  "Good value for the money.",
  "Build quality feels reliable.",
  "Performs well for daily needs.",
  "Nice design and easy to use.",
  "Satisfied with the overall performance.",
  "Works smoothly without issues.",
  "A dependable choice in this category.",
  "Feels premium and well made.",
  "Good option in this price segment.",
  "Met my expectations without any issues.",
  "Reliable choice for daily usage.",
  "Comfortable to use and well designed.",
  "Worth considering if you need something practical.",
  "Balanced performance for the price.",
  "Overall a satisfying purchase.",
];

const MULTI_SENTENCE_COMMENTS = [
  "I have been using this product for a while and it performs really well. The build quality feels premium and reliable. I would definitely recommend it to others looking in this price range.",
  "Overall I am quite happy with the purchase. The performance meets my expectations and the design looks nice in person. Could be slightly cheaper but still a good option.",
  "The product works exactly as described. I liked the quality and the packaging was also well done. It is a solid choice considering the current market prices.",
  "After a few days of use I can say that it is a dependable product. It delivers consistent performance and feels durable during regular use. Satisfied so far.",
  "I bought this recently and it exceeded my expectations. The usability is great and everything functions smoothly without any lag. Would buy again from this brand.",
  "Using it daily for a couple of weeks now and it has been stable so far. The materials feel solid and the overall experience is comfortable. Happy with the purchase.",
  "This product offers a good balance between price and performance. It does not feel cheap and handles everyday tasks without problems. Recommended for regular users.",
  "I was looking for a reliable option in this category and this one fits well. Setup was easy and the performance has been consistent. Overall a positive experience.",
  "The design is clean and practical, and it matches the description perfectly. It works well in daily scenarios and feels like a long-lasting product. No major complaints.",
  "For the price level, this product delivers a satisfying experience. It feels well built and performs as expected in real-life usage. I would consider buying similar models again.",
  "It has been working smoothly since I received it. The features are useful and the overall quality is above average for this segment. Good purchase decision.",
  "I appreciate the simple and functional design of this product. Performance is stable and it handles my regular needs without issues. Quite pleased with it.",
  "The product feels durable and well engineered. It performs consistently in daily use and does not show any major flaws so far. A reliable choice overall.",
  "I tested this product in different scenarios and it handled everything without problems. The quality is convincing and the user experience is smooth. Recommended for long term use.",
  "From the packaging to the performance everything feels carefully designed. It works efficiently and looks good as well. Satisfied with the overall experience.",
  "After comparing with similar products in the market, this one stands out with its balanced performance. It may not be perfect but it definitely offers strong value for the price.",
  "The usability is intuitive and the setup process was straightforward. It integrates well into daily routines and performs reliably. A good purchase decision.",
  "Build quality and performance are both above average. It does what it promises and maintains stable performance over time. Happy with the results so far.",
  "The product design is minimal yet functional. It works smoothly in everyday usage and feels like it will last for a long time. Overall very pleased.",
  "Considering the current market alternatives, this product delivers a solid experience. It feels trustworthy and performs consistently. I would recommend it for most users.",
];

const rand = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const randInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Rating distribution:
 * 55% -> 5 stars
 * 30% -> 4 stars
 * 15% -> 3 stars
 * (No 1- or 2-star ratings)
 * Average ≈ 4.4 (range: 4.2 – 4.7)
 */
const weightedRating = (): number => {
  const roll = Math.random();

  if (roll < 0.55) {
    return 5;
  }

  if (roll < 0.85) {
    return 4;
  }

  return 3;
};

const shuffleArray = (array: number[]): number[] => {
  const copiedArray = [...array];
  for (let index = copiedArray.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temp = copiedArray[index];
    copiedArray[index] = copiedArray[randomIndex];
    copiedArray[randomIndex] = temp;
  }
  return copiedArray;
};

const generateReviewsForProduct = (productId: number, userIds: number[]) => {
  // Rating range: 0–5 (each user can write only one review per product — no conflicts)
  const reviewCount = randInt(0, Math.min(5, userIds.length));

  if (reviewCount === 0) {
    return [];
  }

  const shuffledUserIds = shuffleArray(userIds);
  const selectedUserIds = shuffledUserIds.slice(0, reviewCount);

  const reviews: {
    productId: number;
    userId: number;
    rating: number;
    comment: string;
  }[] = [];

  for (let index = 0; index < selectedUserIds.length; index++) {
    const userId = selectedUserIds[index];

    const isLongComment = index < 2 || Math.random() > 0.5;
    const rating = weightedRating();
    const comment = isLongComment
      ? rand(MULTI_SENTENCE_COMMENTS)
      : rand(ONE_SENTENCE_COMMENTS);

    reviews.push({
      productId,
      userId,
      rating,
      comment,
    });
  }

  return reviews;
};

export const seedProductReviews = async () => {
  console.log(
    "🌱 Seeding product reviews (0-5 reviews per product, weighted ratings, no user collision)",
  );

  const products = await prisma.product.findMany({
    select: { id: true },
  });

  const users = await prisma.user.findMany({
    where: { role: USER_ROLE.USER },
    select: { id: true },
  });

  if (users.length < 5) {
    throw new Error(
      "❌ At least 5 USER role accounts are required to seed realistic product reviews.",
    );
  }

  const userIds = users.map((user) => user.id);

  const reviewData: {
    productId: number;
    userId: number;
    rating: number;
    comment: string;
  }[] = [];

  for (const product of products) {
    const reviewsForProduct = generateReviewsForProduct(product.id, userIds);

    reviewData.push(...reviewsForProduct);
  }

  await prisma.productReview.createMany({
    data: reviewData,
  });

  console.log("✅ Product reviews seeding completed");
};
