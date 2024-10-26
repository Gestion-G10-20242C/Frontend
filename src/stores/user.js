import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userName: '',
    profilePicture: '',
  }),

  actions: {
    logIn(user) {
      this.userName = user.userName
      this.profilePicture = user.profilePicture
      this.isLoggedIn = true
    },

    logOut() {
      this.isLoggedIn = false
      this.userName = ''
      this.profilePicture = ''
    },

    async resetIfExpired() {
      if (this.isLoggedIn) {
        // const response = await fetch('/api/check-session')
        // if (response.status === 401) {
        // if (false === 401) {
        //   this.logOut()
        // }
      }
    },
  },

  persist: true,
})
