import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeQueryRequest from "../../axios.jsx";

const Share = () => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");

  const uploadImg = async () => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await makeQueryRequest.post("/upload", formData);
        return res.data;
    } catch (error) {
      console.log(error);
    }
  }
  const {currentUser} = useContext(AuthContext)

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return  makeQueryRequest.post('/posts', newPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleClick = async(e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) {
      imgUrl = await uploadImg();
    }
    mutation.mutate({content, postImg: imgUrl});
    setContent("");
    setFile(null);
  }

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={currentUser.profilePic}
              alt=""
              />
            <input 
            type="text" 
            placeholder={`What's on your mind ${currentUser.firstname}?`}  
            onChange={(e) => setContent(e.target.value)}
            value={content}
             />
          </div>
          <div className="right">
            {file && (
              <img className='file'  src={URL.createObjectURL(file)} alt="" />
            )
            }
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick} disabled={content || file ? false : true} >Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
