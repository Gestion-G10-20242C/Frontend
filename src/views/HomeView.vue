<template>
  <div class="px-4 py-5 my-5 text-center">
    <img
      alt="Vue logo"
      class="logo"
      src="https://static.vecteezy.com/system/resources/previews/011/660/012/non_2x/book-hand-drawn-sketch-png.png"
      width="90"
      height="90"
    />
    <h1 class="display-5 fw-bold text-body-emphasis">Welcome to Readme</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">
        Find and read more books you'll love, and keep track of the books you
        want to read. Be part of the world's largest community of book lovers on
        Readme.
      </p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <RouterLink to="/login" class="btn btn-primary btn-lg px-4 gap-3">
          Log In
        </RouterLink>
        <RouterLink to="/register" class="btn btn-primary btn-lg px-4 gap-3">
          Sign Up
        </RouterLink>
      </div>
    </div>
  </div>
</template>
