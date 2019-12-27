const express = require ('express')
const router = express.Router()
const Taman = require ('../models/taman')
const helper = require ('../routes/helper_taman')

//List all 'taman'
router.get('/', async (req, res) => {
    try {
        const tamans = await Taman.find()
        res.json(tamans)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//write a new 'taman'
router.post('/', async (req, res) => {
    const taman = new Taman ({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities
    })
    try {
        await taman.save()
        res.status(201).json({taman})
    } catch (err) {
        res.status(404).json({message: err.message})
    }
})

//List a Taman
router.get('/:id', helper, (req, res) => {
    res.json(res.taman)
})
module.exports = router