import House from '../fixtures/models/House';
import template from '../output/views/houses.top';

process.stdout.write(template({
    house: new House(
        'Stark',
        'Winter is coming',
        [{
            name: 'Ned', gender: 'M', children: [
            {
                name: 'Arya', gender: 'F'
            }, {
                name: 'Sansa', gender: 'F'
            }, {
                name: 'Robb', gender: 'M'
            }, {
                name: '<strong>Jon</strong>', gender: 'M'
            }]
        }, {
            name: 'Catelyn', gender: 'F'
        }]
    )
}));
