<h1>📦 <code>getParamsData.js</code> 함수 설명</h1>

  <p>
    이 Node.js 함수는 AWS Lambda나 Firebase Functions와 같이 <strong>서버리스 환경</strong>에서 
    다양한 형태의 HTTP 요청 본문(Body)을 파싱하여 <code>paramsData</code> 객체로 변환해주는 유틸리티입니다.
  </p>

  <h2>📌 주요 목적</h2>
  <p>
    <strong>Content-Type</strong>에 따라 다음 3가지 유형의 데이터를 자동으로 분기하여 처리합니다:
  </p>
  <ul>
    <li><code>application/json</code></li>
    <li><code>multipart/form-data</code></li>
    <li><code>application/x-www-form-urlencoded</code></li>
  </ul>

  <h2>📁 파일 구조</h2>
  <pre><code>
const multipart = require("aws-lambda-multipart-parser");
const querystring = require("querystring");
  </code></pre>

  <p><code>aws-lambda-multipart-parser</code>: 멀티파트 폼 데이터를 파싱하기 위한 라이브러리</p>

  <h2>🔍 동작 흐름 요약</h2>
  <ol>
    <li>요청 헤더에서 <code>Content-Type</code>을 읽어옵니다.</li>
    <li>콘텐츠 타입에 따라 파싱 방식이 달라집니다.</li>
  </ol>

  <h3>① JSON 요청 처리 (<code>application/json</code>)</h3>
  <ul>
    <li><code>event.body</code>를 그대로 사용하여 <code>paramsData</code>에 저장합니다.</li>
  </ul>

  <h3>② 멀티파트 폼 데이터 처리 (<code>multipart/form-data</code>)</h3>
  <ul>
    <li><code>event.body</code>가 base64로 인코딩되어 있으므로 먼저 <code>latin1</code> 디코딩</li>
    <li><code>multipart.parse()</code>를 이용해 파싱</li>
    <li>모든 <code>string</code> 타입 필드에 대해 <strong>latin1 → utf-8</strong> 재인코딩</li>
  </ul>

  <pre><code>
paramsData[key] = Buffer.from(paramsData[key], "latin1").toString("utf-8");
  </code></pre>

  <h3>③ URL 인코딩 폼 데이터 처리 (<code>application/x-www-form-urlencoded</code>)</h3>
  <ul>
    <li>일반적으로 HTML form에서 <code>method="POST"</code>로 전송되는 형식</li>
    <li><code>event.body</code>의 key-value를 그대로 <code>parsedData</code>로 변환</li>
  </ul>

  <h2>📤 반환 값</h2>
  <p>
    성공적으로 파싱된 요청 본문 데이터 (<code>paramsData</code>)를 반환합니다.
  </p>

  <pre><code>return paramsData;</code></pre>

  <p>
    실패할 경우 콘솔에 에러를 출력하고 종료합니다.
  </p>

  <h2>⚠️ 주의사항</h2>
  <ul>
    <li>AWS API Gateway 등에서는 multipart/form-data 요청이 <strong>base64</strong>로 인코딩되어 오기 때문에 처리 필요</li>
    <li>파일 업로드 시 필드별 <strong>encoding 변환</strong> 작업이 필수적 (latin1 → utf-8)</li>
    <li><code>application/x-www-form-urlencoded</code> 파싱은 <code>querystring</code>을 써도 되지만 여기서는 수동 처리됨</li>
  </ul>

  <h2>✅ 사용 예</h2>
  <pre><code>
const data = getParamsData(event);
console.log(data["username"]);
console.log(data["uploadedFile"]);  // 멀티파트일 경우 파일 정보 포함
  </code></pre>

  <h2>📚 참고 라이브러리</h2>
  <ul>
    <li><a href="https://www.npmjs.com/package/aws-lambda-multipart-parser" target="_blank">aws-lambda-multipart-parser</a></li>
    <li><a href="https://nodejs.org/api/querystring.html" target="_blank">Node.js QueryString</a></li>
  </ul>

  <h2>🔒 License</h2>
  <p>MIT License</p>
