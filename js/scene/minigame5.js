let minigame5 = function(game, status) {
  let scene = new Scene();

let kitchen
let Osara
let isAPressed
let TamagoBGM
let kansei
let gravity = 20
const limitY = 1500
let LandSound
let guwa
let isGameOver = false
let score = 0
let komaWalk
let komaFinish
let komaWalk2
let komaFinish2

LandSound = game.assets['LandSound']
TamagoBGM = game.assets['TamagoBGM']
kansei = game.assets['kansei']
Fall = game.assets['Fall']
komaWalk = game.assets['Tamagokoma1']
komaFinish = game.assets['Tamagokoma3']
komaWalk2 = game.assets['Tamagokoma4']
komaFinish2 = game.assets['Tamagokoma5']

TamagoBGM.volume = 0.5;
TamagoBGM.play();

  var FallingEgg = enchant.Class.create({
    initialize: function(x, y) {
      this.sprite = new Sprite(1200,1100);
      this.sprite.scaleX /= 10;
      this.sprite.scaleY /= 10;
      this.sprite.x = x;
      this.x = x
      this.sprite.y = y;
      this.sprite.image = game.assets['TamagoFall'];
      this.sprite.addEventListener('enterframe', this.update.bind(this));
      this.once = false
      this.isLanding = false
      this.LandPos = 0
      Fall.play()
  },
  update: function() {
    if(this.sprite.y < limitY){
      if(!this.isLanding){
        this.sprite.y += gravity
      }
    }else{
      scene.removeChild(this.sprite);
    }

    if(this.isLanding){
      this.sprite.image = game.assets['TamagoLand']
      this.sprite.x = saraX + this.LandPos +200
      this.sprite.y = saraY+50
      this.sprite.scaleY = 0.2;
      this.sprite.scaleX = 0.2;
    }
      if(this.sprite.x < Osara.x-200 && this.sprite.x > Osara.x-450 && this.sprite.y < Osara.y-100 && this.sprite.y > Osara.y-400){  
        this.isLanding = true
        if(!this.once){
          score++
          this.LandPos = this.sprite.x - saraX
          LandSound.play()
          this.sprite.image = game.assets['TamagoLand']
          this.sprite.height /= 4
          this.sprite.width /= 1.5
          this.sprite.x = saraX + this.LandPos +200
          this.sprite.y = saraY+50
          this.once = true
        }
      }
      if(this.intersect(stage1.sprite)){
        guwa = game.assets['guwa']
        scene.removeChild(this.sprite);
        guwa.play()
      }
      if(this.intersect(stage2.sprite)){
        guwa = game.assets['guwa']
        scene.removeChild(this.sprite);
        guwa.play()
      }
  },
  intersect(otherObject) {
    if(!this.isLanding){
      // 当たり判定の処理を実装する
      // 例: thisとotherObjectが重なっているか判定する処理
      return (this.sprite.x < otherObject.x &&
        this.sprite.x > otherObject.x - 200 &&
        this.sprite.y < otherObject.y -100&&
        this.sprite.y > otherObject.y - 200)
      } 
      }
})


    var MoveStage = enchant.Class.create({
      initialize: function(x, y) {
        this.sprite = new Sprite(1000, 660);
        this.sprite.x = x;
        this.sprite.y = y;
        this.MaxSpeed = 25
        this.MinSpeed = 15
        this.sprite.scaleX/= 3;
        this.sprite.scaleY/= 3;
        this.sprite.image = game.assets['huraipan'];
        this.sprite.addEventListener('enterframe', this.update.bind(this));
        this.speed = Math.floor( Math.random() * (this.MaxSpeed + 1 - this.MinSpeed) ) + this.MinSpeed ;
        this.nowSpeed = -this.speed
        this.rotSpeed = 1
      },
    
     //左移動関数
      move: function(nowSpeed) {
        this.sprite.x += nowSpeed;
      },
    
    //マイフレーム呼び出される
      update: function() {
        this.move(this.nowSpeed)
        this.sprite.rotation += this.rotSpeed
        if(this.sprite.rotation > 15) {
          this.sprite.rotation = 15
          this.rotSpeed = -1
        }
        if(this.sprite.rotation < -15) {
          this.sprite.rotation = -15
          this.rotSpeed = 1
        }
        if(this.sprite.x > 1100){
          this.speed = Math.floor( Math.random() * (this.MaxSpeed + 1 - this.MinSpeed) ) + this.MinSpeed ;
        this.nowSpeed = -this.speed
        }
        if(this.sprite.x < -500){
          this.speed = Math.floor( Math.random() * (this.MaxSpeed + 1 - this.MinSpeed) ) + this.MinSpeed ;
         this.nowSpeed = this.speed
        }
        // ここに任意の処理を追加
      },   
    },);

    game.keybind(65, "a");  //aキーをenchant.jsに登録
    game.keybind(68, "d");  //dキーをenchant.jsに登録

    kitchen = new Sprite(2000,1280)
    kitchen.image = game.assets["TamagoKitchen"]
    kitchen.x = 0
    kitchen.y = -300
    scene.addChild(kitchen);	
    
    var TamagoPosX = 0
    var TamagoPosY = 0

    var guideA = new Sprite(200,200)
    guideA.image = game.assets["TamagoguideA"]
   scene.addChild(guideA);	
    guideA.frame = [1,1,2,2,3,3,4,4,5,5]
    guideA.x = 1100
    guideA.y = 0
    guideA.scaleX /= 1.5
    guideA.scaleY /= 1.5
    var guideMouse = new Sprite(200,200)
    guideMouse.image = game.assets["TamagoguideM"]
   scene.addChild(guideMouse);
    guideMouse.frame = [1,1,2,2,3,3,4,4,5,5]
    guideMouse.x = 1300
    guideMouse.y = 0
    guideMouse.scaleX /= 1.5
    guideMouse.scaleY /= 1.5	
    
    var Tamago = new Sprite(260,200)
    Tamago.image = game.assets["TamagoIdle"]
    Tamago.scaleX /= 2
    Tamago.scaleY /= 2
    Tamago.x = TamagoPosX
    Tamago.y = TamagoPosY
    scene.addChild(Tamago)
    
    let saraX = 200
    let saraY = 600
    let saraSpeed = 10
    
    Osara = new Sprite(500,500)
    Osara.image = game.assets["TamagoSara"]
    Osara.x = saraX
    Osara.y = saraY
    Osara.scaleY /= 1.5
    Osara.scaleX /= 1.5
    scene.addChild(Osara);	

    var stage1 = new MoveStage(1700,150);
    scene.addChild(stage1.sprite);
    
    var stage2 = new MoveStage(-800,0);
    stage2.sprite.scaleX *= -1
    scene.addChild(stage2.sprite);

   var koma1 = new Sprite(300,300)
    koma1.image = komaWalk
    koma1.x = stage1.sprite.x
    koma1.y = stage1.sprite.y
    koma1.scaleX = 0.5
    koma1.scaleY = 0.5
    scene.addChild(koma1);	

   var koma2 = new Sprite(300,300)
   koma2.image = komaWalk2
   koma2.x = stage2.sprite.x
   koma2.y = stage2.sprite.y
   koma2.scaleX = 0.5
   koma2.scaleY = 0.5
   scene.addChild(koma2);	

    var label = new Label("Hello, Enchant.js");
    label.x = 50;
    label.y = 50;
    label.color = "black";
    label.font = "75px 'fantasy'";
    scene.addChild(label);

game.onenterframe = function() {
  // テキストを更新する例
  if(score > 10){
    score = 10
  }
  label.text = "Score: " + score;
  time.text = "Time: " + Times;
};

var time = new Label("Hello, Enchant.js");
    time.x = 50;
    time.y = 150;
    time.color = "black";
    time.font = "75px 'fantasy'";
    scene.addChild(time);


 setTimeout(delayedExecution, 20000); //後に関数を実行

 var Times = 20
 setTimeout(countdown, 1000); //後に関数を実行

 function countdown(){
  Times--
  if(Times < 0){
    Times = 0
  }
  setTimeout(countdown, 1000); //後に関数を実行
 }

function delayedExecution(){
  isGameOver = true
  TamagoBGM.stop()
  kansei.play()
  koma1.image = komaFinish
  koma2.image = komaFinish2
  setTimeout(move, 2000); //後に関数を実行
}

scene.addEventListener('enterframe', function() {

  saraX += saraSpeed;
  Osara.x = saraX

  koma1.x = stage1.sprite.x + 300
  koma1.y = stage1.sprite.y + 100
  koma1.rotation = stage1.sprite.rotation

  koma2.x = stage2.sprite.x + 400
  koma2.y = stage2.sprite.y + 100
  koma2.rotation = stage2.sprite.rotation

  if(saraX > 1600){
    saraSpeed = -10;
  }
  else if(saraX < -100){
    saraSpeed = 10;
  }

  Tamago.x = TamagoPosX
  Tamago.y = TamagoPosY

  if(isAPressed){
    Tamago.sprite = game.assets['TamagoCluck']
  }else{
    Tamago.sprite = game.assets['TamagoIdle']
  }

  console.log(5)

  if(isGameOver) return


  if (game.input.a) {
    if(!isAPressed){
    isAPressed = true
    Tamago.image = game.assets['TamagoCluck']
    Tamago.width *= 1.3
    var fallTamago = new FallingEgg(TamagoPosX-460,TamagoPosY-400)
    scene.addChild(fallTamago.sprite);
    setTimeout(() => {
      ResetEgg()
    }, 1300); // 2秒後に実行
  }
}

}) 

var onceBGM = false 

scene.addEventListener(enchant.Event.TOUCH_MOVE, function (e) {
  if(!onceBGM){
    /*TamagoBGM.volume = 0.5
    TamagoBGM.play()
    onceBGM = true*/
  }
  // ドラッグしてスプライトを移動
  TamagoPosX = e.x - Tamago.width / 2;
  TamagoPosY = e.y - Tamago.height / 2;
  if(TamagoPosX > 1600){
    TamagoPosX = 1600
  }
  if(TamagoPosX < -50){
    TamagoPosX = -50
  }
  if(TamagoPosY > 100){
    TamagoPosY = 100
  }
  if(TamagoPosY < -100){
    TamagoPosY = -100
  }
});

function ResetEgg(){
  isAPressed = false
  Tamago.image = game.assets['TamagoIdle']
  Tamago.width /= 1.3
}

function move(){
  game.fps = 30;
  
  if(score * 10 > 100)
  {
    status.score = 100;
  }
  else
  {
    status.score = score * 10;
  }

  switch(status.type)
  {
    case 1:
      game.replaceScene(attack1p(game, status));
      break;
    case 2:
      game.replaceScene(attack2p(game, status));
      break;
    case 3:
      game.replaceScene(attack3p(game, status));
      break;
  }
  return scene;
}
return scene;
};