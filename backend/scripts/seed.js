import { MongoClient } from "mongodb";
import { settings } from "../config/settings.js";

const client = new MongoClient(settings.mongodb.uri);

const seedData = {
  services: [
    {
      name: "3D Printing - PLA",
      category: "3d_printing",
      type: "service",
      status: "available",
      description: "Standard PLA 3D printing",
      priceType: "per_gram",
      pricePerUnit: 0.1,
      unitLabel: "g",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Laser Cutting - Acrylic 3mm",
      category: "laser_cutting",
      type: "material",
      status: "available",
      description: "3mm clear acrylic",
      priceType: "per_minute",
      pricePerUnit: 2.5,
      unitLabel: "min",
      laserMetadata: {
        thickness: "3mm",
        maxSize: "24x18 inches",
      },
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  equipment: [
    {
      name: "Canon EOS R6",
      category: "Camera",
      status: "available",
      description: "Professional camera",
      imageUrl: "",
      thumbUrl: "",
      location: "Morton 1st floor",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

async function seed() {
  try {
    await client.connect();
    const db = client.db(settings.mongodb.dbName);

    await db.collection("services").deleteMany({});
    await db.collection("services").insertMany(seedData.services);
    console.log("✓ Services seeded");

    await db.collection("equipment").deleteMany({});
    await db.collection("equipment").insertMany(seedData.equipment);
    console.log("✓ Equipment seeded");

    console.log("\n✓ Database seeded!");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await client.close();
  }
}

seed();
