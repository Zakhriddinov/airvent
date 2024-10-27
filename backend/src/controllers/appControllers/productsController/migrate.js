exports.migrate = (result) => {
  let newData = {};
  newData._id = result._id;
  newData.name = result.name;
  newData.code = result.code;
  newData.price = result.price;
  newData.quantity = result.quantity;
  newData.quantityUnit = result.quantityUnit;
  return newData;
};
