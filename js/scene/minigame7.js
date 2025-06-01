/*----------------ゲームの説明画面--------------------*/
let minigame7 = function (game, status) {
    let scene = new Scene();

    /*bgm*/
    let bgm = game.assets['minigame7_bgm'];
    bgm.volume = 0.5;
    bgm.play();

    let dodon_SE = game.assets['dodon_SE'];

    /*背景のスプライト*/
    var maturi = new Sprite(window.innerWidth, window.innerHeight);
    maturi.image = game.assets['haikei.jpg'];
    scene.addChild(maturi);

    /*ゲーム説明*/
    var guide1 = new Sprite(900, 506);
    guide1.image = game.assets['guide2'];
    guide1.x = 10;
    guide1.y = 100;
    scene.addChild(guide1);
    var guide2 = new Sprite(900, 506);
    guide2.image = game.assets['guide3'];
    guide2.x = 930;
    guide2.y = 100;
    scene.addChild(guide2);

    /*ガイドラベルの設定*/
    var guideLabel = new Label();
    guideLabel.text = "協力して的をたくさん壊そう！";
    guideLabel.color = "white";
    guideLabel.font = "50px HGP行書体";
    guideLabel.width = 1000;
    guideLabel.x = window.innerWidth / 2 - 300;
    guideLabel.y = 20;
    scene.addChild(guideLabel);
    
    /*startラベルの設定*/
    var startLabel = new Label();
    startLabel.text = "始める";
    startLabel.color = "black";
    startLabel.font = "80px HGP行書体";
    startLabel.x = window.innerWidth / 2 - 110;
    startLabel.y = window.innerHeight / 2 + 260;

    /* 吹き出しのスプライト */
    var fuki1 = new Sprite(400, 200);
    fuki1.image = game.assets['fukidashi.png'];
    fuki1.scaleX = 1.2;
    fuki1.scaleY = 1.2;
    fuki1.moveTo(window.innerWidth / 2 - 200, window.innerHeight / 2 + 200);

    scene.addChild(fuki1);
    scene.addChild(startLabel);
    //console.log("開始");

    fuki1.on('touchstart', function () {
        dodon_SE.play();
        game.replaceScene(minigame7_start2(game, status));
    });
    startLabel.on('touchstart', function () {
        dodon_SE.play();
        game.replaceScene(minigame7_start2(game, status));

    });

    return scene;
};

/*-------------------ゲーム開始のロゴ表示---------------------*/
let minigame7_start2 = function(game, status) {
    let scene = new Scene();
    game.frame = 1;

    /*bgm*/
    let bgm = game.assets['minigame7_bgm'];
    bgm.volume = 0.5;
    bgm.play();


    /*開始のラベルの設定*/
    var logoLabel = new Label();
    logoLabel.text = "開始";
    logoLabel.color = "red";
    logoLabel.font = "200px HGP行書体";
    logoLabel.width = 400;
    logoLabel.height = 400;
    logoLabel.x = window.innerWidth / 2 - 200;
    logoLabel.y = window.innerHeight / 2 - 100;

    /*背景のスプライト*/
    var maturi = new Sprite(window.innerWidth, window.innerHeight);
    maturi.image = game.assets['haikei.jpg'];
    scene.addChild(maturi);
    scene.addChild(logoLabel);
    console.log(game.frame);

    scene.onenterframe = function() {
        if(game.frame == 20) {
            game.replaceScene(minigame7_main(game, status));
        }
    }
    
    return scene;
};

/*-----------------ゲームのメイン画面--------------------*/
let minigame7_main = function(game, status) {
    let scene = new Scene();

    /*変数宣言*/
    let bullet_i = 0;
    var mato;
    var target;
    var score = 0;
    var time = 25;
    var time_frame = 0;
    var mato_count = 0;
    var M_freame_count = 0;
    var func_i = 0;
    var mato_i = 0;
    var spriteList = [];

    /*bgm*/
    let bgm = game.assets['minigame7_bgm'];

    /*ラベルの宣言*/
    var ScoreLabel = new Label();
    var TypingLabel = new Label();
    var BulletLabel = new Label();
    var TimerLabel = new Label();

    //タイピングする文字列を格納する配列
    let textbox = [
        'apple',
        'banana',
        'orange',
        'melon',
        'strawberry',
        'avocado',
        'grapefruit',
        'cherry',
        'muscat',
        'peach',
        'watermelon',
        'pomegranate'
    ]

    /*バレットラベルの設定*/
    BulletLabel.color = 'black';
    BulletLabel.font = '40px "HGP行書体';
    BulletLabel.text = "装填数：" + bullet_i;
    BulletLabel.x = window.innerWidth - 250;
    BulletLabel.y = 30;

    /*タイピングラベルの設定*/
    TypingLabel.color = 'black';
    TypingLabel.font = '50px "Arial"';
    TypingLabel.text = "キーを押して下さい";
    TypingLabel.width = 1000;
    TypingLabel.x = window.innerWidth / 2 - 200;
    TypingLabel.y = window.innerHeight / 2 + 100;
    

    /* スコアラベルの設定 */
    ScoreLabel.color = 'red';
    ScoreLabel.font = '60px "HGP行書体"';
    ScoreLabel.text = "Score :" + score;
    ScoreLabel.y = 60;

    /* 時間のラベルの設定 */
    TimerLabel.color = 'White';
    TimerLabel.font = '60px "HGP行書体"';
    TimerLabel.y = 10;
    TimerLabel.text = "Time :" + time;


    /* 配列の要素を削除するメソッド */
    Array.prototype.remove = function (elm) {
        var index = this.indexOf(elm);
        this.splice(index, 1);
        return this;
    }


 /*------------背景---------------*/
    var bg = function (scene) {
        /* 屋台の背景 */
        var maturi = new Sprite(window.innerWidth, window.innerHeight);
        maturi.image = game.assets['haikei.jpg'];
        scene.addChild(maturi);

        /* 吹き出しのスプライト */
        var fuki = new Sprite(400, 200);
        fuki.image = game.assets['fukidashi.png'];
        fuki.scaleX = 5.0;
        fuki.scaleY = 2.6;
        fuki.moveTo(700, window.innerHeight / 2 + 30);
        scene.addChild(fuki);
        var fuki2 = new Sprite(400, 200);
        fuki2.image = game.assets['fukidashi.png'];
        fuki2.scaleX = 0.9;
        fuki2.scaleY = 0.9;
        fuki2.moveTo(window.innerWidth - 350, -50);
        scene.addChild(fuki2);
    }
    bg(scene);

 /*--------的の処理に関するスプライト-----------*/
    var Mato = Class.create(Sprite, {
        initialize: function () {
            this.existance = 1; //敵が存在する
            Sprite.call(this, 100, 100);    //Spriteクラスのメソッドをthisでもつかえるようにする
            this.image = game.assets['mato.png'];
            this.frame = 0;
            this.scaleX = 2;
            this.scaleY = 2;
            var rnd_matoX = Math.random() * (12);
            var rnd_matoY = Math.random() * (3);

            //y座標 0~150, //x座標　0~640
            this.moveTo(230 + rnd_matoX * 100, rnd_matoY * 100);

        },

        onenterframe: function () {
            var mato_f = 0;
            //的の中でクリックしたら
            this.addEventListener('touchstart', Position);

            function Position(ev) {
                if (bullet_i > 0 && func_i == 0) {
                    this.frame = 5;
                    score += 5;
                    bullet_i--;
                    ScoreLabel.text = "Score :" + score;

                    let wareru_SE = game.assets['wareru_SE'];
                    wareru_SE.stop();
                    wareru_SE.play();
                }
                func_i = 1;
                //console.log(this.x, this.y);
            }

            //20fカウントするまで次の弾を打てなくする
            if (func_i == 1) {
                if (M_freame_count == 20) {
                    func_i = 0;
                    M_freame_count = 0;
                }
                M_freame_count++;
            }

            //スプライトの削除
            if (this.frame == 5 || this.age % 100 === 0) {
                if (this.frame == 5) {
                    if (mato_count == 20) {
                        mato_f = 1;
                        this.parentNode.removeChild(this);
                        spriteList.remove(this);
                        mato_count = 0;
                    }
                    mato_count++;
                }
                if (this.age % 100 === 0 && mato_f == 0) {
                    this.parentNode.removeChild(this);
                    spriteList.remove(this);
                }
                mato_f = 0;
            }
        }
    });

 /*------タイピング成功時テキストのスプライト--------*/
    var text_bullet = Class.create(Sprite, {
        initialize: function (text_x) {
            Sprite.call(this, 200, 200);
            this.image = game.assets['text_bull.png'];
            this.frame = 2;
            this.text_x = text_x;
            this.scaleX = 1;
            this.scaleY = 1;
            this.moveTo(window.innerWidth / 2 - 70, window.innerHeight / 2 - 60);
            console.log("text");
        },

        onenterframe: function () {
            if (this.text_x == 0) {
                this.frame = 0;
                if (this.age % 20 === 0) {
                    this.remove(this);
                }
            } else if (this.text_x == 1) {
                this.frame = 1;
                if (this.age % 20 === 0) {
                    this.remove(this);
                }
            }
        }
    });

    //ランダムな変数rndを作成する
    let rnd = Math.floor(Math.random() * textbox.length);
    let text_i = 0; //現在の単語でどこまであっているか判定している文字の番号
    let text_l = textbox[rnd].length;   //文字の長さ
    push_keydown('a');

 /*-------------タイピングに関する処理-------------*/
    function push_keydown(event) {
        console.log("push");

        //押されたボタンを判別
        let keycode = event.key;
        //最初だけ実行
        if (text_l == text_l - text_i) {
            TypingLabel.x = window.innerWidth / 2 - 230 + 80;
            TypingLabel.font = '80px "Arial"';
            TypingLabel.text = textbox[rnd].substring(text_i, text_l); //問題を書き出す
            if (text_l >= 7) {
                text_x = 1;
            } else {
                text_x = 0;
            }
        }

        //キーの判定
        if (textbox[rnd].charAt(text_i) == keycode) { //押したキーがあっていたら

            text_i++; //判定する文字番号を１増やす
            TypingLabel.text = textbox[rnd].substring(text_i, text_l); //残りの文字表示

            let key_SE = game.assets['key_SE'];
            key_SE.stop();
            key_SE.play();
           
            if (text_l - text_i == 0) {//全ての文字を打ったら
                /*成功時のSE*/
                let success_SE = game.assets['success_SE'];
                success_SE.stop();
                success_SE.play(); 
                /*成功時のテキスト*/
                text_Bullet = new text_bullet(text_x);
                scene.addChild(text_Bullet);

                //初期化
                rnd = Math.floor(Math.random() * textbox.length);
                text_i = 0;
                text_l = textbox[rnd].length;

                if (text_l >= 7) {
                    text_x = 1;
                    bullet_i += 3;
                } else {
                    bullet_i++;
                    text_x = 0;
                }

                //弾の数の表示
                BulletLabel.text = "装填数：" + bullet_i;

                //新たな問題を出力
                TypingLabel.x = window.innerWidth / 2 - 230 + 100;
                TypingLabel.text = textbox[rnd].substring(text_i, text_l);
                TypingLabel.x = window.innerWidth / 2 - 230 + 150; //変更・
            }
        } else {
            let miss_SE = game.assets['miss_SE'];
            miss_SE.stop();
            miss_SE.play();
        }
    }

    /* シーン更新事に呼び出す */
    scene.onenterframe = function () {
        /*30f毎に時間を１減らす*/
        time_frame = game.frame;
        if (time_frame % 30 == 0) {
            time--;
        }
        TimerLabel.text = "Time : " + time;

        //30フレーム毎かつ的の数が５以下ならば的を生成
        if (game.frame % 20 === 0 && mato_i == 0) {
            /* 的の作成 */
            mato = new Mato();
            spriteList.push(mato);  //spriteListに的をプッシュ
        }
        /* 的やターゲット（あれば追加）のスプライトを表示 */
        for (var i = 0; i < spriteList.length; i++) {
            scene.addChild(spriteList[i]);
        }

        //何かのキーが押されたらpush_keydown関数が呼ばれる
        window.addEventListener("keydown", push_keydown);
        BulletLabel.text = "装填数：" + bullet_i;

        /* 時間とスコアと弾の表示 */
        scene.addChild(TimerLabel);
        scene.addChild(ScoreLabel);
        scene.addChild(TypingLabel);
        scene.addChild(BulletLabel);

        /*時間が０になったらシーンを切り替える */
        if (time === 0) {
            bgm.stop();
            game.replaceScene(FinishScene(game, status, score));
        }
    }

    return scene;
};

/*-----------------------終了画面----------------------------*/
let FinishScene = function (game, status, score) {
    let scene = new Scene();

    /*SE*/
    var fue_SE = game.assets['fue_SE'];
    fue_SE.play();

    /*背景のスプライト*/
   var maturi = new Sprite(window.innerWidth, window.innerHeight);
   maturi.image = game.assets['haikei.jpg'];
   scene.addChild(maturi);

    var gameFinishLabel = new Label('終了');  //Finishのラベル作成
    gameFinishLabel.color = 'white';            //ラベルの色を変更
    gameFinishLabel.font = "200px 'Russo One', HGP行書体";     //フォントの設定
    gameFinishLabel.moveTo(window.innerWidth - 1200, 150);    //初期位置

    var FinishScoreLabel = new Label();
    FinishScoreLabel.text = "Score :" + score;
    FinishScoreLabel.color = "red";
    FinishScoreLabel.font = "150px 'Russo One', HGP行書体";
    FinishScoreLabel.width = 1000;
    FinishScoreLabel.moveTo(window.innerWidth - 1200, 350);
    scene.addChild(FinishScoreLabel);
    scene.addChild(gameFinishLabel);    //ラベルを表示 

    var time = 1;
    
    scene.on(Event.ENTER_FRAME, function(e)
        {
            if(game.frame % game.fps == 0)
            {
                time += -1;
            }

            if(time < 0)
            {
                if(score > 100)
                {
                    status.score = 100;
                }
                else
                {
                    status.score = score;
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
            }
        });
    return scene;
};
