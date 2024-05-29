import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      setMessageType('success')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    } catch (exception) {
      setMessage('Error adding blog')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (exception) {
      setMessage('Error updating blog')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setMessage('Blog removed successfully')
      setMessageType('success')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    } catch (exception) {
      setMessage('Error removing blog')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong credentials')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogFormRef = useRef()

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message} type={messageType} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <h1>Create a new blog</h1>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <h2>Blogs added by {user.name}</h2>
          <ul>
            {blogs
              .slice()
              .sort((a, b) => b.likes - a.likes)
              .map(blog => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  updateBlog={updateBlog}
                  deleteBlog={deleteBlog}
                  user={user}
                />
              ))}
          </ul>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default App
