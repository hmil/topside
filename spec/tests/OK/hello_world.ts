import Message from '../../fixtures/models/Message';
import template from '../../output/views/hello_world.top';

process.stdout.write(template({
    motd: new Message('Hello World!')
}));
