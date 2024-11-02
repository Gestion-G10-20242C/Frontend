<script>
import { ref, computed } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useSearchStore } from '@/stores/search';

export default {
  name: 'SearchView',
  components: {
    HeaderComponent,
  },
    setup(){
      const searchStore = useSearchStore()
      const searchParameter = searchStore.getSearchQuery()

      console.log('Search parameter:', searchParameter)


      const items = [
      'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
      'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon',
      'Mango', 'Nectarine', 'Orange', 'Papaya', 'Quince'
      ]

      const searchQuery = ref(searchParameter? searchParameter: '')

      const filteredItems = computed(() => {
      if (searchQuery.value === '') return items
      const lowercaseQuery = searchQuery.value.toLowerCase()
      return items.filter(item => item.toLowerCase().includes(lowercaseQuery))
      })

      return {
          items,
          searchParameter,
          searchQuery,
          filteredItems,
          HeaderComponent
          }
    }
}
</script>

<template>
  <HeaderComponent/>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4 text-center">Search Items</h1>
        
        <div class="flex justify-center mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <transition-group 
          name="list" 
          tag="ul" 
          class="space-y-2"
        >
          <li 
            v-for="item in filteredItems" 
            :key="item"
            class="bg-gray-50 p-3 rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-gray-100"
          >
            {{ item }}
          </li>
        </transition-group>
        
        <p v-if="filteredItems.length === 0" class="text-center text-gray-500 mt-4">
          No items found.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>