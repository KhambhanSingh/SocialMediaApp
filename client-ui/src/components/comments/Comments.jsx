import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import makeQueryRequest from "../../axios.jsx";
import moment from 'moment';

const Comments = ({postId}) => {
  const [commentDesc, setCommentDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery({
    queryKey: ['comments'],
    queryFn: () => makeQueryRequest.get('/comments?postId='+postId).then((res) =>res.data)
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return  makeQueryRequest.post('/comments', newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });

  const handleClick = async(e) => {
    e.preventDefault();
    mutation.mutate({commentDesc, postId});
    setCommentDesc("");
  }


  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/"+currentUser.profilePic} alt="" />
        <input 
        type="text" 
        placeholder="write a comment" 
        onChange={(e) => setCommentDesc(e.target.value)}
        value={commentDesc} />
        <button onClick={handleClick}>Send</button>
      </div>
      {error ? "Something went wrong":
      isLoading ? "loading..." :
      data.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={"/upload/"+comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.comment}</p>
          </div>
          <span className="date">{moment(comment.createDate).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
