import Message from '../fixtures/models/Message';
import template from '../fixtures/templates/hello_world.top';

process.stdout.write(template({
    motd: new Message('Hello World!')
}));