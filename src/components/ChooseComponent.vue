<template>
  <div class="matching-space">
    <!-- <button>Virtual Keyboard</button> -->
    <div style="margin: 10px">
      <a href="/virtual-keyboard" class="button">Virtual Keyboard</a>
    </div>
    <div style="margin: 10px">
      <a href="/card" class="button">Card Flip</a>
    </div>
    <!-- <button v-on:click=""></button> -->
  </div>
</template>

<script>
export default {
  name: "choose-component",
  props: {
    msg: String,
  },
};
</script>

<style scoped>
.hide {
  background: black;
  color: black;
}

.unhide {
  background: white;
  color: black;
}

.hide,
.unhide {
  height: 100%;
  width: 100%;
  margin: 20px;
  font-size: 10vh;
}

.row {
  display: flex;
  height: 50%;
  align-items: center;
  align-content: space-between;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px;
}

.rows {
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 100%;
  align-content: space-between;
}

.matching-space {
  height: 100%;
}
</style>
