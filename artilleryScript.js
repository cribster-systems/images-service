module.exports.loadTestScript = (userContext, ee, next) => {
  let max = 1000, min = 1;
  userContext.vars.listing_id = Math.floor(Math.random() * (max - min + 1) + min);
  return next();
}