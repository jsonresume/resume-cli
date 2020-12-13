module.exports = ({ mount = '/' } = {}) => {
  const dedent = require('dedent');
  const flat = require('flat');
  const { Volume } = require('memfs');
  return Volume.fromJSON(
    flat(
      {
        'only-number-schema.json': JSON.stringify({ type: 'number' }),
        'only-number.json': '123',
        'invalid-resume.json': JSON.stringify({
          notAValidKey: {
            foo: 'bar',
          },
        }),
        'resume.json': JSON.stringify({
          basics: {
            name: 'thomas',
            email: 'thomas@example.com',
          },
        }),
        'resume.yaml': dedent`
        basics: 
          name: thomas
          email: thomas@example.com
      `,
        quaff: {
          'basics.yaml': dedent`
          name: thomas
          email: thomas@example.com
        `,
          'work.json': JSON.stringify([
            {
              company: 'Pied Piper',
              endDate: '2014-12-01',
              position: 'CEO/President',
              startDate: '2013-12-01',
            },
          ]),
        },
      },
      { delimiter: '/' },
    ),
    mount,
  );
};
