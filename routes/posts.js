var express = require('express');
var router = express.Router();

/* POST a post handler. */
router.post('/a-post-handler', function(req, res, next) {
    res.render('pages/index', {
        pageTitle: 'Express Template (posted to this url)'
    });
});

module.exports = router;
