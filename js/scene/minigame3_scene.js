let minigame3 = function(game, status)
{
    let scene = new Scene();

    game.keybind(87, "w");

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_minigame3"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let bgm = game.assets["bgm_minigame3"];
    bgm.volume = 0.5;
    bgm.play();

    var time = 12;
    var score = 0;
    var tmp = 0;
    var turn = 1;
    var press01 = 0;
    var press02 = 0;

    let guide = new Sprite(1197, 575);
    guide.image = game.assets["guide_minigame3"];
    guide.x = (innerWidth - 1200) / 2;
    guide.y = 40;
    scene.addChild(guide);

    let komainu01 = new Sprite(300, 300);
    komainu01.image = game.assets["komainu01_01_minigame3"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01.scaleX = 1.2;
    komainu01.scaleY = 1.2;
    komainu01.x = 300;
    komainu01.y = innerHeight - 440;

    let komainu02 = new Sprite(300, 300);
    komainu02.image = game.assets["komainu02_01_minigame3"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02.scaleX = -1.2;
    komainu02.scaleY = 1.2;
    komainu02.x = innerWidth - 600;
    komainu02.y = innerHeight - 440;

    let kokeshi = new Sprite(500, 500);
    kokeshi.image = game.assets["kokeshi_minigame3"];
    kokeshi.x = (innerWidth - 500) / 2;
    kokeshi.y = innerHeight - 600;

    let keydown = new Sprite(200, 200);
    keydown.image = game.assets["keydown_minigame3"];
    keydown.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];
    keydown.x = 100;
    keydown.y = 200;

    let mousedown = new Sprite(200, 200);
    mousedown.image = game.assets["mousedown_minigame3"];
    mousedown.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];
    mousedown.x = innerWidth - 300;
    mousedown.y = 200;
    
    let logo = new Label("開始");
    logo.color = "black"
    logo.font = "400px HGP行書体";
    logo.width = 800;
    logo.heigth = 400;
    logo.x = (innerWidth - 800) / 2;
    logo.y = (innerHeight - 400) / 2;

    let ui_time = new Label("TIME：" + time);
    ui_time.font = "160px HGP行書体";
    ui_time.width = 960;
    ui_time.heigth = 200;
    ui_time.x = 160;
    ui_time.y = 0;

    let ui_score = new Label("SCORE：" + score);
    ui_score.font = "160px HGP行書体";
    ui_score.width = 960;
    ui_score.heigth = 200;
    ui_score.x = innerWidth - 900;
    ui_score.y = 0;

    let button = new Sprite(400, 100);
    button.image = game.assets["button_minigame3"];
    button.frame = [0];
    button.x = (window.innerWidth - 400) / 2;
    button.y = innerHeight - 160;
    scene.addChild(button);
    button.on(Event.TOUCH_START, function(e)
    {
        start();
    });

    let text = new Label("始める");
    text.color = "white"
    text.font = "100px HGP行書体";
    text.x = (window.innerWidth - 280) / 2;
    text.y = innerHeight - 160;
    scene.addChild(text);
    text.on(Event.TOUCH_START, function(e)
    {
        start();
    });

    let intro = game.assets["intro_minigame3"];
    intro.volume = 0.75;

    let sound01 = game.assets["sound_minigame3"];
    sound01.volume = 0.75;

    let sound02 = game.assets["sound_minigame3"];
    sound02.volume = 0.75;

    let alert = new Label("お手つき！");
    alert.color = "crimson"
    alert.font = "160px HGP行書体";
    alert.width = 1000;
    alert.x = (window.innerWidth - 750) / 2;
    alert.y = 160;

    function timer()
    {
        scene.on(Event.ENTER_FRAME, function(e)
        {
            if(game.frame % game.fps == 0)
            {
                time += -1;
                if(time > 2)
                {
                    turn = Math.floor(Math.random() * 2) + 1;
                }
                else
                {
                    turn = 3;
                }
            }

            if(time > 0 && time < 11)
            {
                if(time == 10)
                {
                    scene.removeChild(logo);
                    scene.addChild(ui_time);
                    scene.addChild(ui_score);
                }
                
                if(turn == 1 || turn == 3)
                {
                    scene.addChild(keydown);
                }
                else
                {
                    scene.removeChild(keydown);
                    komainu01.frame = [0];
                }
                
                if(turn == 2 || turn == 3)
                {
                    scene.addChild(mousedown);
                }
                else
                {
                    scene.removeChild(mousedown);
                    komainu02.frame = [0];
                }
                
                ui_time.text = "TIME：" + time;
                player01();
                player02();
            }
            else
            {
                if(time == 12)
                {
                    komainu01.image = game.assets["komainu01_01_minigame3"];
                    komainu01.frame = [0];
                    komainu02.image = game.assets["komainu02_01_minigame3"];
                    komainu02.frame = [0];
                    logo.text = "開始";
                    scene.addChild(logo);
                    intro.play();
                }
                if(time == 0)
                {
                    komainu01.frame = [0];
                    komainu02.frame = [0];
                    logo.text = "終了";
                    scene.addChild(logo);
                    scene.removeChild(keydown);
                    scene.removeChild(mousedown);
                    ui_time.text = "TIME：" + time;
                    intro.play();
                    scene.removeChild(alert);
                }
                if(time == -2)
                {
                    end();
                }
            }
        });
    }
    
    function start()
    {
        scene.removeChild(guide);
        scene.removeChild(button);
        scene.removeChild(text);
        scene.addChild(komainu01);
        scene.addChild(komainu02);
        scene.addChild(kokeshi);
        timer();
    }

    function end()
    {
        tmp = Math.floor(score * 1.5);

        if(tmp > 100)
        {
            status.score = 100;
        }
        else
        {
            status.score = tmp;
        }

        bgm.stop();
        
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

    function player01()
    {
        scene.on(Event.TOUCH_START, function(e)
        {
            if(time > 0 && time < 11)
            {
                if(turn == 2 || turn == 3)
                {
                    if(press01 < 1)
                    {
                        press01 = 1;
                        score += 1;
                        ui_score.text = "SCORE：" + score;
                        komainu02.image = game.assets["komainu02_02_minigame3"];
                        komainu02.scaleX = 1.2;
                        komainu02.frame = [0, 1, 2, 1, 0, null];
                        kokeshi.frame = [0, 2, 0, 1, 0, null];
                        sound01.currentTime = 0;
                        sound01.play();
                        scene.removeChild(alert);
                    }
                }
                else
                {
                    if(press01 < 1)
                    {
                        press01 = 1;
                        if(score > 0)
                        {
                            score += -1;
                        }
                        else
                        {
                            score = 0;
                        }
                        ui_score.text = "SCORE：" + score;
                        scene.addChild(alert);
                    }
                }
            }
        });

        scene.on(Event.TOUCH_END, function(e)
        {
            press01 = 0;
        });
    }

    function player02()
    {
        scene.on(Event.ENTER_FRAME, function(e)
        {
            if(game.input.w)
            {
                if(time > 0 && time < 11)
                {
                    if(turn == 1 || turn == 3)
                    {
                        if(press02 < 1)
                        {
                            press02 = 1;
                            score += 1;
                            ui_score.text = "SCORE：" + score;
                            komainu01.image = game.assets["komainu01_02_minigame3"];
                            komainu01.frame = [0, 1, 2, 1, 0, null];
                            kokeshi.frame = [0, 1, 0, 2, 0, null];
                            sound02.currentTime = 0;
                            sound02.play();
                            scene.removeChild(alert);
                        }
                    }
                    else
                    {
                        if(press02 < 1)
                        {
                            press02 = 1;
                            if(score > 0)
                            {
                                score += -1;
                            }
                            else
                            {
                                score = 0;
                            }
                            ui_score.text = "SCORE：" + score;
                            scene.addChild(alert);
                        }
                    }
                }
            }
            else
            {
                press02 = 0;
            }
        });
    }

    return scene;
};
