define([
    'backbone',
    'text!tpl/user.html'
], function(Backbone, Tpl){
    return Backbone.View.extend({
        tpl: _.template(Tpl),

        initialize: function(){

            this.render();

            //Слушаем изменение модели, если что-то изменилось - перерисовываем
            this.listenTo(this.model, 'change', function(){
                this.render();
            });
        },

        events: {
            //Обработчик на кнопку разлогинивания
            'click #logout':'logout'
        },

        logout: function(e){
            e.preventDefault();
            //Розлогиниваем пользователя
            this.model.logout();
        },

        render: function(){
            this.$el.html( this.tpl({ user:this.model.toJSON() }));
        }
    });
});