import {db} from '../connect.js'
import jwt from 'jsonwebtoken'
import moment from 'moment'

export const getPosts = async (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated!");
    jwt.verify(token, 'secretKey', (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");

        const query = userId != "undefined"
        ? `SELECT p.*, u.fullname as name, u.profilePic FROM posts as p 
        JOIN users as u ON p.userId = u.id 
        WHERE p.userId=? ORDER BY p.createDate DESC` 
        :`SELECT p.*, u.fullname as name, u.profilePic FROM posts as p 
        JOIN users as u ON p.userId = u.id
        LEFT JOIN relationships as r ON (p.userId = r.followedUserId) 
        WHERE r.followerUserId=? OR p.userId=? ORDER BY p.createDate DESC`

        const values = userId != "undefined" ? [userId] : [userInfo.id, userInfo.id]

        db.query(query, values, (err, result) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json(result)
        })
    })    
}

export const addPost = async (req, res) => {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated!");
    jwt.verify(token, 'secretKey', (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");
        const query = "INSERT INTO posts(`userId`, `postContent`, `postImg`, `createDate`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.content,
            req.body.postImg,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ]

        db.query(query, [values], (err, result) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json("Post has been created.")
        })
    })
}

export const deletePost = async (req, res) => {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated!");
    jwt.verify(token, 'secretKey', (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");
        const postId = req.params.id;
        const query = "DELETE FROM posts WHERE `postId`=? AND `userId`=?";
        db.query(query, [postId, userInfo.id], (err, result) => {
            if(err) return res.status(500).json(err);
            if(result.affectedRows == 0) return res.status(403).json("You can delete only your post!");
        })
    })
}