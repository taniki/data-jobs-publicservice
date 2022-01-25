const fs = require("fs");
const fetch = require("node-fetch");

const csv = require("csv-parse/sync");

const moment = require("moment");

module.exports = (eleventyConfig) => {
  eleventyConfig.setPugOptions({
    // debug: true,
  });

  eleventyConfig.addPassthroughCopy({
    "_includes/css/global.css": "./global.css",
  });

  eleventyConfig.addCollection("offers", async (collection) => {
    // let data = fs.readFileSync("_data/latest.csv", "utf8");

    let source =
      "https://www.data.gouv.fr/api/1/datasets/fiche-de-poste-exploitation-de-donnees-place-de-lemploi-public/";

    let res = await fetch(source);
    let dataset = await res.json();

    res = await fetch(dataset.resources[0]["url"]);
    let data = await res.text();

    let offers = csv
      .parse(data, {
        columns: true,
        skip_empty_lines: true,
      })
      .sort(
        (b, a) =>
          new moment(a["publication_date"], "DD/MM/YYYY").format("YYYYMMDD") -
          new moment(b["publication_date"], "DD/MM/YYYY").format("YYYYMMDD")
      );

    return offers;
  });

  eleventyConfig.addDataExtension("csv", (contents) => {
    const records = csv.parse(contents, {
      columns: true,
      skip_empty_lines: true,
    });
    return records;
  });
};
