<template>
  <!-- temporary looping for 10 time, in real take from backend -->
  <div v-for="(n, i) in 10" v-bind:key="i" class="pf-c-card idea-card">
    <div class="left-section">
      <p>100</p>
      <button class="pf-c-button pf-m-secondary vote-btn" type="button">
        VOTE
      </button>
    </div>
    <div class="right-section">
      <div class="title">
        <a>
          An internal platform for associate run projects and experimentation
        </a>
        <p class="float-right">
          <ion-icon name="ellipsis-vertical"></ion-icon>
        </p>
      </div>
      <div class="details">
        <span>2 days ago</span>
        <span>Posted by: <b>Prasad Ambulkar</b></span>
        <span class="float-right">
          <ion-item>
            <ion-icon class="icon" name="chatbox"></ion-icon>
            <span class="text">6 Comments</span>
          </ion-item>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.idea-card {
  margin: 8px 0;
  display: grid;
  grid-template-columns: 100px 1fr;
  padding: 16px 0;
}

.left-section {
  display: grid;
  font-size: 24px;
  text-align: center;
  color: #5c5c5c;
}

.left-section > .vote-btn {
  padding: 4px 8px;
  font-size: 12px;
  margin: auto;
  color: #61bffa;
  z-index: 0;
  --pf-c-button--after--BorderColor: #61bffa;
  --pf-c-button--after--BorderRadius: 8px;
}

.right-section > .title > a {
  color: #212121;
  text-decoration: none;
  font-size: 24px;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 700px;
  display: inline-block;
}

.right-section > .details {
  color: #5c5c5c;
  margin-top: 8px;
}

.right-section > .details > span:first-child {
  margin-right: 32px;
}

.float-right {
  float: right;
  padding: 0px 10px;
}

.icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
</style>

<script lang="ts">
export default {
  name: "Idea",
};
</script>