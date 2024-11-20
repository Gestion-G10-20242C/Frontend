import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  // Definir el estado inicial
  state: () => ({
    chats: JSON.parse(localStorage.getItem('chats')) || {}, // Restaurar desde localStorage
  }),

  // Definir getters (opcional, si necesitas derivar datos del estado)
  getters: {
    getMessages: state => author => {
      if (!state.chats[author]) {
        state.chats[author] = [] // Inicializa el chat si no existe
      }
      return state.chats[author]
    },
  },

  // Definir acciones para mutar el estado
  actions: {
    addMessage(author, message) {
      if (!this.chats[author]) {
        this.chats[author] = []
      }
      this.chats[author].push(message)

      // Guardar en localStorage cada vez que se añada un mensaje
      localStorage.setItem('chats', JSON.stringify(this.chats))
    },
    resetStore() {
      this.chats = {}
      localStorage.removeItem('chats') // Eliminar datos persistidos
    },
  },
})
