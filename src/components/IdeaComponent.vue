<template>
  <!-- temporary looping for 10 time, in real take from backend -->
  <div v-for="(n, i) in 10" v-bind:key="i" class="pf-c-card idea-card">
    <div class="left-section">
      <p class="vote-number">100</p>
      <button class="pf-c-button pf-m-secondary vote-btn" type="button">
        VOTE
      </button>
    </div>
    <div class="middle-section">
      <a class="title">
        An internal platform for associate run projects and experimentation
      </a>
      <div class="details">
        <span>2 days ago</span>
        <span class="owner">Posted by: <b>Prasad Ambulkar</b></span>
      </div>
    </div>
    <div class="right-section">
      <p class="kebab"><ion-icon name="ellipsis-vertical"></ion-icon></p>
      <p class="comments">
        <ion-item>
          <ion-icon class="icon" name="chatbox"></ion-icon>
          <span class="text">6 Comments</span>
        </ion-item>
      </p>
    </div>
  </div>
</template>

<style scoped>
.idea-card {
  margin: 8px 0;
  display: grid;
  grid-template-columns: 100px 1fr 150px;
  padding: 24px 0;
}

.left-section {
  margin: auto;
  font-size: 24px;
  text-align: center;
}

.left-section > .vote-btn {
  padding: 0 10px;
  font-size: 12px;
  margin: auto;
  --pf-c-button--after--BorderColor: #61bffa;
  color: #61bffa;
  z-index: 0;
}

.middle-section > .title {
  color: #212121;
  text-decoration: none;
  font-size: 20px;
  text-align: left;
}

.middle-section > .details {
  color: #5c5c5c;
  margin-top: 14px;
}

.right-section {
  position: relative;
  color: #5c5c5c;
}

.right-section > .comments {
  bottom: 4px;
  position: absolute;
}

.details > .owner {
  margin: 32px;
}

.kebab {
  float: right;
  padding: 0px 10px;
}

.icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 2px;
}

.text {
  display: inline-block;
  vertical-align: middle;
}
</style>

<script lang="ts">
export default {
  name: "Idea",
};
</script>