import House from '../fixtures/models/House';
import template from '../fixtures/templates/houses.top';

process.stdout.write(template({
    house: new House(
        'Stark',
        'Winter is coming',
        [{
            name: 'Ned', sex: 'M', children: [
            {
                name: 'Arya', sex: 'F'
            }, {
                name: 'Sansa', sex: 'F'
            }, {
                name: 'Robb', sex: 'M'
            }, {
                name: '<strong>Jon</strong>', sex: 'M'
            }]
        }, {
            name: 'Catelyn', sex: 'F'
        }]
    )
}));