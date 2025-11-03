import './update.scss'
import { useState } from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeQueryRequest from "../../axios.jsx";

const Update = ({setOpenUpdate, user}) => {

    const [cover, setCover] = useState(null)
    const [profile, setProfile] = useState(null)

    const [texts, setTexts] = useState({
        fname : '',
        lname : '',
        city: '',
        website: '',
    })

    const uploadImg = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeQueryRequest.post("/upload", formData);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) =>{
        setTexts((prev) => ({...prev, [e.target.name]: [e.target.value]}))
    }

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (user) => {
        return  makeQueryRequest.put('/users', user);
        },
        onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        },
    });

    const handleClick = async(e) => {
        e.preventDefault();        
        let coverUrl = cover ? await uploadImg(cover) : user.coverPic;
        let profileUrl = profile ? await uploadImg(profile) : user.profilePic;

        console.log(coverUrl, profileUrl);

        mutation.mutate({...texts, coverPic: coverUrl, profilePic: profileUrl,});
        setOpenUpdate(false)
    }

  return (
    <div className='update'>
        Update
        <form action="">
            <input type="file" onChange={(e) => setCover(e.target.files[0])}/>
            <input type="file" onChange={(e) => setProfile(e.target.files[0])}/>
            <input type="text" name="fname" onChange={handleChange} />
            <input type="text" name="lname" onChange={handleChange} />
            <input type="text" name='city' onChange={handleChange} />
            <input type="text" name='website' onChange={handleChange} />
            <button onClick={handleClick}>Update</button>
        </form>
        <button onClick={() => setOpenUpdate(false)}>X</button>
    </div>
  )
}

export default Update