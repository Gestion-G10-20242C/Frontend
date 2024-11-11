import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userName: '',
    name: '',
    profilePicture: '',
    followingUsers: [],
    favouriteBook: '',
    favouriteBookCover: '',
    favouriteBookReview: '',
    bookShelf: [],
    myBooks: [],
    groups: [],
    readingChallenges: [],
  }),

  actions: {
    async logIn(username) {
      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}`
      try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error('Error fetching user data')
        }
        const data = await response.json()
        this.userName = username
        this.name = data.name || username
        this.profilePicture =
          data.profilePicture ||
          'https://i.pinimg.com/736x/c4/86/8f/c4868fc3f718f95e10eb6341e1305bb6.jpg'
        this.description = data.description || ''
        this.followingUsers = data.followingUsers || []
        this.isLoggedIn = true
      } catch (error) {
        console.error('Error:', error)
      }
    },

    logOut() {
      this.isLoggedIn = false
      this.userName = ''
      this.profilePicture = ''
      this.name = ''
      this.description = ''
      this.followingUsers = [] // Limpiar la lista al salir
    },

    // Nueva acción para actualizar la información del usuario
    updateUser(updatedData) {
      this.name = updatedData.name
      this.profilePicture = updatedData.profilePicture
      this.description = updatedData.description
    },

    async resetIfExpired() {
      if (this.isLoggedIn) {
        // Lógica para verificar la sesión
      }
    },
  },

  persist: true,
})
