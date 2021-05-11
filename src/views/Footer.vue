<template>
  <footer>
    <div class="footer-text">
      <div class="footer-text-left">
        Developer and Maintained by the <b> One Platform Team </b>
      </div>
      <div class="footer-text-middle">Internal use only</div>
      <div class="footer-text-right">
        Find out more about similar associate run projects
      </div>
    </div>
    <div class="footer-logo">
      <img src="@/assets/red_hat_logo.svg" alt="Redhat" />
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

footer > .footer-text > div {
  margin: 6px;
}
</style>