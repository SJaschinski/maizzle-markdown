import * as dotenv from "dotenv";
// import { CodaPayload } from "./codaPayload";
// import { CodaRow } from "./codaRow";
import fetch from "node-fetch";
import { promises as fs } from "fs";

const upsertCodaRow = async (newsletterId: string, html: string) => {
  // CodaRow
  const codaRow = {
    cells: [
      {
        column: "c-SJi37oyjn4",
        value: newsletterId,
      },
      {
        column: "c-XPbBFYj-vm",
        value: html,
      },
    ],
  };
  // CodaPayload
  const codaPayload = {
    rows: [codaRow],
    keyColumns: ["c-SJi37oyjn4"],
  };
  const docId = "zz10IjV_U_";
  const tableId = "grid-BcNdt6OiN8";
  const url = `${baseUrl}/docs/${docId}/tables/${tableId}/rows?disableParsing=true`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(codaPayload),
    });
    const data = await response.json();
    console.log(`Upsert for newsletter ${newsletterId}`, data);
  } catch (error) {
    console.log("Error in upsertCodaRow", error);
  }
};

const getNewsletter = async () => {
  const docId = "zz10IjV_U_";
  const tableId = "grid-kUNhyVmPHv";
  console.log("Getting newsletter", newsletterId);
  // {{baseUrl}}/docs/:docId/tables/:tableIdOrName/rows/:rowIdOrName?useColumnNames=false&valueFormat=rich
  const url = `${baseUrl}/docs/${docId}/tables/${tableId}/rows/${newsletterId}?useColumnNames=false&valueFormat=rich&visibleOnly=true`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    const data = await response.json();
    return data.values["c-WaJvqpnq48"];
  } catch (error) {
    console.log("Error in getNewsletter", error);
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

const saveMarkdown = async (md: string) => {
  const filename = `./src/content/${newsletterId}.md`;
  try {
    await fs
      .writeFile(filename, md)
      .then(() => console.log(`Saved ${filename}`))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log("Error in saveMarkdown", error);
  }
};

const main_actual = async () => {
  try {
    const md = await getNewsletter();
    await saveMarkdown(md);
    // await upsertCodaRow(newsletterId, "html");
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
console.log("newsletterId", newsletterId);
const baseUrl = "https://coda.io/apis/v1";
const bearerToken = process.env.CODA_BEARER_TOKEN;
console.log("bearerToken", bearerToken);
const vercelProjectId = process.env.VERCEL_PROJECT_ID;
console.log("vercelProjectId", vercelProjectId);
main();
