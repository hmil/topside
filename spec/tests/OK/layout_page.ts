import Message from '../../fixtures/models/Message';
import template from '../../output/views/page.top';

process.stdout.write(template({
    lang: 'Latin',
    motd: new Message('A l\'ouest rien de nouveau')
}));
