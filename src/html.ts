import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { promises as fs } from "fs";

const updateCodaRow = async (newsletterId: string, html: string) => {
  // CodaRow
  const codaRow = {
    cells: [
      {
        column: "c-iS2QMQi7_d",
        value: html,
      },
    ],
  };
  // CodaPayload
  const codaPayload = {
    row: { ...codaRow },
  };
  const docId = "zz10IjV_U_";
  const tableId = "grid-kUNhyVmPHv";
  const url = `${baseUrl}/docs/${docId}/tables/${tableId}/rows/${newsletterId}?disableParsing=true`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(codaPayload),
    });
    const data = await response.json();
    console.log(`Updated newsletter's ${newsletterId} html`, data);
  } catch (error) {
    console.log("Error in updateCodaRow", error);
  }
};

// const deployVercel = async () => {
//   const url = `https://api.vercel.com/v1/integrations/deploy/${vercelProjectId}`;
//   console.log("Deploying to Vercel", url);
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//     });
//     const job = await response.json();
//     console.log("Deployed to Vercel", job);
//   } catch (error) {
//     console.log("Error in deployVercel", error);
//   }
// };

const openHtml = async () => {
  let html = await fs.readFile(
    `./build_production/${newsletterId}.html`,
    "utf8"
  );
  html = html.replace(/src=\"images\/(.*)\"/g, `src="${maizzleImagesUrl}/$1"`);
  return html;
};

const main_actual = async () => {
  try {
    const html = await openHtml();
    await updateCodaRow(newsletterId, html);
    // await deployVercel();
  } catch (error) {
    console.log(error);
  } finally {
    process.exit(0);
  }
};

let main = async () => {
  await main_actual();
};

dotenv.config();
console.log("argv", process.argv);
const newsletterId = process.argv[2];
if (!newsletterId) {
  console.log("No newsletterId provided");
  process.exit(1);
}
const baseUrl = process.env.CODA_BASE_URL;
console.log("baseUrl", baseUrl);
const bearerToken = process.env.CODA_BEARER_TOKEN;
console.log("bearerToken", bearerToken);
const vercelProjectId = process.env.VERCEL_PROJECT_ID;
console.log("vercelProjectId", vercelProjectId);
const maizzleImagesUrl = process.env.MAIZZLE_IMAGES_URL;
console.log("maizzleImagesUrl", maizzleImagesUrl);
main();
