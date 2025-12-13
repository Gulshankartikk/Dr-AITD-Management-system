const mongoose = require('mongoose');

const validateId = (paramNames) => {
    return (req, res, next) => {
        // If paramNames is a single string, convert to array
        const params = Array.isArray(paramNames) ? paramNames : [paramNames];

        for (const param of params) {
            if (req.params[param] && !mongoose.Types.ObjectId.isValid(req.params[param])) {
                return res.status(400).json({
                    success: false,
                    msg: `Invalid ${param} format`
                });
            }
        }
        next();
    };
};

module.exports = validateId;
