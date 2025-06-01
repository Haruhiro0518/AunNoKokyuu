let minigame4 = function(game,status) {
  let scene = new Scene();
 // let HP = mini4_HP;

var count = 0;
const TogeNum = 10;
const TogeSpan = 1500;
const TogeSpeedMin = 12;
const TogeSpeedMax = 20;
var isFinish = false

let score = 0;

      //game.rootScene.backgroundColor = '#00FF00'; // 背景色を緑色に設定
		 

     /* game.preload('img_m4/komainu_walk.png');
      game.preload('img_m4/komainu_jump.png');
      game.preload('img_m4/komainu_finish.png');
      game.preload('img_m4/Explosion_Animation.png');
      game.preload('img_m4/sougen.png');
      game.preload('img_m4/togetoge.png');
      game.preload('img_m4/jump.mp3');
      game.preload('img_m4/bgm.mp3');
      game.preload('img_m4/omedetou.mp3');
      game.preload('img_m4/guide_A.png');
      game.preload('img_m4/guide_D.png');
      game.preload('img_m4/guide_MouseClick.png');
      */

        var BackGround = new Sprite(3333,2500)
        BackGround.image = game.assets["sougen"]
        BackGround.x = 0
        BackGround.y = -1350
       scene.addChild(BackGround);	

        
        var guideA = new Sprite(200,200)
        guideA.image = game.assets["guideA"]
       scene.addChild(guideA);	
        guideA.frame = [1,1,2,2,3,3,4,4,5,5]
        guideA.x = 650
        guideA.y = 0
        var guideD = new Sprite(200,200)
        guideD.image = game.assets["guideD"]
        scene.addChild(guideD);
        guideD.frame = [1,1,2,2,3,3,4,4]
        guideD.x = 950
        guideD.y = 0	
        var guideMouse = new Sprite(200,200)
        guideMouse.image = game.assets["guideM"]
       scene.addChild(guideMouse);
        guideMouse.frame = [1,1,2,2,3,3,4,4,5,5]
        guideMouse.x = 1400
        guideMouse.y = 0	
        

        var JumpSound = game.assets['jumpSabo']
        var BGM = game.assets['bgm']
        BGM.volume = 0.35;
        BGM.play();
        var omedetou = game.assets['omedotou']

       // BgmSound.volume = 0.
      // setTimeout(bgm, 300); //後に関数を実行
        
        var label = new Label("Hello, Enchant.js");
        label.x = 100;
        label.y = 100;
        label.width = 600;
        label.color = "black";
        label.font = "90px 'fantasy'";
    
       scene.addChild(label);
    
        game.onenterframe = function() {
          // テキストを更新する例
          label.text = "Score: " + score;
         
        };

     
        
			  var character = new Sprite(300, 300);
			  character.image = game.assets['koma1'];
         character.frame = [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3]
        character.x = 150;
			character.y = 420;
      

var Toge = enchant.Class.create({
  initialize: function(x, y) {
    this.sprite = new Sprite(275, 320);
    this.sprite.x = x;
    this.once = false
    var min = 1 ;
    var max = 2 ;
    this.MaxSpeed = 25
    this.MinSpeed = 15
    this.sprite.scaleX/= 2;
    this.sprite.scaleY/= 2;
    this.sprite.rotation =  -90
    this.sprite.image = game.assets['toge'];
    this.sprite.addEventListener('enterframe', this.update.bind(this));
    //this.sprite.frame = [1,1,2,2,3,3,4,4]

    var a = Math.floor( Math.random() * (max + 1 - min) ) + min ;
    if(a ==1){
      this.sprite.y = y;
    }else{
      this.sprite.y = y - 250;
    }
    this.speed = Math.floor( Math.random() * (this.MaxSpeed + 1 - this.MinSpeed) ) + this.MinSpeed ;

  },

  intersect(otherObject) {
    // 当たり判定の処理を実装する
    // 例: thisとotherObjectが重なっているか判定する処理
    return (this.sprite.x < otherObject.x + otherObject.width/2 &&
            this.sprite.x + this.sprite.width/2 > otherObject.x &&
            this.sprite.y < otherObject.y + otherObject.height/2 &&
            this.sprite.y + this.sprite.height/2 > otherObject.y);
  },

 //左移動関数
  moveLeft: function(speed) {
    this.sprite.x -= speed;
  },

//マイフレーム呼び出される
  update: function() {
    // フレームごとの処理を実行
    this.moveLeft(this.speed)
    if(this.intersect(character)){

      /*
      if(this.once == false){
        var ex = new ExplosionClass(this.sprite.x,this.sprite.y)
       scene.addChild(ex.sprite)
        //game.rootScene.addChild(ex.sprite);
        this.once = true
      }
      */

       scene.removeChild(this.sprite);
    }
    if(this.sprite.x < -100){
       score += 1;
      scene.removeChild(this.sprite);
    }
    // ここに任意の処理を追加
  },

  
},);



var ExplosionClass = enchant.Class.create({
  initialize: function(x, y) {
    this.sprite = new Sprite(1138,1646)
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.scaleX/= 2;
    this.sprite.scaleY/= 2;
    this.sec = 1;
    this.sprite.image = game.assets["Explo"]
    this.sprite.frame = [1,1,2,2,3,3,4,4,5,5,6,6,7,7]
    
   function delayedExecution() {
    // 数秒後に実行される処理を記述
   scene.removeChild(this.sprite)
  }
  setTimeout(delayedExecution, 500); //後に関数を実行

  }
},);


      const TogeGenerate = () =>{
         // Togeクラスのインスタンス化(Class)
         var toge = new Toge(1700,400);
        scene.addChild(toge.sprite);
         count++
      }
      
      //最初にトゲの生成
      TogeGenerate();


      //この部分は本番で使用する

let sec = 20;
const url = new URL(window.location.href);

function countdown() {
    if(sec > 0){
        sec = sec - 1;
    } else{

    
    //  character.image = game.assets['img_m4/komainu_finish.png'];
     // character.frame = [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5]
      //window.location.href = `komainu_attack02.html?score=${score*10}&php=${url.searchParams.get('php')}&ehp=${url.searchParams.get('ehp')}`;
    }

}
//countdown();
//setInterval(countdown, 1000);

function delayedExecution() {
  // 数秒後に実行される処理を記述
  score *= 10;
  status.score = score;
  BGM.stop();
  switch(status.type)
  {
      case 1:
        game.replaceScene(attack1p(game,status));
        break;
      case 2:
        game.replaceScene(attack2p(game,status));
        break;
      case 3:
        game.replaceScene(attack3p(game,status));
        break;
  }
//  window.location.href = `komainu_attack02.html?score=${score*10}&php=${url.searchParams.get('php')}&ehp=${url.searchParams.get('ehp')}`;
}


function fn(){
  isFinish = true
  BGM.stop()
  omedetou.play()
  //BGM.stop()
    setTimeout(delayedExecution, 4500); //後に関数を実行
      }

      var tm = 3000;
const intervalId = setInterval(() =>{
  TogeGenerate();
  if(count >= TogeNum){
    clearInterval(intervalId);//intervalIdをclearIntervalで指定している
    setTimeout(fn,tm);//一定時間後にmainのシーンへ戻る
  }}, TogeSpan);    

	
			var speed = 24; // 移動速度
			var jumpPower = -40; // ジャンプの強さ
			var gravity = 20; // 重力
	
			var isJumping = false; // ジャンプ中かどうかのフラグ
			var jumpCount = 0; // ジャンプ回数
      const LimitLeftX = -150
      const LimitRightX = 1500
      let isBGM = false
      
			scene.addChild(character);	

      

      game.keybind(65, "a");  //aキーをenchant.jsに登録
      game.keybind(68, "d");  //dキーをenchant.jsに登録

			scene.addEventListener('enterframe', function() {

        if(isFinish){
          character.image = game.assets['koma3'];
          character.frame = [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5]
        }
        if(character.x < LimitLeftX){
          character.x = LimitLeftX
        }else if(character.x > LimitRightX){
          character.x = LimitRightX
        }

        //移動処理
			 if (game.input.a) {

        /*if(!isBGM){
          isBGM = true
          BGM.play()
        }*/

        if(!isFinish){  
          character.x -= speed;
          character.scaleX = -1
        }
			  } else if (game.input.d) {

          if(!isBGM){
            isBGM = true
            //BGM.play()
          }

        if(!isFinish){
          character.x += speed;
          character.scaleX = 1
        }
			  }
      

       // ジャンプ
      scene.addEventListener("touchstart", function(e){
        if(isFinish) return
        if(!isJumping){
          JumpSound.volume = 0.3
          JumpSound.play()
          // Bgm.play()
        }
          isJumping = true;
        });
				
				// 重力処理
				if (isJumping) {
					if(jumpCount < 20){
					//character.y -= 1; // 当たり判定用に一時的に下へ移動
					character.y += jumpPower;
					jumpCount++;
          //jumpモーションに
          character.image = game.assets['koma2'];
          character.frame = [0,0,0,0,1,1,1,1,2,2,2,2,1,1,1,1]
      
					}
			}
			
			// 地面に着地したらジャンプ関連の変数をリセット
				if(isJumping){
					character.y += gravity;
				}
			  if (character.y >= 420) {
				character.y = 420;
				isJumping = false;
        if(jumpCount > 0){
          //walkモーションに戻す
          character.image = game.assets['koma1'];
          character.frame = [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3]
        }
				jumpCount = 0;

			  }
			});
      return scene;
		}