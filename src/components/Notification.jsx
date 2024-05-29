const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: type === 'success' ? 'green' : 'red',
    background: 'grey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 3,
    padding: 5,
    marginBottom: 5
  }

  return (
    <div style={notificationStyle} data-testid="notification">
      {message}
    </div>
  )
}

export default Notification
