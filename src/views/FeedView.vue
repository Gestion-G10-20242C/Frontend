<script>
import { ref, reactive } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import ReviewItem from '@/components/ReviewItem.vue'

export default {
  name: 'FeedView',
  components: {
    HeaderComponent,
    ReviewItem,
  },
  setup() {
    const posts = reactive([
      {
        user: {
          name: 'Carlos Fontela',
          profilePicture: 'https://cysingsoft.wordpress.com/wp-content/uploads/2009/01/carlosfontela6.jpg?w=584',
          username: '@carlosfontela'
        },
        content: '¡Acabo de terminar de leer "Java y UML"! Es un libro increíble sobre programación.',
        bookTitle: 'Java y UML',
        likes: 5,
        comments: 2,
      },
      {
        user: {
          name: 'Ana Pérez',
          profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
          username: '@anaperez'
        },
        content: 'Recomiendo "El Alquimista" de Paulo Coelho. ¡Una historia inspiradora!',
        bookTitle: 'El Alquimista',
        likes: 8,
        comments: 3,
      },
      {
        user: {
          name: 'Luis Gómez',
          profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
          username: '@luisgomez'
        },
        content: 'Acabo de leer "Cien años de soledad" de Gabriel García Márquez. Una obra maestra de la literatura.',
        bookTitle: 'Cien años de soledad',
        likes: 10,
        comments: 5,
      },
    ]);

    return {
      posts,
    };
  },
}
</script>

<template>
  <HeaderComponent />
  <div class="container pt-4">
    <div class="row">
      <div class="col">
        <h1>Feed</h1>
        <div class="list-group">
          <ReviewItem
            v-for="(post, index) in posts"
            :key="index"
            :post="post"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  margin-bottom: 15px;
}
</style>
