<template>
  <div class="matching-space">
    <div>
      <a href="/" class="button">Back to Home</a>
    </div>
    <div>
      {{ message }}
    </div>
    <div>
      {{ starRating }}
    </div>
    <button v-on:click="moveToFirstLevel()">Restart From Level 1</button>
    <div class="rows">
      <div v-for="(cards, indexRow) in board.rows" :key="cards" class="row">
        <div
          v-for="(card, indexCol) in cards"
          :key="card"
          :class="{
            unhide: cardFlipped(indexRow, indexCol),
            hide: !cardFlipped(indexRow, indexCol),
          }"
          v-on:click="flipCard(indexRow, indexCol)"
        >
          {{ card }}
        </div>
      </div>
      <div>Current Moves - {{ currentMoves }}</div>
      <div>Moves Left - {{ moves - currentMoves }}</div>
      <div>Timer - {{ timerCount }}</div>
    </div>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";

export default {
  name: "card-match-assignment",
  props: {
    msg: String,
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  mounted() {
    this.init();
  },
  methods: {
    cardFlipped(row, col) {
      return (
        this.isArrayInArray(this.flippedCards, [row, col]) ||
        this.correctlyFlippedCards.includes(this.board.rows[row][col])
      );
    },
    isArrayInArray(arr, item) {
      var item_as_string = JSON.stringify(item);

      var contains = arr.some(function (ele) {
        return JSON.stringify(ele) === item_as_string;
      });
      return contains;
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async flipCard(row, col) {
      if (
        this.flippedCards.length === 2 ||
        this.isArrayInArray(this.flippedCards, [row, col])
      ) {
        return;
      }
      this.flippedCards.push([row, col]);
      if (this.flippedCards.length == 2) {
        // Comparing cards
        this.currentMoves += 1;
        let card0 =
          this.board.rows[this.flippedCards[0][0]][this.flippedCards[0][1]];
        let card1 =
          this.board.rows[this.flippedCards[1][0]][this.flippedCards[1][1]];
        if (card0 === card1) {
          this.correctlyFlippedCards.push(card0);
        }
        this.checkStatusBoard();
        console.log("sleeping for 2 seconds");
        if (card0 !== card1) {
          await this.sleep(2000);
        }
        this.flippedCards = [];
      }
    },
    checkStatusBoard() {
      // Checks the current status of the board, if the user has won or lost
      if (this.currentMoves > this.moves - 1) {
        this.restartLevel();
      }
      if (this.correctlyFlippedCards.length === Math.pow(2, this.level)) {
        this.moveToNextLevel();
      }
    },
    async restartLevel() {
      // Restarts the level
      this.message = "You lost restarting the level.";
      await this.sleep(2000);
      this.board.setupBoard();
    },
    async moveToFirstLevel() {
      // Restarts from level 1
      this.message = "Restarting the game.";
      await this.sleep(2000);
      this.level = 1;
      this.board.setupBoard();
    },
    async moveToNextLevel() {
      // Moves to the next level and sets up the board for next level
      this.message = "You cleared this level, moving to next one.";
      let minimumMoves = Math.pow(2, this.level);
      console.log(`Minimum Moves ${minimumMoves}`);
      console.log(`Moves ${this.moves}`);
      console.log(`Current Moves ${this.currentMoves}`);
      let percentScore =
        this.moves / (this.moves + (this.currentMoves - minimumMoves));
      this.percentScore = percentScore;
      this.starRating = "⭐️".repeat(Math.trunc(percentScore * 10));
      await this.sleep(4000);
      this.level += 1;
      this.board.setupBoard();
    },
    getShuffledCards(level) {
      // Returns shuffled set of cards
      const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      const subsetOfCards = alphabets.substring(0, Math.pow(2, level));
      return this.shuffle((subsetOfCards + subsetOfCards).split(""));
    },
    shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    },
    init() {
      this.board.setupBoard();
    },
  },
  watch: {
    timerCount: {
      handler(value) {
        if (this.levelSetup) {
          return;
        }
        if (value > 0) {
          this.timerCountTimeout = setTimeout(() => {
            this.timerCount--;
          }, 1000);
        } else {
          this.restartLevel();
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  },
  data: function () {
    return {
      levelSetup: false,
      timerCount: 15,
      currentMoves: 0,
      timerCountTimeout: null,
      moves: 4,
      percentScore: 0,
      flippedCards: [],
      correctlyFlippedCards: [],
      level: this.cookies.get("level")
        ? parseInt(this.cookies.get("level"))
        : 1,
      message: "",
      board: {
        rows: [],
        setupBoard: () => {
          this.levelSetup = true;
          // Storing the level in cache
          this.cookies.set("level", this.level);
          clearTimeout(this.timerCountTimeout);

          // Reinitializing the board
          this.starRating = "";
          this.message = `Level ${this.level}`;
          this.timerCount = 15 * Math.pow(2, this.level);
          this.correctlyFlippedCards = [];
          this.flippedCards = [];
          this.board.rows = [];
          this.currentMoves = 0;
          this.moves = Math.pow(2, this.level + 2);

          // Setting up the board
          let listOfAllCards = this.getShuffledCards(this.level);
          for (let j = 0; j < Math.pow(2, this.level); j++) {
            this.board.rows.push([]);
          }
          for (let j = 0; j < Math.pow(2, this.level); j++) {
            for (let k = 0; k < 2; k++) {
              this.board.rows[j][k] =
                listOfAllCards[j + Math.pow(2, this.level) * k];
            }
          }
          this.levelSetup = false;
        },
      },
    };
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
