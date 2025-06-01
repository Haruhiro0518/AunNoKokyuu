let attack2e = function(game, status)
{
    let scene = new Scene();

    var time = 3;

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_attack2e"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let bgm = game.assets["bgm_attack2e"];
    bgm.volume = 0.5;
    bgm.currentTime = status.pause;
    bgm.play();

    let komainu01 = new Sprite(300, 300);
    komainu01.image = game.assets["komainu01_01_attack2e"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01.x = 100;
    komainu01.y = ((innerHeight - 300) / 2) - 100;
    scene.addChild(komainu01);

    let komainu02 = new Sprite(300, 300);
    komainu02.image = game.assets["komainu02_01_attack2e"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02.x = 0;
    komainu02.y = ((innerHeight - 300) / 2);
    scene.addChild(komainu02);

    let nekomata01 = new Sprite(300, 300);
    if(status.ehp > status.border)
    {
        nekomata01.image = game.assets["nekomata01_attack2e"];
    }
    else
    {
        nekomata01.image = game.assets["nekomata02_attack2e"];
    }
    nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
    nekomata01.x = innerWidth - 350;
    nekomata01.y = ((innerHeight - 300) / 2) - 50;
    scene.addChild(nekomata01);

    let effect = new Sprite(900, 300);
    effect.image = game.assets["effect_attack2e"];
    effect.frame = [7, 7, 7, 7, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 6, 7, 7, 7, 7, null];
    effect.scaleX = (innerWidth / 900);
    effect.x = 0;
    effect.y = ((innerHeight - 300) / 2) - 60;


    let textbox = new Sprite(400, 100);
    textbox.image = game.assets["textbox_attack2e"];
    textbox.scaleX = window.innerWidth / 400;
    textbox.scaleY = 1.6;
    textbox.x = (window.innerWidth - 400) / 2;
    textbox.y = innerHeight - 160;
    scene.addChild(textbox);

    let message = new Label("ミケのキャッツアイ！");
    message.color = "black";
    message.font = "100px HGP行書体";
    message.width = 1280;
    message.x = 100;
    message.y = innerHeight - 160;
    scene.addChild(message);

    let hpbox01 = new Sprite(400, 100);
    hpbox01.image = game.assets["button_command"];
    hpbox01.frame = [1];
    hpbox01.x = 0;
    hpbox01.y = 0;
    scene.addChild(hpbox01);
    
    let hp01 = new Label("HP:" + status.php);
    hp01.color = "white"
    hp01.font = "100px HGP行書体";
    hp01.width = 400;
    hp01.x = 0;
    hp01.y = 0;
    scene.addChild(hp01);
    
    let hpbox02 = new Sprite(400, 100);
    hpbox02.image = game.assets["button_command"];
    hpbox02.frame = [1];
    hpbox02.x = innerWidth - 400;
    hpbox02.y = 0;
    scene.addChild(hpbox02);

    let hp02 = new Label("HP:" + status.ehp);
    hp02.color = "white"
    hp02.font = "100px HGP行書体";
    hp02.width = 400;
    hp02.x = innerWidth - 400;
    hp02.y = 0;
    scene.addChild(hp02);

    let attack = game.assets["attack_attack2e"];
    attack.volume = 0.75;
    
    var damage = Math.floor(((Math.random() * 40) + 160) * status.epow);

    status.php += -damage;
    if(status.php < 0)
    {
        status.php = 0;
    }

    timer();

    function timer()
    {
        scene.on(Event.ENTER_FRAME, function(e)
        {
            if(game.frame % game.fps == 0)
            {
                time += -1;
            }

            if(time < 0)
            {
                status.pause = bgm.currentTime;
                bgm.stop();
                if(status.php > 0)
                {
                    game.replaceScene(mode(game, status));
                }
                else
                {
                    game.replaceScene(lose(game, status));
                }
            }
            else
            {
                switch(time)
                {
                    case 2:
                        scene.addChild(effect); 
                        nekomata01.image = game.assets["nekomata03_attack2e"];
                        nekomata01.frame = [0, 1, 2, 3, 4, 4, 5, 5, 4, 4, 5, 5, 4, 4, 5, 5, 4, 4, 5, 5, 4, 4, 5, 5, 4, 4, 3, 2, 1, 0, null];
                        komainu01.image = game.assets["komainu01_02_attack2e"];
                        komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, null];
                        komainu02.image = game.assets["komainu02_02_attack2e"];
                        komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, null];
                        attack.play();
                        break;
                    case 1:
                        hp01.text = "HP:" + status.php;
                        scene.removeChild(effect);
                        if(status.ehp > 500)
                        {
                            nekomata01.image = game.assets["nekomata01_attack2e"];
                        }
                        else
                        {
                            nekomata01.image = game.assets["nekomata02_attack2e"];
                        }
                        nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
                        komainu01.image = game.assets["komainu01_01_attack2e"];
                        komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
                        komainu02.image = game.assets["komainu02_01_attack2e"];
                        komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
                        attack.stop();
                        message.text = ("シシとコマに" + damage + "ダメージ！");
                        break;
                }
            }
        });
    }

    return scene;
};
