import template from '../fixtures/templates/text.top';

process.stdout.write(template({
    text: '<script>alert("pwned")</script>'
}));
