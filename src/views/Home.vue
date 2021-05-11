<template>
  <aside class="pf-l-grid__item pf-m-3-col-on-lg pf-m-3-col-on-xl">
    <div class="sticky-aside">
      <button class="pf-c-button pf-m-block btn">Post a new Idea!</button>
      <div>
        <Categories />
      </div>
    </div>
  </aside>
  <section class="pf-l-grid__item pf-m-9-col-on-lg pf-m-9-col-on-xl">
    <div class="sticky-section">
      <div class="tabs">
        <pfe-tabs variant="wind" selected-index="1">
          <pfe-tab class="active" role="heading" slot="tab">
            <h1 class="pf-c-tabs__item-text">Recent</h1>
          </pfe-tab>
          <pfe-tab role="heading" slot="tab">
            <h1>Popular</h1>
          </pfe-tab>
        </pfe-tabs>
      </div>
      <div class="search">
        <div class="pf-c-input-group">
          <input
            class="pf-c-form-control"
            type="search"
            aria-label="Search input example"
          />
          <button
            class="pf-c-button pf-m-control"
            type="button"
            aria-label="Search button for search input"
          >
            <i class="fas fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="tab-content">
      <IdeaList />
    </div>
  </section>
</template>
<style scoped>
.btn {
  background-color: #61bffa;
  color: #f4fbff;
  padding: 8px 0px;
}

.sticky-aside {
  margin: 24px 0;
  position: sticky;
  top: 24px;
}

section {
  margin-top: 4px;
}

.sticky-section {
  display: flex;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 1;
  margin-bottom: 16px;
}

.tab-content {
  margin: 8px 0;
}

.sticky-section > .tabs {
  flex: 70%;
}

.sticky-section > .search {
  flex: 30%;
  margin-top: 24px;
}

pfe-tabs {
  --pfe-theme--color--surface--border: none;
}

pfe-tab {
  margin-top: 24px;
  padding: 4px 10px;
}

pfe-tab.active {
  border-bottom-color: #61bffa;
  font-weight: bold;
  color: black;
}

pfe-tab:hover {
  border-bottom-color: #61bffa;
  font-weight: bold;
}

pfe-tab:focus {
  border-bottom-color: #61bffa;
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Categories from "@/views/Categories.vue"; // @ is an alias to /src
import IdeaList from "@/views/IdeaList.vue"; // @ is an alias to /src
import "@patternfly/pfe-tabs";

@Options({
  components: {
    Categories,
    IdeaList,
  },
})
export default class Home extends Vue {}
</script>