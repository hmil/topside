import template from '../../output/views/for.top';

process.stdout.write(template({
    names: [
        'Al Bean',
        'Al Shepard',
        'Buzz Aldrin',
        'Charlie Duke',
        'Dave Scott',
        'Ed Mitchell',
        'Gene Cernan',
        'Jack Schmitt',
        'James Irwin',
        'John Watts Young',
        'Neil Armstrong',
        'Pete Conrad',
    ]
}))