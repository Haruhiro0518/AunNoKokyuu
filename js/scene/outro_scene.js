let outro = function(game, status)
{
    let scene = new Scene();

    var time = 1;

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_outro"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let sound = game.assets["sound_outro"];
    sound.volume = 0.75;
    sound.play();

    let komainu01 = new Sprite(300, 300);
    komainu01.image = game.assets["komainu01_outro"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01.x = 100;
    komainu01.y = ((innerHeight - 300) / 2) - 100;
    scene.addChild(komainu01);

    let komainu02 = new Sprite(300, 300);
    komainu02.image = game.assets["komainu02_outro"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02.x = 0;
    komainu02.y = ((innerHeight - 300) / 2);
    scene.addChild(komainu02);

    let nekomata01 = new Sprite(300, 300);
    nekomata01.image = game.assets["nekomata01_outro"];
    nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
    nekomata01.x = innerWidth - 350;
    nekomata01.y = ((innerHeight - 300) / 2) - 50;
    scene.addChild(nekomata01);

    let logo = new Label("決着");
    logo.color = "black"
    logo.font = "400px HGP行書体";
    logo.width = 800;
    logo.heigth = 400;
    logo.x = (innerWidth - 800) / 2;
    logo.y = (innerHeight - 400) / 2;
    scene.addChild(logo);
    
    timer();

    function timer()
    {
        scene.on(Event.ENTER_FRAME, function(e)
        {
            if(game.frame % game.fps == 0)
            {
                time += -1;
            }

            if(time == 0)
            {
                nekomata01.image = game.assets["nekomata02_outro"];
                nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2];
            }
            
            if(time < 0)
            {
                game.replaceScene(win(game, status));
            }
        });
    }

    return scene;
};