import {db} from '../connect.js'
import jwt from 'jsonwebtoken'

export const getRelationships = (req, res) => {
    const query = `SELECT followerUserId FROM relationships WHERE followedUserId = ?`;
    db.query(query, [req.query.followedUserId], (err, result) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(result.map(relationship => relationship.followerUserId));
    })
}

export const addRelationship = (req, res) => {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated!");
    jwt.verify(token, 'secretKey', (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");
        const query = `INSERT INTO relationships (followerUserId, followedUserId) VALUES (?)`;
        const values = [
            userInfo.id,
            req.body.userId
        ]
        db.query(query, [values], (err, result) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json('User has been followed!')
        })
    })
}

export const deleteRelationship = (req, res) => {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated!");
    jwt.verify(token, 'secretKey', (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");
        const query = 'DELETE FROM relationships WHERE followerUserId=? AND followedUserId=?'
        db.query(query, [userInfo.id, req.query.userId], (err, result) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json('User has been unfollowed!')
        })
    })
}