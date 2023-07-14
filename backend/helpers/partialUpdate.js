import { BadRequestError, ExpressError } from "../expressError.js";

function partialUpdateSQL(dataToUpdate) {
  // create an array of the keys to be updated:
  const keys = Object.keys(dataToUpdate);

  // if there are no keys, that means no data in the patch request, return error:
  if (keys.length === 0) throw new BadRequestError("No data");

  // Take columns and create a sql string.  If column name is JS, convert it to sql-friendly based on inputs provided otherwise just use the col name.  Also add argument index for sql $1, $2, etc...
  //
  // *      Example:
  // *      {firstName: 'Aliya', age: 32} =>
  // *      ['"first_name"=$1', '"age"=$2']
  //
  const cols = keys.map((colName, idx) => `${colName}=$${idx + 1}`);

  // return two things:
  //
  //      setCols: a string of column names joined
  //              together by a ", "
  //            ex: "first_name, email"
  //
  //      values: an array of the values from the data
  //
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

// // *   Function that filters COMPANIES based on certain keys:
// //
// //  ({key: var, key:var })
// //               => {statement: string,
// //                   terms: []}
// //
// //  possible keys: minEmployee, maxEmployeee, name
// //
// //

// function sqlForFiltering(filtersObj) {
//   let statements = [];
//   let terms = [];

//   // if the filtering obj exists:
//   if (Object.keys(filtersObj).length !== 0) {
//     statements.push("WHERE");

//     // ********* name is in query string:
//     //
//     if (filtersObj["name"]) {
//       let statement = `name ILIKE $1`;
//       statements.push(statement);
//       terms.push(`%${filtersObj["name"]}%`);
//     }

//     // ******** minEmployee or maxEmployee in query string
//     if (filtersObj["minEmployees"] || filtersObj["maxEmployees"]) {
//       // check for errors if a number is not used:
//       if (filtersObj["minEmployees"] && !Number(filtersObj["minEmployees"])) {
//         throw new BadRequestError("Minimum employees must be a number", 400);
//       }
//       if (filtersObj["maxEmployees"] && !Number(filtersObj["maxEmployees"])) {
//         throw new BadRequestError("Maxmimum employees must be a number", 400);
//       }

//       // if min or max employees is NOT a number or does not exist, set a default:
//       // this should also protect against SQL injection ?
//       let minEmployees = Number(filtersObj["minEmployees"]) || 0;
//       let maxEmployees = Number(filtersObj["maxEmployees"]) || 999999;

//       if (statements.length > 1) statements.push("AND");
//       // create a statement:
//       statements.push(
//         `num_employees BETWEEN ${minEmployees} AND ${maxEmployees}`
//       );
//     }
//   }

//   return {
//     statement: statements.join(" "),
//     terms,
//   };
// }

// // *   Function that filters JOBS based on certain keys:
// //
// //  ({key: var, key:var })
// //               => {statement: string,
// //                   terms: []}
// //
// //  possible keys: title, minSalary, hasEquity
// //
// //

// function sqlForFilteringJobs(filtersObj) {
//   let statements = [];
//   let terms = [];

//   // if the filtering object exists
//   if (Object.keys(filtersObj).length !== 0) {
//     statements.push("WHERE");

//     // ********** title in filter query
//     if (filtersObj["title"]) {
//       statements.push(`title ILIKE $1`);
//       terms.push(`%${filtersObj["title"]}%`);
//     }
//     // ********** minSalary in filter query
//     if (filtersObj["minSalary"]) {
//       if (!Number(filtersObj["minSalary"])) {
//         throw new BadRequestError("minSalary must be a number");
//       }
//       if (statements.length > 1) statements.push("AND");
//       let idx = terms.length + 1;
//       statements.push(`salary > $${idx}`);
//       terms.push(Number(filtersObj["minSalary"]));
//     }
//     // ********** hasEquity in filter query
//     if (Object.keys(filtersObj).includes("hasEquity")) {
//       if (filtersObj["hasEquity"] === "true") {
//         if (statements.length > 1) statements.push("AND");
//         statements.push(`equity > 0`);
//       } else {
//         throw new BadRequestError("hasEquity must be set to true");
//       }
//     }
//   }

//   return {
//     statement: statements.join(" "),
//     terms,
//   };
// }

// module.exports = { sqlForPartialUpdate, sqlForFiltering, sqlForFilteringJobs };

export { partialUpdateSQL };
