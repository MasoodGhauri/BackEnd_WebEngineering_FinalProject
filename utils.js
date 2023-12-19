const jwt = require("jsonwebtoken")

let AuthenticateUser = async(req , res , next) =>{

    let token = req.headers.token;

    try{
    let DecodedData = await jwt.verify(token, process.env.SECRET_KEY)
    if(DecodedData)
    {
      req.User = DecodedData;
      res.locals.User = DecodedData;
      next()
    }
    else
    {
        res.status(404).json({"Message":"Your Are Not Authenticated"})
    }
}catch(err)
{
    res.status(404).json({"Message":"Your Are Not Authenticated" , err})

}}



let requireAdmin = async (req, res, next) =>
{
    if (req.user && req.user.role === 'admin') 
    {
      return next();
    }
    return res.status(403).json({ error: 'Access denied. Admin authorization required.' });
}

let handlePaginationAndFiltering = async(req, res, next)=> 
{
    const { page, limit, category, sortBy } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
  
    const filters = {};
    
    if (category) 
    {
      filters.category = category;
    }
  
    req.pagination = 
    {
      page: pageNumber,
      limit: pageSize
    };
  
    req.filters = filters;
    req.sortBy = sortBy;
  
    return next();
  }





module.exports ={
    AuthenticateUser,
    requireAdmin,
    handlePaginationAndFiltering
}