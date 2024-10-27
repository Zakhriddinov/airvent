exports.migrate = (result) => {
  let newData = {};
  newData._id = result._id;
  newData.name = result.name;
  newData.currency = result.currency;
  return newData;
};
