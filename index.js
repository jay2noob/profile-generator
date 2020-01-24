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
  const queryURL = `https://api.github.com/users/${answers.name}`;
searchAPI(queryURL);

  
  function searchAPI(URL) {
    axios.get(URL)
      .then(function(user) {
        profilePic = user.data.avatar_url
        
      })
  }

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
<div class="card border-primary mb-3" style="max-width: 100rem;">
<div class="card-header"><h3>${answers.name}</h3></div>
<div class="card-body">
  <div class="row">
  <div class="col-md-3">
    <img class="img-thumbnail avatar" src="${profilePic}">
    <a target="_blank" class="btn btn-primary btn-block" href="${html_url}">View Profile</a>
  </div>
  <div class="col-md-9">
    <span class="badge badge-dark">Public Repos: ${public_repos}</span>
    <span class="badge badge-primary">Public Gists: ${public_gists}</span>
    <span class="badge badge-success">Followers: ${followers}</span>
    <span class="badge badge-info">Following: ${following}</span>
    <br><br>
    <ul class="list-group">
      <li class="list-group-item">Company: ${company}</li>
      <li class="list-group-item">Website/blog: <a href="${blog}" target="_blank">${user.blog}</a></li>
      <li class="list-group-item">Location: ${location}</li>
      <li class="list-group-item">Member Since: ${created_at}</li>
    </ul>
    </div>
  </div>
</div>
</div>
<div class="card">
                <div class="row">
                  <div class="col-md-7">
                    <strong>${name}</strong>: ${description}
                  </div>
                  <div class="col-md-3">
                    <span class="badge badge-dark">Forks: ${forks_count}</span>
                    <span class="badge badge-primary">Watchers: ${watchers_count}</span>
                    <span class="badge badge-success">Stars: ${stargazers_count}</span>
                  </div>
                  <div class="col-md-2">
                    <a href="${html_url}" target="_blank" class="btn btn-dark">Repo Page</a>
                  </div>
                </div>
              </div>
<h3 class="page-header">Latest Repos</h3>
<div id="repos"></div>
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

    //return writeFileAsync("index.html", html);
  })
  .then(function() {
    console.log("Successfully wrote to index.html");
  })
  .catch(function(err) {
    console.log(err);
  });
 
