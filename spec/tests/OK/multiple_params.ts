import template from '../../output/views/multiple_params.top';

process.stdout.write(template({
    text: 'John',
    second: 'Cena'
}));
