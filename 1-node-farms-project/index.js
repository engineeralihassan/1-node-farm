const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////
// const fs= require('fs');
// let http= require('http');
// const url = require('url');
// let updateTemplate = require('./starter/modules/replaceTemplate')
// let overViewTemplate= fs.readFileSync('./starter/templates/template-overview.html','utf-8');
// let productTemplate= fs.readFileSync('./starter/templates/template-product.html','utf-8');
// let cardTemplate= fs.readFileSync('./starter/templates/template-card.html','utf-8');

// let hello = "Hello world its an first node script";
// let modules = "Hello this is modules intro lecture";

// console.log(hello);
// console.log(modules);

// // Write and reading files in node Modules

// // REad File
// let textInFile= fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textInFile);

// // Write files 

// let dataForFile=   `This is the new text we inserted in the file :  \nwe inserted on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/input.txt',dataForFile);
// console.log('File writter successfully');

// Blocking and non blocking events in Node.js | Reading and writing files async way
// REad File Async way
// console.log("File reading start");
// let readFileAsync= fs.readFile('./starter/txt/input.txt', 'utf-8', (err,data)=>{
// console.log(data);
// });
// console.log("File reading End");
// console.log(textInFile);

// Write files Async

// let dataForFile=   `This is the new text we inserted in the file :  \nwe inserted on ${Date.now()}`;
// fs.writeFile('./starter/txt/input.txt',dataForFile,'utf-8',(error)=>{
//     console.log("File Has been written successfully");
// });


// ___________________________________ CREATING A WEB SERVER FROM SRATCH ____________________//

// const server=http.createServer((req,res)=>{
//     console.log(req.url);
//     let pathName=req.url;
//     if(pathName === '/' || pathName === '/overview'){
//         res.end("This the responce for the overview Page");
//     }
//     else if(pathName === '/product'){
//         res.end("This is the responce for the Product Page");
//     }
//     else{
//         res.writeHead(404,{
//            'content-type' : 'text/html',
//            'my-own-header':'example of custome headers',
//         })
//         res.end("Page Note found Please try with correct URL");
//     }
   
// });
// server.listen(8000,'127.0.0.1',()=>{
//     console.log("Server is lisning on the demand");
// });


// ___________________________________ START CREATING A SIMPLE API ____________________//


// const data= JSON.parse( fs.readFileSync(`./starter/dev-data/data.json`,'utf-8'));
// const server=http.createServer((req,res)=>{
//    let {pathname,query}= url.parse(req.url,true);
//    if(pathname === '/' || pathname === '/overview'){
//        res.writeHead(200,{
//            'Content-type':'text/html',
//        });
//            const cardsHtml = data.map(el => updateTemplate(cardTemplate, el)).join('');
//            const output = overViewTemplate.replace('{%PRODUCT_CARDS%}', cardsHtml);
//            res.end(output);
//            }
//            else if(pathname === '/product'){
//                res.writeHead(200, {
//                    'Content-type': 'text/html'
//                  });
//                  const product = data[query.id];
//                  const output = updateTemplate(productTemplate, product);
//                  res.end(output);
              
//            }
//            else{
//                res.writeHead(404,{
//                   'content-type' : 'text/html',
//                   'my-own-header':'example of custome headers',
//                })
//                res.end("Page Note found Please try with correct URL");
//            }   
// });
// server.listen(8000,'127.0.0.1',()=>{
//    console.log("Server is lisning on the demand");
// });
// //////////////////////////////
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
