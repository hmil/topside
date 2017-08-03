import Message from '../../fixtures/models/Message';
import template from '../../output/views/page2.top';

process.stdout.write(template({
    lang: 'French',
    motd: new Message('A l\'ouest rien de nouveau')
}));
