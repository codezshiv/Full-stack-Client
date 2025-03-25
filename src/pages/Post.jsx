import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'
import { useNavigate } from 'react-router-dom'


const Post = () => {
    
    let { id } = useParams()
    
    const [postObject, setPostObject] = useState({})
    const [comments, setComments] = useState([])
    const {authState} = useContext(AuthContext)
    let navigate = useNavigate()
    
    const [newComment, setNewComment] = useState('')

    useEffect(() => {
        Axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data)
        });

        Axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data)
        });
    }, [])

    const addComment = () => {
        Axios.post('http://localhost:3001/comments', {
            commentBody: newComment,
            PostId: id},
            {
                headers: {
                    accessToken : localStorage.getItem("accessToken")
                }
            }
        
        ).then((response) => {
            if(response.data.error){
                console.log(response.data.error)
            } else {
                const commentToAdd = {commentBody: newComment, username: response.data.username}
                setComments([...comments, commentToAdd])
                setNewComment("")
            }
            })
    }

    const deleteComment = (id) => {
        Axios.delete(`http://localhost:3001/comments/${id}`,{
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(() => {
            setComments(comments.filter((val) => {
                return val.id != id;
            }))
        })
    }

    const deletePost = (id) => {
        Axios.delete(`http://localhost:3001/posts/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(() => {
            navigate("/")
        })
    }

    const editPost = (option) => {
        if(option === 'title'){
            let newTitle = prompt('Enter new title: ')
            Axios.put("http://localhost:3001/posts/title", {newTitle: newTitle, id: id}, {
                headers: {
                    accessToken : localStorage.getItem("accessToken")
                }
            });
            setPostObject({...postObject, title: newTitle})
        } else {
            let newPostText = prompt('Enter new postText: ')
            Axios.put("http://localhost:3001/posts/postText", {newPostText: newPostText, id: id}, {
                headers: {
                    accessToken : localStorage.getItem("accessToken")
                }
            });
            setPostObject({...postObject, postText: newPostText})
        }
    };

    return (
        <div className='postPage'>
            <div className="leftSide">
                <div className="post" id='individual'>
                    <div className="title" onClick={() => {
                        if(authState.username === postObject.username){
                            editPost('title') 
                        }
                    }}>{postObject.title}</div>
                    <div className="body" onClick={() => {
                        if(authState.username === postObject.username){
                            editPost('body')
                        }
                    }}>{postObject.postText}</div>
                    <div className="footer">{postObject.username}
                        {authState.username === postObject.username && <button onClick={() => {deletePost(postObject.id)}}>Delete Post</button>}
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <div className='addCommentContainer'>
                    <input type='text' placeholder='Comment...' autoComplete='off' value={newComment} onChange={(e) => {setNewComment(e.target.value)}} />
                    <button onClick={addComment}>Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className='comment'>
                                {comment.commentBody}
                                <label> Username: {comment.username} </label>
                                {authState.username === comment.username && <button onClick={() => {deleteComment(comment.id)}}>X</button>}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Post
