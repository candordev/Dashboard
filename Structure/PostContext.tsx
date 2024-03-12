import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { Post } from '../utils/interfaces';

interface PostIdContextType {
  postId: string | null;
  setPostId: Dispatch<SetStateAction<string | null>>;
  post: Post | null;
  setPost: Dispatch<SetStateAction<Post | null>>;
}

const defaultValue: PostIdContextType = {
  postId: null,
  setPostId: () => {},
  post: null,
  setPost: () => {},
};

const PostIdContext = createContext<PostIdContextType>(defaultValue);

export const usePostId = () => useContext(PostIdContext);

export const PostIdProvider = ({ children }: any) => {
  const [postId, setPostId] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);

  return (
    <PostIdContext.Provider value={{postId, setPostId, post, setPost}}>
      {children}
    </PostIdContext.Provider>
  );
};
