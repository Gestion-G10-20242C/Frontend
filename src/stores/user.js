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
    favouriteGenres: [],
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
      this.favouriteBook = ''
      this.favouriteBookCover = ''
      this.favouriteBookReview = ''
      this.bookShelf = []
      this.myBooks = []
      this.groups = []
      this.readingChallenges = []
      this.favouriteGenres = []
    },

    // Nueva acción para actualizar la información del usuario
    updateUser(updatedData) {
      this.name = updatedData.name
      this.profilePicture = updatedData.profilePicture
      this.description = updatedData.description
      this.myBooks = updatedData.myBooks
      this.favouriteBook = updatedData.favouriteBook
      this.favouriteBookCover = updatedData.favouriteBookCover
      this.favouriteBookReview = updatedData.favouriteBookReview
      this.bookShelf = updatedData.bookShelf
      this.groups = updatedData.groups
      this.readingChallenges = updatedData.readingChallenges
      this.favouriteGenres = updatedData.favouriteGenres
    },

    getUserData() {
      return {
        name: this.name,
        profilePicture: this.profilePicture,
        description: this.description,
        myBooks: this.myBooks,
        favouriteBook: this.favouriteBook,
        favouriteBookCover: this.favouriteBookCover,
        favouriteBookReview: this.favouriteBookReview,
        bookShelf: this.bookShelf,
        groups: this.groups,
        readingChallenges: this.readingChallenges,
        favouriteGenres: this.favouriteGenres,
      }
    },

    async resetIfExpired() {
      if (this.isLoggedIn) {
        // Lógica para verificar la sesión
      }
    },
  },

  persist: true,
})
