import React, { use, useContext, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { AuthContext } from '../helpers/AuthContext'


const CreatePost = () => {
  
  const { authState } = useContext(AuthContext)
  let navigate = useNavigate()

    const initialValues ={
        title: "",
        postText: ""
    }

    useEffect(() => {
      if(!localStorage.getItem("accessToken")){
        navigate('/login')
      }
    }, [])

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        postText: Yup.string().required()
    })

    const onSubmit = (data) => {
        Axios.post("https://full-stack-server-1-xwls.onrender.com/posts", data, {
          headers: {
            accessToken: localStorage.getItem("accessToken")
          }
        }).then((response) => {
            navigate('/')
          })
    }

    
  return (
    <div className='createPostPage'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className='formContainer'>
            <label>Title:</label>
            <ErrorMessage name='title' component="span" />
            <Field autoComplete="off" id="inputCreatePost" name="title" placeholder="Enter Your Title.." />
            <label>Post:</label>
            <ErrorMessage name='postText' component="span" />
            <Field autoComplete="off" id="inputCreatePost" name="postText" placeholder="Enter Post Content.." />
            <button type='submit'>Create Post</button>
        </Form>
      </Formik>
    </div>
  )
}

export default CreatePost
