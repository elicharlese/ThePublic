import { Router } from 'express';
import { BlogController } from '@/controllers/blogController';
import { requireRole } from '@/middleware/auth';

const router = Router();

// Public blog routes
router.get('/posts', BlogController.getAllPosts);
router.get('/posts/featured', BlogController.getFeaturedPosts);
router.get('/posts/:slug', BlogController.getPostBySlug);
router.get('/categories', BlogController.getCategories);
router.get('/tags', BlogController.getTags);

// Admin/author routes
router.post('/posts', requireRole('admin'), BlogController.createPost);
router.put('/posts/:id', requireRole('admin'), BlogController.updatePost);
router.delete('/posts/:id', requireRole('admin'), BlogController.deletePost);

export { router as blogRoutes };
