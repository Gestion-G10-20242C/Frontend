<script>
import { reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useRouter } from 'vue-router' // Importa useRouter

export default {
  name: 'FeedView',
  components: {
    HeaderComponent,
  },
  setup() {
    const follows = reactive([])
    const userStore = useUserStore()
    const router = useRouter() // Inicializa el router

    return {}
  },
}
</script>

<template>
  <HeaderComponent />
  <div class="container pt-4 content-wrapper">
    <div class="row">
      <div class="col feed-column">
        <h1>Comunidad</h1>
      </div>
    </div>
  </div>
</template>
