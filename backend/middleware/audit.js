const AuditLog = require('../models/AuditLog');

const audit = (action, resource) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;

    res.send = function (data) {
      res._body = data;
      return originalSend.call(this, data);
    };

    res.json = function (data) {
      res._body = data;
      return originalJson.call(this, data);
    };

    res.on('finish', async () => {
      try {
        await AuditLog.create({
          user: req.user ? req.user._id : null,
          action,
          resource,
          resourceId: req.params.id || req.params.projectId || req.params.jobId || req.params.courseId || req.params.customerId,
          method: req.method,
          endpoint: req.originalUrl,
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent') || '',
          status: res.statusCode,
          metadata: {
            query: req.query,
            body: req.body ? { ...req.body, password: undefined } : undefined,
          },
        });
      } catch (error) {
        console.error('Audit log error:', error.message);
      }
    });

    next();
  };
};

module.exports = audit;