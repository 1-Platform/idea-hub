<template>
  <header>
    <div class="header-logo">
      <img src="@/assets/idea-hub.svg" alt="Idea Hub" />
    </div>
    <div class="header-data">
      <div class="header-title">Innovation Hub</div>
      <div class="header-description">
        A place to share your ideas and find other passionate people
      </div>
    </div>
    <ion-icon
      class="header-help-icon"
      name="help-circle-outline"
      size="large"
    ></ion-icon>
  </header>
</template>

<style>
header {
  height: 144px;
  background: #f4fbff;
  color: #212121;
  border-radius: 8px;
  align-items: center;
  display: grid;
  grid-template-columns: 100px 1fr 50px;
  grid-template-rows: 50px 1fr;
}

header > .header-logo {
  grid-column: 1/2;
  grid-row: 1/3;
  padding: 10px;
}

header > .header-data {
  grid-row: 1/3;
}

header > .header-data > .header-title {
  grid-column: 1/3;
  font-size: 32px;
  margin-bottom: 6px;
}

header > .header-data > .header-description {
  grid-column: 1/3;
  font-size: 16px;
}

header > .header-help-icon {
  color: #61bffa;
}
</style>