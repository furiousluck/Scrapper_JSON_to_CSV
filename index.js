const fetch = require("node-fetch");
const fs = require("fs");
const links = require("./results.json");

const data = [
  "App Name",
  "Genre",
  "Location",
  "Personal info",
  "Financial info",
  "Health and fitness",
  "Messages",
  "Photos and videos",
  "Audio",
  "Files and docs",
  "Contacts",
  "App activity",
  "App info and performance",
  "Device or other IDs",
];

const idx = {
  "App Name": 0,
  Genre: 1,
  Location: 2,
  "Personal info": 3,
  "Financial info": 4,
  "Health and fitness": 5,
  Messages: 6,
  "Photos and videos": 7,
  Audio: 8,
  "Files and docs": 9,
  Contacts: 10,
  "App activity": 11,
  "App info and performance": 12,
  "Device or other IDs": 13,
};

async function main() {
  let final = [];
  final.push(data);

  // await links.result.forEach(async (ele) => {
  for (let ele of links.result) {
    let rowData = Array(data.length).fill(0);

    try {
      await fetch(ele.link2)
        .then((res) => res.json())
        .then((res) => {
          rowData[idx["App Name"]] = res["title"];
          rowData[idx["Genre"]] = res["genre"];
        });

      await fetch(ele.link1)
        .then((res) => res.json())
        .then((res) => {
          res.results.collectedData.forEach((element) => {
            if (idx[element.type] !== undefined) {
              rowData[idx[element.type]] |= element.optional;
            }
          });

          final.push(rowData);
        });
    } catch (e) {
      console.log(e);
    }
  }

  let csv = final
    .map((item) => {
      var row = item;
      return row.join(",");
    })
    .join("\n");

  await fs.writeFile("./data.csv", csv, "utf-8", (err) => {
    if (err) console.log(err);
    else console.log("Data saved");
  });

  return final;
}

main().then((res) => console.log("YES"));