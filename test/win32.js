var t = require('tap')
Object.defineProperty(process, 'platform', { value: 'win32' })
const featws = require('..')

const res = featws.encode({foo: { bar: 'baz' }})
t.equal(res, '[foo]\r\nbar=baz\r\n')

t.equal(featws.encode({bar: 'baz'}, 'foo'), '[foo]\r\nbar=baz\r\n')

t.same(featws.decode('=just junk!\r\n[foo]\r\nbar\r\n'),
  { foo: { bar: true }})

t.same(featws.decode('[x]\r\ny=1\r\ny[]=2\r\n'), {
  x: {
    y: [1, 2],
  },
})

t.equal(featws.unsafe(''), '')
t.equal(featws.unsafe('x;y'), 'x')
t.equal(featws.unsafe('x  # y'), 'x  # y')
t.equal(featws.unsafe('x "\\'), 'x "\\')
