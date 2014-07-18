var App = Ember.Application.create({
    rootElement: "#ember"
});

App.Router.map(function(){
    this.resource('users', {path: '/'}, function(){
        this.resource('languages', {path: ':username/'}, function(){
            this.resource('repos', {path: ':language/'});
        });
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

App.LanguageSelect = Ember.Select.extend({
    change: function(){
        var controller = this.get('controller');
        if(!this.get('value')){
            controller.transitionToRoute('languages');
            return;
        }
        controller.transitionToRoute('repos', this.get('value'));
    }
});

App.LanguagesRoute = Ember.Route.extend({
    model: function(params){
        App.Language.languages = [];
        return Ember.RSVP.hash({
            languages: App.Language.find(params.username),
            username: params.username
        });
    },
    setupController: function(controller, model){
        if(model){
            controller.set('model', model.languages);
            this.controllerFor('users').set('current_user', model.username);
        }
    }
});

App.Repo = Ember.Object.extend({
    name: '',
    url: ''
}).reopenClass({
    repos: [],
    find: function(username, language){
        var self = this;
        $.ajax({
            type: 'GET',
            async: false,
            url: 'https://api.github.com/users/' + username + '/repos',
            success: function(response){
                for(var i = 0; i < response.length; i++){
                    var repo = response[i];
                    if (repo.language.toLowerCase() === language){
                        var github_repo = App.Repo.create({name: repo.name, url: repo.html_url});
                        Ember.run(self.repos, self.repos.pushObject, github_repo)
                    }
                }
            }
        });
        return this.repos;
    }
});

App.ReposRoute = Ember.Route.extend({
    model: function(params){
        App.Repo.repos = [];
        var username = this.modelFor('languages').username;
        return Ember.RSVP.hash({
            repos: App.Repo.find(username, params.language.toLowerCase()),
            language: params.language.toLowerCase()
        });
    },
    setupController: function(controller, model){
        if(model){
            controller.set('model', model.repos);
            this.controllerFor('languages').set('current_language', model.language);
        }
    }
});
