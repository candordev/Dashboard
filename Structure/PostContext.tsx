import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

interface PostIdContextType {
  postId: string | null;
  setPostId: Dispatch<SetStateAction<string | null>>;
}

const defaultValue: PostIdContextType = {
  postId: null,
  setPostId: () => {},
};

const PostIdContext = createContext<PostIdContextType>(defaultValue);

export const usePostId = () => useContext(PostIdContext);

export const PostIdProvider = ({ children }: any) => {
  const [postId, setPostId] = useState<string | null>(null);

  return (
    <PostIdContext.Provider value={{ postId, setPostId }}>
      {children}
    </PostIdContext.Provider>
  );
};
