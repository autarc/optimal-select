## [v3.3.0]
> October 7, 2016

- fix missing pass options to `getSingleSelector` ([#16](https://github.com/Autarc/optimal-select/pull/16), by [@Zhuoqing](https://github.com/Zhuoqing))
- fix optimization of child selectors with multiple classnames
- apply optimizations on simple selectors
- add default options and parameter checks for public API
- improve `getMultiSelector` for matching nested descendants


## [v3.2.0]
> June 18, 2016

- add `options.skip` to allow the definition of elements which shouldn't be considered
- use `name` fallback for the ignore predicate function of `class`


## [v3.1.0]
> May 18, 2016

- add `options.root` to allow the definition of the container element


## [v3.0.0]
> Apr 15, 2016

- add support for virtual representations based on the htmlparser2 DOM


## [v2.2.0]
> Apr 02, 2016

- improve whitespace matching in classnames ([#6](https://github.com/Autarc/optimal-select/pull/6) by [@paulborges](https://github.com/pauloborges))
- enable simplified ignore patterns based on strings/regex
- fix matching ignored classes as attributes


## [v2.1.0]
> Mar 08, 2016

- change `options.excludes` to `options.ignore` and allow the definitions of flexible predicate functions to ignore specific pattern matches


## [v2.0.2]
> Mar 07, 2016

- fix splitting of select segments in case attribute values contain spaces
- lookup the `class` attribute instead of the `className` property to support svg elements


## [v2.0.1]
> Jan 24, 2016

- replace element validation to remove implicit dependency on global window


## [v2.0.0]
> Jan 15, 2016

- enable filtering with RegExp to exclude specific property values
- replace complex key-value and classname selectors with tags


## [v1.0.2]
> Jan 2, 2016

- add example
- reference pre-built files
- replace NodeList iteration with regular for-loop
- module exports 'select' as default
- ignore 'data-react-checksum' attribute by default


## [v1.0.1]
> Dec 11, 2015

- add `.npmignore`


## [v1.0.0]
> Dec 10, 2015

- initial release
