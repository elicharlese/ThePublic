import React, { useState } from 'react';
import styles from './communitysocialnetwork.module.scss';

interface Post {
  id: number;
  username: string;
  content: string;
}

const CommunitySocialNetwork: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const handlePostSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newPostEntry: Post = {
      id: posts.length + 1,
      username: username || 'Anonymous',
      content: newPost,
    };
    setPosts([...posts, newPostEntry]);
    setNewPost('');
  };

  return (
    <div className={styles.socialNetworkContainer}>
      <h1>Community Social Network</h1>
      <form onSubmit={handlePostSubmit} className={styles.postForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="newPost">New Post:</label>
          <textarea
            id="newPost"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>
          Post
        </button>
      </form>
      <div className={styles.postsContainer}>
        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            <h3>{post.username}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunitySocialNetwork;