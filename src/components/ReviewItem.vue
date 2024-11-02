<template>
  <div class="list-group-item">
    <div class="d-flex align-items-start">
      <img
        :src="post.user.profilePicture"
        alt="User profile picture"
        class="rounded-circle me-3"
        width="50"
        height="50"
      />
      <div>
        <h5 class="mb-1">
          {{ post.user.name }}
          <small class="text-muted">{{ post.user.username }}</small>
        </h5>
        <p class="mb-1">{{ post.content }}</p>
        <p class="fw-bold mb-1">Libro: {{ post.bookTitle }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewItem',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.list-group-item {
  margin-bottom: 15px;
}
</style>
