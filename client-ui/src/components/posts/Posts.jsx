import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from '@tanstack/react-query'
import makeQueryRequest from "../../axios.jsx"

const Posts = ({userId}) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => makeQueryRequest.get('/posts?userId='+userId).then(res => res.data)
  });
  
  return <div className="posts">
    {error? 'Somthing went wrong' : 
    isLoading? "loading..." : 
    data?.map(post => (
      <Post post={post} key={post.postId} />
    ))}
  </div>;
};

export default Posts;
