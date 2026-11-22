const createCrud = (Model) => {
  const list = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      const filter = {};
      if (req.query.search) {
        filter.$or = Object.keys(Model.schema.paths)
          .filter(k => Model.schema.paths[k].instance === 'String')
          .map(k => ({ [k]: new RegExp(req.query.search, 'i') }));
      }
      const [items, total] = await Promise.all([
        Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Model.countDocuments(filter),
      ]);
      res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (e) { next(e); }
  };
  const get = async (req, res, next) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { next(e); }
  };
  const create = async (req, res, next) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (e) { next(e); }
  };
  const update = async (req, res, next) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { next(e); }
  };
  const remove = async (req, res, next) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, message: 'Deleted' });
    } catch (e) { next(e); }
  };
  return { list, get, create, update, remove };
};

module.exports = createCrud;
