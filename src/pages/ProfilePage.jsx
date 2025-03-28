import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'

const ProfilePage = () => {

    let { id } = useParams()
    const {authState} = useContext(AuthContext)
    let navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [listOfPosts, setListOfPosts] = useState([])

    useEffect(() => {
        Axios.get(`https://full-stack-server-1-xwls.onrender.com/auth/basicinfo/${id}`).then((response) => {
            setUsername(response.data.username)
        });

        Axios.get(`https://full-stack-server-1-xwls.onrender.com/posts/byuserId/${id}`).then((response) => {
            setListOfPosts(response.data);
        })

    }, [])

  return (
    <div className='profilePageContainer'>
      <div className="basicInfo">
        <h1> Username: {username} </h1>
        {authState.username === username && <button onClick={() => {navigate("/changepassword")}}>Change My Password</button>}
        </div>
      <div className="listOfPosts">
      {listOfPosts.map((value, key) => {
        return (
        <div className='post'>
          <div className='title'> {value.title} </div>
          <div className='body' onClick={() => {navigate(`/post/${value.id}`)}}> {value.postText} </div>
          <div className='footer'>
            <div className="username"> {value.username}</div>
            <div className="buttons">
                <label>{value.Likes.length}</label>
            </div>
           </div>
        </div>
        )
      })}
      </div>
    </div>
  )
}

export default ProfilePage