var express = require("express");
const fs = require("fs");
const path = require("path");
const formidable = require("express-formidable");
var app = express();
app.use(formidable());
const port = 3001;

function getBlogPost() {
  let text = fs.readFileSync("database.json");
  return JSON.parse(text);
}

function writeBlogPost(data) {
  fs.writeFileSync("database.json", JSON.stringify(data));
}
function blogpostHasId(blogId) {
  return function (blogpost) {
    return blogpost.id === blogId;
  };
}

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/blogposts", function (req, res) {
  res.sendFile(path.resolve(__dirname, "database.json"));
});

app.get("/blogpostsbyid/:id", function (req, res) {
  let data = getBlogPost().filter((blogpost) => blogpost.id == req.params.id);
  res.send(data);
});

app.get("/blogpostsbyauthor/:author", function (req, res) {
  let data = getBlogPost().filter(
    (blogpost) => blogpost.Author == req.params.author
  );
  res.send(data);
});

app.post("/blogpost", function (req, res) {
  let data = getBlogPost();
  data.push(req.fields);
  writeBlogPost(data);
  res.send(data);
});

app.put("/blogpost/:id", function (req, res) {
  let data = getBlogPost();
  const blogId = parseInt(req.params.id);
  const blogIndex = data.findIndex(blogpostHasId(blogId));
  data[blogIndex] = req.fields;
  writeBlogPost(data);
  res.send(data);
});

app.delete("/blogpost/:id", function (req, res) {
  let data = getBlogPost();
  const blogId = parseInt(req.params.id);
  const blogIndex = data.findIndex(blogpostHasId(blogId));
  data.splice(blogIndex, 1);
  writeBlogPost(data);
  res.send(data);
});

app.listen(3001, function () {
  console.log(`Server listening to port: ${port}`);
});
