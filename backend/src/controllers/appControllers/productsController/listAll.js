const { migrate } = require('./migrate');

const listAll = async (Model, req, res) => {
  const sort = parseInt(req.query.sort) || 'desc';

  const result = await Model.find({
    removed: false,
    enabled: true,
  })
    .sort({ created: sort })
    .populate()
    .exec();

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

module.exports = listAll;
