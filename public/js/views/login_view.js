define([
    'backbone',
    'text!tpl/login.html',
    'vk',
    'fb',
    'models/user'
], function(Backbone, Tpl, VK, FB, User){
   return Backbone.View.extend({

       initialize: function () {

           this.model = User;

           //VK init
           VK.init( { apiId: 5059083 } , '5.53');

           //FB init
           FB.init({appId: '215489712124849', cookie: true, oauth: true}, function(res){
               console.log(res);
           });

           this.render();
       },

       events: {
           'click #fb_login' : 'fb_login',
           'click #vk_login' : 'vk_login'
       },

       fb_login: function(e){
           e.preventDefault();

           var self = this;

           FB.login(function(res) {
               if (res.status === 'connected') {
                   $.ajax({
                       url: '/auth/facebook',
                       method: 'POST',
                       data: { accessToken: res.authResponse.accessToken },
                       dataType: 'JSON',
                       success: function(){
                           self.login();
                       }
                   });
               }
           }, { scope: 'public_profile,email'} );
       },

       vk_login: function(e){
           e.preventDefault();

           var self = this;

           VK.Auth.login(function(res){
               if (res.status === 'connected') {

                   var data = {};
                   data = res.session;

                   var user = {};
                   user = res.session.user;

                   VK.Api.call('users.get', { fields: 'sex,photo_50' }, function(res) {
                       if(res.response){
                           user.photo = res.response[0].photo_50;
                           user.gender = res.response[0].sex;

                           data.user = user;

                           $.ajax({
                               url: '/auth/vk',
                               method: 'POST',
                               data: data,
                               dataType: 'JSON',
                               success: function(){
                                   self.login();
                               }
                           });
                       }
                   });
               }
           }, 4194304 );
       },

       login: function(){
            Backbone.history.navigate('/', { trigger : true });
            this.model.fetch();
       },

       render: function(){
           this.$el.html(Tpl);
       }
   });
});