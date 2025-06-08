const multipart = require("aws-lambda-multipart-parser");
const { params } = require("firebase-functions/v1");
const querystring = require("querystring");

module.exports = function getParamsData(event) {

  var paramsData;
  
  const headersContentType = event.headers["Content-Type"] || event.headers["content-type"];

  if (headersContentType.includes("application/json")) {
    // JSON 파싱
    paramsData = JSON.parse(JSON.stringify(event.body));
  } else if (headersContentType.includes("multipart/form-data")) {
    // 라틴어로 변환
    event.body = Buffer.from(event.body, "base64").toString("latin1");
    // FORM-DATA 파싱
    paramsData = multipart.parse(event, true);
    // 전체 컬럼 중 String형 라틴1을 UTF-8로 변환
    for (const key in paramsData) {
      if (typeof paramsData[key] === "string") {
        paramsData[key] = Buffer.from(paramsData[key], "latin1").toString("utf-8");
      }
    }
  } else if (headersContentType.includes("application/x-www-form-urlencoded")) {
    // X-WWW-FORM-URLENCODED 파싱
    const formData = event.body;
    const parsedData = {};
    for (const key in formData) { parsedData[key] = formData[key]; }
    paramsData = parsedData;
  }

  if (paramsData) {
    return paramsData;
  } else {
    console.error("parsing error");
  }
};