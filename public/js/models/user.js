define([
    'backbone'
], function(Backbone){
    var User = Backbone.Model.extend({
        url: '/auth/getUser',

        initialize: function(){
            console.log('user model was loaded');

            this.on('change', function(){
               if(this.has('login')){
                   this.set('auth', true);
               }
            });
        },

        defaults: {
            auth: false
        },

        isAuth: function(){
            return this.get('auth');
        },

        logout: function(){
            this.clear();
            $.post( "/auth/logout" );
        }
    });

    return new User();
});