module.exports = function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details[0].message.replace(/['"]/g, '');
      return res.status(400).json({ error: message });
    }
    next();
  };
};
