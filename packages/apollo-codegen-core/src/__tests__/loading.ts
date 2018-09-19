import { stripIndents } from "common-tags";
import * as fs from "fs";
import * as path from "path";

import {
  extractDocumentFromJavascript,
  loadAndMergeQueryDocuments,
  loadQueryDocuments
} from "../loading";

// Test example javascript source files are located within __fixtures__
describe("extractDocumentFromJavascript", () => {
  test("normal queries", () => {
    const contents = fs
      .readFileSync(path.join(__dirname, "__fixtures__", "normal.js"))
      .toString();
    expect(stripIndents`${extractDocumentFromJavascript(contents)}`).toMatch(
      stripIndents`
          query UserProfileView {
            me {
              id
              uuid
              role
            }
          }
        `
    );
  });

  test("comments in template string", () => {
    const contents = fs
      .readFileSync(path.join(__dirname, "__fixtures__", "comments.js"))
      .toString();
    expect(stripIndents`${extractDocumentFromJavascript(contents)}`).toMatch(
      stripIndents`
          query UserProfileView {
            me {
              id
              # TODO: https://www.fast.com/sdf/sdf
              uuid
              # Some other comment
              role
            }
          }
        `
    );
  });

  test("gql completely commented out", () => {
    const contents = fs
      .readFileSync(path.join(__dirname, "__fixtures__", "commentedOut.js"))
      .toString();
    expect(extractDocumentFromJavascript(contents)).toBeNull();
  });

  test("invalid gql", () => {
    const contents = fs
      .readFileSync(path.join(__dirname, "__fixtures__", "invalid.js"))
      .toString();
    expect(extractDocumentFromJavascript(contents)).toBeNull();
  });
});

describe("Validation", () => {
  test(`should extract gql snippet from javascript file`, () => {
    const inputPaths = [
      path.join(
        __dirname,
        "../../../common-test/fixtures/starwars/gqlQueries.js"
      )
    ];

    const document = loadAndMergeQueryDocuments(inputPaths);

    expect(document).toMatchSnapshot();
  });
});

describe("loadQueryDocuments", () => {
  test(`should load a schema document from a .graphqls file`, () => {
    const inputPaths = [
      path.join(
        __dirname,
        "../../../common-test/fixtures/starwars/schema.graphqls"
      )
    ];

    const document = loadQueryDocuments(inputPaths);

    expect(document.length).toEqual(1);
    expect(document[0]).toMatchSnapshot();
  });
});
