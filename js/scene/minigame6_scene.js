let minigame6 = function(game, status) {
    let scene = new Scene();
    let playerHP = status.php;
    game.fps = 60;
    let endtime = 100;
    status.score = 0;

    game.keybind(87, "w"); 
    let bgm = game.assets['m6BGM'];
    //let nice = game.assets['sound_m6/nice.mp3'];
    function niceSE() { //.cloneで複製すると音を重ねられる. 2行を関数にした. 
        var nice = game.assets['niceSE'].clone();
        nice.play();
    }
    function missSE() {
        var miss = game.assets['missSE'].clone();
        miss.play();
    }
    bgm.play();

    let state = 0;          //入力した結果に対する状態を表す ex)1pが成功したら状態1
    let timeSuccess = 8;    //成功したときに動く時間
    let timeMiss = 30/2;      //失敗時ペナルティ時間
    let speed = (200)/8;       //落ちる速度
    let timeImg = 0;        //成功した時に時間を制御する
    // let status.score = 0;      
    let GameEndif = 0;      //ゲーム終了判定
    let timeLimit = 10;     //タイムリミット
    let timeCount = 0;      //タイムカウント
    let timeLeft = timeLimit;//残り時間
    //ランダムな初期値を生成
    let rand = new Array(4);
    var min = 0;
    var max = 1;
    for(let i = 0; i < 4; i++) {
        rand[i] = Math.floor( Math.random() * (max + 1 - min) ) + min;
    }

    //背景
    var bg = new Sprite(1600, 1080);
    bg.scaleX *= 1.3;
    bg.image = game.assets['imgForest'];
    scene.addChild(bg);

    //毛虫クラス
    var Caterpillar = enchant.Class.create(enchant.Sprite, {
        initialize: function(x, y, LRflag){
            enchant.Sprite.call(this, 350, 350);

            this.image = game.assets['imgCaterpillar'];
            this.scaleX /= 3;
            this.scaleY /= 3;
            this.x = x;
            this.y = y;
            this.LRflag = LRflag;
        },
        
        onenterframe: function() {
            if(this.LRflag == 0) {
                this.x = 715 - 90;//L
            } else if (this.LRflag == 1) {
                this.x = 715 + 160;//R
            }
        }

    });
    var caterpillar0 = new Caterpillar(715, -10, rand[0]);
    scene.addChild(caterpillar0)
    console.log(caterpillar0.LRflag);
    var caterpillar1 = new Caterpillar(715, 110, rand[1]);
    scene.addChild(caterpillar1);
    var caterpillar2 = new Caterpillar(715, 230, rand[2]);
    scene.addChild(caterpillar2);
    var caterpillar3 = new Caterpillar(715, 350, rand[3]);
    scene.addChild(caterpillar3);
    
    //こまいぬクラス
    var Komainu = enchant.Class.create(enchant.Sprite, {
        initialize: function(x, y){
            enchant.Sprite.call(this, 300, 300);

            this.image = game.assets['timber10gif'];
            this.x = x;
            this.y = y;
            
        },
    });
    var Koma1 = new Komainu(480, 540);
    scene.addChild(Koma1);
    var Koma2 = new Komainu(1100, 540);
    Koma2.image = game.assets['timber20gif'];
    scene.addChild(Koma2);

    //木に関するクラス
    var Wood = enchant.Class.create(enchant.Sprite, {
        initialize: function(x, y){
            enchant.Sprite.call(this, 350, 600);

            this.image = game.assets['imgWoodStump'];
            this.x = x;
            this.y = y;
        },

    });
    var woodStump = new Wood(750, 300);
    scene.addChild(woodStump);
    var woodTrunk = new Wood(750, 180);
    woodTrunk.image = game.assets['imgWoodTrunk'];
    woodTrunk.scaleY *= 1.65;
    scene.addChild(woodTrunk);
    
    
    var label = new Label("Hello, Enchant.js");
        label.x = 1200;
        label.y = 100;
        label.color = "black";
        label.font = "80px HGP行書体";
        scene.addChild(label);
    var countdown = new Label("Hello, Enchant.js");
        countdown.x = 300;
        countdown.y = 100;
        countdown.color = "black";
        countdown.font = "80px HGP行書体";
        scene.addChild(countdown);
    let time = 10;
    let timecount = 0;    
   
    //draw
    scene.addEventListener('enterframe', function() { 
        label.text = (status.score)+"[間]"; //[間]けん: 1.8182[m]
        if(time > 0) timecount++;
        
        if(timecount == 60) {
            time--;
            timecount = 0;
        }
        countdown.text = "時間："+(time);

        //状態ごとの場合分け
    switch (state) {
        case 0:                                     //通常状態
            Koma1.image = game.assets['timber10gif'];
            Koma1.frame = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23];
            Koma2.image = game.assets['timber20gif'];
            Koma2.frame = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23];
            break;
        case 1:                                     //1pミス
            timeImg++;                          //1frame毎にtimeImgをインクリメント
            if(timeImg <= timeMiss) {           //timeMissの値(frame)の間描画
                Koma1.image = game.assets['timber12gif'];      //モーション再生
                Koma1.frame = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11];
            } else if(timeImg > timeMiss) {     //timeMissの値より大きくなったとき
                state = 0;                      //stateを0にし通常状態に戻る
                timeImg = 0;                    //timeImgの値リセット
            }
            break;
        case 2:                                     //1p成功
            timeImg++;
            if(timeImg <= timeSuccess) {        //timeSuccessの値(frame)の間描画
                catMove();                      //毛虫が落ちる
                Koma1.image = game.assets['timber11gif'];
                Koma1.frame = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11];
                woodTrunk.y += speed;        //木が落ちる
            } else if(timeImg > timeSuccess) {
                state = 0;
                timeImg = 0;
            }
            break;
        case 3:                                     //2p成功
            timeImg++;
            if(timeImg <= timeSuccess) {
                catMove();
                Koma2.image = game.assets['timber21gif'];
                Koma2.frame = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11];
                woodTrunk.y += speed;
            } else if(timeImg > timeSuccess) {
                state = 0;
                timeImg = 0;
            }
            break;
        case 4:                                     //2pミス
            timeImg++;
            if(timeImg <= timeMiss) {
                Koma2.image = game.assets['timber22gif'];
                Koma2.frame = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11];
            } else if(timeImg > timeMiss) {
                state = 0;
                timeImg = 0;
            }
            break;
    }


        //keyPress
        if(game.input.w) {
            if(time > 0) {
                console.log('key_w');
                if((state == 0) && caterpillar3.LRflag == 0) {  //state0のとき 1p ミス state=1
                    missSE();
                    state = 1;
                } else if((state == 0) && caterpillar3.LRflag == 1){   //state0のとき 1p 成功 state=2
                    niceSE();
                    state = 2;
                    status.score += 2;    //成功したときstatus.scoreインクリメント
                    woodTrunk.y -= 200;
                    catSet();
                }       
            }
            
        }

        if(time == 0) {
            countdown.text = "時間：終了";
            time = 0;
            endtime--;
            bgm.volume = 0.5;
            console.log(time);
            if(endtime == 0) {
                if(status.score > 100) {
                    status.socre = 100;
                }
                console.log(endtime);
                game.fps = 30;
                bgm.stop();
                if(status.type == 1) game.replaceScene(attack1p(game, status));
                else if(status.type == 2) game.replaceScene(attack2p(game, status));
                else if(status.type == 3) game.replaceScene(attack3p(game, status));
                return scene;
            }
        }
    });
    
    //touch
    scene.addEventListener('touchstart', function() {
        if(time > 0) {
            if((state == 0) && caterpillar3.LRflag == 0) {      //state0のとき 2p 成功　state=3
                niceSE();
                state = 3;
                status.score += 2;    
                woodTrunk.y -= 200;
                catSet();
            } else if((state == 0) && caterpillar3.LRflag == 1) {   //state0のとき 2p ミス state=4
                missSE();
                state = 4;
            }
        }
        
    });

    function catSet() {
        caterpillar3.y = caterpillar2.y;
        caterpillar3.LRflag = caterpillar2.LRflag;
    
        caterpillar2.y = caterpillar1.y;
        caterpillar2.LRflag = caterpillar1.LRflag;
    
        caterpillar1.y = caterpillar0.y;
        caterpillar1.LRflag = caterpillar0.LRflag;
    
        caterpillar0.y = -400;
        caterpillar0.LRflag = Math.floor( Math.random() * (1 + 1 - 0) ) + 0;
    }

        //上に移動した毛虫を落とす
    function catMove() {
        caterpillar0.y += speed;
        caterpillar1.y += speed;
        caterpillar2.y += speed;
        caterpillar3.y += speed;
    }

    
    let guideKeyW = new Sprite(200,200);
    guideKeyW.image = game.assets['imgKeyW'];
    guideKeyW.x = 50;
    guideKeyW.y = 750;
    scene.addChild(guideKeyW);

    let guideMouseL = new Sprite(200,200);
    guideMouseL.image = game.assets['imgMouseL'];
    guideMouseL.x = 1500;
    guideMouseL.y = 750;
    scene.addChild(guideMouseL);
    
    
    return scene;
    };