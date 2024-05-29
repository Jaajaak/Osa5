import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('Test that createBlog is being called with the right values', async () => {

  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')

  await user.type(titleInput, 'Testi titteli')
  await user.type(authorInput, 'Testikirjan kirjoittaja')
  await user.type(urlInput, 'hienotestiosoite')

  const createButton = screen.getByText('save')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testi titteli',
    author: 'Testikirjan kirjoittaja',
    url: 'hienotestiosoite',
    likes: 0
  })
})