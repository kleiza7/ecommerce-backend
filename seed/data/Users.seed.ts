import { USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";

export const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash("Test1234", 10);

  ////////////////////////////////////////////////////////////
  // ADMIN
  ////////////////////////////////////////////////////////////

  const admins = [
    {
      name: "System Administrator",
      email: "admin@shopland.dev",
      role: USER_ROLE.ADMIN,
    },
  ];

  ////////////////////////////////////////////////////////////
  // USERS (200 realistic names)
  ////////////////////////////////////////////////////////////

  const users = [
    {
      name: "John Carter",
      email: "john.carter@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Emily Watson",
      email: "emily.watson@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Michael Reed",
      email: "michael.reed@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Olivia Bennett",
      email: "olivia.bennett@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Daniel Brooks",
      email: "daniel.brooks@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Sophia Turner",
      email: "sophia.turner@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "James Parker",
      email: "james.parker@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Lucas Anderson",
      email: "lucas.anderson@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Henry Collins",
      email: "henry.collins@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Ethan Mitchell",
      email: "ethan.mitchell@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Charlotte Hughes",
      email: "charlotte.hughes@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Benjamin Foster",
      email: "benjamin.foster@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Amelia Price",
      email: "amelia.price@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "William Hayes",
      email: "william.hayes@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Harper Simmons",
      email: "harper.simmons@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Alexander Ward",
      email: "alexander.ward@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Sebastian Cole",
      email: "sebastian.cole@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Jack Foster",
      email: "jack.foster@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Mason Turner",
      email: "mason.turner@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Liam Bennett",
      email: "liam.bennett@example.com",
      role: USER_ROLE.USER,
    },

    {
      name: "Noah Harrison",
      email: "noah.harrison@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Logan Ellis",
      email: "logan.ellis@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Jacob Griffin",
      email: "jacob.griffin@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Ava Porter",
      email: "ava.porter@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Isabella Cruz",
      email: "isabella.cruz@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Mia Coleman",
      email: "mia.coleman@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Evelyn Jenkins",
      email: "evelyn.jenkins@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Ella Patterson",
      email: "ella.patterson@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Scarlett Bennett",
      email: "scarlett.bennett@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Victoria Richardson",
      email: "victoria.richardson@example.com",
      role: USER_ROLE.USER,
    },

    {
      name: "David Cooper",
      email: "david.cooper@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Joseph Bailey",
      email: "joseph.bailey@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Matthew Howard",
      email: "matthew.howard@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Samuel Ward",
      email: "samuel.ward@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Anthony Cox",
      email: "anthony.cox@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Andrew Diaz",
      email: "andrew.diaz@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Joshua Gray",
      email: "joshua.gray@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Christopher James",
      email: "christopher.james@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Nathan Russell",
      email: "nathan.russell@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Ryan Powell",
      email: "ryan.powell@example.com",
      role: USER_ROLE.USER,
    },

    {
      name: "Aaron Peterson",
      email: "aaron.peterson@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Connor Hughes",
      email: "connor.hughes@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Dylan Price",
      email: "dylan.price@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Caleb Hayes",
      email: "caleb.hayes@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Adrian Coleman",
      email: "adrian.coleman@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Brandon Jenkins",
      email: "brandon.jenkins@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Kevin Foster",
      email: "kevin.foster@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Justin Sanders",
      email: "justin.sanders@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Patrick Barnes",
      email: "patrick.barnes@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Zachary Stone",
      email: "zachary.stone@example.com",
      role: USER_ROLE.USER,
    },

    {
      name: "Grace Holland",
      email: "grace.holland@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Chloe Barrett",
      email: "chloe.barrett@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Lily Pearson",
      email: "lily.pearson@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Hannah West",
      email: "hannah.west@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Samantha Johnston",
      email: "samantha.johnston@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Natalie Day",
      email: "natalie.day@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Madison Fowler",
      email: "madison.fowler@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Leah Walters",
      email: "leah.walters@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Zoe Bryant",
      email: "zoe.bryant@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Lucy Holland",
      email: "lucy.holland@example.com",
      role: USER_ROLE.USER,
    },

    {
      name: "Julian Hayes",
      email: "julian.hayes@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Aaron Clark",
      email: "aaron.clark@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Nathan Wells",
      email: "nathan.wells@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Victor Morales",
      email: "victor.morales@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Oscar Blake",
      email: "oscar.blake@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Leo Stevens",
      email: "leo.stevens@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Adam Carter",
      email: "adam.carter@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Peter Walsh",
      email: "peter.walsh@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Scott Hunter",
      email: "scott.hunter@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Tony Mills",
      email: "tony.mills@example.com",
      role: USER_ROLE.USER,
    },

    {
      name: "Eva Knight",
      email: "eva.knight@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Julia Bishop",
      email: "julia.bishop@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Sara Wallace",
      email: "sara.wallace@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Rachel Cole",
      email: "rachel.cole@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Anna Hudson",
      email: "anna.hudson@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Megan Graham",
      email: "megan.graham@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Claire Spencer",
      email: "claire.spencer@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Katie Chapman",
      email: "katie.chapman@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Holly Lane",
      email: "holly.lane@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Jasmine Wells",
      email: "jasmine.wells@example.com",
      role: USER_ROLE.USER,
    },

    {
      name: "Derek Shaw",
      email: "derek.shaw@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Trevor Bates",
      email: "trevor.bates@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Bryan Dean",
      email: "bryan.dean@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Shawn Curtis",
      email: "shawn.curtis@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Kyle Gordon",
      email: "kyle.gordon@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Marcus Wallace",
      email: "marcus.wallace@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Philip Grant",
      email: "philip.grant@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Evan Watts",
      email: "evan.watts@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Cole Ramsey",
      email: "cole.ramsey@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Miles Sanders",
      email: "miles.sanders@example.com",
      role: USER_ROLE.USER,
    },

    { name: "Nina Ross", email: "nina.ross@example.com", role: USER_ROLE.USER },
    {
      name: "Ivy Curtis",
      email: "ivy.curtis@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Sophie Banks",
      email: "sophie.banks@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Paige Stone",
      email: "paige.stone@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Clara Dunn",
      email: "clara.dunn@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Bella Griffin",
      email: "bella.griffin@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Daisy Ward",
      email: "daisy.ward@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Ruby Porter",
      email: "ruby.porter@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Rose Coleman",
      email: "rose.coleman@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Luna Barrett",
      email: "luna.barrett@example.com",
      role: USER_ROLE.USER,
    },
  ];

  ////////////////////////////////////////////////////////////
  // SELLERS (20)
  ////////////////////////////////////////////////////////////

  const sellers = [
    // TECH (6)

    {
      name: "NovaTech Store",
      email: "contact@novatech.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "BrightElectro",
      email: "hello@brightelectro.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "NextGen Gadgets",
      email: "sales@nextgengadgets.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "VoltEdge Electronics",
      email: "support@voltedge.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "QuantumDevice Hub",
      email: "contact@quantumdevice.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "CoreTech Market",
      email: "info@coretechmarket.com",
      role: USER_ROLE.SELLER,
    },

    // FASHION (5)

    {
      name: "UrbanWear Co.",
      email: "support@urbanwear.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "PureStyle Boutique",
      email: "contact@purestyle.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "Veloura Fashion",
      email: "hello@veloura.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "ThreadCulture Store",
      email: "sales@threadculture.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "ModeNest Apparel",
      email: "support@modenest.com",
      role: USER_ROLE.SELLER,
    },

    // HOME (4)

    {
      name: "HomeCraft Market",
      email: "info@homecraft.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "ComfortLiving Store",
      email: "support@comfortliving.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "NestSpace Living",
      email: "hello@nestspace.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "OakHouse Interiors",
      email: "contact@oakhouse.com",
      role: USER_ROLE.SELLER,
    },

    // SPORTS (3)

    {
      name: "ActivePulse Sports",
      email: "support@activepulse.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "TrailPeak Outfitters",
      email: "contact@trailpeak.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "MotionGear Store",
      email: "sales@motiongear.com",
      role: USER_ROLE.SELLER,
    },

    // BEAUTY (2)

    {
      name: "GlowCare Studio",
      email: "support@glowcare.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "AuraSkin Beauty",
      email: "contact@auraskin.com",
      role: USER_ROLE.SELLER,
    },
  ];

  const usersData = [...admins, ...users, ...sellers].map((user) => ({
    ...user,
    password: hashedPassword,
  }));

  await prisma.user.createMany({
    data: usersData,
  });
};
