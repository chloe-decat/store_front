const express = require('express')
const fetch = require("node-fetch")
const nunjucks = require('nunjucks')

const port = process.env.PORT || 3000;

const app = express()

function apiCallProducts(identifier){
  return fetch(
    `https://decath-product-api.herokuapp.com/products/${identifier}`,
    {method: "GET"}
  )
  .then((response) => response.json())
}

function apiCallCategories(identifier){
  return fetch(
    `https://decath-product-api.herokuapp.com/categories/`,
    {method: "GET"}
  )
  .then((response) => response.json())
  .then((display) => {
    return display.map((getLabel)=>{
      return {label : getLabel.label, id : getLabel.id}
  })
})
}

function apiCallProductsByCategories(identifier){
  return fetch(
    `https://decath-product-api.herokuapp.com/categories/${identifier}/products`,
    {method: "GET"}
  )
  .then((response) => response.json())
  .then((display) => {
    return display.map((getProducts)=>{
      return {id : getProducts.id, title : getProducts.title, image : getProducts.image_path}
  })
})
}

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set("views", __dirname + "/views");
app.set("view engine", "njk");

app.get("/", function(request, result) {
  apiCallCategories()
  .then ((returnCat)=> {
  return result.render("home", {categories :returnCat});
})
});

app.get("/categorie/:idcategorie", function(request, result) {
  apiCallProductsByCategories(request.params.idcategorie)
  .then ((returnProducts)=> {
  return result.render("categorie", {products :returnProducts});
})
});

app.get("/product/:idproduct", function(request, result) {
  apiCallProducts(request.params.idproduct)
  .then ((returnProduct)=> {
  return result.render("product", {product :returnProduct});
})
});

// apiCallProductsByCategories();
// apiCallCategories();
// apiCallProducts();
// apiCallProducts("9f8d8840-e22c-496f-b865-f5014710e234");
// apiCallProductsByCategories("9f8d8840-e22c-496f-b865-f5014710e234")
app.listen(3000)
