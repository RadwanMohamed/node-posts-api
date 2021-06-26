const express = require('express');
const {body}  = require('express-validator');
const router  = express.Router();
const feedController = require('../controllers/feed');
const Authentication = require('../middleware/Authentication');

router.get('/posts',Authentication,feedController.getPosts); 
router.post('/posts',[
    body('title').trim().isLength({min : 5}),
   // body('body').trim().isLength({min : 5}),
],feedController.createPost); 
router.get('/posts/:postId',feedController.getPost); 

router.put('/posts/:postId',
[
    body('title').trim().isLength({min : 5})
]
,feedController.updatePost); 

router.delete('/posts/:postId',feedController.deletePost)
module.exports = router; 
