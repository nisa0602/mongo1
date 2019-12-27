const Taman = require('../models/taman')

async function getTaman(req, res, next) {
    try {
        taman = await Taman.findById(req.params.id)
        if (taman == null) {
            return res.status(404).json({message: 'Taman is not found'})
        }
    } catch(err) {
        return res.status(500).json({message: err.message})
    }

    res.taman = taman
    next()
}

module.exports = getTaman