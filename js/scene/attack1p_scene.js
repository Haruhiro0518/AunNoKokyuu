let attack1p = function(game, status)
{
    let scene = new Scene();

    var time = 3;

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_attack1p"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let bgm = game.assets["bgm_attack1p"];
    bgm.volume = 0.5;
    bgm.currentTime = 10;
    bgm.play();

    let komainu01 = new Sprite(300, 300);
    komainu01.image = game.assets["komainu01_attack1p"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01.x = 100;
    komainu01.y = ((innerHeight - 300) / 2) - 100;
    scene.addChild(komainu01);

    let komainu02 = new Sprite(300, 300);
    komainu02.image = game.assets["komainu02_attack1p"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02.x = 0;
    komainu02.y = ((innerHeight - 300) / 2);
    scene.addChild(komainu02);

    let nekomata01 = new Sprite(300, 300);
    if(status.ehp > status.border)
    {
        nekomata01.image = game.assets["nekomata01_01_attack1p"];
    }
    else
    {
        nekomata01.image = game.assets["nekomata02_attack1p"];
    }
    nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
    nekomata01.x = innerWidth - 350;
    nekomata01.y = ((innerHeight - 300) / 2) - 50;
    scene.addChild(nekomata01);

    let effect = new Sprite(500, 500);
    effect.image = game.assets["effect_attack1p"];
    effect.x = innerWidth - 500;
    effect.y = 0;

    let textbox = new Sprite(400, 100);
    textbox.image = game.assets["textbox_attack1p"];
    textbox.scaleX = window.innerWidth / 400;
    textbox.scaleY = 1.6;
    textbox.x = (window.innerWidth - 400) / 2;
    textbox.y = innerHeight - 160;
    scene.addChild(textbox);

    let message = new Label("シシとコマの御手！");
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

    let attack = game.assets["attack_attack1p"];
    attack.volume = 0.75;
    
    if(status.charge > 0)
    {
        status.charge = 0;
    }
    else
    {
        status.ppow = 1;
    }

    var damage = Math.floor(status.score * 1.5 * status.ppow)

    status.ehp += -damage;
    if(status.ehp < 0)
    {
        status.ehp = 0;
    }

    var loop = 1;
    
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
                if(status.ehp > 0)
                {
                    if(status.ehp > status.border)
                    {
                        if(status.count > 0)
                        {
                            status.count += -1;
                            game.replaceScene(attack1e(game, status));
                        }
                        else
                        {
                            status.count = 2;
                            game.replaceScene(attack2e(game, status));
                        }
                    }
                    else
                    {
                        if(status.check > 0)
                        {
                            game.replaceScene(half(game, status));
                        }
                        else
                        {
                            if(status.count > 0)
                            {
                                status.count += -1;
                                game.replaceScene(attack1e(game, status));
                            }
                            else
                            {
                                status.count = 1;
                                game.replaceScene(attack2e(game, status));
                            }
                        }
                    }
                }
                else
                {
                    game.replaceScene(outro(game, status));
                }
            }
            else
            {
                switch(time)
                {
                    case 2:
                        nekomata01.image = game.assets["nekomata01_02_attack1p"];
                        nekomata01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, null];
                        scene.addChild(effect);
                        effect.frame = [0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, null];
                        if(loop > 0)
                        {
                            attack.play();
                            loop = 0;
                        }
                        break;
                    case 1:
                        hp02.text = "HP:" + status.ehp;
                        if(status.ehp > status.border)
                        {
                            nekomata01.image = game.assets["nekomata01_01_attack1p"];
                        }
                        else
                        {
                            nekomata01.image = game.assets["nekomata02_attack1p"];
                        }
                        scene.removeChild(effect);
                        nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
                        message.text = ("ミケに" + damage + "ダメージ！")
                        break;
                }
            }
        });
    }

    return scene;
};