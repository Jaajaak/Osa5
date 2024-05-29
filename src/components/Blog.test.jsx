import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'


test('renders content', () => {
  const blog = {
    title: 'Uusi testityyli',
    author: 'Jaakko',
    url: 'fakeurl',
    likes : 5
  }

  render(<Blog blog={blog} />)

  screen.debug()

  const element = screen.getByText('Uusi testityyli Jaakko')
  expect(element).toBeDefined()
})

test('Test view button works', async () => {
  const blog = {
    title: 'Uusi testityyli',
    author: 'Jaakko',
    url: 'fakeurl',
    likes: 5,
    user: {
      username: 'testaaja',
      name: 'Jaakkotest'
    }
  }

  const updateBlog = vi.fn()
  const deleteBlog = vi.fn()
  const user = {
    username: 'testaaja',
    name: 'Jaakkotest'
  }

  render(
    <Blog
      blog={blog}
      updateBlog={updateBlog}
      deleteBlog={deleteBlog}
      user={user}
    />
  )

  const userEventTest = userEvent.setup()

  // Simulate clicking the view button
  const viewButton = screen.getByText('view')
  await userEventTest.click(viewButton)

  // Check that the blog details are displayed
  const urlElement = screen.getByText('fakeurl')
  const likesElement = screen.getByText('likes: 5')
  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('Test like button is used twice', async () => {
  const blog = {
    title: 'Uusi testityyli',
    author: 'Jaakko',
    url: 'fakeurl',
    likes: 5,
    user: {
      username: 'testaaja',
      name: 'Jaakkotest'
    }
  }

  const updateBlog = vi.fn()
  const deleteBlog = vi.fn()
  const user = {
    username: 'testaaja',
    name: 'Jaakkotest'
  }

  render(
    <Blog
      blog={blog}
      updateBlog={updateBlog}
      deleteBlog={deleteBlog}
      user={user}
    />
  )

  const userEventTest = userEvent.setup()
  const viewButton = screen.getByText('view')
  await userEvent.click(viewButton)

  const likeButton = screen.getByText('like')
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})