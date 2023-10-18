const express = require("express")
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello Server is Running as Sub-Instance of Baron-Tech for Kit-Builder Application")
})

module.exports = router;