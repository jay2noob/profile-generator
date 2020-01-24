const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const pdf = require("html-pdf")

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your Github username?"
    },
    {
      type: "input",
      name: "color",
      message: "What is your favorite color?"
    }
  ]);
}

function generateHTML(answers) {
  const queryUrl = `https://api.github.com/users/${answers.name}`;
  
  const resume = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div>${answers.name}</div>
  <div>${answers.color}</div>
</body>
</html>`;
fs.writeFile(`./html/${answers.name}.html`, resume, function (err) {
  if (err) {
      return console.log(err);
  }
  console.log("Success!");
  makePDFFile();
});
function makePDFFile() {
  const html = fs.readFileSync(`./html/${answers.name}.html`, 'utf8');
  const options = {
      "height": "14in",
      "width": "12in",
  };
  pdf.create(html, options).toFile(`./pdf/${answers.name}.pdf`, function (err, res) {
      if (err) return console.log(err);
      console.log(res);
  });
}
}

promptUser()
  .then(function(answers) {
    const html = generateHTML(answers);

    return writeFileAsync("index.html", html);

    
    
  
  })
  .then(function() {
    console.log("Successfully wrote to index.html");
  })
  .catch(function(err) {
    console.log(err);
  });
 
