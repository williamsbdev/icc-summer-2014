function stubHttpRequest(url, json) {
    $.mockjax({
        url: url,
        type: "GET",
        contentType: 'json',
        responseText: json
    });
}

$.mockjaxSettings.logging = false;
$.mockjaxSettings.responseTime = 0;

var setupMocks = function(){
    stubHttpRequest("https://api.github.com/orgs/dsmjs/members", JSON.stringify([
        {login: "mattjmorrison"},
        {login: "toranb"},
    ]));
    stubHttpRequest("https://api.github.com/users/mattjmorrison", JSON.stringify(
        {login: "mattjmorrison", name: "Matthew J Morrison"}
    ));
    stubHttpRequest("https://api.github.com/users/toranb", JSON.stringify(
        {login: "toranb", name: "Toran Billups"}
    ));
    stubHttpRequest("https://api.github.com/users/mattjmorrison/repos", JSON.stringify([
        {language: "JavaScript", name: "matt-javascript-one", html_url: "matt-javascript-one"},
        {language: "Python", name: "matt-python-one", html_url: "matt-python-one"},
        {language: "JavaScript", name: "matt-javascript-two", html_url: "matt-javascript-two"},
        {language: "Shell", name: "matt-shell-one", html_url: "matt-shell-one"},
        {language: "Objective C", name: "matt-objective-c-one", html_url: "matt-objective-c-one"}
    ]));
    stubHttpRequest("https://api.github.com/users/toranb/repos", JSON.stringify([
        {language: "JavaScript", name: "toranb-javascript-one", html_url: "toranb-javascript-one"},
        {language: "TypeScript", name: "toranb-typescript-one", html_url: "toranb-typescript-one"},
        {language: "JavaScript", name: "toranb-javascript-two", html_url: "toranb-javascript-two"},
        {language: "Ruby", name: "toranb-ruby-one", html_url: "toranb-ruby-one"},
        {language: "Java", name: "toranb-java-one", html_url: "toranb-java-one"}
    ]));
};
setupMocks();
