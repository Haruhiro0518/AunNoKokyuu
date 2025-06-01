let minigame1 = function(game, status) {
    let scene = new Scene();

    /*
    const IMG_1 = "IMG_1/notes(32, circle).png";
    const BAR = "IMG_1/widebar.png";
    const TATEBOU = "IMG_1/lane.png";
    const KOMAINU = "IMG_1/komainu01.png";
    const TACCHI = "IMG_1/TouchButton.png";
    const WHITEBOARD = "IMG_1/white.png";
    */

    game.keybind(65, "a");  //キーボードの”a”を登録
    game.keybind(66, "b");
    game.keybind(67, "c");


    var player_x = 0; //プレイヤーのどこのライン上にいるかの情報
    var score = 0;    //ミニゲーム全体のスコア
    var mode = 0;

    const bgm = game.assets['BGM_1'];
    const point = game.assets['POINTUP_1'];

    // 乱数発生用関数
    function rand(num) {
        return Math.floor(Math.random() * num);
    };

    //縦ラインに合わせたx座標を計算して返す関数
    function xculc(lane_x, x)
    {
        return (window.innerWidth / 2) + 200 * (lane_x - 2) + 5 - x/2 ;
    }

    //キーボードの状態を管理するクラス（未完成、未使用）///////////////////////////////////////////////////
    var KEYBOARD = Class.create(Sprite, {
        initialize: function () {
            //使用するキーの状態を変数にして置く
            Sprite.call(this, 1, 1);  //Spriteクラスのメソッドを、thisでも使えるようにする
            this.key_a = 0; //押されているときは1、押されていないときは0
        },

        onenterframe: function () {

        }

    });///////////////////////////////////////////////////////////////////////////

    //ノーツの動き、状態を管理するクラス
    var Notes = Class.create(Sprite, {
    initialize: function (x, notetype) {    //xはノーツが生成される位置、yは生成されるノーツのタイプ

        //ここに初期化のプログラム
        Sprite.call(this, 128, 128);  //Spriteクラスのメソッドを、thisでも使えるようにする
        this.scaleX = 0.5;
        this.scaleY = 0.5;
        
        this.lane_x = x;    //何番目のレーンにいるかを指定
        this.x = xculc(this.lane_x, 128); //実際のx座標
        this.y = 0; //最初のy座標を指定

        switch(notetype)
        {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                this.notetype = 0;
                this.image = game.assets['NOTES_Y'];  //スプライトの画像ファイルを指定
            break;

            case 5:
            case 6:
            case 7:
                this.notetype = 1;
                this.image = game.assets["NOTES_B"];
            break;

            case 8:
            case 9:
                this.notetype = 2;
                this.image = game.assets['NOTES_P'];  
            break;
        }

        var r = rand(3);
        switch(r)
        {
            case 0:
                this.yspeed = 5;
            break;

            case 1:
                this.yspeed = 7;
            break;

            case 2:
                this.yspeed = 8;
            break;
        }
    },

    //毎フレームごとのプログラム
    onenterframe: function () {
        
        this.y += this.yspeed;   //落下処理

        //ノーツが判定ラインを通り越したらノーツを消去
        if (this.y > 600) {
            this.remove();
        }


        //ノーツの点数をスコアに加算する処理
        if (this.y > 600 - 48 && this.lane_x == player_x) {  //判定ラインに接していてプレイヤーとノーツが同じレーンにいるとき
            //console.log("同じレーンにいるよ");
            if (this.notetype == mode) { 
                score += this.notecalc(this.notetype);
                this.remove(this);

                //消える演出のインスタンス化
                var f = new FLASH(this.lane_x); 
                scene.addChild(f);

                point.play();
            }
        }

        },

        //notetypeからノーツの点数へと変換する関数
        notecalc: function (notetype) {
            switch(notetype)
            {
                case 0:
                    return 10;
                case 1:
                    return 30;
                case 2:
                    return 50;
            }
        },

        //ノーツを消去する処理
        remove: function () {
            scene.removeChild(this);
            delete this;
        }
    });



///////////////////////////////////////////////////////////////////////////////////////

    //背景の描画
    const background = new Sprite(1920, 1080);
    background.image = game.assets['BACKGROUND_1'];
    //background.scaleX = 1.2;
    background.x = 0;
    //background.scaleY = 720 / 1080;
    background.y = 0;
    scene.addChild(background);

    //判定ラインの定義、描画
    const widebar = new Sprite(1920, 20);
    widebar.image = game.assets['BAR_1'];
    widebar.x = 0;
    widebar.y = 600;
    widebar.on('enterframe', function(){
        if(game.input.a)
        {
            mode = 0;
            this.image = game.assets['BAR_Y'];
        }
        else if(game.input.b)
        {
            mode = 1;
            this.image = game.assets['BAR_B'];
        }
        else if(game.input.c)
        {
            mode = 2;
            this.image = game.assets['BAR_P'];
        }
        else
        {
            mode = -1;
            this.image = game.assets['BAR_1'];
        }
        console.log(mode);
    })
    scene.addChild(widebar);
    
    var notescreater = null;
    var time1 = null;
    
    //ノーツが流れる縦のレーンとボタンの描画
    const lane = [];
    const button = [];
    for (let i = 0; i < 5; i++) {
        //レーンの描画
        lane[i] = new Sprite(10, 600);
        lane[i].image = game.assets['TATEBOU_1'];
        lane[i].x = (window.innerWidth / 2) + 200 * (i - 2);
        lane[i].y = 0
        scene.addChild(lane[i]);
    
    
        //プレイヤーを移動させるボタンの描画
        button[i] = new Sprite(150, 150);
        button[i].image = game.assets['TACCHI_1'];
        button[i].scaleX = 1.2;
        button[i].scaleY = 1.2;
        button[i].x = xculc(i, 150);
        button[i].y = 700;
        scene.addChild(button[i]);
    
        //各ボタンがクリックされたときの処理
        button[i].on('touchstart', function () { // addEventListenerはonとも書ける
            player_x = i;
            PlayerMove(i);
            //ボタンをプレイヤーとかぶらないように透明にする処理
            button[i].opacity = 0;
            for (let j = 0; j < 5; j++) {
                if (j != i) {
                    button[j].opacity = 1;
                }
            }
        });
    }

    var FLASH = Class.create(Sprite, {
        initialize: function (x) {
            
            Sprite.call(this, 200, 200);  //Spriteクラスのメソッドを、thisでも使えるようにする
            this.image = game.assets['FLASH_ANIM_1'];
            this.framenumber = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
            this.i = 0;
            this.frame = 0
            this.x = xculc(x, 200);
            this.y = 500;
            console.log("instance");
        },

        onenterframe: function () {
            this.i++;

            if(this.i > 15)
            {
                scene.removeChild(this);
                delete this;
            }
            else
                this.frame = this.framenumber[this.i];
        }

    });



    /* 左上の塊 */
    const white = new Sprite(300, 520);
    white.image = game.assets['WHITEBOARD_1'];
    white.x = 0.1;
    white.y = 0.1;
    scene.addChild(white)

    //残り時間の描画
    var time = 20; //残り時間
    var timeLabel = new Label();
    timeLabel.font = "60px 'Arial'";
    timeLabel.text = 'Time: ' + time;
    timeLabel.y = 0;
    scene.addChild(timeLabel);
    
    //スコアの描画
    var scoreLabel = new Label();
    scoreLabel.y = 80;
    scoreLabel.font = "60px 'Arial'";
    scoreLabel.text = 'Score: ' + score;
    scoreLabel.addEventListener('enterframe', function () {
        scoreLabel.text = 'Score: ' + score;
    })
    scene.addChild(scoreLabel);

    const aimage = new Sprite(128, 128);
    aimage.image = game.assets["NOTES_Y"];
    aimage.scaleX = 0.5;
    aimage.scaleY = 0.5;
    aimage.x = -20;
    aimage.y = 200;
    scene.addChild(aimage);

    const aLabel = new Label();
    aLabel.font = "60px 'Arial'";
    aLabel.text = ': 10点';
    aLabel.x = 100;
    aLabel.y = 235;
    scene.addChild(aLabel);
    
    const bimage = new Sprite(128, 128);
    bimage.image = game.assets["NOTES_B"];
    bimage.scaleX = 0.5;
    bimage.scaleY = 0.5;
    bimage.x = -20;
    bimage.y = 300;
    scene.addChild(bimage);

    const bLabel = new Label();
    bLabel.font = "60px 'Arial'";
    bLabel.text = ': 30点';
    bLabel.x = 100;
    bLabel.y = 335;
    scene.addChild(bLabel);

    const cimage = new Sprite(128, 128);
    cimage.image = game.assets["NOTES_P"];
    cimage.scaleX = 0.5;
    cimage.scaleY = 0.5;
    cimage.x = -20;
    cimage.y = 400;
    scene.addChild(cimage);

    const cLabel = new Label();
    cLabel.font = "60px 'Arial'";
    cLabel.text = ': 50点';
    cLabel.x = 100;
    cLabel.y = 435;
    scene.addChild(cLabel);



    /*右上の塊*/
    const white2 = new Sprite(500, 900);
    white2.image = game.assets["WHITEBOARD_1"];
    white2.x = 1419;
    white2.y = 1;
    scene.addChild(white2);

    const keyguide = new Label();
    keyguide.font = "60px 'Arial'";
    keyguide.text = "タイミングよく正しいキーを押せ！";
    keyguide.x = 1419;
    keyguide.width = 380;
    keyguide.y = 100;
    scene.addChild(keyguide);

    const keyguide1 = new Label();
    keyguide1.font = "60px 'Arial'";
    keyguide1.text = "(キーボード）"
    keyguide1.x = 1419;
    keyguide1.width = 500;
    keyguide1.y = 20;
    scene.addChild(keyguide1);

    const key_a = new Sprite(200, 200);
    key_a.image = game.assets["KEY_A_1"];
    key_a.x = 1400;
    key_a.y = 230;
    key_a.scaleX = 0.5;
    key_a.scaleY = 0.5;
    scene.addChild(key_a);

    const key_b = new Sprite(200, 200);
    key_b.image = game.assets["KEY_B_1"];
    key_b.x = 1530;
    key_b.y = 230;
    key_b.scaleX = 0.5;
    key_b.scaleY = 0.5;
    scene.addChild(key_b);

    const key_c = new Sprite(200, 200);
    key_c.image = game.assets["KEY_C_1"];
    key_c.x = 1660;
    key_c.y = 230;
    key_c.scaleX = 0.5;
    key_c.scaleY = 0.5;
    scene.addChild(key_c);

    const mouseguide = new Label();
    mouseguide.font = "60px 'Arial'";
    mouseguide.text = "(マウス）";
    mouseguide.x = 1419;
    mouseguide.y = 450;
    scene.addChild(mouseguide);

    const mouseguide1 = new Label();
    mouseguide1.font = "60px 'Arial'";
    mouseguide1.text = "玉の真下に移動しろ！";
    mouseguide1.x = 1419;
    mouseguide1.width = 370;
    mouseguide1.y = 530;
    scene.addChild(mouseguide1);

    const mouse = new Sprite(200, 200);
    mouse.image = game.assets["MOUSE_1"];
    mouse.x = 1530;
    mouse.y = 630;
    mouse.scaleX = 0.8;
    mouse.scaleY = 0.8;
    scene.addChild(mouse);
    


    
    
    //ゲームを開始するボタンの描画
    var startmessage = new Sprite(1260, 720);
    startmessage.image = game.assets['START_1'];
    startmessage.scaleX = 0.5;
    startmessage.scaleY = 0.5;
    startmessage.x = xculc(2, 1260);
    startmessage.y = 0;
    startmessage.on('touchstart', function (e) {
        delete (this);
        scene.removeChild(this);

        bgm.play();
    
        notescreater = setInterval(CreateNotes, 600);
        time1 = setInterval(Countdown, 1000);
    });
    scene.addChild(startmessage);
/*
    const startLabel = new Label();
    startLabel.y = 300;
    startLabel.x = 800;
    startLabel.width = 480;
    startLabel.font = "60px 'Arial'";
    startLabel.text = 'クリックしてスタート'
    scene.addChild(startLabel);
*/
    
    //プレイヤーの描画
    var player = new Sprite(500, 500);
    player.image = game.assets['KOMAINU_ANIM_1'];
    player.frame = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1];
    player.scaleX = 0.5;
    player.scaleY = 0.5;
    PlayerMove(0);  //プレイヤーを初期位置（左端）に移動
    player.y = 525;
    scene.addChild(player);
    
    button[0].opacity = 0;  //プレイヤーのスタート位置にあるボタンを透明にする
    
    
    var key = new KEYBOARD();//////////////////////////////////////
    scene.addChild(key);
    
    
    //毎フレーム呼び出される処理
    scene.on('enterframe', function () {
    
        //制限時間が０になった時の処理
        if (time == 0) {
            //ゲームの結果を表示する
            /*
            
                var result = new Sprite(400, 300);
            result.image = game.assets['WHITEBOARD_1'];
            result.x = 640 - 200;
            result.y = 150;
            this.addChild(result);
    
            var resultLabel = new Label();
            resultLabel.font = "72px 'Arial'";
            resultLabel.text = 'Score: ' + score;
            resultLabel.x = 500;
            resultLabel.y = 270;
            this.addChild(resultLabel);
            */

            bgm.stop();
            
            
            if(score > 500)
            score = 500;
            score = score / 5;
            status.score = score;
            

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
                break
            }
            
        }
    
    })
    
    //クリックされた時に呼び出される処理
    scene.on('touchstart', function (ev) {
        //クリックされた位置によってプレイヤーを動かす
    })
    
    //プレイヤーをクリックした位置に動かす関数
    function PlayerMove(ex) {
        player.x = xculc(ex, 500);
        console.log(player.x);
        console.log(lane[0].x);
    }
    
    
    //ノーツを生成する関数
    var CreateNotes = () => {
        //ノーツのインスタンス化(Class)
        var n = new Notes(rand(4), rand(10));    //第一引数はノーツの位置、第二引数はノーツのタイプ
        scene.addChild(n);
    
        if (time <= 4)  //制限時間が０になるまでノーツがすべて完全に降ってくる必要があるから０にしない。
            clearInterval(notescreater);
    }
    
    
    //制限時間のカウントダウンを行う関数
    var Countdown = () => {
        time--;
        timeLabel.text = 'Time: ' + time;
    
        if (time <= 0) {
            time = 0;
            timeLabel.text = 'Time: ' + time;
            clearInterval(time1);
        }
    }

    return scene;
}