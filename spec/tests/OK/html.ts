import template from '../../output/views/html.top';

process.stdout.write(template({
    text: '<script>alert("pwned")</script>'
}));
