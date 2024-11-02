import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userName: '',
    profilePicture: '',
    followingUsers: [], // Nueva propiedad para almacenar los usuarios seguidos
  }),

  actions: {
    logIn(user) {
      this.userName = user.userName
      this.profilePicture = user.profilePicture
      this.followingUsers = user.followingUsers || [] // Asumir que viene del backend
      this.isLoggedIn = true
    },

    logOut() {
      this.isLoggedIn = false
      this.userName = ''
      this.profilePicture = ''
      this.followingUsers = [] // Limpiar la lista al salir
    },

    async resetIfExpired() {
      if (this.isLoggedIn) {
        // Lógica para verificar la sesión
      }
    },
  },

  persist: true,
})
