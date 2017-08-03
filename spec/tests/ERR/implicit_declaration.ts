import Message from '../../fixtures/models/Message';
import template from '../../output/views/implicit_declaration.top';

process.stdout.write(template({
    lang: 'Latin',
    motd: new Message('Hello world')
}));
