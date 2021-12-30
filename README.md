An featws format parser and serializer for node. Based on  default [NodeJs Ini Parser](https://github.com/npm/ini).

Sections are treated as nested objects.  Items before the first
heading are saved on the object directly.

## Usage

Consider an featws-file `rules.featws` that looks like this:
```featws
    ; this comment is being ignored
    scope = global

    [database]
    user = dbuser
    password = dbpassword
    database = use_this_database

    [paths.default]
    datadir = /var/lib/data
    array[] = first value
    array[] = second value
    array[] = third value
```

You can read, manipulate and write the featws-file like so:

```js
    var fs = require('fs')
      , featws = require('featws')

    var config = featws.parse(fs.readFileSync('./config.featws', 'utf-8'))

    config.scope = 'local'
    config.database.database = 'use_another_database'
    config.paths.default.tmpdir = '/tmp'
    delete config.paths.default.datadir
    config.paths.default.array.push('fourth value')

    fs.writeFileSync('./config_modified.featws', featws.stringify(config, { section: 'section' }))
```

This will result in a file called `config_modified.featws` being written
to the filesystem with the following content:

```featws
    [section]
    scope=local
    [section.database]
    user=dbuser
    password=dbpassword
    database=use_another_database
    [section.paths.default]
    tmpdir=/tmp
    array[]=first value
    array[]=second value
    array[]=third value
    array[]=fourth value
```

## API

### decode(inistring)

Decode the featws-style formatted `inistring` into a nested object.

### parse(inistring)

Alias for `decode(inistring)`

### encode(object, [options])

Encode the object `object` into an featws-style formatted string. If the
optional parameter `section` is given, then all top-level properties
of the object are put into this section and the `section`-string is
prepended to all sub-sections, see the usage example above.

The `options` object may contain the following:

* `section` A string which will be the first `section` in the encoded
  featws data.  Defaults to none.
* `whitespace` Boolean to specify whether to put whitespace around the
  `=` character.  By default, whitespace is omitted, to be friendly to
  some persnickety old parsers that don't tolerate it well.  But some
  find that it's more human-readable and pretty with the whitespace.

For backwards compatibility reasons, if a `string` options is passed
in, then it is assumed to be the `section` value.

### stringify(object, [options])

Alias for `encode(object, [options])`

### safe(val)

Escapes the string `val` such that it is safe to be used as a key or
value in an featws-file. Basically escapes quotes. For example

```js
    featws.safe('"unsafe string"')
```

would result in

    "\"unsafe string\""

### unsafe(val)

Unescapes the string `val`
