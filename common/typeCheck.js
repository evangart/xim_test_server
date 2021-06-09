module.exports.isNumeric =  function isNumeric(checkedValue, isStrict = false) {
  if (isStrict) return isNaN(checkedValue) === false
  return isNaN(parseInt(checkedValue)) === false
}