const express = require("express");

const hbs = require("hbs");
const fs = require("fs");

let app = express();
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

app.use((req, res, next) => {
    res.render('maintenance.hbs');
});
app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => {
   return new Date().getFullYear();
});

hbs.registerHelper('getDescription', (pageTitle) => {
   return `The description of "${pageTitle}"`;
});

hbs.registerHelper('fullName', (person) => {
   return `${person.firstName} ${person.lastName}`;
});

hbs.registerHelper('bold', function(options){
    return `<div class="bold">${options.fn(this)}</div>`;
});

hbs.registerHelper('list', function(context, options) {
    var ret = "<ul>";
    for(var i=0; i < context.length; i++) {
        ret = ret + "<li>" + options.fn(context[i]) + "</li>";
    }
    return ret + "</ul>";
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: "Home Page",
        pageContent: "Hello, this is Home Page"
    });
});

app.get('/about/:id', (req, res) => {
   res.render('about.hbs', {
       id: req.params.id,
       pageTitle: "About Page",
       pageContent: "Hello, this is About Page",
       author: {
           firstName: "John",
           lastName: "Doe"
       }
   });
});

app.get('/about', (req, res) => {
    console.log(req.query);
    res.render('about.hbs', {
        id: req.params.id,
        pageTitle: "About Page",
        pageContent: "Hello, this is About Page",
        author: {
            firstName: "John",
            lastName: "Doe"
        }
    });
});

app.get('/people', (req, res) => {
    res.render('people.hbs', {
        pageTitle: "People Page",
        pageContent: "Hello, this is People Page",
        people: [
            {url: "http://john-doe.com", firstName: "John", lastName: "Doe"},
            {url: "http://alex-freeman.com", firstName: "Alex", lastName: "Freeman"},
            {url: "http://peter-johnson.com", firstName: "Peter", lastName: "Johnson"}
        ]
    });
});

app.get('/user', (req, res) => {
   res.send({
       name: "Alex",
       likes: [
           'Biking',
           'Cities'
       ]
   });
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000");
});
