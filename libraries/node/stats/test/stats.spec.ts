import { StatFiles, Stats } from '@upradata/stats';


const createStats = () => {

    const stats = new Stats('Stats Test', StatFiles);

    const all = [ 'a.txt', 'b.txt', 'c.txt', 'd.txt' ];

    const stat1 = stats.create('A-collection1', 'A-sub-collection1-1');

    stat1.addBeforeCache(...all);
    stat1.addToBeProcessed(...all);
    stat1.succeed(...all.slice(0, 1));
    stat1.fail(...all.slice(1).map(file => ({ file, reason: `J'en sais rien` })));

    const stat2 = stats.create('A-collection1', 'B-sub-collection1-2');

    stat2.addBeforeCache(...all);
    stat2.addToBeProcessed(...all);
    stat2.succeed(...all.slice(0, 1));
    stat2.fail(...all.slice(1).map(file => ({ file, reason: `J'en sais rien` })));

    const stat3 = stats.create('B-collection2', 'A-sub-collection', 'A-sub-sub-collection');

    stat3.addBeforeCache(...all);
    stat3.addToBeProcessed(...all);
    stat3.succeed(...all.slice(0, 1));
    stat3.fail(...all.slice(1).map(file => ({ file, reason: `J'en sais rien` })));


    return stats;

};


describe('Stats test', () => {

    it('should create all collections', () => {
        const stats = createStats();
        expect(stats.output()).toMatchSnapshot('all stat collections');
        expect(stats.output('B-collection2', 'A-sub-collection')).toMatchSnapshot('stat sub-collections');
    });

    it('should log all collections', () => {

        const stats = createStats();
        expect(stats.toString([], { rowWidth: 200 }).split('\n')).toMatchSnapshot('all stats as string');
        expect(stats.toString([ 'B-collection2', 'A-sub-collection' ], { rowWidth: 200 }).split('\n')).toMatchSnapshot('sub-collection stats as string');

        expect(stats.toString([], {
            sort: {
                collections: colls => colls.sort((c1, c2) => c1.collectionName.localeCompare(c2.collectionName) * -1),
                stats: 'anti-alpha-numeric',
                globalRows: 'anti-alpha-numeric'
            }
        })).toMatchSnapshot('all stats as string with sorting');

    });
});
