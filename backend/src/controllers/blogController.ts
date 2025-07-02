import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/services/supabase';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { CreateBlogPostRequest } from '@/types';
import { AuthenticatedRequest } from '@/middleware/auth';

export class BlogController {
  static async getAllPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { 
        limit = 50, 
        offset = 0, 
        category,
        tag,
        published = 'true',
        featured 
      } = req.query;

      let query = supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          description,
          category,
          tags,
          published,
          featured,
          cover_image,
          read_time,
          created_at,
          published_at,
          users!blog_posts_author_id_fkey(email)
        `)
        .order('published_at', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      // Filter by publication status
      if (published === 'true') {
        query = query.eq('published', true);
      } else if (published === 'false') {
        query = query.eq('published', false);
      }

      // Filter by category
      if (category) {
        query = query.eq('category', category);
      }

      // Filter by tag
      if (tag) {
        query = query.contains('tags', [tag]);
      }

      // Filter by featured status
      if (featured !== undefined) {
        query = query.eq('featured', featured === 'true');
      }

      const { data: posts, error, count } = await query;

      if (error) {
        throw new AppError('Failed to fetch blog posts', 500);
      }

      res.json({
        success: true,
        data: {
          posts,
          pagination: {
            total: count || 0,
            limit: Number(limit),
            offset: Number(offset),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPostBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;

      const { data: post, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          users!blog_posts_author_id_fkey(email, profile)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error || !post) {
        throw new AppError('Blog post not found', 404);
      }

      res.json({
        success: true,
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  static async createPost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const postData: CreateBlogPostRequest = req.body;
      const authorId = req.user?.id;

      if (!authorId) {
        throw new AppError('Authentication required', 401);
      }

      // Generate slug if not provided
      if (!postData.slug) {
        postData.slug = postData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }

      // Check if slug already exists
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', postData.slug)
        .single();

      if (existingPost) {
        postData.slug = `${postData.slug}-${Date.now()}`;
      }

      // Calculate read time (rough estimate: 200 words per minute)
      const wordCount = postData.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      // Create blog post
      const { data: post, error } = await supabase
        .from('blog_posts')
        .insert({
          ...postData,
          author_id: authorId,
          read_time: readTime,
          published_at: postData.published ? new Date().toISOString() : null,
        })
        .select(`
          *,
          users!blog_posts_author_id_fkey(email)
        `)
        .single();

      if (error) {
        logger.error('Failed to create blog post', { error, postData: { ...postData, content: '[truncated]' } });
        throw new AppError('Failed to create blog post', 500);
      }

      logger.info('Blog post created successfully', { 
        postId: post.id, 
        slug: post.slug,
        authorId 
      });

      res.status(201).json({
        success: true,
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Get existing post
      const { data: existingPost, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existingPost) {
        throw new AppError('Blog post not found', 404);
      }

      // Check permissions (author or admin)
      if (existingPost.author_id !== userId && userRole !== 'admin') {
        throw new AppError('Permission denied', 403);
      }

      // Update slug if title changed
      if (updateData.title && updateData.title !== existingPost.title) {
        updateData.slug = updateData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Check if new slug already exists
        const { data: slugExists } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', updateData.slug)
          .neq('id', id)
          .single();

        if (slugExists) {
          updateData.slug = `${updateData.slug}-${Date.now()}`;
        }
      }

      // Recalculate read time if content changed
      if (updateData.content) {
        const wordCount = updateData.content.split(/\s+/).length;
        updateData.read_time = Math.ceil(wordCount / 200);
      }

      // Set published_at if publishing for the first time
      if (updateData.published && !existingPost.published) {
        updateData.published_at = new Date().toISOString();
      }

      // Update post
      const { data: post, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          users!blog_posts_author_id_fkey(email)
        `)
        .single();

      if (error) {
        throw new AppError('Failed to update blog post', 500);
      }

      logger.info('Blog post updated successfully', { 
        postId: id, 
        userId 
      });

      res.json({
        success: true,
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Get existing post
      const { data: existingPost, error: fetchError } = await supabase
        .from('blog_posts')
        .select('author_id, title')
        .eq('id', id)
        .single();

      if (fetchError || !existingPost) {
        throw new AppError('Blog post not found', 404);
      }

      // Check permissions (author or admin)
      if (existingPost.author_id !== userId && userRole !== 'admin') {
        throw new AppError('Permission denied', 403);
      }

      // Delete post
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw new AppError('Failed to delete blog post', 500);
      }

      logger.info('Blog post deleted successfully', { 
        postId: id, 
        title: existingPost.title,
        userId 
      });

      res.json({
        success: true,
        data: {
          message: 'Blog post deleted successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data: categories, error } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('published', true)
        .not('category', 'is', null);

      if (error) {
        throw new AppError('Failed to fetch categories', 500);
      }

      // Count posts per category
      const categoryCount = categories?.reduce((acc: Record<string, number>, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
      }, {});

      const categoryList = Object.entries(categoryCount || {}).map(([name, count]) => ({
        name,
        count,
      })).sort((a, b) => b.count - a.count);

      res.json({
        success: true,
        data: { categories: categoryList },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('tags')
        .eq('published', true)
        .not('tags', 'is', null);

      if (error) {
        throw new AppError('Failed to fetch tags', 500);
      }

      // Flatten and count tags
      const tagCount: Record<string, number> = {};
      posts?.forEach(post => {
        post.tags?.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });

      const tagList = Object.entries(tagCount).map(([name, count]) => ({
        name,
        count,
      })).sort((a, b) => b.count - a.count);

      res.json({
        success: true,
        data: { tags: tagList },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFeaturedPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = 5 } = req.query;

      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          description,
          category,
          tags,
          cover_image,
          read_time,
          published_at,
          users!blog_posts_author_id_fkey(email)
        `)
        .eq('published', true)
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(Number(limit));

      if (error) {
        throw new AppError('Failed to fetch featured posts', 500);
      }

      res.json({
        success: true,
        data: { posts },
      });
    } catch (error) {
      next(error);
    }
  }
}
