requirejs.config({
    baseUrl: "js/",
    paths: {
        jquery: 'lib/jquery.min',
        backbone: 'lib/backbone.min',
        underscore: 'lib/underscore.min',
        fb: 'https://connect.facebook.net/ru_RU/all',
        vk: 'https://vk.com/js/api/openapi',
        text: 'lib/text',
        tpl: '../tpl'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'vk': {
            exports: 'VK'
        },
        'fb': {
            exports: 'FB'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require([
    'backbone',
    'router',
    'models/user',
    'views/user_view'
], function(Backbone, Route, User, UserView){

    var userView = new UserView({ model: User });

    $('#user-info').html(userView.el);

    //Стартуем приложение после загрузки модели пользователя
    User.fetch().done(function(){
        var appRoute = new Route();
        Backbone.history.start();
    });
});