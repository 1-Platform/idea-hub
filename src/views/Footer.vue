<template>
  <footer>
    <div class="footer-text">
      <span>Developer and Maintained by the <b> One Platform Team </b></span>
      <span>Internal use only</span>
      <span>Find out more about similar associate run projects</span>
    </div>
    <div>
      <img src="@/assets/red-hat-logo.svg" alt="Redhat" />
    </div>
  </footer>
</template>

<style>
footer {
  height: 66px;
  background: #f4fbff;
  padding: 20px 10px;
  display: flex;
  align-items: center;
  font-size: 12px;
}

footer > .footer-text {
  display: inline-flex;
  flex-wrap: wrap;
  width: calc(100% + 12px);
}

footer > .footer-text > span {
  margin: 6px;
}
</style>