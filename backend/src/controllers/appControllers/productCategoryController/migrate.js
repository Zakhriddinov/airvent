exports.migrate = (result) => {
  let newData = {};
  newData._id = result._id;
  newData.name = result.name;
  newData.code = result.code;
  newData.color = result.color;
  return newData;
};
