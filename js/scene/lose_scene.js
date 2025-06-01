let lose = function(game, status)
{
    let scene = new Scene();

    scene.backgroundColor = "black"

    let sound = game.assets["sound_lose"];
    sound.volume = 0.75;
    sound.play();

    let logo = new Label("敗北");
    logo.color = "white"
    logo.font = "400px HGP行書体";
    logo.width = 800;
    logo.heigth = 400;
    logo.x = (innerWidth - 800) / 2;
    logo.y = (innerHeight - 400) / 2;
    scene.addChild(logo);
    
    let button = new Sprite(400, 100);
    button.image = game.assets["button_lose"];
    button.frame = [1];
    button.x = (innerWidth - 400) / 2;
    button.y = innerHeight - 160;
    scene.addChild(button);
    button.on(Event.TOUCH_START, function(e)
    {
        sound.stop();
        game.replaceScene(intro(game, status));
    });

    let text = new Label("リベンジ");
    text.color = "white"
    text.font = "80px HGP行書体";
    text.width = 600;
    text.x = (innerWidth - 340) / 2;
    text.y = innerHeight - 150;
    scene.addChild(text);
    text.on(Event.TOUCH_START, function(e)
    {
        sound.stop();
        game.replaceScene(intro(game, status));
    });

    return scene;
};