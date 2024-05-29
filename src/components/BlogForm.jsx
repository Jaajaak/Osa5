import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState(0)

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
      likes
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes(0)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title
        <input
          type="text"
          value={title}
          name="Title"
          placeholder="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          name="Author"
          placeholder="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={url}
          name="URL"
          placeholder="URL"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm
