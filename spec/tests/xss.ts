import template from '../output/views/text.top';

process.stdout.write(template({
    text: '<script>alert("pwned")</script>'
}));
