const routes = require("next-routes")();

routes
 
  .add( "/company/:pid", "/company/productCode")
  .add( "/user/:proId", "/user/scanInfo")
  .add("/scanImage" , "/scanImage")
  .add("/scanImage/:proId" , "user/scanInfo")
  .add("/:add" , "/user")
  .add("/cmpy/:add" , "/company")
//   // .add("company/productCode" , "company/productCode/:pid" )
//    // .add("/user/new", "/user/scanInfo")
// .add( "/company/:pid", "/productCode")
// .add("/company/productCode" , "/company/productCode")  
module.exports = routes;