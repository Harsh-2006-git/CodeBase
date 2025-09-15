// models/seed.js
import { sequelize } from "../config/database.js";
import Zone from "./zone.js";
import QRCodeModel from "./qrCode.js";
import ZoneTracker from "./zoneTracker.js";
import Client from "./client.js";

const zonesData = [
  { name: "Mahakaleshwar Mandir", location_info: "23.1740° N, 75.7901° E" },
  { name: "Ram Ghat", location_info: "23.1748° N, 75.7950° E" },
  { name: "Kshipra Bridge", location_info: "23.1765° N, 75.7970° E" },
  { name: "Harsiddhi Mandir", location_info: "23.1772° N, 75.7905° E" },
  { name: "Bada Ganesh Mandir", location_info: "23.1755° N, 75.7885° E" },
  { name: "Kal Bhairav Mandir", location_info: "23.1730° N, 75.7880° E" },
];

const seedZones = async () => {
  try {
    console.log("Starting database sync...");

    // Sync all models in correct order
    await Client.sync({ force: false });
    await Zone.sync({ force: false });
    await QRCodeModel.sync({ force: false });
    await ZoneTracker.sync({ force: false });

    console.log("Database synced successfully");

    for (const zone of zonesData) {
      const [z, created] = await Zone.findOrCreate({
        where: { name: zone.name },
        defaults: zone,
      });

      if (created) console.log(`Zone added: ${zone.name}`);
      else console.log(`Zone already exists: ${zone.name}`);
    }

    console.log("Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

// Export the seed function
export { seedZones, zonesData };

// Run if called directly
if (process.argv[1] && process.argv[1].includes("seed.js")) {
  seedZones();
}
