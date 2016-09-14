define([
    'baseRouter',
    'views/login_view',
    'models/user'
], function(BaseRouter, LoginView, User){
    return BaseRouter.extend({

        initialize: function(){
            //Модель пользователя
            this.model = User;
            //Слушаем изменение свойства auth, модели пользователя и релоадим роут
            this.listenTo(this.model, 'change:auth', function(){
                Backbone.history.loadUrl();
            });
        },

        routes: {
            ""      : "index",
            "#"     : "index",
            "secure": "secure",
            "login" : "login",
            "logout": "logoute"
        },

        //Страници к которым нужна авторизация
        secure_pages: [
            '#secure'
        ],


        before : function(params, next){

            //Текущий роут
            var path = Backbone.history.location.hash;
            //Нужна ли авторизация для доступа к данному роуту?
            var needAuth = _.contains(this.secure_pages, path);

            if(path == '#login' && User.isAuth()){
                this.navigate("/",  true);
            }else if(!User.isAuth() && needAuth){
                this.navigate("login",  true);
            } else {
                next();
            }
        },

        index: function(){
            $('#main').html('Index page');
        },

        secure: function(){
            $('#main').html('Secure page');
        },

        login: function(){
            $('#main').html( new LoginView().el );
        },

        logoute: function(){
            this.navigate("/",  true);
            this.model.logout();
        }
    });
});