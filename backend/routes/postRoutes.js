const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.post('/:id/regenerate', postController.regeneratePost);
router.patch('/:id/reschedule', postController.reschedulePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
