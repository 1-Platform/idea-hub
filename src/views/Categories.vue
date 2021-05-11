<template>
  <ul class="pf-c-list pf-m-plain pf-c-content default-categories">
    <li><a>My Ideas</a></li>
    <li><a class="active">Discover</a></li>
  </ul>
  <ul class="pf-c-list pf-m-plain pf-c-content categories">
    <li class="title">Categories</li>
    <!-- TODO load categories from backend -->
  </ul>
</template>

<style scoped>
.default-categories {
  margin-top: 24px;
}
.categories {
  margin-top: 24px;
  color: #6a6e73;
}

.categories > .title {
  font-size: 14px;
  color: #212121;
  opacity: 0.54;
}

a {
  color: inherit;
  text-decoration: none;
}

.active {
  font-weight: bold;
}
</style>