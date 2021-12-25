<template>
  <div class="virtual-keyboard">
    <div>
      <a href="/" class="button">Back to Home</a>
    </div>
    <textarea v-model="textAreaText"></textarea>
    <div v-for="keySet in rows.keyMap" :key="keySet" class="key-set">
      <div
        v-for="key in keySet"
        :key="key"
        class="key"
        v-on:click="keyboard.keyPress(key)"
      >
        <div class="lower-key">
          {{ key.lower }}
        </div>
        <div class="upper-key">
          {{ key.upper }}
        </div>
        <div>
          {{ key.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    this.init();
  },
  methods: {
    isLetter(str) {
      return str.length === 1 && str.match(/[a-z]/i);
    },
    init() {
      this.rows.randomize();
      console.log(this.keys.length);
    },
  },
  data: function () {
    const CharacterKeyType = "char";
    const ActionKeyType = "action";
    return {
      textAreaText: "",
      keys: [
        ..."abcdefghijklmnopqrstuvwxyz".split("").map((alphabet) => {
          return {
            type: CharacterKeyType,
            lower: alphabet,
            upper: alphabet.toUpperCase(),
          };
        }),
        {
          type: CharacterKeyType,
          lower: 1,
          upper: "!",
        },
        {
          type: CharacterKeyType,
          lower: 2,
          upper: "@",
        },
        {
          type: CharacterKeyType,
          lower: 3,
          upper: "#",
        },
        {
          type: CharacterKeyType,
          lower: 4,
          upper: "$",
        },
        {
          type: CharacterKeyType,
          lower: 5,
          upper: "%",
        },
        {
          type: CharacterKeyType,
          lower: 6,
          upper: "^",
        },
        {
          type: CharacterKeyType,
          lower: 7,
          upper: "&",
        },
        {
          type: CharacterKeyType,
          lower: 8,
          upper: "*",
        },
        {
          type: CharacterKeyType,
          lower: 9,
          upper: "(",
        },
        {
          type: CharacterKeyType,
          lower: 0,
          upper: ")",
        },
        {
          type: CharacterKeyType,
          lower: "-",
          upper: "_",
        },
        {
          type: CharacterKeyType,
          lower: "=",
          upper: "+",
        },
        {
          type: CharacterKeyType,
          lower: "[",
          upper: "{",
        },
        {
          type: CharacterKeyType,
          lower: "]",
          upper: "}",
        },
        {
          type: CharacterKeyType,
          lower: "'",
          upper: '"',
        },
        {
          type: CharacterKeyType,
          lower: ";",
          upper: ":",
        },
        {
          type: CharacterKeyType,
          lower: "/",
          upper: "?",
        },
        {
          lower: ".",
          type: CharacterKeyType,
          upper: ">",
        },
        {
          type: CharacterKeyType,
          lower: ",",
          upper: "<",
        },
        {
          type: ActionKeyType,
          text: "space",
          action: () => {
            this.input.insert(" ");
          },
          randomize: true,
        },
        {
          type: ActionKeyType,
          text: "delete",
          action: () => {
            this.input.delete();
          },
          randomize: true,
        },
        {
          type: ActionKeyType,
          text: "enter",
          action: () => {
            this.input.insert("\n");
          },
          randomize: true,
        },
        {
          type: ActionKeyType,
          text: "shift",
          action: (_, keyboard) => {
            keyboard.capitalizeOnce();
          },
          randomize: false,
        },
        {
          type: ActionKeyType,
          text: "caps",
          action: (_, keyboard) => {
            keyboard.switchCaps();
          },
          randomize: false,
        },
      ],
      rows: {
        rowsConfig: [
          {
            items: 10,
          },
          {
            items: 10,
          },
          {
            items: 10,
          },
          {
            items: 10,
          },
          {
            items: 10,
          },
        ],
        keyMap: [],
        randomize: () => {
          const shuffledKeys = this.keys.sort(() => 0.5 - Math.random());
          let itemsDone = 0;
          for (let i = 0; i < this.rows.rowsConfig.length; i++) {
            this.rows.keyMap[i] = shuffledKeys.slice(
              itemsDone,
              itemsDone + this.rows.rowsConfig[i].items
            );
            itemsDone += this.rows.rowsConfig[i].items;
          }
        },
      },
      input: {
        insert: (val) => {
          this.textAreaText += val;
        },
        delete: () => {
          if (this.textAreaText.length !== 0) {
            this.textAreaText = this.textAreaText.substring(
              0,
              this.textAreaText.length - 1
            );
          }
        },
      },
      keyboard: {
        capitalize: false,
        capsLock: false,
        afterKeyPress: null, // Callback, after a key is pressed this callback is called
        startup: () => {
          this.rows.randomize();
        },
        switchCaps: () => {
          this.keyboard.capsLock = !this.keyboard.capsLock;
        },
        capitalizeOnce: () => {
          this.keyboard.capitalize = true;
          this.keyboard.afterKeyPress = () => {
            this.keyboard.capitalize = false;
          };
        },
        keyPress: (key) => {
          console.log("key pressed");
          if (key.type === CharacterKeyType) {
            if (this.isLetter(key.lower)) {
              if (!this.keyboard.capsLock) {
                if (this.keyboard.capitalize) {
                  this.input.insert(key.upper);
                } else {
                  this.input.insert(key.lower);
                }
              } else {
                if (!this.keyboard.capitalize) {
                  this.input.insert(key.upper);
                } else {
                  this.input.insert(key.lower);
                }
              }
            } else {
              if (this.keyboard.capitalize) {
                this.input.insert(key.upper);
              } else {
                this.input.insert(key.lower);
              }
            }
            if (this.keyboard.afterKeyPress !== null) {
              this.keyboard.afterKeyPress();
            }
          } else if (key.type === ActionKeyType) {
            console.log("keyboard");
            console.log(this.keyboard);
            key.action(this.input, this.keyboard);
          }
          if (key.type === CharacterKeyType || key.randomize) {
            this.rows.randomize();
          }
        },
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.key-set {
  display: flex;
}
.key {
  display: flex;
  min-width: 50px;
  min-height: 50px;
  flex-direction: column-reverse;
  background: #dfdfdf;
  margin: 5px;
  cursor: pointer;
}


.virtual-keyboard {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
}

</style>
