import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    search_query: '',
  }),

  actions: {
    setSearchQuery(query) {
      this.search_query = query
    },
    getSearchQuery() {
      return this.search_query
    },
  },

  persist: true,
})
