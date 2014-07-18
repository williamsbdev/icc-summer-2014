var App = Ember.Application.create({
    rootElement: "#ember"
});

App.Router.map(function(){
    this.resource('users', {path: '/'}, function(){
        this.resource('languages', {path: ':username/'})
    });
});

App.UsersRoute = Ember.Route.extend({
    model: function(){
        return App.User.loadUsers();
    }
});

App.UsersController = Ember.ArrayController.extend({});

App.UserSelect = Ember.Select.extend({
    change: function(){
        var controller = this.get('controller');
        if(!this.get('value')){
            controller.transitionToRoute('users');
            return;
        }
        controller.transitionToRoute('languages', this.get('value'));
    }
});

App.User = Ember.Object.extend({
    username: '',
    name: ''
}).reopenClass({
    users: [],
    loadUsers: function(){
        var self = this;
        $.ajax({
            type: 'GET',
            async: false,
            url: 'https://api.github.com/orgs/dsmjs/members',
            success: function(response){
                for(var i = 0; i < response.length; i++){
                    self.getUser(response[i]);
                }
            }
        });
        return this.users;
    },
    getUser: function(user){
        var self = this;
        $.ajax({
            type: 'GET',
            async: false,
            url: 'https://api.github.com/users/' + user.login,
            success: function(response){
                var githubUser = App.User.create({username: user.login, name: response.name});
                Ember.run(self.users, self.users.pushObject, githubUser)
            }
        });
    }
});

App.Language = Ember.Object.extend({
    name: '',
    value: ''
}).reopenClass({
    languages: [],
    find: function(username){
        var self = this;
        $.ajax({
            type: 'GET',
            async: false,
            url: 'https://api.github.com/users/' + username + '/repos',
            success: function(response){
                var repos = {};
                for(var i = 0; i < response.length; i++){
                    var repo = response[i];
                    if(repo.language){
                        var language = App.Language.create({
                            name: repo.language,
                            value: repo.language.toLowerCase()
                        });
                        repos[repo.language] = language
                    }
                }
                for(var key in repos){
                    Ember.run(self.languages, self.languages.pushObject, repos[key])
                }
            }
        });
        return this.languages;
    }
});

App.LanguageSelect = Ember.Select.extend({});

App.LanguagesRoute = Ember.Route.extend({
    model: function(params){
        App.Language.languages = [];
        return App.Language.find(params.username);
    }
});

App.JqueryCode = Ember.Component.create({
    initJqueryCode: function(){
        var languagesClickHandler = function(){
            $('#repos').children().remove()
            if(!this.value){
                $('#repos-section').hide();
                return;
            }
            $('#repos-section').show();
            var self = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: 'https://api.github.com/users/' + $('#users').val() + '/repos',
                success: function(response){
                    for(var i = 0; i < response.length; i++){
                        var repo = response[i];
                        if (repo.language.toLowerCase() === self.value){
                            var element = '<a href="' + repo.html_url + '"></a>'
                            var link = $(element).text(repo.name);
                            $('#repos').append(link);
                            $('#repos').append('<br />');
                        }
                    }
                }
            });
        };
        $(document).on('change', "#languages", languagesClickHandler)
    }
});

App.JqueryCode.initJqueryCode();
