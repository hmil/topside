import template from '../fixtures/templates/html.top';

process.stdout.write(template({
    text: '<script>alert("pwned")</script>'
}));
