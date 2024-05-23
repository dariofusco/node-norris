const http = require("http");
const port = process.env.PORT || 8080;
const host = process.env.HOST || "localhost";
const fs = require("fs");
const path = require("path");

const readJSONData = (nomeFile) => {
    const filePath = path.join(__dirname, nomeFile + '.json');
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
}

const writeJSONData = (nomeFile, newData) => {
    const filePath = path.join(__dirname, nomeFile + '.json');
    const fileString = JSON.stringify(newData);
    fs.writeFileSync(filePath, fileString);
}

const server = http.createServer((req, res) => {
    const norrisDb = readJSONData('norrisDb');

    if (req.url === "/favicon.ico") {
        res.writeHead(404);
        res.end();
        return;
    }

    fetch(`https://api.chucknorris.io/jokes/random`)
        .then(response => response.json())
        .then(data => {
            norrisDb.push(data.value)
            writeJSONData('norrisDb', norrisDb);
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end();
        });

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    let fileHtml = '<ul>';
    norrisDb.forEach(u => fileHtml += `<li>${u}</li>`);
    fileHtml += '</ul>';
    res.end(fileHtml);

});

server.listen(port, host, () => {
    console.log(`Server avviato su http://${host}:${port}`);
});