<template>
  <div class="container" id="app">
    <Header />
    <main class="pf-l-grid pf-m-gutter">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style>
html,
body {
  font-family: "Red Hat Text", sans-serif;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
/**
*  Media queries here
*/
/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .container {
    max-width: 540px;
    margin: auto;
  }
}

/* Medium devices (tablets, 768px and up) The navbar toggle appears at this breakpoint */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    margin: auto;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
    margin: auto;
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
    margin: auto;
  }
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/views/Header.vue"; // @ is an alias to /src
import Footer from "@/views/Footer.vue"; // @ is an alias to /src

@Options({
  components: {
    Header,
    Footer,
  },
})
export default class Home extends Vue {}
</script>