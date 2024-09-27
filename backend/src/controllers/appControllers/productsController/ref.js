const { migrate } = require('./migrate');

const ref = async (Model, req, res) => {
  const sort = parseInt(req.query.sort) || 'desc';

  const supplierId = req.params.id;
  const result = await Model.find({
    removed: false,
    enabled: true,
    supplier: supplierId,
  })
    .sort({ created: sort })
    .exec();

    console.log(result);
    

  const migratedData = result.map((x) => migrate(x));
  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result: migratedData,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = ref;
