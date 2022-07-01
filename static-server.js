const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const os = require("os");

const PORT = 9128;
const ROOT = __dirname;

let en0IPv4Address = os.networkInterfaces().en0.find(v => v.family === 'IPv4').address;

http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;
  let fullPath = path.join(ROOT, pathname);
  if (!fs.existsSync(fullPath)) {
    res.writeHead(404);
    res.end('404 Not Found');
  } else {
    let stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      viewFolder(req, res, fullPath, pathname);
    } else if (stat.isFile()) {
      fs.createReadStream(fullPath).pipe(res);
    } else {
      res.end(path + ' must be dir or file!');
    }
  }
}).listen(PORT, () => {
  console.log(`server listen in http://${en0IPv4Address}:${PORT}`);
});

function viewFolder(req, res, fullPath, pathname) {
  let list = [];
  readDirectory(fullPath).forEach(item => {
    let name = path.basename(item);
    let stat = fs.statSync(item);
    list.push(`<a href="${path.join(pathname, name)}" style="line-height:20px;${(!stat.isFile() ? 'font-weight:bold;font-size: 18px;' : 'color:red;font-size: 16px;')}">${name}</a>`);
  });
  res.end(`
            <!DOCTYPE html>
            <html>
            <head>
            <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
            <title>${pathname}</title>
            </head>
            <body>
            <div style="font-size: 20px;padding-bottom:20px;">${(pathname !== '/' ? '<a href="/">Index</a> ' : '') + pathname}</div>
            ${list.join('<br/>')}
            </body>
            </html>`);
}


function readDirectory(fullPath) {
  return fs.readdirSync(fullPath).map(item => path.join(fullPath, item));
}
