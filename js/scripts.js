function Card(number, color, effect){
  this.number = number,
  this.color = color,
  this.effect = effect
}

Card.prototype.getName = function(){
  var color = ["red", "yellow", "green", "blue"];
  if (this.effect) {
    if (this.effect === "wild" || this.effect === "drawFour") {
      return this.effect;
    }
    return color[this.color] + " " + this.effect;
  }
  return color[this.color] + " " + this.number;
}

function Player(id) {
  this.hand = [];
  this.id = id;
}

Player.prototype.draw = function(game, count) {
  count = (count ? count : 1);
  for (var i = 0; i<count; i++){
    this.hand.push(game.deckArray.pop());
  }
}

Player.prototype.play = function(cardid, game) {
  var card = this.hand[cardid];
  if (card.effect){
    game.affect(card.effect, this)
  }

  Game.prototype.affect = function(effect, player){
    if (player.id === 0){
      if (effect === "wild") {
        return true;
      } else if (effect === "drawFour") {
        return true;
      } else if (effect === "skip" || effect === "reverse"){
        return true;
      } else {

      }
    }

  }
  game.boardState = this.hand.splice(cardid, 1)[0];
}

function Game(player){
  this.deckArray = [];
  
  var effects = {
    10: "skip",
    11: "reverse",
    12: "drawTwo",
  }
  for (var set = 0; set <=1; set ++) {
    for (var color = 0; color < 4; color++) {
      for (i = 0; i < 14; i ++) {
        if (set === 0 || i !== 0) {
          var effect = effects[i]
          if (i === 13) {
            if (set === 0){
              effect = "wild"
            } else {
              effect = "drawFour"
            }
          }
          this.deckArray.push(new Card(i, color, effect))
        }
      }
    }
  }
  this.players = [];
  for (var j=0; j<=player; j++){
    this.players.push(new Player(j))
  }
}


Game.prototype.shuffle = function() {
  var output = [];

  while (this.deckArray.length > 0) {
    var randIndex = Math.floor(Math.random() * this.deckArray.length);
    var card = this.deckArray.splice(randIndex, 1);
    output.push(card[0]);
  }
  this.deckArray = output;
}

Game.prototype.deal = function(){
  var deck = this.deckArray
  this.players.forEach(function(player){
    for(var l = 0; l < 7; l++){
      player.hand.push(deck.pop());
    }
  });
  this.boardState = deck.pop();
  this.deckArray = deck;
}

Game.prototype.validCard = function(card){
  var board = this.boardState;
  if (card.effect) {
    if (card.effect === "wild" || card.effect === "drawFour") {
      return card.effect;
    }
    if (card.color === board.color) {
      return card.effect;
    }
  }
  if (card.color === board.color || card.number === board.number) {
    return true;
  }
  return false;
}

var updatePlayerHand = function(player, game) {
  $("#player").empty();
  var generateCard = function(id) {
    var card = player.hand[id];
    $("#player").append('<li id ="card-' + id + '">' + card.getName() + '</li>');
    $("#card-" + id).click(function() {
      if (game.validCard(card)){
        player.play(id, game);
        updatePlayerHand(player, game);
        $("#board").text(game.boardState.getName());
      }
    });
  }
  for (var i = 0; i < player.hand.length; i++) {
    generateCard(i);
  }
}

$(document).ready(function(){
  var game = new Game(1);
  game.shuffle();
  game.deal();
  updatePlayerHand(game.players[0], game)
  $("#board").text(game.boardState.getName());

  $("#player-draw").click(function(){
    game.players[0].draw(game);
    updatePlayerHand(game.players[0], game);
  });

  console.log(game);
});
