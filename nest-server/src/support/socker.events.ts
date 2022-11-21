
export const ServerEvents = {
  chat: {
    new: 'chat.new',
    message: {
      new: 'chat.message.new',
      updated: 'chat.message.updated',
    }
  },
  notification: {
    new: 'notification.new',
  }
}

export const ClientEvents = {
  chat: {
    join: 'chat.join',
  }
}