var App = Ember.Application.create({
    rootElement: "#ember"
});

App.JqueryCode = Ember.Component.create({
    initJqueryCode: function(){
        var loadUsers = function(){
            $.ajax({
                type: 'GET',
                async: false,
                url: 'https://api.github.com/orgs/dsmjs/members',
                success: function(response){
                    for(var i = 0; i < response.length; i++){
                        getUser(response[i]);
                    }
                }
            });
        };

        var getUser = function(user){
            $.ajax({
                type: 'GET',
                async: true,
                url: 'https://api.github.com/users/' + user.login,
                success: function(response){
                    var opt = $('<option></option>').attr("value", user.login).text(response.name);
                    $('#users').append(opt);
                }
            });
        };

        var usersClickHandler = function(){
            $('#languages').children('option:not(:first)').remove();
            if(!this.value){
                $('#languages-section').hide();
                return;
            }
            $('#languages-section').show();
            $.ajax({
                type: 'GET',
                async: false,
                url: 'https://api.github.com/users/' + this.value + '/repos',
                success: function(response){
                    var repos = {};
                    for(var i = 0; i < response.length; i++){
                        var repo = response[i];
                        if(repo.language){
                            repos[repo.language.toLowerCase()] = repo.language;
                        }
                    }
                    for(var key in repos){
                        var opt = $('<option></option>').attr("value", key).text(repos[key]);
                        $('#languages').append(opt);
                    }
                }
            });
        };
        $(document).on('change', "#users", usersClickHandler)

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
        loadUsers();
    }
});

App.JqueryCode.initJqueryCode();
