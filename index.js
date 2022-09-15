const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();
async function main() {
  console.log("Azure Blob storage");

  const AZURE_STORAGE_CONNECTION_STRING =
    "DefaultEndpointsProtocol=https;AccountName=qtsstorage;AccountKey=fMqBTgHZdICmDgEFcsOZkb1WGnPrrPagapxb13OiMMd51dhiA6kuyF6OPaY5WGR0rxolLgqUyR5P+AStxbC73Q==;EndpointSuffix=core.windows.net";

  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw Error("Azure Storage Connection string not found");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  const containerName = "questionnaires";

  console.log("\nCreating container...");
  console.log("\t", containerName);

  const containerClient = blobServiceClient.getContainerClient(containerName);
  console.log("\nListing blobs...");

  for await (const blob of containerClient.listBlobsFlat()) {
    const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);

    console.log(`\n\tname: ${blob.name}\n\tURL: ${tempBlockBlobClient.url}\n`);
  }
  const blockBlobClient = containerClient.getBlockBlobClient("first.json");

  const downloadBlockBlobResponse = await blockBlobClient.download(0);
  console.log("\nDownloaded blob content...");

  const textJson = await streamToText(
    downloadBlockBlobResponse.readableStreamBody
  );
  console.log(JSON.parse(textJson));

  async function streamToText(readable) {
    readable.setEncoding("utf8");
    let data = "";

    for await (const chunk of readable) {
      data += chunk;
    }

    return data;
  }
}

main()
  .then(() => console.log("Done"))
  .catch((ex) => console.log(ex.message));
