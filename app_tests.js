module('testing our application', {
    setup: function(){
        App.setupForTesting();
        App.injectTestHelpers();
    }
});

test('test that users are populated on page load', function(){
    var options = find('#users option');
    equal(options.length, 3);
    equal(find("#users").val(), '');
    equal(options[0].text, 'Select One');
    equal(options[1].text, 'Matthew J Morrison');
    equal(options[2].text, 'Toran Billups');
});

test('test that languages are populated when user selected', function(){
    find('#users').val('mattjmorrison').change();
    equal(find('#users').val(), 'mattjmorrison');
    andThen(function(){
        var options = find('#languages option');
        equal(options.length, 5);
        equal(options[0].text, 'Select One');
        equal(options[1].text, 'JavaScript');
        equal(options[2].text, 'Python');
        equal(options[3].text, 'Shell');
        equal(options[4].text, 'Objective C');
    });
});

test('test that languages are populated when user selected', function(){
    find('#users').val('mattjmorrison').change();
    equal(find('#users').val(), 'mattjmorrison');
    andThen(function(){
        find('#languages').val('javascript').change();
        equal(find('#languages').val(), 'javascript');
    });
    andThen(function(){
        var options = find('#repos a')
        equal(options.length, 2);
        equal(options[0].text, 'matt-javascript-one');
        equal(options[1].text, 'matt-javascript-two');
    });
});
