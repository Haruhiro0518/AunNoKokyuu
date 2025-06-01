let attack2p = function(game, status)
{
    let scene = new Scene();

    var time = 5;

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_attack2p"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let bgm = game.assets["bgm_attack2p"];
    bgm.volume = 0.5;
    bgm.currentTime = 10;
    bgm.play();

    let komainu01_01 = new Sprite(300, 300);
    komainu01_01.image = game.assets["komainu01_01_attack2p"];
    komainu01_01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01_01.x = 100;
    komainu01_01.y = ((innerHeight - 300) / 2) - 100;
    scene.addChild(komainu01_01);

    let komainu01_02 = new Sprite(500, 300);
    komainu01_02.image = game.assets["komainu01_02_attack2p"];
    komainu01_02.x = 150;
    komainu01_02.y = ((innerHeight - 300) / 2) - 100;

    let komainu02_01 = new Sprite(300, 300);
    komainu02_01.image = game.assets["komainu02_01_attack2p"];
    komainu02_01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02_01.x = 0;
    komainu02_01.y = ((innerHeight - 300) / 2);
    scene.addChild(komainu02_01);

    let komainu02_02 = new Sprite(500, 300);
    komainu02_02.image = game.assets["komainu02_02_attack2p"];
    komainu02_02.x = 50;
    komainu02_02.y = ((innerHeight - 300) / 2);

    let nekomata01 = new Sprite(300, 300);
    if(status.ehp > status.border)
    {
        nekomata01.image = game.assets["nekomata01_01_attack2p"];
    }
    else
    {
        nekomata01.image = game.assets["nekomata02_attack2p"];
    }
    nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
    nekomata01.x = innerWidth - 350;
    nekomata01.y = ((innerHeight - 300) / 2) - 50;
    scene.addChild(nekomata01);

    let effect01 = new Sprite(400, 400);
    effect01.image = game.assets["effect01_attack2p"];
    effect01.x = innerWidth - 450;
    effect01.y = ((innerHeight - 400) / 2) - 50;

    let effect02 = new Sprite(400, 400);
    effect02.image = game.assets["effect02_attack2p"];
    effect02.x = innerWidth - 450;
    effect02.y = ((innerHeight - 400) / 2) + 50;

    let textbox = new Sprite(400, 100);
    textbox.image = game.assets["textbox_attack2p"];
    textbox.scaleX = window.innerWidth / 400;
    textbox.scaleY = 1.6;
    textbox.x = (window.innerWidth - 400) / 2;
    textbox.y = innerHeight - 160;
    scene.addChild(textbox);

    let message = new Label("シシとコマの神速！");
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

    let attack01 = game.assets["attack01_attack2p"];
    attack01.volume = 0.75;

    let attack02 = game.assets["attack02_attack2p"];
    attack02.volume = 0.75;

    var loop01 = 1;
    var loop02 = 1;

    if(status.charge > 0)
    {
        status.charge = 0;
    }
    else
    {
        status.ppow = 1;
    }

    var damage = Math.floor(status.score * ((Math.random() + 0.5)* 2) * status.ppow)

    status.ehp += -damage;
    if(status.ehp < 0)
    {
        status.ehp = 0;
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
                    case 4:
                        scene.removeChild(komainu01_01);
                        scene.removeChild(komainu02_01);
                        scene.addChild(komainu01_02);
                        komainu01_02.frame = [0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null];
                        scene.addChild(komainu02_02);
                        komainu02_02.frame = [0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null];
                        if(loop01 > 0)
                        {
                            attack01.play();
                            loop01 = 0;
                        }
                        break;
                    case 3:
                        nekomata01.image = game.assets["nekomata01_02_attack2p"];
                        nekomata01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, null];
                        scene.addChild(effect01);
                        effect01.frame = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
                        scene.addChild(effect02);
                        effect02.frame = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
                        attack02.currentTime = 0;
                        attack02.play();
                        break;
                    case 2:
                        attack02.stop();
                        scene.removeChild(effect01);
                        scene.removeChild(effect02);
                        scene.addChild(komainu01_02);
                        komainu01_02.frame = [5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null];
                        scene.addChild(komainu02_02);
                        komainu02_02.frame = [5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null];
                        if(status.ehp > status.border)
                        {
                            nekomata01.image = game.assets["nekomata01_01_attack2p"];
                        }
                        else
                        {
                            nekomata01.image = game.assets["nekomata02_attack2p"];
                        }
                        nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
                        if(loop02 > 0)
                        {
                            attack01.play();
                            loop02 = 0;
                        }
                        break;
                    case 1:
                        hp02.text = "HP:" + status.ehp;
                        scene.removeChild(komainu01_02);
                        scene.removeChild(komainu02_02);
                        scene.addChild(komainu01_01);
                        scene.addChild(komainu02_01);
                        message.text = ("ミケに" + damage + "ダメージ！");
                        break;
                }
            }
        });
    }

    return scene;
};