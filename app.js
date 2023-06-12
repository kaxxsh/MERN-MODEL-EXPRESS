import http from "http";
import url from "url";

let data = [
  { name: "John", age: 20 },
  { name: "Jane", age: 21 },
];

const server = http.createServer((req, res) => {
  const { method, url: reqUrl } = req;
  const parsedUrl = url.parse(reqUrl, true);

  res.setHeader("Content-Type", "application/json");

  if (method === "GET") {
    if (parsedUrl.pathname === "/") {
      res.end(JSON.stringify(data));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  } else if (method === "POST") {
    if (parsedUrl.pathname === "/") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const postData = JSON.parse(body);
        data.push(postData);
        res.end(JSON.stringify(data));
      });
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  } else if (method === "PUT") {
    if (parsedUrl.pathname.startsWith("/")) {
      const id = parseInt(parsedUrl.pathname.slice(1));
      if (isNaN(id)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid ID" }));
      } else {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          const putData = JSON.parse(body);
          data[id] = putData;
          res.end(JSON.stringify(data));
        });
      }
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  } else if (method === "DELETE") {
    if (parsedUrl.pathname.startsWith("/")) {
      const id = parseInt(parsedUrl.pathname.slice(1));
      if (isNaN(id)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid ID" }));
      } else {
        data.splice(id, 1);
        res.end(JSON.stringify(data));
      }
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  } else {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
