;(() => {
  var __webpack_modules__ = {
    5841: (e, t, r) => {
      'use strict'
      e.exports = t
      t.mockS3Http = r(9361).get_mockS3Http()
      t.mockS3Http('on')
      const s = t.mockS3Http('get')
      const a = r(7147)
      const o = r(1017)
      const u = r(1758)
      const c = r(9544)
      c.disableProgress()
      const f = r(5977)
      const d = r(2361).EventEmitter
      const p = r(3837).inherits
      const h = [
        'clean',
        'install',
        'reinstall',
        'build',
        'rebuild',
        'package',
        'testpackage',
        'publish',
        'unpublish',
        'info',
        'testbinary',
        'reveal',
        'configure',
      ]
      const v = {}
      c.heading = 'node-pre-gyp'
      if (s) {
        c.warn(`mocking s3 to ${process.env.node_pre_gyp_mock_s3}`)
      }
      Object.defineProperty(t, 'find', {
        get: function () {
          return r(5921).find
        },
        enumerable: true,
      })
      function Run({ package_json_path: e = './package.json', argv: t }) {
        this.package_json_path = e
        this.commands = {}
        const r = this
        h.forEach((e) => {
          r.commands[e] = function (t, s) {
            c.verbose('command', e, t)
            return require('./' + e)(r, t, s)
          }
        })
        this.parseArgv(t)
        this.binaryHostSet = false
      }
      p(Run, d)
      t.Run = Run
      const g = Run.prototype
      g.package = r(7399)
      g.configDefs = {
        help: Boolean,
        arch: String,
        debug: Boolean,
        directory: String,
        proxy: String,
        loglevel: String,
      }
      g.shorthands = {
        release: '--no-debug',
        C: '--directory',
        debug: '--debug',
        j: '--jobs',
        silent: '--loglevel=silent',
        silly: '--loglevel=silly',
        verbose: '--loglevel=verbose',
      }
      g.aliases = v
      g.parseArgv = function parseOpts(e) {
        this.opts = u(this.configDefs, this.shorthands, e)
        this.argv = this.opts.argv.remain.slice()
        const t = (this.todo = [])
        e = this.argv.map((e) => {
          if (e in this.aliases) {
            e = this.aliases[e]
          }
          return e
        })
        e.slice().forEach((r) => {
          if (r in this.commands) {
            const s = e.splice(0, e.indexOf(r))
            e.shift()
            if (t.length > 0) {
              t[t.length - 1].args = s
            }
            t.push({ name: r, args: [] })
          }
        })
        if (t.length > 0) {
          t[t.length - 1].args = e.splice(0)
        }
        let r = this.package_json_path
        if (this.opts.directory) {
          r = o.join(this.opts.directory, r)
        }
        this.package_json = JSON.parse(a.readFileSync(r))
        this.todo = f.expand_commands(this.package_json, this.opts, t)
        const s = 'npm_config_'
        Object.keys(process.env).forEach((e) => {
          if (e.indexOf(s) !== 0) return
          const t = process.env[e]
          if (e === s + 'loglevel') {
            c.level = t
          } else {
            e = e.substring(s.length)
            if (e === 'argv') {
              if (
                this.opts.argv &&
                this.opts.argv.remain &&
                this.opts.argv.remain.length
              ) {
              } else {
                this.opts[e] = t
              }
            } else {
              this.opts[e] = t
            }
          }
        })
        if (this.opts.loglevel) {
          c.level = this.opts.loglevel
        }
        c.resume()
      }
      g.setBinaryHostProperty = function (e) {
        if (this.binaryHostSet) {
          return this.package_json.binary.host
        }
        const t = this.package_json
        if (!t || !t.binary || t.binary.host) {
          return ''
        }
        if (!t.binary.staging_host || !t.binary.production_host) {
          return ''
        }
        let r = 'production_host'
        if (e === 'publish') {
          r = 'staging_host'
        }
        const s = process.env.node_pre_gyp_s3_host
        if (s === 'staging' || s === 'production') {
          r = `${s}_host`
        } else if (
          this.opts['s3_host'] === 'staging' ||
          this.opts['s3_host'] === 'production'
        ) {
          r = `${this.opts['s3_host']}_host`
        } else if (this.opts['s3_host'] || s) {
          throw new Error(`invalid s3_host ${this.opts['s3_host'] || s}`)
        }
        t.binary.host = t.binary[r]
        this.binaryHostSet = true
        return t.binary.host
      }
      g.usage = function usage() {
        const e = [
          '',
          '  Usage: node-pre-gyp <command> [options]',
          '',
          '  where <command> is one of:',
          h
            .map((e) => '    - ' + e + ' - ' + require('./' + e).usage)
            .join('\n'),
          '',
          'node-pre-gyp@' + this.version + '  ' + o.resolve(__dirname, '..'),
          'node@' + process.versions.node,
        ].join('\n')
        return e
      }
      Object.defineProperty(g, 'version', {
        get: function () {
          return this.package.version
        },
        enumerable: true,
      })
    },
    5921: (e, t, r) => {
      'use strict'
      const s = r(5841)
      const a = r(2821)
      const o = r(5977)
      const u = r(7147).existsSync || r(1017).existsSync
      const c = r(1017)
      e.exports = t
      t.usage = 'Finds the require path for the node-pre-gyp installed module'
      t.validate = function (e, t) {
        a.validate_config(e, t)
      }
      t.find = function (e, t) {
        if (!u(e)) {
          throw new Error(e + 'does not exist')
        }
        const r = new s.Run({ package_json_path: e, argv: process.argv })
        r.setBinaryHostProperty()
        const f = r.package_json
        a.validate_config(f, t)
        let d
        if (o.get_napi_build_versions(f, t)) {
          d = o.get_best_napi_build_version(f, t)
        }
        t = t || {}
        if (!t.module_root) t.module_root = c.dirname(e)
        const p = a.evaluate(f, t, d)
        return p.module
      }
    },
    5977: (e, t, r) => {
      'use strict'
      const s = r(7147)
      e.exports = t
      const a = process.version
        .substr(1)
        .replace(/-.*$/, '')
        .split('.')
        .map((e) => +e)
      const o = [
        'build',
        'clean',
        'configure',
        'package',
        'publish',
        'reveal',
        'testbinary',
        'testpackage',
        'unpublish',
      ]
      const u = 'napi_build_version='
      e.exports.get_napi_version = function () {
        let e = process.versions.napi
        if (!e) {
          if (a[0] === 9 && a[1] >= 3) e = 2
          else if (a[0] === 8) e = 1
        }
        return e
      }
      e.exports.get_napi_version_as_string = function (t) {
        const r = e.exports.get_napi_version(t)
        return r ? '' + r : ''
      }
      e.exports.validate_package_json = function (t, r) {
        const s = t.binary
        const a = pathOK(s.module_path)
        const o = pathOK(s.remote_path)
        const u = pathOK(s.package_name)
        const c = e.exports.get_napi_build_versions(t, r, true)
        const f = e.exports.get_napi_build_versions_raw(t)
        if (c) {
          c.forEach((e) => {
            if (!(parseInt(e, 10) === e && e > 0)) {
              throw new Error(
                'All values specified in napi_versions must be positive integers.'
              )
            }
          })
        }
        if (c && (!a || (!o && !u))) {
          throw new Error(
            'When napi_versions is specified; module_path and either remote_path or ' +
              "package_name must contain the substitution string '{napi_build_version}`."
          )
        }
        if ((a || o || u) && !f) {
          throw new Error(
            "When the substitution string '{napi_build_version}` is specified in " +
              'module_path, remote_path, or package_name; napi_versions must also be specified.'
          )
        }
        if (
          c &&
          !e.exports.get_best_napi_build_version(t, r) &&
          e.exports.build_napi_only(t)
        ) {
          throw new Error(
            'The Node-API version of this Node instance is ' +
              e.exports.get_napi_version(r ? r.target : undefined) +
              '. ' +
              'This module supports Node-API version(s) ' +
              e.exports.get_napi_build_versions_raw(t) +
              '. ' +
              'This Node instance cannot run this module.'
          )
        }
        if (f && !c && e.exports.build_napi_only(t)) {
          throw new Error(
            'The Node-API version of this Node instance is ' +
              e.exports.get_napi_version(r ? r.target : undefined) +
              '. ' +
              'This module supports Node-API version(s) ' +
              e.exports.get_napi_build_versions_raw(t) +
              '. ' +
              'This Node instance cannot run this module.'
          )
        }
      }
      function pathOK(e) {
        return (
          e &&
          (e.indexOf('{napi_build_version}') !== -1 ||
            e.indexOf('{node_napi_label}') !== -1)
        )
      }
      e.exports.expand_commands = function (t, r, s) {
        const a = []
        const c = e.exports.get_napi_build_versions(t, r)
        s.forEach((s) => {
          if (c && s.name === 'install') {
            const o = e.exports.get_best_napi_build_version(t, r)
            const c = o ? [u + o] : []
            a.push({ name: s.name, args: c })
          } else if (c && o.indexOf(s.name) !== -1) {
            c.forEach((e) => {
              const t = s.args.slice()
              t.push(u + e)
              a.push({ name: s.name, args: t })
            })
          } else {
            a.push(s)
          }
        })
        return a
      }
      e.exports.get_napi_build_versions = function (t, s, a) {
        const o = r(9544)
        let u = []
        const c = e.exports.get_napi_version(s ? s.target : undefined)
        if (t.binary && t.binary.napi_versions) {
          t.binary.napi_versions.forEach((e) => {
            const t = u.indexOf(e) !== -1
            if (!t && c && e <= c) {
              u.push(e)
            } else if (a && !t && c) {
              o.info(
                'This Node instance does not support builds for Node-API version',
                e
              )
            }
          })
        }
        if (s && s['build-latest-napi-version-only']) {
          let e = 0
          u.forEach((t) => {
            if (t > e) e = t
          })
          u = e ? [e] : []
        }
        return u.length ? u : undefined
      }
      e.exports.get_napi_build_versions_raw = function (e) {
        const t = []
        if (e.binary && e.binary.napi_versions) {
          e.binary.napi_versions.forEach((e) => {
            if (t.indexOf(e) === -1) {
              t.push(e)
            }
          })
        }
        return t.length ? t : undefined
      }
      e.exports.get_command_arg = function (e) {
        return u + e
      }
      e.exports.get_napi_build_version_from_command_args = function (e) {
        for (let t = 0; t < e.length; t++) {
          const r = e[t]
          if (r.indexOf(u) === 0) {
            return parseInt(r.substr(u.length), 10)
          }
        }
        return undefined
      }
      e.exports.swap_build_dir_out = function (t) {
        if (t) {
          const a = r(4700)
          a.sync(e.exports.get_build_dir(t))
          s.renameSync('build', e.exports.get_build_dir(t))
        }
      }
      e.exports.swap_build_dir_in = function (t) {
        if (t) {
          const a = r(4700)
          a.sync('build')
          s.renameSync(e.exports.get_build_dir(t), 'build')
        }
      }
      e.exports.get_build_dir = function (e) {
        return 'build-tmp-napi-v' + e
      }
      e.exports.get_best_napi_build_version = function (t, r) {
        let s = 0
        const a = e.exports.get_napi_build_versions(t, r)
        if (a) {
          const t = e.exports.get_napi_version(r ? r.target : undefined)
          a.forEach((e) => {
            if (e > s && e <= t) {
              s = e
            }
          })
        }
        return s === 0 ? undefined : s
      }
      e.exports.build_napi_only = function (e) {
        return (
          e.binary &&
          e.binary.package_name &&
          e.binary.package_name.indexOf('{node_napi_label}') === -1
        )
      }
    },
    9361: (e, t, r) => {
      'use strict'
      e.exports = t
      const s = r(7310)
      const a = r(7147)
      const o = r(1017)
      e.exports.detect = function (e, t) {
        const r = e.hosted_path
        const a = s.parse(r)
        t.prefix =
          !a.pathname || a.pathname === '/' ? '' : a.pathname.replace('/', '')
        if (e.bucket && e.region) {
          t.bucket = e.bucket
          t.region = e.region
          t.endpoint = e.host
          t.s3ForcePathStyle = e.s3ForcePathStyle
        } else {
          const e = a.hostname.split('.s3')
          const r = e[0]
          if (!r) {
            return
          }
          if (!t.bucket) {
            t.bucket = r
          }
          if (!t.region) {
            const r = e[1].slice(1).split('.')[0]
            if (r === 'amazonaws') {
              t.region = 'us-east-1'
            } else {
              t.region = r
            }
          }
        }
      }
      e.exports.get_s3 = function (e) {
        if (process.env.node_pre_gyp_mock_s3) {
          const e = r(3930)
          const t = r(2037)
          e.config.basePath = `${t.tmpdir()}/mock`
          const s = e.S3()
          const wcb =
            (e) =>
            (t, ...r) => {
              if (t && t.code === 'ENOENT') {
                t.code = 'NotFound'
              }
              return e(t, ...r)
            }
          return {
            listObjects(e, t) {
              return s.listObjects(e, wcb(t))
            },
            headObject(e, t) {
              return s.headObject(e, wcb(t))
            },
            deleteObject(e, t) {
              return s.deleteObject(e, wcb(t))
            },
            putObject(e, t) {
              return s.putObject(e, wcb(t))
            },
          }
        }
        const t = r(2355)
        t.config.update(e)
        const s = new t.S3()
        return {
          listObjects(e, t) {
            return s.listObjects(e, t)
          },
          headObject(e, t) {
            return s.headObject(e, t)
          },
          deleteObject(e, t) {
            return s.deleteObject(e, t)
          },
          putObject(e, t) {
            return s.putObject(e, t)
          },
        }
      }
      e.exports.get_mockS3Http = function () {
        let e = false
        if (!process.env.node_pre_gyp_mock_s3) {
          return () => e
        }
        const t = r(4997)
        const s =
          'https://mapbox-node-pre-gyp-public-testing-bucket.s3.us-east-1.amazonaws.com'
        const u =
          process.env.node_pre_gyp_mock_s3 +
          '/mapbox-node-pre-gyp-public-testing-bucket'
        const mock_http = () => {
          function get(e, t) {
            const r = o.join(u, e.replace('%2B', '+'))
            try {
              a.accessSync(r, a.constants.R_OK)
            } catch (e) {
              return [404, 'not found\n']
            }
            return [200, a.createReadStream(r)]
          }
          return t(s)
            .persist()
            .get(() => e)
            .reply(get)
        }
        mock_http(t, s, u)
        const mockS3Http = (t) => {
          const r = e
          if (t === 'off') {
            e = false
          } else if (t === 'on') {
            e = true
          } else if (t !== 'get') {
            throw new Error(`illegal action for setMockHttp ${t}`)
          }
          return r
        }
        return mockS3Http
      }
    },
    2821: (e, t, r) => {
      'use strict'
      e.exports = t
      const s = r(1017)
      const a = r(8353)
      const o = r(7310)
      const u = r(5104)
      const c = r(5977)
      let f
      if (process.env.NODE_PRE_GYP_ABI_CROSSWALK) {
        f = require(process.env.NODE_PRE_GYP_ABI_CROSSWALK)
      } else {
        f = r(9448)
      }
      const d = {}
      Object.keys(f).forEach((e) => {
        const t = e.split('.')[0]
        if (!d[t]) {
          d[t] = e
        }
      })
      function get_electron_abi(e, t) {
        if (!e) {
          throw new Error('get_electron_abi requires valid runtime arg')
        }
        if (typeof t === 'undefined') {
          throw new Error(
            'Empty target version is not supported if electron is the target.'
          )
        }
        const r = a.parse(t)
        return e + '-v' + r.major + '.' + r.minor
      }
      e.exports.get_electron_abi = get_electron_abi
      function get_node_webkit_abi(e, t) {
        if (!e) {
          throw new Error('get_node_webkit_abi requires valid runtime arg')
        }
        if (typeof t === 'undefined') {
          throw new Error(
            'Empty target version is not supported if node-webkit is the target.'
          )
        }
        return e + '-v' + t
      }
      e.exports.get_node_webkit_abi = get_node_webkit_abi
      function get_node_abi(e, t) {
        if (!e) {
          throw new Error('get_node_abi requires valid runtime arg')
        }
        if (!t) {
          throw new Error('get_node_abi requires valid process.versions object')
        }
        const r = a.parse(t.node)
        if (r.major === 0 && r.minor % 2) {
          return e + '-v' + t.node
        } else {
          return t.modules
            ? e + '-v' + +t.modules
            : 'v8-' + t.v8.split('.').slice(0, 2).join('.')
        }
      }
      e.exports.get_node_abi = get_node_abi
      function get_runtime_abi(e, t) {
        if (!e) {
          throw new Error('get_runtime_abi requires valid runtime arg')
        }
        if (e === 'node-webkit') {
          return get_node_webkit_abi(e, t || process.versions['node-webkit'])
        } else if (e === 'electron') {
          return get_electron_abi(e, t || process.versions.electron)
        } else {
          if (e !== 'node') {
            throw new Error("Unknown Runtime: '" + e + "'")
          }
          if (!t) {
            return get_node_abi(e, process.versions)
          } else {
            let r
            if (f[t]) {
              r = f[t]
            } else {
              const e = t.split('.').map((e) => +e)
              if (e.length !== 3) {
                throw new Error('Unknown target version: ' + t)
              }
              const s = e[0]
              let a = e[1]
              let o = e[2]
              if (s === 1) {
                while (true) {
                  if (a > 0) --a
                  if (o > 0) --o
                  const e = '' + s + '.' + a + '.' + o
                  if (f[e]) {
                    r = f[e]
                    console.log(
                      'Warning: node-pre-gyp could not find exact match for ' +
                        t
                    )
                    console.log(
                      'Warning: but node-pre-gyp successfully choose ' +
                        e +
                        ' as ABI compatible target'
                    )
                    break
                  }
                  if (a === 0 && o === 0) {
                    break
                  }
                }
              } else if (s >= 2) {
                if (d[s]) {
                  r = f[d[s]]
                  console.log(
                    'Warning: node-pre-gyp could not find exact match for ' + t
                  )
                  console.log(
                    'Warning: but node-pre-gyp successfully choose ' +
                      d[s] +
                      ' as ABI compatible target'
                  )
                }
              } else if (s === 0) {
                if (e[1] % 2 === 0) {
                  while (--o > 0) {
                    const e = '' + s + '.' + a + '.' + o
                    if (f[e]) {
                      r = f[e]
                      console.log(
                        'Warning: node-pre-gyp could not find exact match for ' +
                          t
                      )
                      console.log(
                        'Warning: but node-pre-gyp successfully choose ' +
                          e +
                          ' as ABI compatible target'
                      )
                      break
                    }
                  }
                }
              }
            }
            if (!r) {
              throw new Error('Unsupported target version: ' + t)
            }
            const s = {
              node: t,
              v8: r.v8 + '.0',
              modules: r.node_abi > 1 ? r.node_abi : undefined,
            }
            return get_node_abi(e, s)
          }
        }
      }
      e.exports.get_runtime_abi = get_runtime_abi
      const p = ['module_name', 'module_path', 'host']
      function validate_config(e, t) {
        const r = e.name + ' package.json is not node-pre-gyp ready:\n'
        const s = []
        if (!e.main) {
          s.push('main')
        }
        if (!e.version) {
          s.push('version')
        }
        if (!e.name) {
          s.push('name')
        }
        if (!e.binary) {
          s.push('binary')
        }
        const a = e.binary
        if (a) {
          p.forEach((e) => {
            if (!a[e] || typeof a[e] !== 'string') {
              s.push('binary.' + e)
            }
          })
        }
        if (s.length >= 1) {
          throw new Error(
            r + 'package.json must declare these properties: \n' + s.join('\n')
          )
        }
        if (a) {
          const e = o.parse(a.host).protocol
          if (e === 'http:') {
            throw new Error(
              "'host' protocol (" +
                e +
                ") is invalid - only 'https:' is accepted"
            )
          }
        }
        c.validate_package_json(e, t)
      }
      e.exports.validate_config = validate_config
      function eval_template(e, t) {
        Object.keys(t).forEach((r) => {
          const s = '{' + r + '}'
          while (e.indexOf(s) > -1) {
            e = e.replace(s, t[r])
          }
        })
        return e
      }
      function fix_slashes(e) {
        if (e.slice(-1) !== '/') {
          return e + '/'
        }
        return e
      }
      function drop_double_slashes(e) {
        return e.replace(/\/\//g, '/')
      }
      function get_process_runtime(e) {
        let t = 'node'
        if (e['node-webkit']) {
          t = 'node-webkit'
        } else if (e.electron) {
          t = 'electron'
        }
        return t
      }
      e.exports.get_process_runtime = get_process_runtime
      const h = '{module_name}-v{version}-{node_abi}-{platform}-{arch}.tar.gz'
      const v = ''
      e.exports.evaluate = function (e, t, r) {
        t = t || {}
        validate_config(e, t)
        const f = e.version
        const d = a.parse(f)
        const p = t.runtime || get_process_runtime(process.versions)
        const g = {
          name: e.name,
          configuration: t.debug ? 'Debug' : 'Release',
          debug: t.debug,
          module_name: e.binary.module_name,
          version: d.version,
          prerelease: d.prerelease.length ? d.prerelease.join('.') : '',
          build: d.build.length ? d.build.join('.') : '',
          major: d.major,
          minor: d.minor,
          patch: d.patch,
          runtime: p,
          node_abi: get_runtime_abi(p, t.target),
          node_abi_napi: c.get_napi_version(t.target)
            ? 'napi'
            : get_runtime_abi(p, t.target),
          napi_version: c.get_napi_version(t.target),
          napi_build_version: r || '',
          node_napi_label: r ? 'napi-v' + r : get_runtime_abi(p, t.target),
          target: t.target || '',
          platform: t.target_platform || process.platform,
          target_platform: t.target_platform || process.platform,
          arch: t.target_arch || process.arch,
          target_arch: t.target_arch || process.arch,
          libc: t.target_libc || u.family || 'unknown',
          module_main: e.main,
          toolset: t.toolset || '',
          bucket: e.binary.bucket,
          region: e.binary.region,
          s3ForcePathStyle: e.binary.s3ForcePathStyle || false,
        }
        const D = g.module_name.replace('-', '_')
        const y =
          process.env['npm_config_' + D + '_binary_host_mirror'] ||
          e.binary.host
        g.host = fix_slashes(eval_template(y, g))
        g.module_path = eval_template(e.binary.module_path, g)
        if (t.module_root) {
          g.module_path = s.join(t.module_root, g.module_path)
        } else {
          g.module_path = s.resolve(g.module_path)
        }
        g.module = s.join(g.module_path, g.module_name + '.node')
        g.remote_path = e.binary.remote_path
          ? drop_double_slashes(
              fix_slashes(eval_template(e.binary.remote_path, g))
            )
          : v
        const m = e.binary.package_name ? e.binary.package_name : h
        g.package_name = eval_template(m, g)
        g.staged_tarball = s.join('build/stage', g.remote_path, g.package_name)
        g.hosted_path = o.resolve(g.host, g.remote_path)
        g.hosted_tarball = o.resolve(g.hosted_path, g.package_name)
        return g
      }
    },
    1121: function (e, t, r) {
      'use strict'
      var s =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e }
        }
      Object.defineProperty(t, '__esModule', { value: true })
      const a = s(r(1017))
      const o = r(3982)
      const u = r(9663)
      const c = r(9770)
      const f = r(6414)
      const d = s(r(3331))
      const p = r(5456)
      const h = s(r(567))
      const v = r(4010)
      const g = r(8137)
      const D = r(2397)
      const y = s(r(6903))
      const m = s(r(930))
      const _ = s(r(9042))
      const E = s(r(5841))
      const w = r(7310)
      const x = f.Parser.extend(r(8832).J)
      const C = s(r(2037))
      const F = r(3939)
      const S = s(r(2382))
      const A = {
        cwd: () => K,
        env: { NODE_ENV: c.UNKNOWN, [c.UNKNOWN]: true },
        [c.UNKNOWN]: true,
      }
      const k = Symbol()
      const R = Symbol()
      const O = Symbol()
      const T = Symbol()
      const j = Symbol()
      const N = Symbol()
      const B = Symbol()
      const L = Symbol()
      const I = Symbol()
      const P = {
        access: N,
        accessSync: N,
        createReadStream: N,
        exists: N,
        existsSync: N,
        fstat: N,
        fstatSync: N,
        lstat: N,
        lstatSync: N,
        open: N,
        readdir: B,
        readdirSync: B,
        readFile: N,
        readFileSync: N,
        stat: N,
        statSync: N,
      }
      const M = {
        ...P,
        pathExists: N,
        pathExistsSync: N,
        readJson: N,
        readJSON: N,
        readJsonSync: N,
        readJSONSync: N,
      }
      const W = Object.assign(Object.create(null), {
        bindings: { default: L },
        express: {
          default: function () {
            return { [c.UNKNOWN]: true, set: k, engine: R }
          },
        },
        fs: { default: P, ...P },
        'fs-extra': { default: M, ...M },
        'graceful-fs': { default: P, ...P },
        process: { default: A, ...A },
        path: { default: {} },
        os: { default: C.default, ...C.default },
        '@mapbox/node-pre-gyp': { default: E.default, ...E.default },
        'node-pre-gyp': g.pregyp,
        'node-pre-gyp/lib/pre-binding': g.pregyp,
        'node-pre-gyp/lib/pre-binding.js': g.pregyp,
        'node-gyp-build': { default: I },
        '@aminya/node-gyp-build': { default: I },
        nbind: { init: O, default: { init: O } },
        'resolve-from': { default: S.default },
        'strong-globalize': { default: { SetRootDir: T }, SetRootDir: T },
        pkginfo: { default: j },
      })
      const U = {
        _interopRequireDefault: D.normalizeDefaultRequire,
        _interopRequireWildcard: D.normalizeWildcardRequire,
        __importDefault: D.normalizeDefaultRequire,
        __importStar: D.normalizeWildcardRequire,
        MONGOOSE_DRIVER_PATH: undefined,
        URL: w.URL,
        Object: { assign: Object.assign },
      }
      U.global = U.GLOBAL = U.globalThis = U
      const q = Symbol()
      g.pregyp.find[q] = true
      const H = W.path
      Object.keys(a.default).forEach((e) => {
        const t = a.default[e]
        if (typeof t === 'function') {
          const r = function mockPath() {
            return t.apply(mockPath, arguments)
          }
          r[q] = true
          H[e] = H.default[e] = r
        } else {
          H[e] = H.default[e] = t
        }
      })
      H.resolve = H.default.resolve = function (...e) {
        return a.default.resolve.apply(this, [K, ...e])
      }
      H.resolve[q] = true
      const $ = new Set(['.h', '.cmake', '.c', '.cpp'])
      const G = new Set([
        'CHANGELOG.md',
        'README.md',
        'readme.md',
        'changelog.md',
      ])
      let K
      const z = /^\/[^\/]+|^[a-z]:[\\/][^\\/]+/i
      function isAbsolutePathOrUrl(e) {
        if (e instanceof w.URL) return e.protocol === 'file:'
        if (typeof e === 'string') {
          if (e.startsWith('file:')) {
            try {
              new w.URL(e)
              return true
            } catch {
              return false
            }
          }
          return z.test(e)
        }
        return false
      }
      const V = Symbol()
      const Y = /([\/\\]\*\*[\/\\]\*)+/g
      async function analyze(e, t, r) {
        const s = new Set()
        const f = new Set()
        const D = new Set()
        const E = a.default.dirname(e)
        K = r.cwd
        const C = (0, v.getPackageBase)(e)
        const emitAssetDirectory = (e) => {
          if (!r.analysis.emitGlobs) return
          const t = e.indexOf(c.WILDCARD)
          const o = t === -1 ? e.length : e.lastIndexOf(a.default.sep, t)
          const u = e.substring(0, o)
          const f = e.slice(o)
          const d =
            f
              .replace(c.wildcardRegEx, (e, t) =>
                f[t - 1] === a.default.sep ? '**/*' : '*'
              )
              .replace(Y, '/**/*') || '/**/*'
          if (r.ignoreFn(a.default.relative(r.base, u + d))) return
          P = P.then(async () => {
            if (r.log) console.log('Globbing ' + u + d)
            const e = await new Promise((e, t) =>
              (0, h.default)(
                u + d,
                { mark: true, ignore: u + '/**/node_modules/**/*', dot: true },
                (r, s) => (r ? t(r) : e(s))
              )
            )
            e.filter(
              (e) =>
                !$.has(a.default.extname(e)) &&
                !G.has(a.default.basename(e)) &&
                !e.endsWith('/')
            ).forEach((e) => s.add(e))
          })
        }
        let P = Promise.resolve()
        t = t.replace(/^#![^\n\r]*[\r\n]/, '')
        let M
        let H = false
        try {
          M = x.parse(t, {
            ecmaVersion: 'latest',
            allowReturnOutsideFunction: true,
          })
          H = false
        } catch (t) {
          const s = t && t.message && t.message.includes('sourceType: module')
          if (!s) {
            r.warnings.add(
              new Error(`Failed to parse ${e} as script:\n${t && t.message}`)
            )
          }
        }
        if (!M) {
          try {
            M = x.parse(t, {
              ecmaVersion: 'latest',
              sourceType: 'module',
              allowAwaitOutsideFunction: true,
            })
            H = true
          } catch (t) {
            r.warnings.add(
              new Error(`Failed to parse ${e} as module:\n${t && t.message}`)
            )
            return { assets: s, deps: f, imports: D, isESM: false }
          }
        }
        const Q = (0, w.pathToFileURL)(e).href
        const J = Object.assign(Object.create(null), {
          __dirname: {
            shadowDepth: 0,
            value: { value: a.default.resolve(e, '..') },
          },
          __filename: { shadowDepth: 0, value: { value: e } },
          process: { shadowDepth: 0, value: { value: A } },
        })
        if (!H || r.mixedModules) {
          J.require = {
            shadowDepth: 0,
            value: {
              value: {
                [c.FUNCTION](e) {
                  f.add(e)
                  const t = W[e.startsWith('node:') ? e.slice(5) : e]
                  return t.default
                },
                resolve(t) {
                  return (0, m.default)(t, e, r)
                },
              },
            },
          }
          J.require.value.value.resolve[q] = true
        }
        function setKnownBinding(e, t) {
          if (e === 'require') return
          J[e] = { shadowDepth: 0, value: t }
        }
        function getKnownBinding(e) {
          const t = J[e]
          if (t) {
            if (t.shadowDepth === 0) {
              return t.value
            }
          }
          return undefined
        }
        function hasKnownBindingValue(e) {
          const t = J[e]
          return t && t.shadowDepth === 0
        }
        if ((H || r.mixedModules) && isAst(M)) {
          for (const e of M.body) {
            if (e.type === 'ImportDeclaration') {
              const t = String(e.source.value)
              f.add(t)
              const r = W[t.startsWith('node:') ? t.slice(5) : t]
              if (r) {
                for (const t of e.specifiers) {
                  if (t.type === 'ImportNamespaceSpecifier')
                    setKnownBinding(t.local.name, { value: r })
                  else if (
                    t.type === 'ImportDefaultSpecifier' &&
                    'default' in r
                  )
                    setKnownBinding(t.local.name, { value: r.default })
                  else if (t.type === 'ImportSpecifier' && t.imported.name in r)
                    setKnownBinding(t.local.name, { value: r[t.imported.name] })
                }
              }
            } else if (
              e.type === 'ExportNamedDeclaration' ||
              e.type === 'ExportAllDeclaration'
            ) {
              if (e.source) f.add(String(e.source.value))
            }
          }
        }
        async function computePureStaticValue(e, t = true) {
          const r = Object.create(null)
          Object.keys(U).forEach((e) => {
            r[e] = { value: U[e] }
          })
          Object.keys(J).forEach((e) => {
            r[e] = getKnownBinding(e)
          })
          r['import.meta'] = { url: Q }
          const s = await (0, c.evaluate)(e, r, t)
          return s
        }
        let Z
        let X
        let ee = false
        function emitWildcardRequire(e) {
          if (
            !r.analysis.emitGlobs ||
            (!e.startsWith('./') && !e.startsWith('../'))
          )
            return
          e = a.default.resolve(E, e)
          const t = e.indexOf(c.WILDCARD)
          const s = t === -1 ? e.length : e.lastIndexOf(a.default.sep, t)
          const o = e.substring(0, s)
          const u = e.slice(s)
          let d =
            u.replace(c.wildcardRegEx, (e, t) =>
              u[t - 1] === a.default.sep ? '**/*' : '*'
            ) || '/**/*'
          if (!d.endsWith('*'))
            d += '?(' + (r.ts ? '.ts|.tsx|' : '') + '.js|.json|.node)'
          if (r.ignoreFn(a.default.relative(r.base, o + d))) return
          P = P.then(async () => {
            if (r.log) console.log('Globbing ' + o + d)
            const e = await new Promise((e, t) =>
              (0, h.default)(
                o + d,
                { mark: true, ignore: o + '/**/node_modules/**/*' },
                (r, s) => (r ? t(r) : e(s))
              )
            )
            e.filter(
              (e) =>
                !$.has(a.default.extname(e)) &&
                !G.has(a.default.basename(e)) &&
                !e.endsWith('/')
            ).forEach((e) => f.add(e))
          })
        }
        async function processRequireArg(e, t = false) {
          if (e.type === 'ConditionalExpression') {
            await processRequireArg(e.consequent, t)
            await processRequireArg(e.alternate, t)
            return
          }
          if (e.type === 'LogicalExpression') {
            await processRequireArg(e.left, t)
            await processRequireArg(e.right, t)
            return
          }
          let r = await computePureStaticValue(e, true)
          if (!r) return
          if ('value' in r && typeof r.value === 'string') {
            if (!r.wildcards) (t ? D : f).add(r.value)
            else if (r.wildcards.length >= 1) emitWildcardRequire(r.value)
          } else {
            if ('then' in r && typeof r.then === 'string')
              (t ? D : f).add(r.then)
            if ('else' in r && typeof r.else === 'string')
              (t ? D : f).add(r.else)
          }
        }
        let te = (0, u.attachScopes)(M, 'scope')
        if (isAst(M)) {
          ;(0, F.handleWrappers)(M)
          await (0, y.default)({
            id: e,
            ast: M,
            emitDependency: (e) => f.add(e),
            emitAsset: (e) => s.add(e),
            emitAssetDirectory: emitAssetDirectory,
            job: r,
          })
        }
        async function backtrack(e, t) {
          if (!Z)
            throw new Error('Internal error: No staticChildNode for backtrack.')
          const r = await computePureStaticValue(e, true)
          if (r) {
            if (
              ('value' in r && typeof r.value !== 'symbol') ||
              ('then' in r &&
                typeof r.then !== 'symbol' &&
                typeof r.else !== 'symbol')
            ) {
              X = r
              Z = e
              if (t) t.skip()
              return
            }
          }
          await emitStaticChildAsset()
        }
        await (0, o.asyncWalk)(M, {
          async enter(t, o) {
            const u = t
            const c = o
            if (u.scope) {
              te = u.scope
              for (const e in u.scope.declarations) {
                if (e in J) J[e].shadowDepth++
              }
            }
            if (Z) return
            if (!c) return
            if (u.type === 'Identifier') {
              if (
                (0, p.isIdentifierRead)(u, c) &&
                r.analysis.computeFileReferences
              ) {
                let e
                if (
                  (typeof (e = getKnownBinding(u.name)?.value) === 'string' &&
                    e.match(z)) ||
                  (e &&
                    (typeof e === 'function' || typeof e === 'object') &&
                    e[q])
                ) {
                  X = { value: typeof e === 'string' ? e : undefined }
                  Z = u
                  await backtrack(c, this)
                }
              }
            } else if (
              r.analysis.computeFileReferences &&
              u.type === 'MemberExpression' &&
              u.object.type === 'MetaProperty' &&
              u.object.meta.name === 'import' &&
              u.object.property.name === 'meta' &&
              (u.property.computed ? u.property.value : u.property.name) ===
                'url'
            ) {
              X = { value: Q }
              Z = u
              await backtrack(c, this)
            } else if (u.type === 'ImportExpression') {
              await processRequireArg(u.source, true)
              return
            } else if (u.type === 'CallExpression') {
              if (
                (!H || r.mixedModules) &&
                u.callee.type === 'Identifier' &&
                u.arguments.length
              ) {
                if (
                  u.callee.name === 'require' &&
                  J.require.shadowDepth === 0
                ) {
                  await processRequireArg(u.arguments[0])
                  return
                }
              } else if (
                (!H || r.mixedModules) &&
                u.callee.type === 'MemberExpression' &&
                u.callee.object.type === 'Identifier' &&
                u.callee.object.name === 'module' &&
                'module' in J === false &&
                u.callee.property.type === 'Identifier' &&
                !u.callee.computed &&
                u.callee.property.name === 'require' &&
                u.arguments.length
              ) {
                await processRequireArg(u.arguments[0])
                return
              } else if (
                (!H || r.mixedModules) &&
                u.callee.type === 'MemberExpression' &&
                u.callee.object.type === 'Identifier' &&
                u.callee.object.name === 'require' &&
                J.require.shadowDepth === 0 &&
                u.callee.property.type === 'Identifier' &&
                !u.callee.computed &&
                u.callee.property.name === 'resolve' &&
                u.arguments.length
              ) {
                await processRequireArg(u.arguments[0])
                return
              }
              const t =
                r.analysis.evaluatePureExpressions &&
                (await computePureStaticValue(u.callee, false))
              if (
                t &&
                'value' in t &&
                typeof t.value === 'function' &&
                t.value[q] &&
                r.analysis.computeFileReferences
              ) {
                X = await computePureStaticValue(u, true)
                if (X && c) {
                  Z = u
                  await backtrack(c, this)
                }
              } else if (t && 'value' in t && typeof t.value === 'symbol') {
                switch (t.value) {
                  case V:
                    if (
                      u.arguments.length === 1 &&
                      u.arguments[0].type === 'Literal' &&
                      u.callee.type === 'Identifier' &&
                      J.require.shadowDepth === 0
                    ) {
                      await processRequireArg(u.arguments[0])
                    }
                    break
                  case L:
                    if (u.arguments.length) {
                      const e = await computePureStaticValue(
                        u.arguments[0],
                        false
                      )
                      if (e && 'value' in e && e.value) {
                        let t
                        if (typeof e.value === 'object') t = e.value
                        else if (typeof e.value === 'string')
                          t = { bindings: e.value }
                        if (!t.path) {
                          t.path = true
                        }
                        t.module_root = C
                        let r
                        try {
                          r = (0, d.default)(t)
                        } catch (e) {}
                        if (r) {
                          X = { value: r }
                          Z = u
                          await emitStaticChildAsset()
                        }
                      }
                    }
                    break
                  case I:
                    const o =
                      u.arguments.length === 1 &&
                      u.arguments[0].type === 'Identifier' &&
                      u.arguments[0].name === '__dirname'
                    const p =
                      u.arguments.length === 1 &&
                      u.arguments[0].callee?.object?.name === 'path' &&
                      u.arguments[0].callee?.property?.name === 'join' &&
                      u.arguments[0].arguments.length === 2 &&
                      u.arguments[0].arguments[0].type === 'Identifier' &&
                      u.arguments[0].arguments[0].name === '__dirname' &&
                      u.arguments[0].arguments[1].type === 'Literal'
                    if (J.__dirname.shadowDepth === 0 && (o || p)) {
                      const e = p
                        ? a.default.join(E, u.arguments[0].arguments[1].value)
                        : E
                      let t
                      try {
                        const r = u.callee.arguments[0].value
                        const s = (0, S.default)(e, r)
                        t = require(s).path(e)
                      } catch (r) {
                        try {
                          t = _.default.path(e)
                        } catch (e) {}
                      }
                      if (t) {
                        X = { value: t }
                        Z = u
                        await emitStaticChildAsset()
                      }
                    }
                    break
                  case O:
                    if (u.arguments.length) {
                      const e = await computePureStaticValue(
                        u.arguments[0],
                        false
                      )
                      if (
                        e &&
                        'value' in e &&
                        (typeof e.value === 'string' ||
                          typeof e.value === 'undefined')
                      ) {
                        const t = (0, g.nbind)(e.value)
                        if (t && t.path) {
                          f.add(
                            a.default.relative(E, t.path).replace(/\\/g, '/')
                          )
                          return this.skip()
                        }
                      }
                    }
                    break
                  case k:
                    if (
                      u.arguments.length === 2 &&
                      u.arguments[0].type === 'Literal' &&
                      u.arguments[0].value === 'view engine' &&
                      !ee
                    ) {
                      await processRequireArg(u.arguments[1])
                      return this.skip()
                    }
                    break
                  case R:
                    ee = true
                    break
                  case N:
                  case B:
                    if (u.arguments[0] && r.analysis.computeFileReferences) {
                      X = await computePureStaticValue(u.arguments[0], true)
                      if (X) {
                        Z = u.arguments[0]
                        if (
                          t.value === B &&
                          u.arguments[0].type === 'Identifier' &&
                          u.arguments[0].name === '__dirname'
                        ) {
                          emitAssetDirectory(E)
                        } else {
                          await backtrack(c, this)
                        }
                        return this.skip()
                      }
                    }
                    break
                  case T:
                    if (u.arguments[0]) {
                      const e = await computePureStaticValue(
                        u.arguments[0],
                        false
                      )
                      if (e && 'value' in e && e.value)
                        emitAssetDirectory(e.value + '/intl')
                      return this.skip()
                    }
                    break
                  case j:
                    let h = a.default.resolve(e, '../package.json')
                    const v = a.default.resolve('/package.json')
                    while (h !== v && (await r.stat(h)) === null)
                      h = a.default.resolve(h, '../../package.json')
                    if (h !== v) s.add(h)
                    break
                }
              }
            } else if (
              u.type === 'VariableDeclaration' &&
              c &&
              !(0, p.isVarLoop)(c) &&
              r.analysis.evaluatePureExpressions
            ) {
              for (const e of u.declarations) {
                if (!e.init) continue
                const t = await computePureStaticValue(e.init, true)
                if (t) {
                  if (e.id.type === 'Identifier') {
                    setKnownBinding(e.id.name, t)
                  } else if (e.id.type === 'ObjectPattern' && 'value' in t) {
                    for (const r of e.id.properties) {
                      if (
                        r.type !== 'Property' ||
                        r.key.type !== 'Identifier' ||
                        r.value.type !== 'Identifier' ||
                        typeof t.value !== 'object' ||
                        t.value === null ||
                        !(r.key.name in t.value)
                      )
                        continue
                      setKnownBinding(r.value.name, {
                        value: t.value[r.key.name],
                      })
                    }
                  }
                  if (
                    !('value' in t) &&
                    isAbsolutePathOrUrl(t.then) &&
                    isAbsolutePathOrUrl(t.else)
                  ) {
                    X = t
                    Z = e.init
                    await emitStaticChildAsset()
                  }
                }
              }
            } else if (
              u.type === 'AssignmentExpression' &&
              c &&
              !(0, p.isLoop)(c) &&
              r.analysis.evaluatePureExpressions
            ) {
              if (!hasKnownBindingValue(u.left.name)) {
                const e = await computePureStaticValue(u.right, false)
                if (e && 'value' in e) {
                  if (u.left.type === 'Identifier') {
                    setKnownBinding(u.left.name, e)
                  } else if (u.left.type === 'ObjectPattern') {
                    for (const t of u.left.properties) {
                      if (
                        t.type !== 'Property' ||
                        t.key.type !== 'Identifier' ||
                        t.value.type !== 'Identifier' ||
                        typeof e.value !== 'object' ||
                        e.value === null ||
                        !(t.key.name in e.value)
                      )
                        continue
                      setKnownBinding(t.value.name, {
                        value: e.value[t.key.name],
                      })
                    }
                  }
                  if (isAbsolutePathOrUrl(e.value)) {
                    X = e
                    Z = u.right
                    await emitStaticChildAsset()
                  }
                }
              }
            } else if (
              (!H || r.mixedModules) &&
              (u.type === 'FunctionDeclaration' ||
                u.type === 'FunctionExpression' ||
                u.type === 'ArrowFunctionExpression') &&
              (u.arguments || u.params)[0] &&
              (u.arguments || u.params)[0].type === 'Identifier'
            ) {
              let e
              let t
              if (
                (u.type === 'ArrowFunctionExpression' ||
                  u.type === 'FunctionExpression') &&
                c &&
                c.type === 'VariableDeclarator' &&
                c.id.type === 'Identifier'
              ) {
                e = c.id
                t = u.arguments || u.params
              } else if (u.id) {
                e = u.id
                t = u.arguments || u.params
              }
              if (e && u.body.body) {
                let r,
                  s = false
                for (let e = 0; e < u.body.body.length; e++) {
                  if (u.body.body[e].type === 'VariableDeclaration' && !r) {
                    r = u.body.body[e].declarations.find(
                      (e) =>
                        e &&
                        e.id &&
                        e.id.type === 'Identifier' &&
                        e.init &&
                        e.init.type === 'CallExpression' &&
                        e.init.callee.type === 'Identifier' &&
                        e.init.callee.name === 'require' &&
                        J.require.shadowDepth === 0 &&
                        e.init.arguments[0] &&
                        e.init.arguments[0].type === 'Identifier' &&
                        e.init.arguments[0].name === t[0].name
                    )
                  }
                  if (
                    r &&
                    u.body.body[e].type === 'ReturnStatement' &&
                    u.body.body[e].argument &&
                    u.body.body[e].argument.type === 'Identifier' &&
                    u.body.body[e].argument.name === r.id.name
                  ) {
                    s = true
                    break
                  }
                }
                if (s) setKnownBinding(e.name, { value: V })
              }
            }
          },
          async leave(e, t) {
            const r = e
            const s = t
            if (r.scope) {
              if (te.parent) {
                te = te.parent
              }
              for (const e in r.scope.declarations) {
                if (e in J) {
                  if (J[e].shadowDepth > 0) J[e].shadowDepth--
                  else delete J[e]
                }
              }
            }
            if (Z && s) await backtrack(s, this)
          },
        })
        await P
        return { assets: s, deps: f, imports: D, isESM: H }
        async function emitAssetPath(e) {
          const t = e.indexOf(c.WILDCARD)
          const o = t === -1 ? e.length : e.lastIndexOf(a.default.sep, t)
          const u = e.substring(0, o)
          try {
            var f = await r.stat(u)
            if (f === null) {
              throw new Error('file not found')
            }
          } catch (e) {
            return
          }
          if (t !== -1 && f.isFile()) return
          if (f.isFile()) {
            s.add(e)
          } else if (f.isDirectory()) {
            if (validWildcard(e)) emitAssetDirectory(e)
          }
        }
        function validWildcard(t) {
          let s = ''
          if (t.endsWith(a.default.sep)) s = a.default.sep
          else if (t.endsWith(a.default.sep + c.WILDCARD))
            s = a.default.sep + c.WILDCARD
          else if (t.endsWith(c.WILDCARD)) s = c.WILDCARD
          if (t === E + s) return false
          if (t === K + s) return false
          if (t.endsWith(a.default.sep + 'node_modules' + s)) return false
          if (E.startsWith(t.slice(0, t.length - s.length) + a.default.sep))
            return false
          if (C) {
            const s =
              e.substring(0, e.indexOf(a.default.sep + 'node_modules')) +
              a.default.sep +
              'node_modules' +
              a.default.sep
            if (!t.startsWith(s)) {
              if (r.log)
                console.log(
                  'Skipping asset emission of ' +
                    t.replace(c.wildcardRegEx, '*') +
                    ' for ' +
                    e +
                    ' as it is outside the package base ' +
                    C
                )
              return false
            }
          }
          return true
        }
        function resolveAbsolutePathOrUrl(e) {
          return e instanceof w.URL
            ? (0, w.fileURLToPath)(e)
            : e.startsWith('file:')
            ? (0, w.fileURLToPath)(new w.URL(e))
            : a.default.resolve(e)
        }
        async function emitStaticChildAsset() {
          if (!X) {
            return
          }
          if ('value' in X && isAbsolutePathOrUrl(X.value)) {
            try {
              const e = resolveAbsolutePathOrUrl(X.value)
              await emitAssetPath(e)
            } catch (e) {}
          } else if (
            'then' in X &&
            'else' in X &&
            isAbsolutePathOrUrl(X.then) &&
            isAbsolutePathOrUrl(X.else)
          ) {
            let e
            try {
              e = resolveAbsolutePathOrUrl(X.then)
            } catch (e) {}
            let t
            try {
              t = resolveAbsolutePathOrUrl(X.else)
            } catch (e) {}
            if (e) await emitAssetPath(e)
            if (t) await emitAssetPath(t)
          } else if (
            Z &&
            Z.type === 'ArrayExpression' &&
            'value' in X &&
            X.value instanceof Array
          ) {
            for (const e of X.value) {
              try {
                const t = resolveAbsolutePathOrUrl(e)
                await emitAssetPath(t)
              } catch (e) {}
            }
          }
          Z = X = undefined
        }
      }
      t['default'] = analyze
      function isAst(e) {
        return 'body' in e
      }
    },
    817: function (e, t, r) {
      'use strict'
      var s =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e }
        }
      Object.defineProperty(t, '__esModule', { value: true })
      t.CachedFileSystem = void 0
      const a = r(1017)
      const o = s(r(6450))
      const u = r(7574)
      const c = o.default.promises.readFile
      const f = o.default.promises.readlink
      const d = o.default.promises.stat
      class CachedFileSystem {
        constructor({ cache: e, fileIOConcurrency: t }) {
          this.fileIOQueue = new u.Sema(t)
          this.fileCache = e?.fileCache ?? new Map()
          this.statCache = e?.statCache ?? new Map()
          this.symlinkCache = e?.symlinkCache ?? new Map()
          if (e) {
            e.fileCache = this.fileCache
            e.statCache = this.statCache
            e.symlinkCache = this.symlinkCache
          }
        }
        async readlink(e) {
          const t = this.symlinkCache.get(e)
          if (t !== undefined) return t
          const r = this.executeFileIO(e, this._internalReadlink)
          this.symlinkCache.set(e, r)
          return r
        }
        async readFile(e) {
          const t = this.fileCache.get(e)
          if (t !== undefined) return t
          const r = this.executeFileIO(e, this._internalReadFile)
          this.fileCache.set(e, r)
          return r
        }
        async stat(e) {
          const t = this.statCache.get(e)
          if (t !== undefined) return t
          const r = this.executeFileIO(e, this._internalStat)
          this.statCache.set(e, r)
          return r
        }
        async _internalReadlink(e) {
          try {
            const t = await f(e)
            const r = this.statCache.get(e)
            if (r) this.statCache.set((0, a.resolve)(e, t), r)
            return t
          } catch (e) {
            if (
              e.code !== 'EINVAL' &&
              e.code !== 'ENOENT' &&
              e.code !== 'UNKNOWN'
            )
              throw e
            return null
          }
        }
        async _internalReadFile(e) {
          try {
            return (await c(e)).toString()
          } catch (e) {
            if (e.code === 'ENOENT' || e.code === 'EISDIR') {
              return null
            }
            throw e
          }
        }
        async _internalStat(e) {
          try {
            return await d(e)
          } catch (e) {
            if (e.code === 'ENOENT') {
              return null
            }
            throw e
          }
        }
        async executeFileIO(e, t) {
          await this.fileIOQueue.acquire()
          try {
            return t.call(this, e)
          } finally {
            this.fileIOQueue.release()
          }
        }
      }
      t.CachedFileSystem = CachedFileSystem
    },
    4871: function (e, t, r) {
      'use strict'
      var s =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, r, s) {
              if (s === undefined) s = r
              var a = Object.getOwnPropertyDescriptor(t, r)
              if (
                !a ||
                ('get' in a ? !t.__esModule : a.writable || a.configurable)
              ) {
                a = {
                  enumerable: true,
                  get: function () {
                    return t[r]
                  },
                }
              }
              Object.defineProperty(e, s, a)
            }
          : function (e, t, r, s) {
              if (s === undefined) s = r
              e[s] = t[r]
            })
      var a =
        (this && this.__exportStar) ||
        function (e, t) {
          for (var r in e)
            if (r !== 'default' && !Object.prototype.hasOwnProperty.call(t, r))
              s(t, e, r)
        }
      var o =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e }
        }
      Object.defineProperty(t, '__esModule', { value: true })
      t.resolve = t.nodeFileTrace = void 0
      a(r(2711), t)
      var u = r(5281)
      Object.defineProperty(t, 'nodeFileTrace', {
        enumerable: true,
        get: function () {
          return u.nodeFileTrace
        },
      })
      const c = o(r(930))
      t.resolve = c.default
    },
    5281: function (e, t, r) {
      'use strict'
      var s =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, r, s) {
              if (s === undefined) s = r
              var a = Object.getOwnPropertyDescriptor(t, r)
              if (
                !a ||
                ('get' in a ? !t.__esModule : a.writable || a.configurable)
              ) {
                a = {
                  enumerable: true,
                  get: function () {
                    return t[r]
                  },
                }
              }
              Object.defineProperty(e, s, a)
            }
          : function (e, t, r, s) {
              if (s === undefined) s = r
              e[s] = t[r]
            })
      var a =
        (this && this.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', {
                enumerable: true,
                value: t,
              })
            }
          : function (e, t) {
              e['default'] = t
            })
      var o =
        (this && this.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e
          var t = {}
          if (e != null)
            for (var r in e)
              if (r !== 'default' && Object.prototype.hasOwnProperty.call(e, r))
                s(t, e, r)
          a(t, e)
          return t
        }
      var u =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e }
        }
      Object.defineProperty(t, '__esModule', { value: true })
      t.Job = t.nodeFileTrace = void 0
      const c = r(1017)
      const f = u(r(1121))
      const d = o(r(930))
      const p = r(1065)
      const h = r(8582)
      const v = r(1017)
      const g = r(817)
      function inPath(e, t) {
        const r = (0, v.join)(t, c.sep)
        return e.startsWith(r) && e !== r
      }
      async function nodeFileTrace(e, t = {}) {
        const r = new Job(t)
        if (t.readFile) r.readFile = t.readFile
        if (t.stat) r.stat = t.stat
        if (t.readlink) r.readlink = t.readlink
        if (t.resolve) r.resolve = t.resolve
        r.ts = true
        await Promise.all(
          e.map(async (e) => {
            const t = (0, c.resolve)(e)
            await r.emitFile(t, 'initial')
            return r.emitDependency(t)
          })
        )
        const s = {
          fileList: r.fileList,
          esmFileList: r.esmFileList,
          reasons: r.reasons,
          warnings: r.warnings,
        }
        return s
      }
      t.nodeFileTrace = nodeFileTrace
      class Job {
        constructor({
          base: e = process.cwd(),
          processCwd: t,
          exports: r,
          conditions: s = r || ['node'],
          exportsOnly: a = false,
          paths: o = {},
          ignore: u,
          log: f = false,
          mixedModules: h = false,
          ts: v = true,
          analysis: D = {},
          cache: y,
          fileIOConcurrency: m = 1024,
        }) {
          this.reasons = new Map()
          this.maybeEmitDep = async (e, t, r) => {
            let s = ''
            let a
            try {
              s = await this.resolve(e, t, this, r)
            } catch (o) {
              a = o
              try {
                if (
                  this.ts &&
                  e.endsWith('.js') &&
                  o instanceof d.NotFoundError
                ) {
                  const o = e.slice(0, -3) + '.ts'
                  s = await this.resolve(o, t, this, r)
                  a = undefined
                }
              } catch (e) {
                a = e
              }
            }
            if (a) {
              this.warnings.add(
                new Error(`Failed to resolve dependency "${e}":\n${a?.message}`)
              )
              return
            }
            if (Array.isArray(s)) {
              for (const e of s) {
                if (e.startsWith('node:')) return
                await this.emitDependency(e, t)
              }
            } else {
              if (s.startsWith('node:')) return
              await this.emitDependency(s, t)
            }
          }
          this.ts = v
          e = (0, c.resolve)(e)
          this.ignoreFn = (e) => {
            if (e.startsWith('..' + c.sep)) return true
            return false
          }
          if (typeof u === 'string') u = [u]
          if (typeof u === 'function') {
            const e = u
            this.ignoreFn = (t) => {
              if (t.startsWith('..' + c.sep)) return true
              if (e(t)) return true
              return false
            }
          } else if (Array.isArray(u)) {
            const t = u.map((t) =>
              (0, c.relative)(e, (0, c.resolve)(e || process.cwd(), t))
            )
            this.ignoreFn = (e) => {
              if (e.startsWith('..' + c.sep)) return true
              if ((0, p.isMatch)(e, t)) return true
              return false
            }
          }
          this.base = e
          this.cwd = (0, c.resolve)(t || e)
          this.conditions = s
          this.exportsOnly = a
          const _ = {}
          for (const t of Object.keys(o)) {
            const r = o[t].endsWith('/')
            const s = (0, c.resolve)(e, o[t])
            _[t] = s + (r ? '/' : '')
          }
          this.paths = _
          this.log = f
          this.mixedModules = h
          this.cachedFileSystem = new g.CachedFileSystem({
            cache: y,
            fileIOConcurrency: m,
          })
          this.analysis = {}
          if (D !== false) {
            Object.assign(
              this.analysis,
              {
                emitGlobs: true,
                computeFileReferences: true,
                evaluatePureExpressions: true,
              },
              D === true ? {} : D
            )
          }
          this.analysisCache = (y && y.analysisCache) || new Map()
          if (y) {
            y.analysisCache = this.analysisCache
          }
          this.fileList = new Set()
          this.esmFileList = new Set()
          this.processed = new Set()
          this.warnings = new Set()
        }
        async readlink(e) {
          return this.cachedFileSystem.readlink(e)
        }
        async isFile(e) {
          const t = await this.stat(e)
          if (t) return t.isFile()
          return false
        }
        async isDir(e) {
          const t = await this.stat(e)
          if (t) return t.isDirectory()
          return false
        }
        async stat(e) {
          return this.cachedFileSystem.stat(e)
        }
        async resolve(e, t, r, s) {
          return (0, d.default)(e, t, r, s)
        }
        async readFile(e) {
          return this.cachedFileSystem.readFile(e)
        }
        async realpath(e, t, r = new Set()) {
          if (r.has(e))
            throw new Error('Recursive symlink detected resolving ' + e)
          r.add(e)
          const s = await this.readlink(e)
          if (s) {
            const a = (0, c.dirname)(e)
            const o = (0, c.resolve)(a, s)
            const u = await this.realpath(a, t)
            if (inPath(e, u)) await this.emitFile(e, 'resolve', t, true)
            return this.realpath(o, t, r)
          }
          if (!inPath(e, this.base)) return e
          return (0, v.join)(
            await this.realpath((0, c.dirname)(e), t, r),
            (0, c.basename)(e)
          )
        }
        async emitFile(e, t, r, s = false) {
          if (!s) {
            e = await this.realpath(e, r)
          }
          e = (0, c.relative)(this.base, e)
          if (r) {
            r = (0, c.relative)(this.base, r)
          }
          let a = this.reasons.get(e)
          if (!a) {
            a = { type: [t], ignored: false, parents: new Set() }
            this.reasons.set(e, a)
          } else if (!a.type.includes(t)) {
            a.type.push(t)
          }
          if (r && this.ignoreFn(e, r)) {
            if (!this.fileList.has(e) && a) {
              a.ignored = true
            }
            return false
          }
          if (r) {
            a.parents.add(r)
          }
          this.fileList.add(e)
          return true
        }
        async getPjsonBoundary(e) {
          const t = e.indexOf(c.sep)
          let r
          while ((r = e.lastIndexOf(c.sep)) > t) {
            e = e.slice(0, r)
            if (await this.isFile(e + c.sep + 'package.json')) return e
          }
          return undefined
        }
        async emitDependency(e, t) {
          if (this.processed.has(e)) {
            if (t) {
              await this.emitFile(e, 'dependency', t)
            }
            return
          }
          this.processed.add(e)
          const r = await this.emitFile(e, 'dependency', t)
          if (!r) return
          if (e.endsWith('.json')) return
          if (e.endsWith('.node')) return await (0, h.sharedLibEmit)(e, this)
          if (e.endsWith('.js') || e.endsWith('.ts')) {
            const t = await this.getPjsonBoundary(e)
            if (t) await this.emitFile(t + c.sep + 'package.json', 'resolve', e)
          }
          let s
          const a = this.analysisCache.get(e)
          if (a) {
            s = a
          } else {
            const t = await this.readFile(e)
            if (t === null) throw new Error('File ' + e + ' does not exist.')
            s = await (0, f.default)(e, t.toString(), this)
            this.analysisCache.set(e, s)
          }
          const { deps: o, imports: u, assets: d, isESM: p } = s
          if (p) {
            this.esmFileList.add((0, c.relative)(this.base, e))
          }
          await Promise.all([
            ...[...d].map(async (t) => {
              const r = (0, c.extname)(t)
              if (
                r === '.js' ||
                r === '.mjs' ||
                r === '.node' ||
                r === '' ||
                (this.ts &&
                  (r === '.ts' || r === '.tsx') &&
                  t.startsWith(this.base) &&
                  t
                    .slice(this.base.length)
                    .indexOf(c.sep + 'node_modules' + c.sep) === -1)
              )
                await this.emitDependency(t, e)
              else await this.emitFile(t, 'asset', e)
            }),
            ...[...o].map(async (t) => this.maybeEmitDep(t, e, !p)),
            ...[...u].map(async (t) => this.maybeEmitDep(t, e, false)),
          ])
        }
      }
      t.Job = Job
    },
    930: (e, t, r) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: true })
      t.NotFoundError = void 0
      const s = r(1017)
      const a = r(8188)
      async function resolveDependency(e, t, r, a = true) {
        let o
        if (
          (0, s.isAbsolute)(e) ||
          e === '.' ||
          e === '..' ||
          e.startsWith('./') ||
          e.startsWith('../')
        ) {
          const a = e.endsWith('/')
          o = await resolvePath(
            (0, s.resolve)(t, '..', e) + (a ? '/' : ''),
            t,
            r
          )
        } else if (e[0] === '#') {
          o = await packageImportsResolve(e, t, r, a)
        } else {
          o = await resolvePackage(e, t, r, a)
        }
        if (Array.isArray(o)) {
          return Promise.all(o.map((e) => r.realpath(e, t)))
        } else if (o.startsWith('node:')) {
          return o
        } else {
          return r.realpath(o, t)
        }
      }
      t['default'] = resolveDependency
      async function resolvePath(e, t, r) {
        const s = (await resolveFile(e, t, r)) || (await resolveDir(e, t, r))
        if (!s) {
          throw new NotFoundError(e, t)
        }
        return s
      }
      async function resolveFile(e, t, r) {
        if (e.endsWith('/')) return undefined
        e = await r.realpath(e, t)
        if (await r.isFile(e)) return e
        if (
          r.ts &&
          e.startsWith(r.base) &&
          e.slice(r.base.length).indexOf(s.sep + 'node_modules' + s.sep) ===
            -1 &&
          (await r.isFile(e + '.ts'))
        )
          return e + '.ts'
        if (
          r.ts &&
          e.startsWith(r.base) &&
          e.slice(r.base.length).indexOf(s.sep + 'node_modules' + s.sep) ===
            -1 &&
          (await r.isFile(e + '.tsx'))
        )
          return e + '.tsx'
        if (await r.isFile(e + '.js')) return e + '.js'
        if (await r.isFile(e + '.json')) return e + '.json'
        if (await r.isFile(e + '.node')) return e + '.node'
        return undefined
      }
      async function resolveDir(e, t, r) {
        if (e.endsWith('/')) e = e.slice(0, -1)
        if (!(await r.isDir(e))) return
        const a = await getPkgCfg(e, r)
        if (a && typeof a.main === 'string') {
          const o =
            (await resolveFile((0, s.resolve)(e, a.main), t, r)) ||
            (await resolveFile((0, s.resolve)(e, a.main, 'index'), t, r))
          if (o) {
            await r.emitFile(e + s.sep + 'package.json', 'resolve', t)
            return o
          }
        }
        return resolveFile((0, s.resolve)(e, 'index'), t, r)
      }
      class NotFoundError extends Error {
        constructor(e, t) {
          super("Cannot find module '" + e + "' loaded from " + t)
          this.code = 'MODULE_NOT_FOUND'
        }
      }
      t.NotFoundError = NotFoundError
      const o = new Set(a.builtinModules)
      function getPkgName(e) {
        const t = e.split('/')
        if (e[0] === '@' && t.length > 1)
          return t.length > 1 ? t.slice(0, 2).join('/') : null
        return t.length ? t[0] : null
      }
      async function getPkgCfg(e, t) {
        const r = await t.readFile(e + s.sep + 'package.json')
        if (r) {
          try {
            return JSON.parse(r.toString())
          } catch (e) {}
        }
        return undefined
      }
      function getExportsTarget(e, t, r) {
        if (typeof e === 'string') {
          return e
        } else if (e === null) {
          return e
        } else if (Array.isArray(e)) {
          for (const s of e) {
            const e = getExportsTarget(s, t, r)
            if (e === null || (typeof e === 'string' && e.startsWith('./')))
              return e
          }
        } else if (typeof e === 'object') {
          for (const s of Object.keys(e)) {
            if (
              s === 'default' ||
              (s === 'require' && r) ||
              (s === 'import' && !r) ||
              t.includes(s)
            ) {
              const a = getExportsTarget(e[s], t, r)
              if (a !== undefined) return a
            }
          }
        }
        return undefined
      }
      function resolveExportsImports(e, t, r, s, a, o) {
        let u
        if (a) {
          if (!(typeof t === 'object' && !Array.isArray(t) && t !== null))
            return undefined
          u = t
        } else if (
          typeof t === 'string' ||
          Array.isArray(t) ||
          t === null ||
          (typeof t === 'object' &&
            Object.keys(t).length &&
            Object.keys(t)[0][0] !== '.')
        ) {
          u = { '.': t }
        } else {
          u = t
        }
        if (r in u) {
          const t = getExportsTarget(u[r], s.conditions, o)
          if (typeof t === 'string' && t.startsWith('./')) return e + t.slice(1)
        }
        for (const t of Object.keys(u).sort((e, t) => t.length - e.length)) {
          if (t.endsWith('*') && r.startsWith(t.slice(0, -1))) {
            const a = getExportsTarget(u[t], s.conditions, o)
            if (typeof a === 'string' && a.startsWith('./'))
              return e + a.slice(1).replace(/\*/g, r.slice(t.length - 1))
          }
          if (!t.endsWith('/')) continue
          if (r.startsWith(t)) {
            const a = getExportsTarget(u[t], s.conditions, o)
            if (typeof a === 'string' && a.endsWith('/') && a.startsWith('./'))
              return e + a.slice(1) + r.slice(t.length)
          }
        }
        return undefined
      }
      async function packageImportsResolve(e, t, r, a) {
        if (e !== '#' && !e.startsWith('#/') && r.conditions) {
          const o = await r.getPjsonBoundary(t)
          if (o) {
            const u = await getPkgCfg(o, r)
            const { imports: c } = u || {}
            if (u && c !== null && c !== undefined) {
              let u = resolveExportsImports(o, c, e, r, true, a)
              if (u) {
                if (a)
                  u =
                    (await resolveFile(u, t, r)) || (await resolveDir(u, t, r))
                else if (!(await r.isFile(u))) throw new NotFoundError(u, t)
                if (u) {
                  await r.emitFile(o + s.sep + 'package.json', 'resolve', t)
                  return u
                }
              }
            }
          }
        }
        throw new NotFoundError(e, t)
      }
      async function resolvePackage(e, t, r, a) {
        let u = t
        if (o.has(e)) return 'node:' + e
        if (e.startsWith('node:')) return e
        const c = getPkgName(e) || ''
        let f
        if (r.conditions) {
          const o = await r.getPjsonBoundary(t)
          if (o) {
            const u = await getPkgCfg(o, r)
            const { exports: d } = u || {}
            if (u && u.name && u.name === c && d !== null && d !== undefined) {
              f = resolveExportsImports(
                o,
                d,
                '.' + e.slice(c.length),
                r,
                false,
                a
              )
              if (f) {
                if (a)
                  f =
                    (await resolveFile(f, t, r)) || (await resolveDir(f, t, r))
                else if (!(await r.isFile(f))) throw new NotFoundError(f, t)
              }
              if (f) await r.emitFile(o + s.sep + 'package.json', 'resolve', t)
            }
          }
        }
        let d
        const p = u.indexOf(s.sep)
        while ((d = u.lastIndexOf(s.sep)) > p) {
          u = u.slice(0, d)
          const o = u + s.sep + 'node_modules'
          const p = await r.stat(o)
          if (!p || !p.isDirectory()) continue
          const h = await getPkgCfg(o + s.sep + c, r)
          const { exports: v } = h || {}
          if (r.conditions && v !== undefined && v !== null && !f) {
            let u
            if (!r.exportsOnly)
              u =
                (await resolveFile(o + s.sep + e, t, r)) ||
                (await resolveDir(o + s.sep + e, t, r))
            let f = resolveExportsImports(
              o + s.sep + c,
              v,
              '.' + e.slice(c.length),
              r,
              false,
              a
            )
            if (f) {
              if (a)
                f = (await resolveFile(f, t, r)) || (await resolveDir(f, t, r))
              else if (!(await r.isFile(f))) throw new NotFoundError(f, t)
            }
            if (f) {
              await r.emitFile(
                o + s.sep + c + s.sep + 'package.json',
                'resolve',
                t
              )
              if (u && u !== f) return [f, u]
              return f
            }
            if (u) return u
          } else {
            const a =
              (await resolveFile(o + s.sep + e, t, r)) ||
              (await resolveDir(o + s.sep + e, t, r))
            if (a) {
              if (f && f !== a) return [a, f]
              return a
            }
          }
        }
        if (f) return f
        if (Object.hasOwnProperty.call(r.paths, e)) {
          return r.paths[e]
        }
        for (const s of Object.keys(r.paths)) {
          if (s.endsWith('/') && e.startsWith(s)) {
            const a = r.paths[s] + e.slice(s.length)
            const o =
              (await resolveFile(a, t, r)) || (await resolveDir(a, t, r))
            if (!o) {
              throw new NotFoundError(e, t)
            }
            return o
          }
        }
        throw new NotFoundError(e, t)
      }
    },
    2711: (e, t) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: true })
    },
    5456: (e, t) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: true })
      t.isLoop = t.isVarLoop = t.isIdentifierRead = void 0
      function isIdentifierRead(e, t) {
        switch (t.type) {
          case 'ObjectPattern':
          case 'ArrayPattern':
            return false
          case 'AssignmentExpression':
            return t.right === e
          case 'MemberExpression':
            return t.computed || e === t.object
          case 'Property':
            return e === t.value
          case 'MethodDefinition':
            return false
          case 'VariableDeclarator':
            return t.id !== e
          case 'ExportSpecifier':
            return false
          case 'FunctionExpression':
          case 'FunctionDeclaration':
          case 'ArrowFunctionExpression':
            return false
          default:
            return true
        }
      }
      t.isIdentifierRead = isIdentifierRead
      function isVarLoop(e) {
        return (
          e.type === 'ForStatement' ||
          e.type === 'ForInStatement' ||
          e.type === 'ForOfStatement'
        )
      }
      t.isVarLoop = isVarLoop
      function isLoop(e) {
        return (
          e.type === 'ForStatement' ||
          e.type === 'ForInStatement' ||
          e.type === 'ForOfStatement' ||
          e.type === 'WhileStatement' ||
          e.type === 'DoWhileStatement'
        )
      }
      t.isLoop = isLoop
    },
    8137: function (__unused_webpack_module, exports, __nccwpck_require__) {
      'use strict'
      var __importDefault =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e }
        }
      Object.defineProperty(exports, '__esModule', { value: true })
      exports.nbind = exports.pregyp = void 0
      const path_1 = __importDefault(__nccwpck_require__(1017))
      const graceful_fs_1 = __importDefault(__nccwpck_require__(6450))
      const versioning = __nccwpck_require__(2821)
      const napi = __nccwpck_require__(5977)
      const pregypFind = (e, t) => {
        const r = JSON.parse(graceful_fs_1.default.readFileSync(e).toString())
        versioning.validate_config(r, t)
        var s
        if (napi.get_napi_build_versions(r, t)) {
          s = napi.get_best_napi_build_version(r, t)
        }
        t = t || {}
        if (!t.module_root) t.module_root = path_1.default.dirname(e)
        var a = versioning.evaluate(r, t, s)
        return a.module
      }
      exports.pregyp = { default: { find: pregypFind }, find: pregypFind }
      function makeModulePathList(e, t) {
        return [
          [e, t],
          [e, 'build', t],
          [e, 'build', 'Debug', t],
          [e, 'build', 'Release', t],
          [e, 'out', 'Debug', t],
          [e, 'Debug', t],
          [e, 'out', 'Release', t],
          [e, 'Release', t],
          [e, 'build', 'default', t],
          [
            e,
            process.env['NODE_BINDINGS_COMPILED_DIR'] || 'compiled',
            process.versions.node,
            process.platform,
            process.arch,
            t,
          ],
        ]
      }
      function findCompiledModule(basePath, specList) {
        var resolvedList = []
        var ext = path_1.default.extname(basePath)
        for (var _i = 0, specList_1 = specList; _i < specList_1.length; _i++) {
          var spec = specList_1[_i]
          if (ext == spec.ext) {
            try {
              spec.path = eval('require.resolve(basePath)')
              return spec
            } catch (e) {
              resolvedList.push(basePath)
            }
          }
        }
        for (var _a = 0, specList_2 = specList; _a < specList_2.length; _a++) {
          var spec = specList_2[_a]
          for (
            var _b = 0, _c = makeModulePathList(basePath, spec.name);
            _b < _c.length;
            _b++
          ) {
            var pathParts = _c[_b]
            var resolvedPath = path_1.default.resolve.apply(
              path_1.default,
              pathParts
            )
            try {
              spec.path = eval('require.resolve(resolvedPath)')
            } catch (e) {
              resolvedList.push(resolvedPath)
              continue
            }
            return spec
          }
        }
        return null
      }
      function nbind(e = process.cwd()) {
        const t = findCompiledModule(e, [
          { ext: '.node', name: 'nbind.node', type: 'node' },
          { ext: '.js', name: 'nbind.js', type: 'emcc' },
        ])
        return t
      }
      exports.nbind = nbind
    },
    4010: (e, t) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: true })
      t.getPackageName = t.getPackageBase = void 0
      const r = /^(@[^\\\/]+[\\\/])?[^\\\/]+/
      function getPackageBase(e) {
        const t = e.lastIndexOf('node_modules')
        if (
          t !== -1 &&
          (e[t - 1] === '/' || e[t - 1] === '\\') &&
          (e[t + 12] === '/' || e[t + 12] === '\\')
        ) {
          const s = e.slice(t + 13).match(r)
          if (s) return e.slice(0, t + 13 + s[0].length)
        }
        return undefined
      }
      t.getPackageBase = getPackageBase
      function getPackageName(e) {
        const t = e.lastIndexOf('node_modules')
        if (
          t !== -1 &&
          (e[t - 1] === '/' || e[t - 1] === '\\') &&
          (e[t + 12] === '/' || e[t + 12] === '\\')
        ) {
          const s = e.slice(t + 13).match(r)
          if (s && s.length > 0) {
            return s[0].replace(/\\/g, '/')
          }
        }
        return undefined
      }
      t.getPackageName = getPackageName
    },
    2397: (e, t) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: true })
      t.normalizeWildcardRequire = t.normalizeDefaultRequire = void 0
      function normalizeDefaultRequire(e) {
        if (e && e.__esModule) return e
        return { default: e }
      }
      t.normalizeDefaultRequire = normalizeDefaultRequire
      const r = Object.prototype.hasOwnProperty
      function normalizeWildcardRequire(e) {
        if (e && e.__esModule) return e
        const t = {}
        for (const s in e) {
          if (!r.call(e, s)) continue
          t[s] = e[s]
        }
        t['default'] = e
        return t
      }
      t.normalizeWildcardRequire = normalizeWildcardRequire
    },
    8582: function (e, t, r) {
      'use strict'
      var s =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e }
        }
      Object.defineProperty(t, '__esModule', { value: true })
      t.sharedLibEmit = void 0
      const a = s(r(2037))
      const o = s(r(567))
      const u = r(4010)
      let c = ''
      switch (a.default.platform()) {
        case 'darwin':
          c = '/**/*.@(dylib|so?(.*))'
          break
        case 'win32':
          c = '/**/*.dll'
          break
        default:
          c = '/**/*.so?(.*)'
      }
      async function sharedLibEmit(e, t) {
        const r = (0, u.getPackageBase)(e)
        if (!r) return
        const s = await new Promise((e, t) =>
          (0, o.default)(
            r + c,
            { ignore: r + '/**/node_modules/**/*', dot: true },
            (r, s) => (r ? t(r) : e(s))
          )
        )
        await Promise.all(s.map((r) => t.emitFile(r, 'sharedlib', e)))
      }
      t.sharedLibEmit = sharedLibEmit
    },
    6903: function (e, t, r) {
      'use strict'
      var s =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e }
        }
      Object.defineProperty(t, '__esModule', { value: true })
      const a = r(1017)
      const o = s(r(930))
      const u = r(4010)
      const c = r(6450)
      const f = {
        '@generated/photon'({ id: e, emitAssetDirectory: t }) {
          if (e.endsWith('@generated/photon/index.js')) {
            t((0, a.resolve)((0, a.dirname)(e), 'runtime/'))
          }
        },
        argon2({ id: e, emitAssetDirectory: t }) {
          if (e.endsWith('argon2/argon2.js')) {
            t((0, a.resolve)((0, a.dirname)(e), 'build', 'Release'))
            t((0, a.resolve)((0, a.dirname)(e), 'prebuilds'))
            t((0, a.resolve)((0, a.dirname)(e), 'lib', 'binding'))
          }
        },
        bull({ id: e, emitAssetDirectory: t }) {
          if (e.endsWith('bull/lib/commands/index.js')) {
            t((0, a.resolve)((0, a.dirname)(e)))
          }
        },
        camaro({ id: e, emitAsset: t }) {
          if (e.endsWith('camaro/dist/camaro.js')) {
            t((0, a.resolve)((0, a.dirname)(e), 'camaro.wasm'))
          }
        },
        esbuild({ id: e, emitAssetDirectory: t }) {
          if (e.endsWith('esbuild/lib/main.js')) {
            const r = (0, a.resolve)(e, '..', '..', 'package.json')
            const s = JSON.parse((0, c.readFileSync)(r, 'utf8'))
            for (const r of Object.keys(s.optionalDependencies || {})) {
              const s = (0, a.resolve)(e, '..', '..', '..', r)
              t(s)
            }
          }
        },
        'google-gax'({ id: e, ast: t, emitAssetDirectory: r }) {
          if (e.endsWith('google-gax/build/src/grpc.js')) {
            for (const s of t.body) {
              if (
                s.type === 'VariableDeclaration' &&
                s.declarations[0].id.type === 'Identifier' &&
                s.declarations[0].id.name === 'googleProtoFilesDir'
              ) {
                r(
                  (0, a.resolve)(
                    (0, a.dirname)(e),
                    '../../../google-proto-files'
                  )
                )
              }
            }
          }
        },
        oracledb({ id: e, ast: t, emitAsset: r }) {
          if (e.endsWith('oracledb/lib/oracledb.js')) {
            for (const s of t.body) {
              if (
                s.type === 'ForStatement' &&
                'body' in s.body &&
                s.body.body &&
                Array.isArray(s.body.body) &&
                s.body.body[0] &&
                s.body.body[0].type === 'TryStatement' &&
                s.body.body[0].block.body[0] &&
                s.body.body[0].block.body[0].type === 'ExpressionStatement' &&
                s.body.body[0].block.body[0].expression.type ===
                  'AssignmentExpression' &&
                s.body.body[0].block.body[0].expression.operator === '=' &&
                s.body.body[0].block.body[0].expression.left.type ===
                  'Identifier' &&
                s.body.body[0].block.body[0].expression.left.name ===
                  'oracledbCLib' &&
                s.body.body[0].block.body[0].expression.right.type ===
                  'CallExpression' &&
                s.body.body[0].block.body[0].expression.right.callee.type ===
                  'Identifier' &&
                s.body.body[0].block.body[0].expression.right.callee.name ===
                  'require' &&
                s.body.body[0].block.body[0].expression.right.arguments
                  .length === 1 &&
                s.body.body[0].block.body[0].expression.right.arguments[0]
                  .type === 'MemberExpression' &&
                s.body.body[0].block.body[0].expression.right.arguments[0]
                  .computed === true &&
                s.body.body[0].block.body[0].expression.right.arguments[0]
                  .object.type === 'Identifier' &&
                s.body.body[0].block.body[0].expression.right.arguments[0]
                  .object.name === 'binaryLocations' &&
                s.body.body[0].block.body[0].expression.right.arguments[0]
                  .property.type === 'Identifier' &&
                s.body.body[0].block.body[0].expression.right.arguments[0]
                  .property.name === 'i'
              ) {
                s.body.body[0].block.body[0].expression.right.arguments = [
                  { type: 'Literal', value: '_' },
                ]
                const t = global._unit
                  ? '3.0.0'
                  : JSON.parse(
                      (0, c.readFileSync)(
                        e.slice(0, -15) + 'package.json',
                        'utf8'
                      )
                    ).version
                const o = Number(t.slice(0, t.indexOf('.'))) >= 4
                const u =
                  'oracledb-' +
                  (o ? t : 'abi' + process.versions.modules) +
                  '-' +
                  process.platform +
                  '-' +
                  process.arch +
                  '.node'
                r((0, a.resolve)(e, '../../build/Release/' + u))
              }
            }
          }
        },
        'phantomjs-prebuilt'({ id: e, emitAssetDirectory: t }) {
          if (e.endsWith('phantomjs-prebuilt/lib/phantomjs.js')) {
            t((0, a.resolve)((0, a.dirname)(e), '..', 'bin'))
          }
        },
        'remark-prism'({ id: e, emitAssetDirectory: t }) {
          const r = 'remark-prism/src/highlight.js'
          if (e.endsWith(r)) {
            try {
              const s = e.slice(0, -r.length)
              t((0, a.resolve)(s, 'prismjs', 'components'))
            } catch (e) {}
          }
        },
        semver({ id: e, emitAsset: t }) {
          if (e.endsWith('semver/index.js')) {
            t((0, a.resolve)(e.replace('index.js', 'preload.js')))
          }
        },
        sharp: async ({ id: e, emitAssetDirectory: t, job: r }) => {
          if (e.endsWith('sharp/lib/index.js')) {
            const s = (0, a.resolve)(e, '..', '..', 'package.json')
            const o = JSON.parse((0, c.readFileSync)(s, 'utf8'))
            for (const s of Object.keys(o.optionalDependencies || {})) {
              const o = (0, a.resolve)(e, '..', '..', '..', s)
              t(o)
              try {
                const e = (0, a.resolve)(o, 'package.json')
                const s = JSON.parse((0, c.readFileSync)(e, 'utf8'))
                for (const e of Object.keys(s.optionalDependencies || {})) {
                  const s = (0, a.resolve)(await r.realpath(o), '..', '..', e)
                  t(s)
                }
              } catch (e) {
                if (e && e.code !== 'ENOENT') {
                  console.error(
                    `Error reading "sharp" dependencies from "${o}/package.json"'`
                  )
                  throw e
                }
              }
            }
          }
        },
        shiki({ id: e, emitAssetDirectory: t }) {
          if (e.endsWith('/dist/index.js')) {
            t((0, a.resolve)((0, a.dirname)(e), '..', 'languages'))
            t((0, a.resolve)((0, a.dirname)(e), '..', 'themes'))
          }
        },
        'socket.io': async function ({ id: e, ast: t, job: r }) {
          if (e.endsWith('socket.io/lib/index.js')) {
            async function replaceResolvePathStatement(t) {
              if (
                t.type === 'ExpressionStatement' &&
                t.expression.type === 'AssignmentExpression' &&
                t.expression.operator === '=' &&
                t.expression.right.type === 'CallExpression' &&
                t.expression.right.callee.type === 'Identifier' &&
                t.expression.right.callee.name === 'read' &&
                t.expression.right.arguments.length >= 1 &&
                t.expression.right.arguments[0].type === 'CallExpression' &&
                t.expression.right.arguments[0].callee.type === 'Identifier' &&
                t.expression.right.arguments[0].callee.name === 'resolvePath' &&
                t.expression.right.arguments[0].arguments.length === 1 &&
                t.expression.right.arguments[0].arguments[0].type === 'Literal'
              ) {
                const s = t.expression.right.arguments[0].arguments[0].value
                let u
                try {
                  const t = await (0, o.default)(String(s), e, r)
                  if (typeof t === 'string') {
                    u = t
                  } else {
                    return undefined
                  }
                } catch (e) {
                  return undefined
                }
                const c = '/' + (0, a.relative)((0, a.dirname)(e), u)
                t.expression.right.arguments[0] = {
                  type: 'BinaryExpression',
                  start: t.expression.right.arguments[0].start,
                  end: t.expression.right.arguments[0].end,
                  operator: '+',
                  left: { type: 'Identifier', name: '__dirname' },
                  right: { type: 'Literal', value: c, raw: JSON.stringify(c) },
                }
              }
              return undefined
            }
            for (const e of t.body) {
              if (
                e.type === 'ExpressionStatement' &&
                e.expression.type === 'AssignmentExpression' &&
                e.expression.operator === '=' &&
                e.expression.left.type === 'MemberExpression' &&
                e.expression.left.object.type === 'MemberExpression' &&
                e.expression.left.object.object.type === 'Identifier' &&
                e.expression.left.object.object.name === 'Server' &&
                e.expression.left.object.property.type === 'Identifier' &&
                e.expression.left.object.property.name === 'prototype' &&
                e.expression.left.property.type === 'Identifier' &&
                e.expression.left.property.name === 'serveClient' &&
                e.expression.right.type === 'FunctionExpression'
              ) {
                for (const t of e.expression.right.body.body) {
                  if (
                    t.type === 'IfStatement' &&
                    t.consequent &&
                    'body' in t.consequent &&
                    t.consequent.body
                  ) {
                    const e = t.consequent.body
                    let r = false
                    if (
                      Array.isArray(e) &&
                      e[0] &&
                      e[0].type === 'ExpressionStatement'
                    ) {
                      r = await replaceResolvePathStatement(e[0])
                    }
                    if (
                      Array.isArray(e) &&
                      e[1] &&
                      e[1].type === 'TryStatement' &&
                      e[1].block.body &&
                      e[1].block.body[0]
                    ) {
                      r =
                        (await replaceResolvePathStatement(
                          e[1].block.body[0]
                        )) || r
                    }
                    return
                  }
                }
              }
            }
          }
        },
        typescript({ id: e, emitAssetDirectory: t }) {
          if (e.endsWith('typescript/lib/tsc.js')) {
            t((0, a.resolve)(e, '../'))
          }
        },
        'uglify-es'({ id: e, emitAsset: t }) {
          if (e.endsWith('uglify-es/tools/node.js')) {
            t((0, a.resolve)(e, '../../lib/utils.js'))
            t((0, a.resolve)(e, '../../lib/ast.js'))
            t((0, a.resolve)(e, '../../lib/parse.js'))
            t((0, a.resolve)(e, '../../lib/transform.js'))
            t((0, a.resolve)(e, '../../lib/scope.js'))
            t((0, a.resolve)(e, '../../lib/output.js'))
            t((0, a.resolve)(e, '../../lib/compress.js'))
            t((0, a.resolve)(e, '../../lib/sourcemap.js'))
            t((0, a.resolve)(e, '../../lib/mozilla-ast.js'))
            t((0, a.resolve)(e, '../../lib/propmangle.js'))
            t((0, a.resolve)(e, '../../lib/minify.js'))
            t((0, a.resolve)(e, '../exports.js'))
          }
        },
        'uglify-js'({ id: e, emitAsset: t, emitAssetDirectory: r }) {
          if (e.endsWith('uglify-js/tools/node.js')) {
            r((0, a.resolve)(e, '../../lib'))
            t((0, a.resolve)(e, '../exports.js'))
          }
        },
        'playwright-core'({ id: e, emitAsset: t }) {
          if (e.endsWith('playwright-core/index.js')) {
            t((0, a.resolve)((0, a.dirname)(e), 'browsers.json'))
          }
        },
        'geo-tz'({ id: e, emitAsset: t }) {
          if (e.endsWith('geo-tz/dist/geo-tz.js')) {
            t((0, a.resolve)((0, a.dirname)(e), '../data/geo.dat'))
          }
        },
        pixelmatch({ id: e, emitDependency: t }) {
          if (e.endsWith('pixelmatch/index.js')) {
            t((0, a.resolve)((0, a.dirname)(e), 'bin/pixelmatch'))
          }
        },
      }
      async function handleSpecialCases({
        id: e,
        ast: t,
        emitDependency: r,
        emitAsset: s,
        emitAssetDirectory: a,
        job: o,
      }) {
        const c = (0, u.getPackageName)(e)
        const d = f[c || '']
        e = e.replace(/\\/g, '/')
        if (d)
          await d({
            id: e,
            ast: t,
            emitDependency: r,
            emitAsset: s,
            emitAssetDirectory: a,
            job: o,
          })
      }
      t['default'] = handleSpecialCases
    },
    9770: (e, t, r) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: true })
      t.wildcardRegEx =
        t.WILDCARD =
        t.FUNCTION =
        t.UNKNOWN =
        t.evaluate =
          void 0
      const s = r(7310)
      async function evaluate(e, t = {}, r = true) {
        const s = { computeBranches: r, vars: t }
        return walk(e)
        function walk(e) {
          const t = a[e.type]
          if (t) {
            return t.call(s, e, walk)
          }
          return undefined
        }
      }
      t.evaluate = evaluate
      t.UNKNOWN = Symbol()
      t.FUNCTION = Symbol()
      t.WILDCARD = ''
      t.wildcardRegEx = /\x1a/g
      function countWildcards(e) {
        t.wildcardRegEx.lastIndex = 0
        let r = 0
        while (t.wildcardRegEx.exec(e)) r++
        return r
      }
      const a = {
        ArrayExpression: async function ArrayExpression(e, t) {
          const r = []
          for (let s = 0, a = e.elements.length; s < a; s++) {
            if (e.elements[s] === null) {
              r.push(null)
              continue
            }
            const a = await t(e.elements[s])
            if (!a) return
            if ('value' in a === false) return
            r.push(a.value)
          }
          return { value: r }
        },
        ArrowFunctionExpression: async function (e, r) {
          if (
            e.params.length === 0 &&
            !e.generator &&
            !e.async &&
            e.expression
          ) {
            const s = await r(e.body)
            if (!s || !('value' in s)) return
            return { value: { [t.FUNCTION]: () => s.value } }
          }
          return undefined
        },
        BinaryExpression: async function BinaryExpression(e, r) {
          const s = e.operator
          let a = await r(e.left)
          if (!a && s !== '+') return
          let o = await r(e.right)
          if (!a && !o) return
          if (!a) {
            if (
              this.computeBranches &&
              o &&
              'value' in o &&
              typeof o.value === 'string'
            )
              return {
                value: t.WILDCARD + o.value,
                wildcards: [e.left, ...(o.wildcards || [])],
              }
            return
          }
          if (!o) {
            if (this.computeBranches && s === '+') {
              if (a && 'value' in a && typeof a.value === 'string')
                return {
                  value: a.value + t.WILDCARD,
                  wildcards: [...(a.wildcards || []), e.right],
                }
            }
            if (!('test' in a) && s === '||' && a.value) return a
            return
          }
          if ('test' in a && 'value' in o) {
            const e = o.value
            if (s === '==')
              return { test: a.test, then: a.then == e, else: a.else == e }
            if (s === '===')
              return { test: a.test, then: a.then === e, else: a.else === e }
            if (s === '!=')
              return { test: a.test, then: a.then != e, else: a.else != e }
            if (s === '!==')
              return { test: a.test, then: a.then !== e, else: a.else !== e }
            if (s === '+')
              return { test: a.test, then: a.then + e, else: a.else + e }
            if (s === '-')
              return { test: a.test, then: a.then - e, else: a.else - e }
            if (s === '*')
              return { test: a.test, then: a.then * e, else: a.else * e }
            if (s === '/')
              return { test: a.test, then: a.then / e, else: a.else / e }
            if (s === '%')
              return { test: a.test, then: a.then % e, else: a.else % e }
            if (s === '<')
              return { test: a.test, then: a.then < e, else: a.else < e }
            if (s === '<=')
              return { test: a.test, then: a.then <= e, else: a.else <= e }
            if (s === '>')
              return { test: a.test, then: a.then > e, else: a.else > e }
            if (s === '>=')
              return { test: a.test, then: a.then >= e, else: a.else >= e }
            if (s === '|')
              return { test: a.test, then: a.then | e, else: a.else | e }
            if (s === '&')
              return { test: a.test, then: a.then & e, else: a.else & e }
            if (s === '^')
              return { test: a.test, then: a.then ^ e, else: a.else ^ e }
            if (s === '&&')
              return { test: a.test, then: a.then && e, else: a.else && e }
            if (s === '||')
              return { test: a.test, then: a.then || e, else: a.else || e }
          } else if ('test' in o && 'value' in a) {
            const e = a.value
            if (s === '==')
              return { test: o.test, then: e == o.then, else: e == o.else }
            if (s === '===')
              return { test: o.test, then: e === o.then, else: e === o.else }
            if (s === '!=')
              return { test: o.test, then: e != o.then, else: e != o.else }
            if (s === '!==')
              return { test: o.test, then: e !== o.then, else: e !== o.else }
            if (s === '+')
              return { test: o.test, then: e + o.then, else: e + o.else }
            if (s === '-')
              return { test: o.test, then: e - o.then, else: e - o.else }
            if (s === '*')
              return { test: o.test, then: e * o.then, else: e * o.else }
            if (s === '/')
              return { test: o.test, then: e / o.then, else: e / o.else }
            if (s === '%')
              return { test: o.test, then: e % o.then, else: e % o.else }
            if (s === '<')
              return { test: o.test, then: e < o.then, else: e < o.else }
            if (s === '<=')
              return { test: o.test, then: e <= o.then, else: e <= o.else }
            if (s === '>')
              return { test: o.test, then: e > o.then, else: e > o.else }
            if (s === '>=')
              return { test: o.test, then: e >= o.then, else: e >= o.else }
            if (s === '|')
              return { test: o.test, then: e | o.then, else: e | o.else }
            if (s === '&')
              return { test: o.test, then: e & o.then, else: e & o.else }
            if (s === '^')
              return { test: o.test, then: e ^ o.then, else: e ^ o.else }
            if (s === '&&')
              return { test: o.test, then: e && o.then, else: a && o.else }
            if (s === '||')
              return { test: o.test, then: e || o.then, else: a || o.else }
          } else if ('value' in a && 'value' in o) {
            if (s === '==') return { value: a.value == o.value }
            if (s === '===') return { value: a.value === o.value }
            if (s === '!=') return { value: a.value != o.value }
            if (s === '!==') return { value: a.value !== o.value }
            if (s === '+') {
              const e = { value: a.value + o.value }
              let t = []
              if ('wildcards' in a && a.wildcards) {
                t = t.concat(a.wildcards)
              }
              if ('wildcards' in o && o.wildcards) {
                t = t.concat(o.wildcards)
              }
              if (t.length > 0) {
                e.wildcards = t
              }
              return e
            }
            if (s === '-') return { value: a.value - o.value }
            if (s === '*') return { value: a.value * o.value }
            if (s === '/') return { value: a.value / o.value }
            if (s === '%') return { value: a.value % o.value }
            if (s === '<') return { value: a.value < o.value }
            if (s === '<=') return { value: a.value <= o.value }
            if (s === '>') return { value: a.value > o.value }
            if (s === '>=') return { value: a.value >= o.value }
            if (s === '|') return { value: a.value | o.value }
            if (s === '&') return { value: a.value & o.value }
            if (s === '^') return { value: a.value ^ o.value }
            if (s === '&&') return { value: a.value && o.value }
            if (s === '||') return { value: a.value || o.value }
          }
          return
        },
        CallExpression: async function CallExpression(e, r) {
          const s = await r(e.callee)
          if (!s || 'test' in s) return
          let a = s.value
          if (typeof a === 'object' && a !== null) a = a[t.FUNCTION]
          if (typeof a !== 'function') return
          let o = null
          if (e.callee.object) {
            o = await r(e.callee.object)
            o = o && 'value' in o && o.value ? o.value : null
          }
          let u
          let c = []
          let f
          let d = e.arguments.length > 0 && e.callee.property?.name !== 'concat'
          const p = []
          for (let s = 0, a = e.arguments.length; s < a; s++) {
            let a = await r(e.arguments[s])
            if (a) {
              d = false
              if ('value' in a && typeof a.value === 'string' && a.wildcards)
                a.wildcards.forEach((e) => p.push(e))
            } else {
              if (!this.computeBranches) return
              a = { value: t.WILDCARD }
              p.push(e.arguments[s])
            }
            if ('test' in a) {
              if (p.length) return
              if (u) return
              u = a.test
              f = c.concat([])
              c.push(a.then)
              f.push(a.else)
            } else {
              c.push(a.value)
              if (f) f.push(a.value)
            }
          }
          if (d) return
          try {
            const e = await a.apply(o, c)
            if (e === t.UNKNOWN) return
            if (!u) {
              if (p.length) {
                if (typeof e !== 'string' || countWildcards(e) !== p.length)
                  return
                return { value: e, wildcards: p }
              }
              return { value: e }
            }
            const r = await a.apply(o, f)
            if (e === t.UNKNOWN) return
            return { test: u, then: e, else: r }
          } catch (e) {
            return
          }
        },
        ConditionalExpression: async function ConditionalExpression(e, t) {
          const r = await t(e.test)
          if (r && 'value' in r)
            return r.value ? t(e.consequent) : t(e.alternate)
          if (!this.computeBranches) return
          const s = await t(e.consequent)
          if (!s || 'wildcards' in s || 'test' in s) return
          const a = await t(e.alternate)
          if (!a || 'wildcards' in a || 'test' in a) return
          return { test: e.test, then: s.value, else: a.value }
        },
        ExpressionStatement: async function ExpressionStatement(e, t) {
          return t(e.expression)
        },
        Identifier: async function Identifier(e, t) {
          if (Object.hasOwnProperty.call(this.vars, e.name))
            return this.vars[e.name]
          return undefined
        },
        Literal: async function Literal(e, t) {
          return { value: e.value }
        },
        MemberExpression: async function MemberExpression(e, r) {
          const s = await r(e.object)
          if (!s || 'test' in s || typeof s.value === 'function') {
            return undefined
          }
          if (e.property.type === 'Identifier') {
            if (typeof s.value === 'string' && e.property.name === 'concat') {
              return { value: { [t.FUNCTION]: (...e) => s.value.concat(e) } }
            }
            if (typeof s.value === 'object' && s.value !== null) {
              const a = s.value
              if (e.computed) {
                const o = await r(e.property)
                if (o && 'value' in o && o.value) {
                  const e = a[o.value]
                  if (e === t.UNKNOWN) return undefined
                  return { value: e }
                }
                if (!a[t.UNKNOWN] && Object.keys(s).length === 0) {
                  return { value: undefined }
                }
              } else if (e.property.name in a) {
                const r = a[e.property.name]
                if (r === t.UNKNOWN) return undefined
                return { value: r }
              } else if (a[t.UNKNOWN]) return undefined
            } else {
              return { value: undefined }
            }
          }
          const a = await r(e.property)
          if (!a || 'test' in a) return undefined
          if (typeof s.value === 'object' && s.value !== null) {
            if (a.value in s.value) {
              const e = s.value[a.value]
              if (e === t.UNKNOWN) return undefined
              return { value: e }
            } else if (s.value[t.UNKNOWN]) {
              return undefined
            }
          } else {
            return { value: undefined }
          }
          return undefined
        },
        MetaProperty: async function MetaProperty(e) {
          if (e.meta.name === 'import' && e.property.name === 'meta')
            return { value: this.vars['import.meta'] }
          return undefined
        },
        NewExpression: async function NewExpression(e, t) {
          const r = await t(e.callee)
          if (r && 'value' in r && r.value === s.URL && e.arguments.length) {
            const r = await t(e.arguments[0])
            if (!r) return undefined
            let a = null
            if (e.arguments[1]) {
              a = await t(e.arguments[1])
              if (!a || !('value' in a)) return undefined
            }
            if ('value' in r) {
              if (a) {
                try {
                  return { value: new s.URL(r.value, a.value) }
                } catch {
                  return undefined
                }
              }
              try {
                return { value: new s.URL(r.value) }
              } catch {
                return undefined
              }
            } else {
              const e = r.test
              if (a) {
                try {
                  return {
                    test: e,
                    then: new s.URL(r.then, a.value),
                    else: new s.URL(r.else, a.value),
                  }
                } catch {
                  return undefined
                }
              }
              try {
                return {
                  test: e,
                  then: new s.URL(r.then),
                  else: new s.URL(r.else),
                }
              } catch {
                return undefined
              }
            }
          }
          return undefined
        },
        ObjectExpression: async function ObjectExpression(e, r) {
          const s = {}
          for (let a = 0; a < e.properties.length; a++) {
            const o = e.properties[a]
            const u = o.computed
              ? r(o.key)
              : o.key && { value: o.key.name || o.key.value }
            if (!u || 'test' in u) return
            const c = await r(o.value)
            if (!c || 'test' in c) return
            if (c.value === t.UNKNOWN) return
            s[u.value] = c.value
          }
          return { value: s }
        },
        SequenceExpression: async function SequenceExpression(e, t) {
          if (
            'expressions' in e &&
            e.expressions.length === 2 &&
            e.expressions[0].type === 'Literal' &&
            e.expressions[0].value === 0 &&
            e.expressions[1].type === 'MemberExpression'
          ) {
            const r = await t(e.expressions[1])
            return r
          }
          return undefined
        },
        TemplateLiteral: async function TemplateLiteral(e, r) {
          let s = { value: '' }
          for (var a = 0; a < e.expressions.length; a++) {
            if ('value' in s) {
              s.value += e.quasis[a].value.cooked
            } else {
              s.then += e.quasis[a].value.cooked
              s.else += e.quasis[a].value.cooked
            }
            let o = await r(e.expressions[a])
            if (!o) {
              if (!this.computeBranches) return undefined
              o = { value: t.WILDCARD, wildcards: [e.expressions[a]] }
            }
            if ('value' in o) {
              if ('value' in s) {
                s.value += o.value
                if (o.wildcards)
                  s.wildcards = [...(s.wildcards || []), ...o.wildcards]
              } else {
                if (o.wildcards) return
                s.then += o.value
                s.else += o.value
              }
            } else if ('value' in s) {
              if ('wildcards' in s) {
                return
              }
              s = {
                test: o.test,
                then: s.value + o.then,
                else: s.value + o.else,
              }
            } else {
              return
            }
          }
          if ('value' in s) {
            s.value += e.quasis[a].value.cooked
          } else {
            s.then += e.quasis[a].value.cooked
            s.else += e.quasis[a].value.cooked
          }
          return s
        },
        ThisExpression: async function ThisExpression(e, t) {
          if (Object.hasOwnProperty.call(this.vars, 'this'))
            return this.vars['this']
          return undefined
        },
        UnaryExpression: async function UnaryExpression(e, t) {
          const r = await t(e.argument)
          if (!r) return undefined
          if ('value' in r && 'wildcards' in r === false) {
            if (e.operator === '+') return { value: +r.value }
            if (e.operator === '-') return { value: -r.value }
            if (e.operator === '~') return { value: ~r.value }
            if (e.operator === '!') return { value: !r.value }
          } else if ('test' in r && 'wildcards' in r === false) {
            if (e.operator === '+')
              return { test: r.test, then: +r.then, else: +r.else }
            if (e.operator === '-')
              return { test: r.test, then: -r.then, else: -r.else }
            if (e.operator === '~')
              return { test: r.test, then: ~r.then, else: ~r.else }
            if (e.operator === '!')
              return { test: r.test, then: !r.then, else: !r.else }
          }
          return undefined
        },
      }
      a.LogicalExpression = a.BinaryExpression
    },
    3939: (e, t, r) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: true })
      t.handleWrappers = void 0
      const s = r(3982)
      function isUndefinedOrVoid(e) {
        return (
          (e.type === 'Identifier' && e.name === 'undefined') ||
          (e.type === 'UnaryExpression' &&
            e.operator === 'void' &&
            e.argument.type === 'Literal' &&
            e.argument.value === 0)
        )
      }
      function handleWrappers(e) {
        let t
        if (
          e.body.length === 1 &&
          e.body[0].type === 'ExpressionStatement' &&
          e.body[0].expression.type === 'UnaryExpression' &&
          e.body[0].expression.operator === '!' &&
          e.body[0].expression.argument.type === 'CallExpression' &&
          e.body[0].expression.argument.callee.type === 'FunctionExpression' &&
          e.body[0].expression.argument.arguments.length === 1
        )
          t = e.body[0].expression.argument
        else if (
          e.body.length === 1 &&
          e.body[0].type === 'ExpressionStatement' &&
          e.body[0].expression.type === 'CallExpression' &&
          e.body[0].expression.callee.type === 'FunctionExpression' &&
          (e.body[0].expression.arguments.length === 1 ||
            e.body[0].expression.arguments.length === 0)
        )
          t = e.body[0].expression
        else if (
          e.body.length === 1 &&
          e.body[0].type === 'ExpressionStatement' &&
          e.body[0].expression.type === 'AssignmentExpression' &&
          e.body[0].expression.left.type === 'MemberExpression' &&
          e.body[0].expression.left.object.type === 'Identifier' &&
          e.body[0].expression.left.object.name === 'module' &&
          e.body[0].expression.left.property.type === 'Identifier' &&
          e.body[0].expression.left.property.name === 'exports' &&
          e.body[0].expression.right.type === 'CallExpression' &&
          e.body[0].expression.right.callee.type === 'FunctionExpression' &&
          e.body[0].expression.right.arguments.length === 1
        )
          t = e.body[0].expression.right
        if (t) {
          let e
          let r
          if (
            t.arguments[0] &&
            t.arguments[0].type === 'ConditionalExpression' &&
            t.arguments[0].test.type === 'LogicalExpression' &&
            t.arguments[0].test.operator === '&&' &&
            t.arguments[0].test.left.type === 'BinaryExpression' &&
            t.arguments[0].test.left.operator === '===' &&
            t.arguments[0].test.left.left.type === 'UnaryExpression' &&
            t.arguments[0].test.left.left.operator === 'typeof' &&
            'name' in t.arguments[0].test.left.left.argument &&
            t.arguments[0].test.left.left.argument.name === 'define' &&
            t.arguments[0].test.left.right.type === 'Literal' &&
            t.arguments[0].test.left.right.value === 'function' &&
            t.arguments[0].test.right.type === 'MemberExpression' &&
            t.arguments[0].test.right.object.type === 'Identifier' &&
            t.arguments[0].test.right.property.type === 'Identifier' &&
            t.arguments[0].test.right.property.name === 'amd' &&
            t.arguments[0].test.right.computed === false &&
            t.arguments[0].alternate.type === 'FunctionExpression' &&
            t.arguments[0].alternate.params.length === 1 &&
            t.arguments[0].alternate.params[0].type === 'Identifier' &&
            t.arguments[0].alternate.body.body.length === 1 &&
            t.arguments[0].alternate.body.body[0].type ===
              'ExpressionStatement' &&
            t.arguments[0].alternate.body.body[0].expression.type ===
              'AssignmentExpression' &&
            t.arguments[0].alternate.body.body[0].expression.left.type ===
              'MemberExpression' &&
            t.arguments[0].alternate.body.body[0].expression.left.object
              .type === 'Identifier' &&
            t.arguments[0].alternate.body.body[0].expression.left.object
              .name === 'module' &&
            t.arguments[0].alternate.body.body[0].expression.left.property
              .type === 'Identifier' &&
            t.arguments[0].alternate.body.body[0].expression.left.property
              .name === 'exports' &&
            t.arguments[0].alternate.body.body[0].expression.left.computed ===
              false &&
            t.arguments[0].alternate.body.body[0].expression.right.type ===
              'CallExpression' &&
            t.arguments[0].alternate.body.body[0].expression.right.callee
              .type === 'Identifier' &&
            t.arguments[0].alternate.body.body[0].expression.right.callee
              .name === t.arguments[0].alternate.params[0].name &&
            'body' in t.callee &&
            'body' in t.callee.body &&
            Array.isArray(t.callee.body.body) &&
            t.arguments[0].alternate.body.body[0].expression.right.arguments
              .length === 1 &&
            t.arguments[0].alternate.body.body[0].expression.right.arguments[0]
              .type === 'Identifier' &&
            t.arguments[0].alternate.body.body[0].expression.right.arguments[0]
              .name === 'require'
          ) {
            let e = t.callee.body.body
            if (
              e[0].type === 'ExpressionStatement' &&
              e[0].expression.type === 'Literal' &&
              e[0].expression.value === 'use strict'
            ) {
              e = e.slice(1)
            }
            if (
              e.length === 1 &&
              e[0].type === 'ExpressionStatement' &&
              e[0].expression.type === 'CallExpression' &&
              e[0].expression.callee.type === 'Identifier' &&
              e[0].expression.callee.name ===
                t.arguments[0].test.right.object.name &&
              e[0].expression.arguments.length === 1 &&
              e[0].expression.arguments[0].type === 'FunctionExpression' &&
              e[0].expression.arguments[0].params.length === 1 &&
              e[0].expression.arguments[0].params[0].type === 'Identifier' &&
              e[0].expression.arguments[0].params[0].name === 'require'
            ) {
              const t = e[0].expression.arguments[0]
              t.params = []
              try {
                delete t.scope.declarations.require
              } catch (e) {}
            }
          } else if (
            t.arguments[0] &&
            t.arguments[0].type === 'FunctionExpression' &&
            t.arguments[0].params.length === 0 &&
            (t.arguments[0].body.body.length === 1 ||
              (t.arguments[0].body.body.length === 2 &&
                t.arguments[0].body.body[0].type === 'VariableDeclaration' &&
                t.arguments[0].body.body[0].declarations.length === 3 &&
                t.arguments[0].body.body[0].declarations.every(
                  (e) => e.init === null && e.id.type === 'Identifier'
                ))) &&
            t.arguments[0].body.body[t.arguments[0].body.body.length - 1]
              .type === 'ReturnStatement' &&
            (e =
              t.arguments[0].body.body[t.arguments[0].body.body.length - 1]) &&
            e.argument?.type === 'CallExpression' &&
            e.argument.arguments.length &&
            e.argument.arguments.every(
              (e) => e && e.type === 'Literal' && typeof e.value === 'number'
            ) &&
            e.argument.callee.type === 'CallExpression' &&
            (e.argument.callee.callee.type === 'FunctionExpression' ||
              (e.argument.callee.callee.type === 'CallExpression' &&
                e.argument.callee.callee.callee.type === 'FunctionExpression' &&
                e.argument.callee.callee.arguments.length === 0)) &&
            e.argument.callee.arguments.length === 3 &&
            e.argument.callee.arguments[0].type === 'ObjectExpression' &&
            e.argument.callee.arguments[1].type === 'ObjectExpression' &&
            e.argument.callee.arguments[2].type === 'ArrayExpression'
          ) {
            const t = e.argument.callee.arguments[0].properties
            const r = {}
            if (
              t.every((e) => {
                if (
                  e.type !== 'Property' ||
                  e.computed !== false ||
                  e.key.type !== 'Literal' ||
                  typeof e.key.value !== 'number' ||
                  e.value.type !== 'ArrayExpression' ||
                  e.value.elements.length !== 2 ||
                  !e.value.elements[0] ||
                  !e.value.elements[1] ||
                  e.value.elements[0].type !== 'FunctionExpression' ||
                  e.value.elements[1].type !== 'ObjectExpression'
                ) {
                  return false
                }
                const t = e.value.elements[1].properties
                for (const e of t) {
                  if (
                    e.type !== 'Property' ||
                    (e.value.type !== 'Identifier' &&
                      e.value.type !== 'Literal' &&
                      !isUndefinedOrVoid(e.value)) ||
                    !(
                      (e.key.type === 'Literal' &&
                        typeof e.key.value === 'string') ||
                      e.key.type === 'Identifier'
                    ) ||
                    e.computed
                  ) {
                    return false
                  }
                  if (isUndefinedOrVoid(e.value)) {
                    if (e.key.type === 'Identifier') {
                      r[e.key.name] = {
                        type: 'Literal',
                        start: e.key.start,
                        end: e.key.end,
                        value: e.key.name,
                        raw: JSON.stringify(e.key.name),
                      }
                    } else if (e.key.type === 'Literal') {
                      r[String(e.key.value)] = e.key
                    }
                  }
                }
                return true
              })
            ) {
              const t = Object.keys(r)
              const s = e.argument.callee.arguments[1]
              s.properties = t.map((e) => ({
                type: 'Property',
                method: false,
                shorthand: false,
                computed: false,
                kind: 'init',
                key: r[e],
                value: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: { type: 'Identifier', name: 'exports' },
                      value: {
                        type: 'CallExpression',
                        optional: false,
                        callee: { type: 'Identifier', name: 'require' },
                        arguments: [r[e]],
                      },
                    },
                  ],
                },
              }))
            }
          } else if (
            t.arguments[0] &&
            t.arguments[0].type === 'FunctionExpression' &&
            t.arguments[0].params.length === 2 &&
            t.arguments[0].params[0].type === 'Identifier' &&
            t.arguments[0].params[1].type === 'Identifier' &&
            'body' in t.callee &&
            'body' in t.callee.body &&
            Array.isArray(t.callee.body.body) &&
            t.callee.body.body.length === 1
          ) {
            const e = t.callee.body.body[0]
            if (
              e.type === 'IfStatement' &&
              e.test.type === 'LogicalExpression' &&
              e.test.operator === '&&' &&
              e.test.left.type === 'BinaryExpression' &&
              e.test.left.left.type === 'UnaryExpression' &&
              e.test.left.left.operator === 'typeof' &&
              e.test.left.left.argument.type === 'Identifier' &&
              e.test.left.left.argument.name === 'module' &&
              e.test.left.right.type === 'Literal' &&
              e.test.left.right.value === 'object' &&
              e.test.right.type === 'BinaryExpression' &&
              e.test.right.left.type === 'UnaryExpression' &&
              e.test.right.left.operator === 'typeof' &&
              e.test.right.left.argument.type === 'MemberExpression' &&
              e.test.right.left.argument.object.type === 'Identifier' &&
              e.test.right.left.argument.object.name === 'module' &&
              e.test.right.left.argument.property.type === 'Identifier' &&
              e.test.right.left.argument.property.name === 'exports' &&
              e.test.right.right.type === 'Literal' &&
              e.test.right.right.value === 'object' &&
              e.consequent.type === 'BlockStatement' &&
              e.consequent.body.length > 0
            ) {
              let r
              if (
                e.consequent.body[0].type === 'VariableDeclaration' &&
                e.consequent.body[0].declarations[0].init &&
                e.consequent.body[0].declarations[0].init.type ===
                  'CallExpression'
              )
                r = e.consequent.body[0].declarations[0].init
              else if (
                e.consequent.body[0].type === 'ExpressionStatement' &&
                e.consequent.body[0].expression.type === 'CallExpression'
              )
                r = e.consequent.body[0].expression
              else if (
                e.consequent.body[0].type === 'ExpressionStatement' &&
                e.consequent.body[0].expression.type ===
                  'AssignmentExpression' &&
                e.consequent.body[0].expression.operator === '=' &&
                e.consequent.body[0].expression.right.type === 'CallExpression'
              )
                r = e.consequent.body[0].expression.right
              if (
                r &&
                r.callee.type === 'Identifier' &&
                'params' in t.callee &&
                t.callee.params.length > 0 &&
                'name' in t.callee.params[0] &&
                r.callee.name === t.callee.params[0].name &&
                r.arguments.length === 2 &&
                r.arguments[0].type === 'Identifier' &&
                r.arguments[0].name === 'require' &&
                r.arguments[1].type === 'Identifier' &&
                r.arguments[1].name === 'exports'
              ) {
                const e = t.arguments[0]
                e.params = []
                try {
                  const t = e.scope
                  delete t.declarations.require
                  delete t.declarations.exports
                } catch (e) {}
              }
            }
          } else if (
            (t.callee.type === 'FunctionExpression' &&
              t.callee.body.body.length > 2 &&
              t.callee.body.body[0].type === 'VariableDeclaration' &&
              t.callee.body.body[0].declarations.length === 1 &&
              t.callee.body.body[0].declarations[0].type ===
                'VariableDeclarator' &&
              t.callee.body.body[0].declarations[0].id.type === 'Identifier' &&
              t.callee.body.body[0].declarations[0].init &&
              ((t.callee.body.body[0].declarations[0].init.type ===
                'ObjectExpression' &&
                t.callee.body.body[0].declarations[0].init.properties.length ===
                  0) ||
                (t.callee.body.body[0].declarations[0].init.type ===
                  'CallExpression' &&
                  t.callee.body.body[0].declarations[0].init.arguments
                    .length === 1)) &&
              ((t.callee.body.body[1] &&
                t.callee.body.body[1].type === 'FunctionDeclaration' &&
                t.callee.body.body[1].params.length === 1 &&
                t.callee.body.body[1].body.body.length >= 3) ||
                (t.callee.body.body[2] &&
                  t.callee.body.body[2].type === 'FunctionDeclaration' &&
                  t.callee.body.body[2].params.length === 1 &&
                  t.callee.body.body[2].body.body.length >= 3)) &&
              t.arguments[0] &&
              ((t.arguments[0].type === 'ArrayExpression' &&
                (r = t.arguments[0]) &&
                t.arguments[0].elements.length > 0 &&
                t.arguments[0].elements.every(
                  (e) => e && e.type === 'FunctionExpression'
                )) ||
                (t.arguments[0].type === 'ObjectExpression' &&
                  (r = t.arguments[0]) &&
                  t.arguments[0].properties &&
                  t.arguments[0].properties.length > 0 &&
                  t.arguments[0].properties.every(
                    (e) =>
                      e &&
                      e.type === 'Property' &&
                      !e.computed &&
                      e.key &&
                      e.key.type === 'Literal' &&
                      (typeof e.key.value === 'string' ||
                        typeof e.key.value === 'number') &&
                      e.value &&
                      e.value.type === 'FunctionExpression'
                  )))) ||
            (t.arguments.length === 0 &&
              t.callee.type === 'FunctionExpression' &&
              t.callee.params.length === 0 &&
              t.callee.body.type === 'BlockStatement' &&
              t.callee.body.body.length > 5 &&
              t.callee.body.body[0].type === 'VariableDeclaration' &&
              t.callee.body.body[0].declarations.length === 1 &&
              t.callee.body.body[0].declarations[0].id.type === 'Identifier' &&
              t.callee.body.body[1].type === 'ExpressionStatement' &&
              t.callee.body.body[1].expression.type ===
                'AssignmentExpression' &&
              t.callee.body.body[2].type === 'ExpressionStatement' &&
              t.callee.body.body[2].expression.type ===
                'AssignmentExpression' &&
              t.callee.body.body[3].type === 'ExpressionStatement' &&
              t.callee.body.body[3].expression.type ===
                'AssignmentExpression' &&
              t.callee.body.body[3].expression.left.type ===
                'MemberExpression' &&
              t.callee.body.body[3].expression.left.object.type ===
                'Identifier' &&
              t.callee.body.body[3].expression.left.object.name ===
                t.callee.body.body[0].declarations[0].id.name &&
              t.callee.body.body[3].expression.left.property.type ===
                'Identifier' &&
              t.callee.body.body[3].expression.left.property.name ===
                'modules' &&
              t.callee.body.body[3].expression.right.type ===
                'ObjectExpression' &&
              t.callee.body.body[3].expression.right.properties.every(
                (e) =>
                  e &&
                  e.type === 'Property' &&
                  !e.computed &&
                  e.key &&
                  e.key.type === 'Literal' &&
                  (typeof e.key.value === 'string' ||
                    typeof e.key.value === 'number') &&
                  e.value &&
                  e.value.type === 'FunctionExpression'
              ) &&
              (r = t.callee.body.body[3].expression.right) &&
              ((t.callee.body.body[4].type === 'VariableDeclaration' &&
                t.callee.body.body[4].declarations.length === 1 &&
                t.callee.body.body[4].declarations[0].init &&
                t.callee.body.body[4].declarations[0].init.type ===
                  'CallExpression' &&
                t.callee.body.body[4].declarations[0].init.callee.type ===
                  'Identifier' &&
                t.callee.body.body[4].declarations[0].init.callee.name ===
                  'require') ||
                (t.callee.body.body[5].type === 'VariableDeclaration' &&
                  t.callee.body.body[5].declarations.length === 1 &&
                  t.callee.body.body[5].declarations[0].init &&
                  t.callee.body.body[5].declarations[0].init.type ===
                    'CallExpression' &&
                  t.callee.body.body[5].declarations[0].init.callee.type ===
                    'Identifier' &&
                  t.callee.body.body[5].declarations[0].init.callee.name ===
                    'require')))
          ) {
            const e = new Map()
            let t
            if (r.type === 'ArrayExpression')
              t = r.elements
                .filter((e) => e?.type === 'FunctionExpression')
                .map((e, t) => [String(t), e])
            else t = r.properties.map((e) => [String(e.key.value), e.value])
            for (const [r, s] of t) {
              const t =
                s.body.body.length === 1
                  ? s.body.body[0]
                  : (s.body.body.length === 2 ||
                      (s.body.body.length === 3 &&
                        s.body.body[2].type === 'EmptyStatement')) &&
                    s.body.body[0].type === 'ExpressionStatement' &&
                    s.body.body[0].expression.type === 'Literal' &&
                    s.body.body[0].expression.value === 'use strict'
                  ? s.body.body[1]
                  : null
              if (
                t &&
                t.type === 'ExpressionStatement' &&
                t.expression.type === 'AssignmentExpression' &&
                t.expression.operator === '=' &&
                t.expression.left.type === 'MemberExpression' &&
                t.expression.left.object.type === 'Identifier' &&
                'params' in s &&
                s.params.length > 0 &&
                'name' in s.params[0] &&
                t.expression.left.object.name === s.params[0].name &&
                t.expression.left.property.type === 'Identifier' &&
                t.expression.left.property.name === 'exports' &&
                t.expression.right.type === 'CallExpression' &&
                t.expression.right.callee.type === 'Identifier' &&
                t.expression.right.callee.name === 'require' &&
                t.expression.right.arguments.length === 1 &&
                t.expression.right.arguments[0].type === 'Literal'
              ) {
                e.set(r, t.expression.right.arguments[0].value)
              }
            }
            for (const [, r] of t) {
              if (
                'params' in r &&
                r.params.length === 3 &&
                r.params[2].type === 'Identifier'
              ) {
                const t = new Map()
                ;(0, s.walk)(r.body, {
                  enter(s, a) {
                    const o = s
                    const u = a
                    if (
                      o.type === 'CallExpression' &&
                      o.callee.type === 'Identifier' &&
                      'name' in r.params[2] &&
                      o.callee.name === r.params[2].name &&
                      o.arguments.length === 1 &&
                      o.arguments[0].type === 'Literal'
                    ) {
                      const r = e.get(String(o.arguments[0].value))
                      if (r) {
                        const e = {
                          type: 'CallExpression',
                          optional: false,
                          callee: { type: 'Identifier', name: 'require' },
                          arguments: [{ type: 'Literal', value: r }],
                        }
                        const s = u
                        if ('right' in s && s.right === o) {
                          s.right = e
                        } else if ('left' in s && s.left === o) {
                          s.left = e
                        } else if ('object' in s && s.object === o) {
                          s.object = e
                        } else if ('callee' in s && s.callee === o) {
                          s.callee = e
                        } else if (
                          'arguments' in s &&
                          s.arguments.some((e) => e === o)
                        ) {
                          s.arguments = s.arguments.map((t) =>
                            t === o ? e : t
                          )
                        } else if ('init' in s && s.init === o) {
                          if (
                            s.type === 'VariableDeclarator' &&
                            s.id.type === 'Identifier'
                          )
                            t.set(s.id.name, r)
                          s.init = e
                        }
                      }
                    } else if (
                      o.type === 'CallExpression' &&
                      o.callee.type === 'MemberExpression' &&
                      o.callee.object.type === 'Identifier' &&
                      'name' in r.params[2] &&
                      o.callee.object.name === r.params[2].name &&
                      o.callee.property.type === 'Identifier' &&
                      o.callee.property.name === 'n' &&
                      o.arguments.length === 1 &&
                      o.arguments[0].type === 'Identifier'
                    ) {
                      if (u && 'init' in u && u.init === o) {
                        const e = o.arguments[0]
                        const t = {
                          type: 'CallExpression',
                          optional: false,
                          callee: {
                            type: 'MemberExpression',
                            computed: false,
                            optional: false,
                            object: { type: 'Identifier', name: 'Object' },
                            property: { type: 'Identifier', name: 'assign' },
                          },
                          arguments: [
                            {
                              type: 'ArrowFunctionExpression',
                              expression: true,
                              params: [],
                              body: e,
                            },
                            {
                              type: 'ObjectExpression',
                              properties: [
                                {
                                  type: 'Property',
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'a' },
                                  value: e,
                                },
                              ],
                            },
                          ],
                        }
                        u.init = t
                      }
                    }
                  },
                })
              }
            }
          }
        }
      }
      t.handleWrappers = handleWrappers
    },
    351: (e, t) => {
      e.exports = t = abbrev.abbrev = abbrev
      abbrev.monkeyPatch = monkeyPatch
      function monkeyPatch() {
        Object.defineProperty(Array.prototype, 'abbrev', {
          value: function () {
            return abbrev(this)
          },
          enumerable: false,
          configurable: true,
          writable: true,
        })
        Object.defineProperty(Object.prototype, 'abbrev', {
          value: function () {
            return abbrev(Object.keys(this))
          },
          enumerable: false,
          configurable: true,
          writable: true,
        })
      }
      function abbrev(e) {
        if (arguments.length !== 1 || !Array.isArray(e)) {
          e = Array.prototype.slice.call(arguments, 0)
        }
        for (var t = 0, r = e.length, s = []; t < r; t++) {
          s[t] = typeof e[t] === 'string' ? e[t] : String(e[t])
        }
        s = s.sort(lexSort)
        var a = {},
          o = ''
        for (var t = 0, r = s.length; t < r; t++) {
          var u = s[t],
            c = s[t + 1] || '',
            f = true,
            d = true
          if (u === c) continue
          for (var p = 0, h = u.length; p < h; p++) {
            var v = u.charAt(p)
            f = f && v === c.charAt(p)
            d = d && v === o.charAt(p)
            if (!f && !d) {
              p++
              break
            }
          }
          o = u
          if (p === h) {
            a[u] = u
            continue
          }
          for (var g = u.substr(0, p); p <= h; p++) {
            a[g] = u
            g += u.charAt(p)
          }
        }
        return a
      }
      function lexSort(e, t) {
        return e === t ? 0 : e > t ? 1 : -1
      }
    },
    8832: (e, t, r) => {
      'use strict'
      var s
      s = { value: true }
      t.J = importAttributes
      var a = _interopRequireWildcard(r(6414))
      function _getRequireWildcardCache(e) {
        if (typeof WeakMap !== 'function') return null
        var t = new WeakMap()
        var r = new WeakMap()
        return (_getRequireWildcardCache = function (e) {
          return e ? r : t
        })(e)
      }
      function _interopRequireWildcard(e, t) {
        if (!t && e && e.__esModule) {
          return e
        }
        if (e === null || (typeof e !== 'object' && typeof e !== 'function')) {
          return { default: e }
        }
        var r = _getRequireWildcardCache(t)
        if (r && r.has(e)) {
          return r.get(e)
        }
        var s = {}
        var a = Object.defineProperty && Object.getOwnPropertyDescriptor
        for (var o in e) {
          if (o !== 'default' && Object.prototype.hasOwnProperty.call(e, o)) {
            var u = a ? Object.getOwnPropertyDescriptor(e, o) : null
            if (u && (u.get || u.set)) {
              Object.defineProperty(s, o, u)
            } else {
              s[o] = e[o]
            }
          }
        }
        s.default = e
        if (r) {
          r.set(e, s)
        }
        return s
      }
      const o = '{'.charCodeAt(0)
      const u = ' '.charCodeAt(0)
      const c = 'with'
      const f = 1,
        d = 2,
        p = 4
      function importAttributes(e) {
        const t = e.acorn || a
        const { tokTypes: r, TokenType: s } = t
        return class extends e {
          constructor(...e) {
            super(...e)
            this.withToken = new s(c)
          }
          _codeAt(e) {
            return this.input.charCodeAt(e)
          }
          _eat(e) {
            if (this.type !== e) {
              this.unexpected()
            }
            this.next()
          }
          readToken(e) {
            let t = 0
            for (; t < c.length; t++) {
              if (this._codeAt(this.pos + t) !== c.charCodeAt(t)) {
                return super.readToken(e)
              }
            }
            for (; ; t++) {
              if (this._codeAt(this.pos + t) === o) {
                break
              } else if (this._codeAt(this.pos + t) === u) {
                continue
              } else {
                return super.readToken(e)
              }
            }
            if (this.type.label === '{') {
              return super.readToken(e)
            }
            this.pos += c.length
            return this.finishToken(this.withToken)
          }
          parseDynamicImport(e) {
            this.next()
            e.source = this.parseMaybeAssign()
            if (this.eat(r.comma)) {
              const t = this.parseExpression()
              e.arguments = [t]
            }
            this._eat(r.parenR)
            return this.finishNode(e, 'ImportExpression')
          }
          parseExport(e, t) {
            this.next()
            if (this.eat(r.star)) {
              if (this.options.ecmaVersion >= 11) {
                if (this.eatContextual('as')) {
                  e.exported = this.parseIdent(true)
                  this.checkExport(t, e.exported.name, this.lastTokStart)
                } else {
                  e.exported = null
                }
              }
              this.expectContextual('from')
              if (this.type !== r.string) {
                this.unexpected()
              }
              e.source = this.parseExprAtom()
              if (this.type === this.withToken || this.type === r._with) {
                this.next()
                const t = this.parseImportAttributes()
                if (t) {
                  e.attributes = t
                }
              }
              this.semicolon()
              return this.finishNode(e, 'ExportAllDeclaration')
            }
            if (this.eat(r._default)) {
              this.checkExport(t, 'default', this.lastTokStart)
              var s
              if (this.type === r._function || (s = this.isAsyncFunction())) {
                var a = this.startNode()
                this.next()
                if (s) {
                  this.next()
                }
                e.declaration = this.parseFunction(a, f | p, false, s)
              } else if (this.type === r._class) {
                var o = this.startNode()
                e.declaration = this.parseClass(o, 'nullableID')
              } else {
                e.declaration = this.parseMaybeAssign()
                this.semicolon()
              }
              return this.finishNode(e, 'ExportDefaultDeclaration')
            }
            if (this.shouldParseExportStatement()) {
              e.declaration = this.parseStatement(null)
              if (e.declaration.type === 'VariableDeclaration') {
                this.checkVariableExport(t, e.declaration.declarations)
              } else {
                this.checkExport(
                  t,
                  e.declaration.id.name,
                  e.declaration.id.start
                )
              }
              e.specifiers = []
              e.source = null
            } else {
              e.declaration = null
              e.specifiers = this.parseExportSpecifiers(t)
              if (this.eatContextual('from')) {
                if (this.type !== r.string) {
                  this.unexpected()
                }
                e.source = this.parseExprAtom()
                if (this.type === this.withToken || this.type === r._with) {
                  this.next()
                  const t = this.parseImportAttributes()
                  if (t) {
                    e.attributes = t
                  }
                }
              } else {
                for (var u = 0, c = e.specifiers; u < c.length; u += 1) {
                  var d = c[u]
                  this.checkUnreserved(d.local)
                  this.checkLocalExport(d.local)
                }
                e.source = null
              }
              this.semicolon()
            }
            return this.finishNode(e, 'ExportNamedDeclaration')
          }
          parseImport(e) {
            this.next()
            if (this.type === r.string) {
              e.specifiers = []
              e.source = this.parseExprAtom()
            } else {
              e.specifiers = this.parseImportSpecifiers()
              this.expectContextual('from')
              e.source =
                this.type === r.string
                  ? this.parseExprAtom()
                  : this.unexpected()
            }
            if (this.type === this.withToken || this.type == r._with) {
              this.next()
              const t = this.parseImportAttributes()
              if (t) {
                e.attributes = t
              }
            }
            this.semicolon()
            return this.finishNode(e, 'ImportDeclaration')
          }
          parseImportAttributes() {
            this._eat(r.braceL)
            const e = this.parsewithEntries()
            this._eat(r.braceR)
            return e
          }
          parsewithEntries() {
            const e = []
            const t = new Set()
            do {
              if (this.type === r.braceR) {
                break
              }
              const s = this.startNode()
              let a
              if (this.type === r.string) {
                a = this.parseLiteral(this.value)
              } else {
                a = this.parseIdent(true)
              }
              this.next()
              s.key = a
              if (t.has(s.key.name)) {
                this.raise(this.pos, 'Duplicated key in attributes')
              }
              t.add(s.key.name)
              if (this.type !== r.string) {
                this.raise(
                  this.pos,
                  'Only string is supported as an attribute value'
                )
              }
              s.value = this.parseLiteral(this.value)
              e.push(this.finishNode(s, 'ImportAttribute'))
            } while (this.eat(r.comma))
            return e
          }
        }
      }
    },
    878: (e) => {
      'use strict'
      function isArguments(e) {
        return e != null && typeof e === 'object' && e.hasOwnProperty('callee')
      }
      var t = {
        '*': {
          label: 'any',
          check: function () {
            return true
          },
        },
        A: {
          label: 'array',
          check: function (e) {
            return Array.isArray(e) || isArguments(e)
          },
        },
        S: {
          label: 'string',
          check: function (e) {
            return typeof e === 'string'
          },
        },
        N: {
          label: 'number',
          check: function (e) {
            return typeof e === 'number'
          },
        },
        F: {
          label: 'function',
          check: function (e) {
            return typeof e === 'function'
          },
        },
        O: {
          label: 'object',
          check: function (e) {
            return (
              typeof e === 'object' &&
              e != null &&
              !t.A.check(e) &&
              !t.E.check(e)
            )
          },
        },
        B: {
          label: 'boolean',
          check: function (e) {
            return typeof e === 'boolean'
          },
        },
        E: {
          label: 'error',
          check: function (e) {
            return e instanceof Error
          },
        },
        Z: {
          label: 'null',
          check: function (e) {
            return e == null
          },
        },
      }
      function addSchema(e, t) {
        var r = (t[e.length] = t[e.length] || [])
        if (r.indexOf(e) === -1) r.push(e)
      }
      var r = (e.exports = function (e, r) {
        if (arguments.length !== 2)
          throw wrongNumberOfArgs(['SA'], arguments.length)
        if (!e) throw missingRequiredArg(0, 'rawSchemas')
        if (!r) throw missingRequiredArg(1, 'args')
        if (!t.S.check(e)) throw invalidType(0, ['string'], e)
        if (!t.A.check(r)) throw invalidType(1, ['array'], r)
        var s = e.split('|')
        var a = {}
        s.forEach(function (e) {
          for (var r = 0; r < e.length; ++r) {
            var s = e[r]
            if (!t[s]) throw unknownType(r, s)
          }
          if (/E.*E/.test(e)) throw moreThanOneError(e)
          addSchema(e, a)
          if (/E/.test(e)) {
            addSchema(e.replace(/E.*$/, 'E'), a)
            addSchema(e.replace(/E/, 'Z'), a)
            if (e.length === 1) addSchema('', a)
          }
        })
        var o = a[r.length]
        if (!o) {
          throw wrongNumberOfArgs(Object.keys(a), r.length)
        }
        for (var u = 0; u < r.length; ++u) {
          var c = o.filter(function (e) {
            var s = e[u]
            var a = t[s].check
            return a(r[u])
          })
          if (!c.length) {
            var f = o
              .map(function (e) {
                return t[e[u]].label
              })
              .filter(function (e) {
                return e != null
              })
            throw invalidType(u, f, r[u])
          }
          o = c
        }
      })
      function missingRequiredArg(e) {
        return newException(
          'EMISSINGARG',
          'Missing required argument #' + (e + 1)
        )
      }
      function unknownType(e, t) {
        return newException(
          'EUNKNOWNTYPE',
          'Unknown type ' + t + ' in argument #' + (e + 1)
        )
      }
      function invalidType(e, r, s) {
        var a
        Object.keys(t).forEach(function (e) {
          if (t[e].check(s)) a = t[e].label
        })
        return newException(
          'EINVALIDTYPE',
          'Argument #' +
            (e + 1) +
            ': Expected ' +
            englishList(r) +
            ' but got ' +
            a
        )
      }
      function englishList(e) {
        return e.join(', ').replace(/, ([^,]+)$/, ' or $1')
      }
      function wrongNumberOfArgs(e, t) {
        var r = englishList(e)
        var s = e.every(function (e) {
          return e.length === 1
        })
          ? 'argument'
          : 'arguments'
        return newException(
          'EWRONGARGCOUNT',
          'Expected ' + r + ' ' + s + ' but got ' + t
        )
      }
      function moreThanOneError(e) {
        return newException(
          'ETOOMANYERRORTYPES',
          'Only one error type per argument signature is allowed, more than one found in "' +
            e +
            '"'
        )
      }
      function newException(e, t) {
        var s = new Error(t)
        s.code = e
        if (Error.captureStackTrace) Error.captureStackTrace(s, r)
        return s
      }
    },
    4906: (e, t, r) => {
      'use strict'
      t.TrackerGroup = r(308)
      t.Tracker = r(7605)
      t.TrackerStream = r(374)
    },
    5299: (e, t, r) => {
      'use strict'
      var s = r(2361).EventEmitter
      var a = r(3837)
      var o = 0
      var u = (e.exports = function (e) {
        s.call(this)
        this.id = ++o
        this.name = e
      })
      a.inherits(u, s)
    },
    308: (e, t, r) => {
      'use strict'
      var s = r(3837)
      var a = r(5299)
      var o = r(7605)
      var u = r(374)
      var c = (e.exports = function (e) {
        a.call(this, e)
        this.parentGroup = null
        this.trackers = []
        this.completion = {}
        this.weight = {}
        this.totalWeight = 0
        this.finished = false
        this.bubbleChange = bubbleChange(this)
      })
      s.inherits(c, a)
      function bubbleChange(e) {
        return function (t, r, s) {
          e.completion[s.id] = r
          if (e.finished) return
          e.emit('change', t || e.name, e.completed(), e)
        }
      }
      c.prototype.nameInTree = function () {
        var e = []
        var t = this
        while (t) {
          e.unshift(t.name)
          t = t.parentGroup
        }
        return e.join('/')
      }
      c.prototype.addUnit = function (e, t) {
        if (e.addUnit) {
          var r = this
          while (r) {
            if (e === r) {
              throw new Error(
                'Attempted to add tracker group ' +
                  e.name +
                  ' to tree that already includes it ' +
                  this.nameInTree(this)
              )
            }
            r = r.parentGroup
          }
          e.parentGroup = this
        }
        this.weight[e.id] = t || 1
        this.totalWeight += this.weight[e.id]
        this.trackers.push(e)
        this.completion[e.id] = e.completed()
        e.on('change', this.bubbleChange)
        if (!this.finished)
          this.emit('change', e.name, this.completion[e.id], e)
        return e
      }
      c.prototype.completed = function () {
        if (this.trackers.length === 0) return 0
        var e = 1 / this.totalWeight
        var t = 0
        for (var r = 0; r < this.trackers.length; r++) {
          var s = this.trackers[r].id
          t += e * this.weight[s] * this.completion[s]
        }
        return t
      }
      c.prototype.newGroup = function (e, t) {
        return this.addUnit(new c(e), t)
      }
      c.prototype.newItem = function (e, t, r) {
        return this.addUnit(new o(e, t), r)
      }
      c.prototype.newStream = function (e, t, r) {
        return this.addUnit(new u(e, t), r)
      }
      c.prototype.finish = function () {
        this.finished = true
        if (!this.trackers.length) this.addUnit(new o(), 1, true)
        for (var e = 0; e < this.trackers.length; e++) {
          var t = this.trackers[e]
          t.finish()
          t.removeListener('change', this.bubbleChange)
        }
        this.emit('change', this.name, 1, this)
      }
      var f = '                                  '
      c.prototype.debug = function (e) {
        e = e || 0
        var t = e ? f.substr(0, e) : ''
        var r = t + (this.name || 'top') + ': ' + this.completed() + '\n'
        this.trackers.forEach(function (s) {
          if (s instanceof c) {
            r += s.debug(e + 1)
          } else {
            r += t + ' ' + s.name + ': ' + s.completed() + '\n'
          }
        })
        return r
      }
    },
    374: (e, t, r) => {
      'use strict'
      var s = r(3837)
      var a = r(8511)
      var o = r(857)
      var u = r(7605)
      var c = (e.exports = function (e, t, r) {
        a.Transform.call(this, r)
        this.tracker = new u(e, t)
        this.name = e
        this.id = this.tracker.id
        this.tracker.on('change', delegateChange(this))
      })
      s.inherits(c, a.Transform)
      function delegateChange(e) {
        return function (t, r, s) {
          e.emit('change', t, r, e)
        }
      }
      c.prototype._transform = function (e, t, r) {
        this.tracker.completeWork(e.length ? e.length : 1)
        this.push(e)
        r()
      }
      c.prototype._flush = function (e) {
        this.tracker.finish()
        e()
      }
      o(c.prototype, 'tracker')
        .method('completed')
        .method('addWork')
        .method('finish')
    },
    7605: (e, t, r) => {
      'use strict'
      var s = r(3837)
      var a = r(5299)
      var o = (e.exports = function (e, t) {
        a.call(this, e)
        this.workDone = 0
        this.workTodo = t || 0
      })
      s.inherits(o, a)
      o.prototype.completed = function () {
        return this.workTodo === 0 ? 0 : this.workDone / this.workTodo
      }
      o.prototype.addWork = function (e) {
        this.workTodo += e
        this.emit('change', this.name, this.completed(), this)
      }
      o.prototype.completeWork = function (e) {
        this.workDone += e
        if (this.workDone > this.workTodo) this.workDone = this.workTodo
        this.emit('change', this.name, this.completed(), this)
      }
      o.prototype.finish = function () {
        this.workTodo = this.workDone = 1
        this.emit('change', this.name, 1, this)
      }
    },
    3331: (module, exports, __nccwpck_require__) => {
      var fs = __nccwpck_require__(7147),
        path = __nccwpck_require__(1017),
        fileURLToPath = __nccwpck_require__(7121),
        join = path.join,
        dirname = path.dirname,
        exists =
          (fs.accessSync &&
            function (e) {
              try {
                fs.accessSync(e)
              } catch (e) {
                return false
              }
              return true
            }) ||
          fs.existsSync ||
          path.existsSync,
        defaults = {
          arrow: process.env.NODE_BINDINGS_ARROW || ' → ',
          compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled',
          platform: process.platform,
          arch: process.arch,
          nodePreGyp:
            'node-v' +
            process.versions.modules +
            '-' +
            process.platform +
            '-' +
            process.arch,
          version: process.versions.node,
          bindings: 'bindings.node',
          try: [
            ['module_root', 'build', 'bindings'],
            ['module_root', 'build', 'Debug', 'bindings'],
            ['module_root', 'build', 'Release', 'bindings'],
            ['module_root', 'out', 'Debug', 'bindings'],
            ['module_root', 'Debug', 'bindings'],
            ['module_root', 'out', 'Release', 'bindings'],
            ['module_root', 'Release', 'bindings'],
            ['module_root', 'build', 'default', 'bindings'],
            [
              'module_root',
              'compiled',
              'version',
              'platform',
              'arch',
              'bindings',
            ],
            [
              'module_root',
              'addon-build',
              'release',
              'install-root',
              'bindings',
            ],
            ['module_root', 'addon-build', 'debug', 'install-root', 'bindings'],
            [
              'module_root',
              'addon-build',
              'default',
              'install-root',
              'bindings',
            ],
            ['module_root', 'lib', 'binding', 'nodePreGyp', 'bindings'],
          ],
        }
      function bindings(opts) {
        if (typeof opts == 'string') {
          opts = { bindings: opts }
        } else if (!opts) {
          opts = {}
        }
        Object.keys(defaults).map(function (e) {
          if (!(e in opts)) opts[e] = defaults[e]
        })
        if (!opts.module_root) {
          opts.module_root = exports.getRoot(exports.getFileName())
        }
        if (path.extname(opts.bindings) != '.node') {
          opts.bindings += '.node'
        }
        var requireFunc = true ? eval('require') : 0
        var tries = [],
          i = 0,
          l = opts.try.length,
          n,
          b,
          err
        for (; i < l; i++) {
          n = join.apply(
            null,
            opts.try[i].map(function (e) {
              return opts[e] || e
            })
          )
          tries.push(n)
          try {
            b = opts.path ? requireFunc.resolve(n) : requireFunc(n)
            if (!opts.path) {
              b.path = n
            }
            return b
          } catch (e) {
            if (
              e.code !== 'MODULE_NOT_FOUND' &&
              e.code !== 'QUALIFIED_PATH_RESOLUTION_FAILED' &&
              !/not find/i.test(e.message)
            ) {
              throw e
            }
          }
        }
        err = new Error(
          'Could not locate the bindings file. Tried:\n' +
            tries
              .map(function (e) {
                return opts.arrow + e
              })
              .join('\n')
        )
        err.tries = tries
        throw err
      }
      module.exports = exports = bindings
      exports.getFileName = function getFileName(e) {
        var t = Error.prepareStackTrace,
          r = Error.stackTraceLimit,
          s = {},
          a
        Error.stackTraceLimit = 10
        Error.prepareStackTrace = function (t, r) {
          for (var s = 0, o = r.length; s < o; s++) {
            a = r[s].getFileName()
            if (a !== __filename) {
              if (e) {
                if (a !== e) {
                  return
                }
              } else {
                return
              }
            }
          }
        }
        Error.captureStackTrace(s)
        s.stack
        Error.prepareStackTrace = t
        Error.stackTraceLimit = r
        var o = 'file://'
        if (a.indexOf(o) === 0) {
          a = fileURLToPath(a)
        }
        return a
      }
      exports.getRoot = function getRoot(e) {
        var t = dirname(e),
          r
        while (true) {
          if (t === '.') {
            t = process.cwd()
          }
          if (
            exists(join(t, 'package.json')) ||
            exists(join(t, 'node_modules'))
          ) {
            return t
          }
          if (r === t) {
            throw new Error(
              'Could not find module root given file: "' +
                e +
                '". Do you have a `package.json` file? '
            )
          }
          r = t
          t = join(t, '..')
        }
      }
    },
    8333: (e, t, r) => {
      'use strict'
      const s = r(9849)
      const a = r(8179)
      const o = r(3013)
      const u = r(5719)
      const braces = (e, t = {}) => {
        let r = []
        if (Array.isArray(e)) {
          for (let s of e) {
            let e = braces.create(s, t)
            if (Array.isArray(e)) {
              r.push(...e)
            } else {
              r.push(e)
            }
          }
        } else {
          r = [].concat(braces.create(e, t))
        }
        if (t && t.expand === true && t.nodupes === true) {
          r = [...new Set(r)]
        }
        return r
      }
      braces.parse = (e, t = {}) => u(e, t)
      braces.stringify = (e, t = {}) => {
        if (typeof e === 'string') {
          return s(braces.parse(e, t), t)
        }
        return s(e, t)
      }
      braces.compile = (e, t = {}) => {
        if (typeof e === 'string') {
          e = braces.parse(e, t)
        }
        return a(e, t)
      }
      braces.expand = (e, t = {}) => {
        if (typeof e === 'string') {
          e = braces.parse(e, t)
        }
        let r = o(e, t)
        if (t.noempty === true) {
          r = r.filter(Boolean)
        }
        if (t.nodupes === true) {
          r = [...new Set(r)]
        }
        return r
      }
      braces.create = (e, t = {}) => {
        if (e === '' || e.length < 3) {
          return [e]
        }
        return t.expand !== true ? braces.compile(e, t) : braces.expand(e, t)
      }
      e.exports = braces
    },
    8179: (e, t, r) => {
      'use strict'
      const s = r(7783)
      const a = r(5617)
      const compile = (e, t = {}) => {
        let walk = (e, r = {}) => {
          let o = a.isInvalidBrace(r)
          let u = e.invalid === true && t.escapeInvalid === true
          let c = o === true || u === true
          let f = t.escapeInvalid === true ? '\\' : ''
          let d = ''
          if (e.isOpen === true) {
            return f + e.value
          }
          if (e.isClose === true) {
            return f + e.value
          }
          if (e.type === 'open') {
            return c ? f + e.value : '('
          }
          if (e.type === 'close') {
            return c ? f + e.value : ')'
          }
          if (e.type === 'comma') {
            return e.prev.type === 'comma' ? '' : c ? e.value : '|'
          }
          if (e.value) {
            return e.value
          }
          if (e.nodes && e.ranges > 0) {
            let r = a.reduce(e.nodes)
            let o = s(...r, { ...t, wrap: false, toRegex: true })
            if (o.length !== 0) {
              return r.length > 1 && o.length > 1 ? `(${o})` : o
            }
          }
          if (e.nodes) {
            for (let t of e.nodes) {
              d += walk(t, e)
            }
          }
          return d
        }
        return walk(e)
      }
      e.exports = compile
    },
    5457: (e) => {
      'use strict'
      e.exports = {
        MAX_LENGTH: 1024 * 64,
        CHAR_0: '0',
        CHAR_9: '9',
        CHAR_UPPERCASE_A: 'A',
        CHAR_LOWERCASE_A: 'a',
        CHAR_UPPERCASE_Z: 'Z',
        CHAR_LOWERCASE_Z: 'z',
        CHAR_LEFT_PARENTHESES: '(',
        CHAR_RIGHT_PARENTHESES: ')',
        CHAR_ASTERISK: '*',
        CHAR_AMPERSAND: '&',
        CHAR_AT: '@',
        CHAR_BACKSLASH: '\\',
        CHAR_BACKTICK: '`',
        CHAR_CARRIAGE_RETURN: '\r',
        CHAR_CIRCUMFLEX_ACCENT: '^',
        CHAR_COLON: ':',
        CHAR_COMMA: ',',
        CHAR_DOLLAR: '$',
        CHAR_DOT: '.',
        CHAR_DOUBLE_QUOTE: '"',
        CHAR_EQUAL: '=',
        CHAR_EXCLAMATION_MARK: '!',
        CHAR_FORM_FEED: '\f',
        CHAR_FORWARD_SLASH: '/',
        CHAR_HASH: '#',
        CHAR_HYPHEN_MINUS: '-',
        CHAR_LEFT_ANGLE_BRACKET: '<',
        CHAR_LEFT_CURLY_BRACE: '{',
        CHAR_LEFT_SQUARE_BRACKET: '[',
        CHAR_LINE_FEED: '\n',
        CHAR_NO_BREAK_SPACE: ' ',
        CHAR_PERCENT: '%',
        CHAR_PLUS: '+',
        CHAR_QUESTION_MARK: '?',
        CHAR_RIGHT_ANGLE_BRACKET: '>',
        CHAR_RIGHT_CURLY_BRACE: '}',
        CHAR_RIGHT_SQUARE_BRACKET: ']',
        CHAR_SEMICOLON: ';',
        CHAR_SINGLE_QUOTE: "'",
        CHAR_SPACE: ' ',
        CHAR_TAB: '\t',
        CHAR_UNDERSCORE: '_',
        CHAR_VERTICAL_LINE: '|',
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\ufeff',
      }
    },
    3013: (e, t, r) => {
      'use strict'
      const s = r(7783)
      const a = r(9849)
      const o = r(5617)
      const append = (e = '', t = '', r = false) => {
        let s = []
        e = [].concat(e)
        t = [].concat(t)
        if (!t.length) return e
        if (!e.length) {
          return r ? o.flatten(t).map((e) => `{${e}}`) : t
        }
        for (let a of e) {
          if (Array.isArray(a)) {
            for (let e of a) {
              s.push(append(e, t, r))
            }
          } else {
            for (let e of t) {
              if (r === true && typeof e === 'string') e = `{${e}}`
              s.push(Array.isArray(e) ? append(a, e, r) : a + e)
            }
          }
        }
        return o.flatten(s)
      }
      const expand = (e, t = {}) => {
        let r = t.rangeLimit === void 0 ? 1e3 : t.rangeLimit
        let walk = (e, u = {}) => {
          e.queue = []
          let c = u
          let f = u.queue
          while (c.type !== 'brace' && c.type !== 'root' && c.parent) {
            c = c.parent
            f = c.queue
          }
          if (e.invalid || e.dollar) {
            f.push(append(f.pop(), a(e, t)))
            return
          }
          if (
            e.type === 'brace' &&
            e.invalid !== true &&
            e.nodes.length === 2
          ) {
            f.push(append(f.pop(), ['{}']))
            return
          }
          if (e.nodes && e.ranges > 0) {
            let u = o.reduce(e.nodes)
            if (o.exceedsLimit(...u, t.step, r)) {
              throw new RangeError(
                'expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.'
              )
            }
            let c = s(...u, t)
            if (c.length === 0) {
              c = a(e, t)
            }
            f.push(append(f.pop(), c))
            e.nodes = []
            return
          }
          let d = o.encloseBrace(e)
          let p = e.queue
          let h = e
          while (h.type !== 'brace' && h.type !== 'root' && h.parent) {
            h = h.parent
            p = h.queue
          }
          for (let t = 0; t < e.nodes.length; t++) {
            let r = e.nodes[t]
            if (r.type === 'comma' && e.type === 'brace') {
              if (t === 1) p.push('')
              p.push('')
              continue
            }
            if (r.type === 'close') {
              f.push(append(f.pop(), p, d))
              continue
            }
            if (r.value && r.type !== 'open') {
              p.push(append(p.pop(), r.value))
              continue
            }
            if (r.nodes) {
              walk(r, e)
            }
          }
          return p
        }
        return o.flatten(walk(e))
      }
      e.exports = expand
    },
    5719: (e, t, r) => {
      'use strict'
      const s = r(9849)
      const {
        MAX_LENGTH: a,
        CHAR_BACKSLASH: o,
        CHAR_BACKTICK: u,
        CHAR_COMMA: c,
        CHAR_DOT: f,
        CHAR_LEFT_PARENTHESES: d,
        CHAR_RIGHT_PARENTHESES: p,
        CHAR_LEFT_CURLY_BRACE: h,
        CHAR_RIGHT_CURLY_BRACE: v,
        CHAR_LEFT_SQUARE_BRACKET: g,
        CHAR_RIGHT_SQUARE_BRACKET: D,
        CHAR_DOUBLE_QUOTE: y,
        CHAR_SINGLE_QUOTE: m,
        CHAR_NO_BREAK_SPACE: _,
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: E,
      } = r(5457)
      const parse = (e, t = {}) => {
        if (typeof e !== 'string') {
          throw new TypeError('Expected a string')
        }
        let r = t || {}
        let w = typeof r.maxLength === 'number' ? Math.min(a, r.maxLength) : a
        if (e.length > w) {
          throw new SyntaxError(
            `Input length (${e.length}), exceeds max characters (${w})`
          )
        }
        let x = { type: 'root', input: e, nodes: [] }
        let C = [x]
        let F = x
        let S = x
        let A = 0
        let k = e.length
        let R = 0
        let O = 0
        let T
        let j = {}
        const advance = () => e[R++]
        const push = (e) => {
          if (e.type === 'text' && S.type === 'dot') {
            S.type = 'text'
          }
          if (S && S.type === 'text' && e.type === 'text') {
            S.value += e.value
            return
          }
          F.nodes.push(e)
          e.parent = F
          e.prev = S
          S = e
          return e
        }
        push({ type: 'bos' })
        while (R < k) {
          F = C[C.length - 1]
          T = advance()
          if (T === E || T === _) {
            continue
          }
          if (T === o) {
            push({ type: 'text', value: (t.keepEscaping ? T : '') + advance() })
            continue
          }
          if (T === D) {
            push({ type: 'text', value: '\\' + T })
            continue
          }
          if (T === g) {
            A++
            let e = true
            let t
            while (R < k && (t = advance())) {
              T += t
              if (t === g) {
                A++
                continue
              }
              if (t === o) {
                T += advance()
                continue
              }
              if (t === D) {
                A--
                if (A === 0) {
                  break
                }
              }
            }
            push({ type: 'text', value: T })
            continue
          }
          if (T === d) {
            F = push({ type: 'paren', nodes: [] })
            C.push(F)
            push({ type: 'text', value: T })
            continue
          }
          if (T === p) {
            if (F.type !== 'paren') {
              push({ type: 'text', value: T })
              continue
            }
            F = C.pop()
            push({ type: 'text', value: T })
            F = C[C.length - 1]
            continue
          }
          if (T === y || T === m || T === u) {
            let e = T
            let r
            if (t.keepQuotes !== true) {
              T = ''
            }
            while (R < k && (r = advance())) {
              if (r === o) {
                T += r + advance()
                continue
              }
              if (r === e) {
                if (t.keepQuotes === true) T += r
                break
              }
              T += r
            }
            push({ type: 'text', value: T })
            continue
          }
          if (T === h) {
            O++
            let e = (S.value && S.value.slice(-1) === '$') || F.dollar === true
            let t = {
              type: 'brace',
              open: true,
              close: false,
              dollar: e,
              depth: O,
              commas: 0,
              ranges: 0,
              nodes: [],
            }
            F = push(t)
            C.push(F)
            push({ type: 'open', value: T })
            continue
          }
          if (T === v) {
            if (F.type !== 'brace') {
              push({ type: 'text', value: T })
              continue
            }
            let e = 'close'
            F = C.pop()
            F.close = true
            push({ type: e, value: T })
            O--
            F = C[C.length - 1]
            continue
          }
          if (T === c && O > 0) {
            if (F.ranges > 0) {
              F.ranges = 0
              let e = F.nodes.shift()
              F.nodes = [e, { type: 'text', value: s(F) }]
            }
            push({ type: 'comma', value: T })
            F.commas++
            continue
          }
          if (T === f && O > 0 && F.commas === 0) {
            let e = F.nodes
            if (O === 0 || e.length === 0) {
              push({ type: 'text', value: T })
              continue
            }
            if (S.type === 'dot') {
              F.range = []
              S.value += T
              S.type = 'range'
              if (F.nodes.length !== 3 && F.nodes.length !== 5) {
                F.invalid = true
                F.ranges = 0
                S.type = 'text'
                continue
              }
              F.ranges++
              F.args = []
              continue
            }
            if (S.type === 'range') {
              e.pop()
              let t = e[e.length - 1]
              t.value += S.value + T
              S = t
              F.ranges--
              continue
            }
            push({ type: 'dot', value: T })
            continue
          }
          push({ type: 'text', value: T })
        }
        do {
          F = C.pop()
          if (F.type !== 'root') {
            F.nodes.forEach((e) => {
              if (!e.nodes) {
                if (e.type === 'open') e.isOpen = true
                if (e.type === 'close') e.isClose = true
                if (!e.nodes) e.type = 'text'
                e.invalid = true
              }
            })
            let e = C[C.length - 1]
            let t = e.nodes.indexOf(F)
            e.nodes.splice(t, 1, ...F.nodes)
          }
        } while (C.length > 0)
        push({ type: 'eos' })
        return x
      }
      e.exports = parse
    },
    9849: (e, t, r) => {
      'use strict'
      const s = r(5617)
      e.exports = (e, t = {}) => {
        let stringify = (e, r = {}) => {
          let a = t.escapeInvalid && s.isInvalidBrace(r)
          let o = e.invalid === true && t.escapeInvalid === true
          let u = ''
          if (e.value) {
            if ((a || o) && s.isOpenOrClose(e)) {
              return '\\' + e.value
            }
            return e.value
          }
          if (e.value) {
            return e.value
          }
          if (e.nodes) {
            for (let t of e.nodes) {
              u += stringify(t)
            }
          }
          return u
        }
        return stringify(e)
      }
    },
    5617: (e, t) => {
      'use strict'
      t.isInteger = (e) => {
        if (typeof e === 'number') {
          return Number.isInteger(e)
        }
        if (typeof e === 'string' && e.trim() !== '') {
          return Number.isInteger(Number(e))
        }
        return false
      }
      t.find = (e, t) => e.nodes.find((e) => e.type === t)
      t.exceedsLimit = (e, r, s = 1, a) => {
        if (a === false) return false
        if (!t.isInteger(e) || !t.isInteger(r)) return false
        return (Number(r) - Number(e)) / Number(s) >= a
      }
      t.escapeNode = (e, t = 0, r) => {
        let s = e.nodes[t]
        if (!s) return
        if ((r && s.type === r) || s.type === 'open' || s.type === 'close') {
          if (s.escaped !== true) {
            s.value = '\\' + s.value
            s.escaped = true
          }
        }
      }
      t.encloseBrace = (e) => {
        if (e.type !== 'brace') return false
        if ((e.commas >> (0 + e.ranges)) >> 0 === 0) {
          e.invalid = true
          return true
        }
        return false
      }
      t.isInvalidBrace = (e) => {
        if (e.type !== 'brace') return false
        if (e.invalid === true || e.dollar) return true
        if ((e.commas >> (0 + e.ranges)) >> 0 === 0) {
          e.invalid = true
          return true
        }
        if (e.open !== true || e.close !== true) {
          e.invalid = true
          return true
        }
        return false
      }
      t.isOpenOrClose = (e) => {
        if (e.type === 'open' || e.type === 'close') {
          return true
        }
        return e.open === true || e.close === true
      }
      t.reduce = (e) =>
        e.reduce((e, t) => {
          if (t.type === 'text') e.push(t.value)
          if (t.type === 'range') t.type = 'text'
          return e
        }, [])
      t.flatten = (...e) => {
        const t = []
        const flat = (e) => {
          for (let r = 0; r < e.length; r++) {
            let s = e[r]
            Array.isArray(s) ? flat(s, t) : s !== void 0 && t.push(s)
          }
          return t
        }
        flat(e)
        return t
      }
    },
    8589: (e) => {
      'use strict'
      e.exports = function (e, t) {
        if (e === null || e === undefined) {
          throw TypeError()
        }
        e = String(e)
        var r = e.length
        var s = t ? Number(t) : 0
        if (Number.isNaN(s)) {
          s = 0
        }
        if (s < 0 || s >= r) {
          return undefined
        }
        var a = e.charCodeAt(s)
        if (a >= 55296 && a <= 56319 && r > s + 1) {
          var o = e.charCodeAt(s + 1)
          if (o >= 56320 && o <= 57343) {
            return (a - 55296) * 1024 + o - 56320 + 65536
          }
        }
        return a
      }
    },
    3844: (e, t) => {
      'use strict'
      var r = '['
      t.up = function up(e) {
        return r + (e || '') + 'A'
      }
      t.down = function down(e) {
        return r + (e || '') + 'B'
      }
      t.forward = function forward(e) {
        return r + (e || '') + 'C'
      }
      t.back = function back(e) {
        return r + (e || '') + 'D'
      }
      t.nextLine = function nextLine(e) {
        return r + (e || '') + 'E'
      }
      t.previousLine = function previousLine(e) {
        return r + (e || '') + 'F'
      }
      t.horizontalAbsolute = function horizontalAbsolute(e) {
        if (e == null)
          throw new Error('horizontalAboslute requires a column to position to')
        return r + e + 'G'
      }
      t.eraseData = function eraseData() {
        return r + 'J'
      }
      t.eraseLine = function eraseLine() {
        return r + 'K'
      }
      t.goto = function (e, t) {
        return r + t + ';' + e + 'H'
      }
      t.gotoSOL = function () {
        return '\r'
      }
      t.beep = function () {
        return ''
      }
      t.hideCursor = function hideCursor() {
        return r + '?25l'
      }
      t.showCursor = function showCursor() {
        return r + '?25h'
      }
      var s = {
        reset: 0,
        bold: 1,
        italic: 3,
        underline: 4,
        inverse: 7,
        stopBold: 22,
        stopItalic: 23,
        stopUnderline: 24,
        stopInverse: 27,
        white: 37,
        black: 30,
        blue: 34,
        cyan: 36,
        green: 32,
        magenta: 35,
        red: 31,
        yellow: 33,
        bgWhite: 47,
        bgBlack: 40,
        bgBlue: 44,
        bgCyan: 46,
        bgGreen: 42,
        bgMagenta: 45,
        bgRed: 41,
        bgYellow: 43,
        grey: 90,
        brightBlack: 90,
        brightRed: 91,
        brightGreen: 92,
        brightYellow: 93,
        brightBlue: 94,
        brightMagenta: 95,
        brightCyan: 96,
        brightWhite: 97,
        bgGrey: 100,
        bgBrightBlack: 100,
        bgBrightRed: 101,
        bgBrightGreen: 102,
        bgBrightYellow: 103,
        bgBrightBlue: 104,
        bgBrightMagenta: 105,
        bgBrightCyan: 106,
        bgBrightWhite: 107,
      }
      t.color = function color(e) {
        if (arguments.length !== 1 || !Array.isArray(e)) {
          e = Array.prototype.slice.call(arguments)
        }
        return r + e.map(colorNameToCode).join(';') + 'm'
      }
      function colorNameToCode(e) {
        if (s[e] != null) return s[e]
        throw new Error('Unknown color or style name: ' + e)
      }
    },
    1504: (e, t) => {
      function isArray(e) {
        if (Array.isArray) {
          return Array.isArray(e)
        }
        return objectToString(e) === '[object Array]'
      }
      t.isArray = isArray
      function isBoolean(e) {
        return typeof e === 'boolean'
      }
      t.isBoolean = isBoolean
      function isNull(e) {
        return e === null
      }
      t.isNull = isNull
      function isNullOrUndefined(e) {
        return e == null
      }
      t.isNullOrUndefined = isNullOrUndefined
      function isNumber(e) {
        return typeof e === 'number'
      }
      t.isNumber = isNumber
      function isString(e) {
        return typeof e === 'string'
      }
      t.isString = isString
      function isSymbol(e) {
        return typeof e === 'symbol'
      }
      t.isSymbol = isSymbol
      function isUndefined(e) {
        return e === void 0
      }
      t.isUndefined = isUndefined
      function isRegExp(e) {
        return objectToString(e) === '[object RegExp]'
      }
      t.isRegExp = isRegExp
      function isObject(e) {
        return typeof e === 'object' && e !== null
      }
      t.isObject = isObject
      function isDate(e) {
        return objectToString(e) === '[object Date]'
      }
      t.isDate = isDate
      function isError(e) {
        return objectToString(e) === '[object Error]' || e instanceof Error
      }
      t.isError = isError
      function isFunction(e) {
        return typeof e === 'function'
      }
      t.isFunction = isFunction
      function isPrimitive(e) {
        return (
          e === null ||
          typeof e === 'boolean' ||
          typeof e === 'number' ||
          typeof e === 'string' ||
          typeof e === 'symbol' ||
          typeof e === 'undefined'
        )
      }
      t.isPrimitive = isPrimitive
      t.isBuffer = Buffer.isBuffer
      function objectToString(e) {
        return Object.prototype.toString.call(e)
      }
    },
    857: (e) => {
      e.exports = Delegator
      function Delegator(e, t) {
        if (!(this instanceof Delegator)) return new Delegator(e, t)
        this.proto = e
        this.target = t
        this.methods = []
        this.getters = []
        this.setters = []
        this.fluents = []
      }
      Delegator.prototype.method = function (e) {
        var t = this.proto
        var r = this.target
        this.methods.push(e)
        t[e] = function () {
          return this[r][e].apply(this[r], arguments)
        }
        return this
      }
      Delegator.prototype.access = function (e) {
        return this.getter(e).setter(e)
      }
      Delegator.prototype.getter = function (e) {
        var t = this.proto
        var r = this.target
        this.getters.push(e)
        t.__defineGetter__(e, function () {
          return this[r][e]
        })
        return this
      }
      Delegator.prototype.setter = function (e) {
        var t = this.proto
        var r = this.target
        this.setters.push(e)
        t.__defineSetter__(e, function (t) {
          return (this[r][e] = t)
        })
        return this
      }
      Delegator.prototype.fluent = function (e) {
        var t = this.proto
        var r = this.target
        this.fluents.push(e)
        t[e] = function (t) {
          if ('undefined' != typeof t) {
            this[r][e] = t
            return this
          } else {
            return this[r][e]
          }
        }
        return this
      }
    },
    5104: (e, t, r) => {
      'use strict'
      var s = r(2037).platform()
      var a = r(2081).spawnSync
      var o = r(7147).readdirSync
      var u = 'glibc'
      var c = 'musl'
      var f = { encoding: 'utf8', env: process.env }
      if (!a) {
        a = function () {
          return { status: 126, stdout: '', stderr: '' }
        }
      }
      function contains(e) {
        return function (t) {
          return t.indexOf(e) !== -1
        }
      }
      function versionFromMuslLdd(e) {
        return e
          .split(/[\r\n]+/)[1]
          .trim()
          .split(/\s/)[1]
      }
      function safeReaddirSync(e) {
        try {
          return o(e)
        } catch (e) {}
        return []
      }
      var d = ''
      var p = ''
      var h = ''
      if (s === 'linux') {
        var v = a('getconf', ['GNU_LIBC_VERSION'], f)
        if (v.status === 0) {
          d = u
          p = v.stdout.trim().split(' ')[1]
          h = 'getconf'
        } else {
          var g = a('ldd', ['--version'], f)
          if (g.status === 0 && g.stdout.indexOf(c) !== -1) {
            d = c
            p = versionFromMuslLdd(g.stdout)
            h = 'ldd'
          } else if (g.status === 1 && g.stderr.indexOf(c) !== -1) {
            d = c
            p = versionFromMuslLdd(g.stderr)
            h = 'ldd'
          } else {
            var D = safeReaddirSync('/lib')
            if (D.some(contains('-linux-gnu'))) {
              d = u
              h = 'filesystem'
            } else if (D.some(contains('libc.musl-'))) {
              d = c
              h = 'filesystem'
            } else if (D.some(contains('ld-musl-'))) {
              d = c
              h = 'filesystem'
            } else {
              var y = safeReaddirSync('/usr/sbin')
              if (y.some(contains('glibc'))) {
                d = u
                h = 'filesystem'
              }
            }
          }
        }
      }
      var m = d !== '' && d !== u
      e.exports = {
        GLIBC: u,
        MUSL: c,
        family: d,
        version: p,
        method: h,
        isNonGlibcLinux: m,
      }
    },
    3876: (e) => {
      'use strict'
      e.exports = function () {
        return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g
      }
    },
    7121: (e, t, r) => {
      var s = r(1017).sep || '/'
      e.exports = fileUriToPath
      function fileUriToPath(e) {
        if (
          'string' != typeof e ||
          e.length <= 7 ||
          'file://' != e.substring(0, 7)
        ) {
          throw new TypeError(
            'must pass in a file:// URI to convert to a file path'
          )
        }
        var t = decodeURI(e.substring(7))
        var r = t.indexOf('/')
        var a = t.substring(0, r)
        var o = t.substring(r + 1)
        if ('localhost' == a) a = ''
        if (a) {
          a = s + s + a
        }
        o = o.replace(/^(.+)\|/, '$1:')
        if (s == '\\') {
          o = o.replace(/\//g, '\\')
        }
        if (/^.+\:/.test(o)) {
        } else {
          o = s + o
        }
        return a + o
      }
    },
    7783: (e, t, r) => {
      'use strict'
      /*!
       * fill-range <https://github.com/jonschlinkert/fill-range>
       *
       * Copyright (c) 2014-present, Jon Schlinkert.
       * Licensed under the MIT License.
       */ const s = r(3837)
      const a = r(492)
      const isObject = (e) =>
        e !== null && typeof e === 'object' && !Array.isArray(e)
      const transform = (e) => (t) => e === true ? Number(t) : String(t)
      const isValidValue = (e) =>
        typeof e === 'number' || (typeof e === 'string' && e !== '')
      const isNumber = (e) => Number.isInteger(+e)
      const zeros = (e) => {
        let t = `${e}`
        let r = -1
        if (t[0] === '-') t = t.slice(1)
        if (t === '0') return false
        while (t[++r] === '0');
        return r > 0
      }
      const stringify = (e, t, r) => {
        if (typeof e === 'string' || typeof t === 'string') {
          return true
        }
        return r.stringify === true
      }
      const pad = (e, t, r) => {
        if (t > 0) {
          let r = e[0] === '-' ? '-' : ''
          if (r) e = e.slice(1)
          e = r + e.padStart(r ? t - 1 : t, '0')
        }
        if (r === false) {
          return String(e)
        }
        return e
      }
      const toMaxLen = (e, t) => {
        let r = e[0] === '-' ? '-' : ''
        if (r) {
          e = e.slice(1)
          t--
        }
        while (e.length < t) e = '0' + e
        return r ? '-' + e : e
      }
      const toSequence = (e, t) => {
        e.negatives.sort((e, t) => (e < t ? -1 : e > t ? 1 : 0))
        e.positives.sort((e, t) => (e < t ? -1 : e > t ? 1 : 0))
        let r = t.capture ? '' : '?:'
        let s = ''
        let a = ''
        let o
        if (e.positives.length) {
          s = e.positives.join('|')
        }
        if (e.negatives.length) {
          a = `-(${r}${e.negatives.join('|')})`
        }
        if (s && a) {
          o = `${s}|${a}`
        } else {
          o = s || a
        }
        if (t.wrap) {
          return `(${r}${o})`
        }
        return o
      }
      const toRange = (e, t, r, s) => {
        if (r) {
          return a(e, t, { wrap: false, ...s })
        }
        let o = String.fromCharCode(e)
        if (e === t) return o
        let u = String.fromCharCode(t)
        return `[${o}-${u}]`
      }
      const toRegex = (e, t, r) => {
        if (Array.isArray(e)) {
          let t = r.wrap === true
          let s = r.capture ? '' : '?:'
          return t ? `(${s}${e.join('|')})` : e.join('|')
        }
        return a(e, t, r)
      }
      const rangeError = (...e) =>
        new RangeError('Invalid range arguments: ' + s.inspect(...e))
      const invalidRange = (e, t, r) => {
        if (r.strictRanges === true) throw rangeError([e, t])
        return []
      }
      const invalidStep = (e, t) => {
        if (t.strictRanges === true) {
          throw new TypeError(`Expected step "${e}" to be a number`)
        }
        return []
      }
      const fillNumbers = (e, t, r = 1, s = {}) => {
        let a = Number(e)
        let o = Number(t)
        if (!Number.isInteger(a) || !Number.isInteger(o)) {
          if (s.strictRanges === true) throw rangeError([e, t])
          return []
        }
        if (a === 0) a = 0
        if (o === 0) o = 0
        let u = a > o
        let c = String(e)
        let f = String(t)
        let d = String(r)
        r = Math.max(Math.abs(r), 1)
        let p = zeros(c) || zeros(f) || zeros(d)
        let h = p ? Math.max(c.length, f.length, d.length) : 0
        let v = p === false && stringify(e, t, s) === false
        let g = s.transform || transform(v)
        if (s.toRegex && r === 1) {
          return toRange(toMaxLen(e, h), toMaxLen(t, h), true, s)
        }
        let D = { negatives: [], positives: [] }
        let push = (e) => D[e < 0 ? 'negatives' : 'positives'].push(Math.abs(e))
        let y = []
        let m = 0
        while (u ? a >= o : a <= o) {
          if (s.toRegex === true && r > 1) {
            push(a)
          } else {
            y.push(pad(g(a, m), h, v))
          }
          a = u ? a - r : a + r
          m++
        }
        if (s.toRegex === true) {
          return r > 1
            ? toSequence(D, s)
            : toRegex(y, null, { wrap: false, ...s })
        }
        return y
      }
      const fillLetters = (e, t, r = 1, s = {}) => {
        if ((!isNumber(e) && e.length > 1) || (!isNumber(t) && t.length > 1)) {
          return invalidRange(e, t, s)
        }
        let a = s.transform || ((e) => String.fromCharCode(e))
        let o = `${e}`.charCodeAt(0)
        let u = `${t}`.charCodeAt(0)
        let c = o > u
        let f = Math.min(o, u)
        let d = Math.max(o, u)
        if (s.toRegex && r === 1) {
          return toRange(f, d, false, s)
        }
        let p = []
        let h = 0
        while (c ? o >= u : o <= u) {
          p.push(a(o, h))
          o = c ? o - r : o + r
          h++
        }
        if (s.toRegex === true) {
          return toRegex(p, null, { wrap: false, options: s })
        }
        return p
      }
      const fill = (e, t, r, s = {}) => {
        if (t == null && isValidValue(e)) {
          return [e]
        }
        if (!isValidValue(e) || !isValidValue(t)) {
          return invalidRange(e, t, s)
        }
        if (typeof r === 'function') {
          return fill(e, t, 1, { transform: r })
        }
        if (isObject(r)) {
          return fill(e, t, 0, r)
        }
        let a = { ...s }
        if (a.capture === true) a.wrap = true
        r = r || a.step || 1
        if (!isNumber(r)) {
          if (r != null && !isObject(r)) return invalidStep(r, a)
          return fill(e, t, 1, r)
        }
        if (isNumber(e) && isNumber(t)) {
          return fillNumbers(e, t, r, a)
        }
        return fillLetters(e, t, Math.max(Math.abs(r), 1), a)
      }
      e.exports = fill
    },
    8862: (e, t, r) => {
      'use strict'
      var s = r(5154)
      var a = r(2964)
      e.exports = {
        activityIndicator: function (e, t, r) {
          if (e.spun == null) return
          return s(t, e.spun)
        },
        progressbar: function (e, t, r) {
          if (e.completed == null) return
          return a(t, r, e.completed)
        },
      }
    },
    2905: (e, t, r) => {
      'use strict'
      var s = r(3837)
      var a = (t.User = function User(e) {
        var t = new Error(e)
        Error.captureStackTrace(t, User)
        t.code = 'EGAUGE'
        return t
      })
      t.MissingTemplateValue = function MissingTemplateValue(e, t) {
        var r = new a(s.format('Missing template value "%s"', e.type))
        Error.captureStackTrace(r, MissingTemplateValue)
        r.template = e
        r.values = t
        return r
      }
      t.Internal = function Internal(e) {
        var t = new Error(e)
        Error.captureStackTrace(t, Internal)
        t.code = 'EGAUGEINTERNAL'
        return t
      }
    },
    1191: (e) => {
      'use strict'
      e.exports = isWin32() || isColorTerm()
      function isWin32() {
        return process.platform === 'win32'
      }
      function isColorTerm() {
        var e = /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i
        return !!process.env.COLORTERM || e.test(process.env.TERM)
      }
    },
    287: (e, t, r) => {
      'use strict'
      var s = r(4052)
      var a = r(5214)
      var o = r(1191)
      var u = r(7234)
      var c = r(9986)
      var f = r(7131)
      var d = r(5751)
      var p = r(5498)
      e.exports = Gauge
      function callWith(e, t) {
        return function () {
          return t.call(e)
        }
      }
      function Gauge(e, t) {
        var r, a
        if (e && e.write) {
          a = e
          r = t || {}
        } else if (t && t.write) {
          a = t
          r = e || {}
        } else {
          a = d.stderr
          r = e || t || {}
        }
        this._status = { spun: 0, section: '', subsection: '' }
        this._paused = false
        this._disabled = true
        this._showing = false
        this._onScreen = false
        this._needsRedraw = false
        this._hideCursor = r.hideCursor == null ? true : r.hideCursor
        this._fixedFramerate =
          r.fixedFramerate == null
            ? !/^v0\.8\./.test(d.version)
            : r.fixedFramerate
        this._lastUpdateAt = null
        this._updateInterval = r.updateInterval == null ? 50 : r.updateInterval
        this._themes = r.themes || c
        this._theme = r.theme
        var o = this._computeTheme(r.theme)
        var u = r.template || [
          { type: 'progressbar', length: 20 },
          { type: 'activityIndicator', kerning: 1, length: 1 },
          { type: 'section', kerning: 1, default: '' },
          { type: 'subsection', kerning: 1, default: '' },
        ]
        this.setWriteTo(a, r.tty)
        var f = r.Plumbing || s
        this._gauge = new f(o, u, this.getWidth())
        this._$$doRedraw = callWith(this, this._doRedraw)
        this._$$handleSizeChange = callWith(this, this._handleSizeChange)
        this._cleanupOnExit = r.cleanupOnExit == null || r.cleanupOnExit
        this._removeOnExit = null
        if (r.enabled || (r.enabled == null && this._tty && this._tty.isTTY)) {
          this.enable()
        } else {
          this.disable()
        }
      }
      Gauge.prototype = {}
      Gauge.prototype.isEnabled = function () {
        return !this._disabled
      }
      Gauge.prototype.setTemplate = function (e) {
        this._gauge.setTemplate(e)
        if (this._showing) this._requestRedraw()
      }
      Gauge.prototype._computeTheme = function (e) {
        if (!e) e = {}
        if (typeof e === 'string') {
          e = this._themes.getTheme(e)
        } else if (
          e &&
          (Object.keys(e).length === 0 ||
            e.hasUnicode != null ||
            e.hasColor != null)
        ) {
          var t = e.hasUnicode == null ? a() : e.hasUnicode
          var r = e.hasColor == null ? o : e.hasColor
          e = this._themes.getDefault({
            hasUnicode: t,
            hasColor: r,
            platform: e.platform,
          })
        }
        return e
      }
      Gauge.prototype.setThemeset = function (e) {
        this._themes = e
        this.setTheme(this._theme)
      }
      Gauge.prototype.setTheme = function (e) {
        this._gauge.setTheme(this._computeTheme(e))
        if (this._showing) this._requestRedraw()
        this._theme = e
      }
      Gauge.prototype._requestRedraw = function () {
        this._needsRedraw = true
        if (!this._fixedFramerate) this._doRedraw()
      }
      Gauge.prototype.getWidth = function () {
        return ((this._tty && this._tty.columns) || 80) - 1
      }
      Gauge.prototype.setWriteTo = function (e, t) {
        var r = !this._disabled
        if (r) this.disable()
        this._writeTo = e
        this._tty =
          t ||
          (e === d.stderr && d.stdout.isTTY && d.stdout) ||
          (e.isTTY && e) ||
          this._tty
        if (this._gauge) this._gauge.setWidth(this.getWidth())
        if (r) this.enable()
      }
      Gauge.prototype.enable = function () {
        if (!this._disabled) return
        this._disabled = false
        if (this._tty) this._enableEvents()
        if (this._showing) this.show()
      }
      Gauge.prototype.disable = function () {
        if (this._disabled) return
        if (this._showing) {
          this._lastUpdateAt = null
          this._showing = false
          this._doRedraw()
          this._showing = true
        }
        this._disabled = true
        if (this._tty) this._disableEvents()
      }
      Gauge.prototype._enableEvents = function () {
        if (this._cleanupOnExit) {
          this._removeOnExit = u(callWith(this, this.disable))
        }
        this._tty.on('resize', this._$$handleSizeChange)
        if (this._fixedFramerate) {
          this.redrawTracker = f(this._$$doRedraw, this._updateInterval)
          if (this.redrawTracker.unref) this.redrawTracker.unref()
        }
      }
      Gauge.prototype._disableEvents = function () {
        this._tty.removeListener('resize', this._$$handleSizeChange)
        if (this._fixedFramerate) clearInterval(this.redrawTracker)
        if (this._removeOnExit) this._removeOnExit()
      }
      Gauge.prototype.hide = function (e) {
        if (this._disabled) return e && d.nextTick(e)
        if (!this._showing) return e && d.nextTick(e)
        this._showing = false
        this._doRedraw()
        e && p(e)
      }
      Gauge.prototype.show = function (e, t) {
        this._showing = true
        if (typeof e === 'string') {
          this._status.section = e
        } else if (typeof e === 'object') {
          var r = Object.keys(e)
          for (var s = 0; s < r.length; ++s) {
            var a = r[s]
            this._status[a] = e[a]
          }
        }
        if (t != null) this._status.completed = t
        if (this._disabled) return
        this._requestRedraw()
      }
      Gauge.prototype.pulse = function (e) {
        this._status.subsection = e || ''
        this._status.spun++
        if (this._disabled) return
        if (!this._showing) return
        this._requestRedraw()
      }
      Gauge.prototype._handleSizeChange = function () {
        this._gauge.setWidth(this._tty.columns - 1)
        this._requestRedraw()
      }
      Gauge.prototype._doRedraw = function () {
        if (this._disabled || this._paused) return
        if (!this._fixedFramerate) {
          var e = Date.now()
          if (
            this._lastUpdateAt &&
            e - this._lastUpdateAt < this._updateInterval
          )
            return
          this._lastUpdateAt = e
        }
        if (!this._showing && this._onScreen) {
          this._onScreen = false
          var t = this._gauge.hide()
          if (this._hideCursor) {
            t += this._gauge.showCursor()
          }
          return this._writeTo.write(t)
        }
        if (!this._showing && !this._onScreen) return
        if (this._showing && !this._onScreen) {
          this._onScreen = true
          this._needsRedraw = true
          if (this._hideCursor) {
            this._writeTo.write(this._gauge.hideCursor())
          }
        }
        if (!this._needsRedraw) return
        if (!this._writeTo.write(this._gauge.show(this._status))) {
          this._paused = true
          this._writeTo.on(
            'drain',
            callWith(this, function () {
              this._paused = false
              this._doRedraw()
            })
          )
        }
      }
    },
    4052: (e, t, r) => {
      'use strict'
      var s = r(3844)
      var a = r(7238)
      var o = r(878)
      var u = (e.exports = function (e, t, r) {
        if (!r) r = 80
        o('OAN', [e, t, r])
        this.showing = false
        this.theme = e
        this.width = r
        this.template = t
      })
      u.prototype = {}
      u.prototype.setTheme = function (e) {
        o('O', [e])
        this.theme = e
      }
      u.prototype.setTemplate = function (e) {
        o('A', [e])
        this.template = e
      }
      u.prototype.setWidth = function (e) {
        o('N', [e])
        this.width = e
      }
      u.prototype.hide = function () {
        return s.gotoSOL() + s.eraseLine()
      }
      u.prototype.hideCursor = s.hideCursor
      u.prototype.showCursor = s.showCursor
      u.prototype.show = function (e) {
        var t = Object.create(this.theme)
        for (var r in e) {
          t[r] = e[r]
        }
        return (
          a(this.width, this.template, t).trim() +
          s.color('reset') +
          s.eraseLine() +
          s.gotoSOL()
        )
      }
    },
    5751: (e) => {
      'use strict'
      e.exports = process
    },
    2964: (e, t, r) => {
      'use strict'
      var s = r(878)
      var a = r(7238)
      var o = r(5791)
      var u = r(8321)
      e.exports = function (e, t, r) {
        s('ONN', [e, t, r])
        if (r < 0) r = 0
        if (r > 1) r = 1
        if (t <= 0) return ''
        var o = Math.round(t * r)
        var u = t - o
        var c = [
          { type: 'complete', value: repeat(e.complete, o), length: o },
          { type: 'remaining', value: repeat(e.remaining, u), length: u },
        ]
        return a(t, c, e)
      }
      function repeat(e, t) {
        var r = ''
        var s = t
        do {
          if (s % 2) {
            r += e
          }
          s = Math.floor(s / 2)
          e += e
        } while (s && u(r) < t)
        return o(r, t)
      }
    },
    7238: (e, t, r) => {
      'use strict'
      var s = r(1365)
      var a = r(878)
      var o = r(3540)
      var u = r(5791)
      var c = r(2905)
      var f = r(8855)
      function renderValueWithValues(e) {
        return function (t) {
          return renderValue(t, e)
        }
      }
      var d = (e.exports = function (e, t, r) {
        var a = prepareItems(e, t, r)
        var o = a.map(renderValueWithValues(r)).join('')
        return s.left(u(o, e), e)
      })
      function preType(e) {
        var t = e.type[0].toUpperCase() + e.type.slice(1)
        return 'pre' + t
      }
      function postType(e) {
        var t = e.type[0].toUpperCase() + e.type.slice(1)
        return 'post' + t
      }
      function hasPreOrPost(e, t) {
        if (!e.type) return
        return t[preType(e)] || t[postType(e)]
      }
      function generatePreAndPost(e, t) {
        var r = o({}, e)
        var s = Object.create(t)
        var a = []
        var u = preType(r)
        var c = postType(r)
        if (s[u]) {
          a.push({ value: s[u] })
          s[u] = null
        }
        r.minLength = null
        r.length = null
        r.maxLength = null
        a.push(r)
        s[r.type] = s[r.type]
        if (s[c]) {
          a.push({ value: s[c] })
          s[c] = null
        }
        return function (e, t, r) {
          return d(r, a, s)
        }
      }
      function prepareItems(e, t, r) {
        function cloneAndObjectify(t, s, a) {
          var o = new f(t, e)
          var u = o.type
          if (o.value == null) {
            if (!(u in r)) {
              if (o.default == null) {
                throw new c.MissingTemplateValue(o, r)
              } else {
                o.value = o.default
              }
            } else {
              o.value = r[u]
            }
          }
          if (o.value == null || o.value === '') return null
          o.index = s
          o.first = s === 0
          o.last = s === a.length - 1
          if (hasPreOrPost(o, r)) o.value = generatePreAndPost(o, r)
          return o
        }
        var s = t.map(cloneAndObjectify).filter(function (e) {
          return e != null
        })
        var a = 0
        var o = e
        var u = s.length
        function consumeSpace(e) {
          if (e > o) e = o
          a += e
          o -= e
        }
        function finishSizing(e, t) {
          if (e.finished)
            throw new c.Internal(
              'Tried to finish template item that was already finished'
            )
          if (t === Infinity)
            throw new c.Internal('Length of template item cannot be infinity')
          if (t != null) e.length = t
          e.minLength = null
          e.maxLength = null
          --u
          e.finished = true
          if (e.length == null) e.length = e.getBaseLength()
          if (e.length == null)
            throw new c.Internal('Finished template items must have a length')
          consumeSpace(e.getLength())
        }
        s.forEach(function (e) {
          if (!e.kerning) return
          var t = e.first ? 0 : s[e.index - 1].padRight
          if (!e.first && t < e.kerning) e.padLeft = e.kerning - t
          if (!e.last) e.padRight = e.kerning
        })
        s.forEach(function (e) {
          if (e.getBaseLength() == null) return
          finishSizing(e)
        })
        var d = 0
        var p
        var h
        do {
          p = false
          h = Math.round(o / u)
          s.forEach(function (e) {
            if (e.finished) return
            if (!e.maxLength) return
            if (e.getMaxLength() < h) {
              finishSizing(e, e.maxLength)
              p = true
            }
          })
        } while (p && d++ < s.length)
        if (p)
          throw new c.Internal(
            'Resize loop iterated too many times while determining maxLength'
          )
        d = 0
        do {
          p = false
          h = Math.round(o / u)
          s.forEach(function (e) {
            if (e.finished) return
            if (!e.minLength) return
            if (e.getMinLength() >= h) {
              finishSizing(e, e.minLength)
              p = true
            }
          })
        } while (p && d++ < s.length)
        if (p)
          throw new c.Internal(
            'Resize loop iterated too many times while determining minLength'
          )
        h = Math.round(o / u)
        s.forEach(function (e) {
          if (e.finished) return
          finishSizing(e, h)
        })
        return s
      }
      function renderFunction(e, t, r) {
        a('OON', arguments)
        if (e.type) {
          return e.value(t, t[e.type + 'Theme'] || {}, r)
        } else {
          return e.value(t, {}, r)
        }
      }
      function renderValue(e, t) {
        var r = e.getBaseLength()
        var a =
          typeof e.value === 'function' ? renderFunction(e, t, r) : e.value
        if (a == null || a === '') return ''
        var o = s[e.align] || s.left
        var c = e.padLeft ? s.left('', e.padLeft) : ''
        var f = e.padRight ? s.right('', e.padRight) : ''
        var d = u(String(a), r)
        var p = o(d, r)
        return c + p + f
      }
    },
    5498: (e, t, r) => {
      'use strict'
      var s = r(5751)
      try {
        e.exports = setImmediate
      } catch (t) {
        e.exports = s.nextTick
      }
    },
    7131: (e) => {
      'use strict'
      e.exports = setInterval
    },
    5154: (e) => {
      'use strict'
      e.exports = function spin(e, t) {
        return e[t % e.length]
      }
    },
    8855: (e, t, r) => {
      'use strict'
      var s = r(8321)
      e.exports = TemplateItem
      function isPercent(e) {
        if (typeof e !== 'string') return false
        return e.slice(-1) === '%'
      }
      function percent(e) {
        return Number(e.slice(0, -1)) / 100
      }
      function TemplateItem(e, t) {
        this.overallOutputLength = t
        this.finished = false
        this.type = null
        this.value = null
        this.length = null
        this.maxLength = null
        this.minLength = null
        this.kerning = null
        this.align = 'left'
        this.padLeft = 0
        this.padRight = 0
        this.index = null
        this.first = null
        this.last = null
        if (typeof e === 'string') {
          this.value = e
        } else {
          for (var r in e) this[r] = e[r]
        }
        if (isPercent(this.length)) {
          this.length = Math.round(
            this.overallOutputLength * percent(this.length)
          )
        }
        if (isPercent(this.minLength)) {
          this.minLength = Math.round(
            this.overallOutputLength * percent(this.minLength)
          )
        }
        if (isPercent(this.maxLength)) {
          this.maxLength = Math.round(
            this.overallOutputLength * percent(this.maxLength)
          )
        }
        return this
      }
      TemplateItem.prototype = {}
      TemplateItem.prototype.getBaseLength = function () {
        var e = this.length
        if (
          e == null &&
          typeof this.value === 'string' &&
          this.maxLength == null &&
          this.minLength == null
        ) {
          e = s(this.value)
        }
        return e
      }
      TemplateItem.prototype.getLength = function () {
        var e = this.getBaseLength()
        if (e == null) return null
        return e + this.padLeft + this.padRight
      }
      TemplateItem.prototype.getMaxLength = function () {
        if (this.maxLength == null) return null
        return this.maxLength + this.padLeft + this.padRight
      }
      TemplateItem.prototype.getMinLength = function () {
        if (this.minLength == null) return null
        return this.minLength + this.padLeft + this.padRight
      }
    },
    8469: (e, t, r) => {
      'use strict'
      var s = r(3540)
      e.exports = function () {
        return a.newThemeSet()
      }
      var a = {}
      a.baseTheme = r(8862)
      a.newTheme = function (e, t) {
        if (!t) {
          t = e
          e = this.baseTheme
        }
        return s({}, e, t)
      }
      a.getThemeNames = function () {
        return Object.keys(this.themes)
      }
      a.addTheme = function (e, t, r) {
        this.themes[e] = this.newTheme(t, r)
      }
      a.addToAllThemes = function (e) {
        var t = this.themes
        Object.keys(t).forEach(function (r) {
          s(t[r], e)
        })
        s(this.baseTheme, e)
      }
      a.getTheme = function (e) {
        if (!this.themes[e]) throw this.newMissingThemeError(e)
        return this.themes[e]
      }
      a.setDefault = function (e, t) {
        if (t == null) {
          t = e
          e = {}
        }
        var r = e.platform == null ? 'fallback' : e.platform
        var s = !!e.hasUnicode
        var a = !!e.hasColor
        if (!this.defaults[r]) this.defaults[r] = { true: {}, false: {} }
        this.defaults[r][s][a] = t
      }
      a.getDefault = function (e) {
        if (!e) e = {}
        var t = e.platform || process.platform
        var r = this.defaults[t] || this.defaults.fallback
        var a = !!e.hasUnicode
        var o = !!e.hasColor
        if (!r) throw this.newMissingDefaultThemeError(t, a, o)
        if (!r[a][o]) {
          if (a && o && r[!a][o]) {
            a = false
          } else if (a && o && r[a][!o]) {
            o = false
          } else if (a && o && r[!a][!o]) {
            a = false
            o = false
          } else if (a && !o && r[!a][o]) {
            a = false
          } else if (!a && o && r[a][!o]) {
            o = false
          } else if (r === this.defaults.fallback) {
            throw this.newMissingDefaultThemeError(t, a, o)
          }
        }
        if (r[a][o]) {
          return this.getTheme(r[a][o])
        } else {
          return this.getDefault(s({}, e, { platform: 'fallback' }))
        }
      }
      a.newMissingThemeError = function newMissingThemeError(e) {
        var t = new Error('Could not find a gauge theme named "' + e + '"')
        Error.captureStackTrace.call(t, newMissingThemeError)
        t.theme = e
        t.code = 'EMISSINGTHEME'
        return t
      }
      a.newMissingDefaultThemeError = function newMissingDefaultThemeError(
        e,
        t,
        r
      ) {
        var s = new Error(
          'Could not find a gauge theme for your platform/unicode/color use combo:\n' +
            '    platform = ' +
            e +
            '\n' +
            '    hasUnicode = ' +
            t +
            '\n' +
            '    hasColor = ' +
            r
        )
        Error.captureStackTrace.call(s, newMissingDefaultThemeError)
        s.platform = e
        s.hasUnicode = t
        s.hasColor = r
        s.code = 'EMISSINGTHEME'
        return s
      }
      a.newThemeSet = function () {
        var themeset = function (e) {
          return themeset.getDefault(e)
        }
        return s(themeset, a, {
          themes: s({}, this.themes),
          baseTheme: s({}, this.baseTheme),
          defaults: JSON.parse(JSON.stringify(this.defaults || {})),
        })
      }
    },
    9986: (e, t, r) => {
      'use strict'
      var s = r(3844)
      var a = r(8469)
      var o = (e.exports = new a())
      o.addTheme('ASCII', {
        preProgressbar: '[',
        postProgressbar: ']',
        progressbarTheme: { complete: '#', remaining: '.' },
        activityIndicatorTheme: '-\\|/',
        preSubsection: '>',
      })
      o.addTheme('colorASCII', o.getTheme('ASCII'), {
        progressbarTheme: {
          preComplete: s.color('inverse'),
          complete: ' ',
          postComplete: s.color('stopInverse'),
          preRemaining: s.color('brightBlack'),
          remaining: '.',
          postRemaining: s.color('reset'),
        },
      })
      o.addTheme('brailleSpinner', {
        preProgressbar: '⸨',
        postProgressbar: '⸩',
        progressbarTheme: { complete: '░', remaining: '⠂' },
        activityIndicatorTheme: '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏',
        preSubsection: '>',
      })
      o.addTheme('colorBrailleSpinner', o.getTheme('brailleSpinner'), {
        progressbarTheme: {
          preComplete: s.color('inverse'),
          complete: ' ',
          postComplete: s.color('stopInverse'),
          preRemaining: s.color('brightBlack'),
          remaining: '░',
          postRemaining: s.color('reset'),
        },
      })
      o.setDefault({}, 'ASCII')
      o.setDefault({ hasColor: true }, 'colorASCII')
      o.setDefault({ platform: 'darwin', hasUnicode: true }, 'brailleSpinner')
      o.setDefault(
        { platform: 'darwin', hasUnicode: true, hasColor: true },
        'colorBrailleSpinner'
      )
    },
    5791: (e, t, r) => {
      'use strict'
      var s = r(8321)
      var a = r(3484)
      e.exports = wideTruncate
      function wideTruncate(e, t) {
        if (s(e) === 0) return e
        if (t <= 0) return ''
        if (s(e) <= t) return e
        var r = a(e)
        var o = e.length + r.length
        var u = e.slice(0, t + o)
        while (s(u) > t) {
          u = u.slice(0, -1)
        }
        return u
      }
    },
    8567: (e) => {
      'use strict'
      e.exports = clone
      var t =
        Object.getPrototypeOf ||
        function (e) {
          return e.__proto__
        }
      function clone(e) {
        if (e === null || typeof e !== 'object') return e
        if (e instanceof Object) var r = { __proto__: t(e) }
        else var r = Object.create(null)
        Object.getOwnPropertyNames(e).forEach(function (t) {
          Object.defineProperty(r, t, Object.getOwnPropertyDescriptor(e, t))
        })
        return r
      }
    },
    6450: (e, t, r) => {
      var s = r(7147)
      var a = r(2164)
      var o = r(5653)
      var u = r(8567)
      var c = r(3837)
      var f
      var d
      if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
        f = Symbol.for('graceful-fs.queue')
        d = Symbol.for('graceful-fs.previous')
      } else {
        f = '___graceful-fs.queue'
        d = '___graceful-fs.previous'
      }
      function noop() {}
      function publishQueue(e, t) {
        Object.defineProperty(e, f, {
          get: function () {
            return t
          },
        })
      }
      var p = noop
      if (c.debuglog) p = c.debuglog('gfs4')
      else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
        p = function () {
          var e = c.format.apply(c, arguments)
          e = 'GFS4: ' + e.split(/\n/).join('\nGFS4: ')
          console.error(e)
        }
      if (!s[f]) {
        var h = global[f] || []
        publishQueue(s, h)
        s.close = (function (e) {
          function close(t, r) {
            return e.call(s, t, function (e) {
              if (!e) {
                resetQueue()
              }
              if (typeof r === 'function') r.apply(this, arguments)
            })
          }
          Object.defineProperty(close, d, { value: e })
          return close
        })(s.close)
        s.closeSync = (function (e) {
          function closeSync(t) {
            e.apply(s, arguments)
            resetQueue()
          }
          Object.defineProperty(closeSync, d, { value: e })
          return closeSync
        })(s.closeSync)
        if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
          process.on('exit', function () {
            p(s[f])
            r(9491).equal(s[f].length, 0)
          })
        }
      }
      if (!global[f]) {
        publishQueue(global, s[f])
      }
      e.exports = patch(u(s))
      if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !s.__patched) {
        e.exports = patch(s)
        s.__patched = true
      }
      function patch(e) {
        a(e)
        e.gracefulify = patch
        e.createReadStream = createReadStream
        e.createWriteStream = createWriteStream
        var t = e.readFile
        e.readFile = readFile
        function readFile(e, r, s) {
          if (typeof r === 'function') (s = r), (r = null)
          return go$readFile(e, r, s)
          function go$readFile(e, r, s, a) {
            return t(e, r, function (t) {
              if (t && (t.code === 'EMFILE' || t.code === 'ENFILE'))
                enqueue([
                  go$readFile,
                  [e, r, s],
                  t,
                  a || Date.now(),
                  Date.now(),
                ])
              else {
                if (typeof s === 'function') s.apply(this, arguments)
              }
            })
          }
        }
        var r = e.writeFile
        e.writeFile = writeFile
        function writeFile(e, t, s, a) {
          if (typeof s === 'function') (a = s), (s = null)
          return go$writeFile(e, t, s, a)
          function go$writeFile(e, t, s, a, o) {
            return r(e, t, s, function (r) {
              if (r && (r.code === 'EMFILE' || r.code === 'ENFILE'))
                enqueue([
                  go$writeFile,
                  [e, t, s, a],
                  r,
                  o || Date.now(),
                  Date.now(),
                ])
              else {
                if (typeof a === 'function') a.apply(this, arguments)
              }
            })
          }
        }
        var s = e.appendFile
        if (s) e.appendFile = appendFile
        function appendFile(e, t, r, a) {
          if (typeof r === 'function') (a = r), (r = null)
          return go$appendFile(e, t, r, a)
          function go$appendFile(e, t, r, a, o) {
            return s(e, t, r, function (s) {
              if (s && (s.code === 'EMFILE' || s.code === 'ENFILE'))
                enqueue([
                  go$appendFile,
                  [e, t, r, a],
                  s,
                  o || Date.now(),
                  Date.now(),
                ])
              else {
                if (typeof a === 'function') a.apply(this, arguments)
              }
            })
          }
        }
        var u = e.copyFile
        if (u) e.copyFile = copyFile
        function copyFile(e, t, r, s) {
          if (typeof r === 'function') {
            s = r
            r = 0
          }
          return go$copyFile(e, t, r, s)
          function go$copyFile(e, t, r, s, a) {
            return u(e, t, r, function (o) {
              if (o && (o.code === 'EMFILE' || o.code === 'ENFILE'))
                enqueue([
                  go$copyFile,
                  [e, t, r, s],
                  o,
                  a || Date.now(),
                  Date.now(),
                ])
              else {
                if (typeof s === 'function') s.apply(this, arguments)
              }
            })
          }
        }
        var c = e.readdir
        e.readdir = readdir
        var f = /^v[0-5]\./
        function readdir(e, t, r) {
          if (typeof t === 'function') (r = t), (t = null)
          var s = f.test(process.version)
            ? function go$readdir(e, t, r, s) {
                return c(e, fs$readdirCallback(e, t, r, s))
              }
            : function go$readdir(e, t, r, s) {
                return c(e, t, fs$readdirCallback(e, t, r, s))
              }
          return s(e, t, r)
          function fs$readdirCallback(e, t, r, a) {
            return function (o, u) {
              if (o && (o.code === 'EMFILE' || o.code === 'ENFILE'))
                enqueue([s, [e, t, r], o, a || Date.now(), Date.now()])
              else {
                if (u && u.sort) u.sort()
                if (typeof r === 'function') r.call(this, o, u)
              }
            }
          }
        }
        if (process.version.substr(0, 4) === 'v0.8') {
          var d = o(e)
          ReadStream = d.ReadStream
          WriteStream = d.WriteStream
        }
        var p = e.ReadStream
        if (p) {
          ReadStream.prototype = Object.create(p.prototype)
          ReadStream.prototype.open = ReadStream$open
        }
        var h = e.WriteStream
        if (h) {
          WriteStream.prototype = Object.create(h.prototype)
          WriteStream.prototype.open = WriteStream$open
        }
        Object.defineProperty(e, 'ReadStream', {
          get: function () {
            return ReadStream
          },
          set: function (e) {
            ReadStream = e
          },
          enumerable: true,
          configurable: true,
        })
        Object.defineProperty(e, 'WriteStream', {
          get: function () {
            return WriteStream
          },
          set: function (e) {
            WriteStream = e
          },
          enumerable: true,
          configurable: true,
        })
        var v = ReadStream
        Object.defineProperty(e, 'FileReadStream', {
          get: function () {
            return v
          },
          set: function (e) {
            v = e
          },
          enumerable: true,
          configurable: true,
        })
        var g = WriteStream
        Object.defineProperty(e, 'FileWriteStream', {
          get: function () {
            return g
          },
          set: function (e) {
            g = e
          },
          enumerable: true,
          configurable: true,
        })
        function ReadStream(e, t) {
          if (this instanceof ReadStream) return p.apply(this, arguments), this
          else
            return ReadStream.apply(
              Object.create(ReadStream.prototype),
              arguments
            )
        }
        function ReadStream$open() {
          var e = this
          open(e.path, e.flags, e.mode, function (t, r) {
            if (t) {
              if (e.autoClose) e.destroy()
              e.emit('error', t)
            } else {
              e.fd = r
              e.emit('open', r)
              e.read()
            }
          })
        }
        function WriteStream(e, t) {
          if (this instanceof WriteStream) return h.apply(this, arguments), this
          else
            return WriteStream.apply(
              Object.create(WriteStream.prototype),
              arguments
            )
        }
        function WriteStream$open() {
          var e = this
          open(e.path, e.flags, e.mode, function (t, r) {
            if (t) {
              e.destroy()
              e.emit('error', t)
            } else {
              e.fd = r
              e.emit('open', r)
            }
          })
        }
        function createReadStream(t, r) {
          return new e.ReadStream(t, r)
        }
        function createWriteStream(t, r) {
          return new e.WriteStream(t, r)
        }
        var D = e.open
        e.open = open
        function open(e, t, r, s) {
          if (typeof r === 'function') (s = r), (r = null)
          return go$open(e, t, r, s)
          function go$open(e, t, r, s, a) {
            return D(e, t, r, function (o, u) {
              if (o && (o.code === 'EMFILE' || o.code === 'ENFILE'))
                enqueue([go$open, [e, t, r, s], o, a || Date.now(), Date.now()])
              else {
                if (typeof s === 'function') s.apply(this, arguments)
              }
            })
          }
        }
        return e
      }
      function enqueue(e) {
        p('ENQUEUE', e[0].name, e[1])
        s[f].push(e)
        retry()
      }
      var v
      function resetQueue() {
        var e = Date.now()
        for (var t = 0; t < s[f].length; ++t) {
          if (s[f][t].length > 2) {
            s[f][t][3] = e
            s[f][t][4] = e
          }
        }
        retry()
      }
      function retry() {
        clearTimeout(v)
        v = undefined
        if (s[f].length === 0) return
        var e = s[f].shift()
        var t = e[0]
        var r = e[1]
        var a = e[2]
        var o = e[3]
        var u = e[4]
        if (o === undefined) {
          p('RETRY', t.name, r)
          t.apply(null, r)
        } else if (Date.now() - o >= 6e4) {
          p('TIMEOUT', t.name, r)
          var c = r.pop()
          if (typeof c === 'function') c.call(null, a)
        } else {
          var d = Date.now() - u
          var h = Math.max(u - o, 1)
          var g = Math.min(h * 1.2, 100)
          if (d >= g) {
            p('RETRY', t.name, r)
            t.apply(null, r.concat([o]))
          } else {
            s[f].push(e)
          }
        }
        if (v === undefined) {
          v = setTimeout(retry, 0)
        }
      }
    },
    5653: (e, t, r) => {
      var s = r(2781).Stream
      e.exports = legacy
      function legacy(e) {
        return { ReadStream: ReadStream, WriteStream: WriteStream }
        function ReadStream(t, r) {
          if (!(this instanceof ReadStream)) return new ReadStream(t, r)
          s.call(this)
          var a = this
          this.path = t
          this.fd = null
          this.readable = true
          this.paused = false
          this.flags = 'r'
          this.mode = 438
          this.bufferSize = 64 * 1024
          r = r || {}
          var o = Object.keys(r)
          for (var u = 0, c = o.length; u < c; u++) {
            var f = o[u]
            this[f] = r[f]
          }
          if (this.encoding) this.setEncoding(this.encoding)
          if (this.start !== undefined) {
            if ('number' !== typeof this.start) {
              throw TypeError('start must be a Number')
            }
            if (this.end === undefined) {
              this.end = Infinity
            } else if ('number' !== typeof this.end) {
              throw TypeError('end must be a Number')
            }
            if (this.start > this.end) {
              throw new Error('start must be <= end')
            }
            this.pos = this.start
          }
          if (this.fd !== null) {
            process.nextTick(function () {
              a._read()
            })
            return
          }
          e.open(this.path, this.flags, this.mode, function (e, t) {
            if (e) {
              a.emit('error', e)
              a.readable = false
              return
            }
            a.fd = t
            a.emit('open', t)
            a._read()
          })
        }
        function WriteStream(t, r) {
          if (!(this instanceof WriteStream)) return new WriteStream(t, r)
          s.call(this)
          this.path = t
          this.fd = null
          this.writable = true
          this.flags = 'w'
          this.encoding = 'binary'
          this.mode = 438
          this.bytesWritten = 0
          r = r || {}
          var a = Object.keys(r)
          for (var o = 0, u = a.length; o < u; o++) {
            var c = a[o]
            this[c] = r[c]
          }
          if (this.start !== undefined) {
            if ('number' !== typeof this.start) {
              throw TypeError('start must be a Number')
            }
            if (this.start < 0) {
              throw new Error('start must be >= zero')
            }
            this.pos = this.start
          }
          this.busy = false
          this._queue = []
          if (this.fd === null) {
            this._open = e.open
            this._queue.push([
              this._open,
              this.path,
              this.flags,
              this.mode,
              undefined,
            ])
            this.flush()
          }
        }
      }
    },
    2164: (e, t, r) => {
      var s = r(2057)
      var a = process.cwd
      var o = null
      var u = process.env.GRACEFUL_FS_PLATFORM || process.platform
      process.cwd = function () {
        if (!o) o = a.call(process)
        return o
      }
      try {
        process.cwd()
      } catch (e) {}
      if (typeof process.chdir === 'function') {
        var c = process.chdir
        process.chdir = function (e) {
          o = null
          c.call(process, e)
        }
        if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, c)
      }
      e.exports = patch
      function patch(e) {
        if (
          s.hasOwnProperty('O_SYMLINK') &&
          process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)
        ) {
          patchLchmod(e)
        }
        if (!e.lutimes) {
          patchLutimes(e)
        }
        e.chown = chownFix(e.chown)
        e.fchown = chownFix(e.fchown)
        e.lchown = chownFix(e.lchown)
        e.chmod = chmodFix(e.chmod)
        e.fchmod = chmodFix(e.fchmod)
        e.lchmod = chmodFix(e.lchmod)
        e.chownSync = chownFixSync(e.chownSync)
        e.fchownSync = chownFixSync(e.fchownSync)
        e.lchownSync = chownFixSync(e.lchownSync)
        e.chmodSync = chmodFixSync(e.chmodSync)
        e.fchmodSync = chmodFixSync(e.fchmodSync)
        e.lchmodSync = chmodFixSync(e.lchmodSync)
        e.stat = statFix(e.stat)
        e.fstat = statFix(e.fstat)
        e.lstat = statFix(e.lstat)
        e.statSync = statFixSync(e.statSync)
        e.fstatSync = statFixSync(e.fstatSync)
        e.lstatSync = statFixSync(e.lstatSync)
        if (e.chmod && !e.lchmod) {
          e.lchmod = function (e, t, r) {
            if (r) process.nextTick(r)
          }
          e.lchmodSync = function () {}
        }
        if (e.chown && !e.lchown) {
          e.lchown = function (e, t, r, s) {
            if (s) process.nextTick(s)
          }
          e.lchownSync = function () {}
        }
        if (u === 'win32') {
          e.rename =
            typeof e.rename !== 'function'
              ? e.rename
              : (function (t) {
                  function rename(r, s, a) {
                    var o = Date.now()
                    var u = 0
                    t(r, s, function CB(c) {
                      if (
                        c &&
                        (c.code === 'EACCES' ||
                          c.code === 'EPERM' ||
                          c.code === 'EBUSY') &&
                        Date.now() - o < 6e4
                      ) {
                        setTimeout(function () {
                          e.stat(s, function (e, o) {
                            if (e && e.code === 'ENOENT') t(r, s, CB)
                            else a(c)
                          })
                        }, u)
                        if (u < 100) u += 10
                        return
                      }
                      if (a) a(c)
                    })
                  }
                  if (Object.setPrototypeOf) Object.setPrototypeOf(rename, t)
                  return rename
                })(e.rename)
        }
        e.read =
          typeof e.read !== 'function'
            ? e.read
            : (function (t) {
                function read(r, s, a, o, u, c) {
                  var f
                  if (c && typeof c === 'function') {
                    var d = 0
                    f = function (p, h, v) {
                      if (p && p.code === 'EAGAIN' && d < 10) {
                        d++
                        return t.call(e, r, s, a, o, u, f)
                      }
                      c.apply(this, arguments)
                    }
                  }
                  return t.call(e, r, s, a, o, u, f)
                }
                if (Object.setPrototypeOf) Object.setPrototypeOf(read, t)
                return read
              })(e.read)
        e.readSync =
          typeof e.readSync !== 'function'
            ? e.readSync
            : (function (t) {
                return function (r, s, a, o, u) {
                  var c = 0
                  while (true) {
                    try {
                      return t.call(e, r, s, a, o, u)
                    } catch (e) {
                      if (e.code === 'EAGAIN' && c < 10) {
                        c++
                        continue
                      }
                      throw e
                    }
                  }
                }
              })(e.readSync)
        function patchLchmod(e) {
          e.lchmod = function (t, r, a) {
            e.open(t, s.O_WRONLY | s.O_SYMLINK, r, function (t, s) {
              if (t) {
                if (a) a(t)
                return
              }
              e.fchmod(s, r, function (t) {
                e.close(s, function (e) {
                  if (a) a(t || e)
                })
              })
            })
          }
          e.lchmodSync = function (t, r) {
            var a = e.openSync(t, s.O_WRONLY | s.O_SYMLINK, r)
            var o = true
            var u
            try {
              u = e.fchmodSync(a, r)
              o = false
            } finally {
              if (o) {
                try {
                  e.closeSync(a)
                } catch (e) {}
              } else {
                e.closeSync(a)
              }
            }
            return u
          }
        }
        function patchLutimes(e) {
          if (s.hasOwnProperty('O_SYMLINK') && e.futimes) {
            e.lutimes = function (t, r, a, o) {
              e.open(t, s.O_SYMLINK, function (t, s) {
                if (t) {
                  if (o) o(t)
                  return
                }
                e.futimes(s, r, a, function (t) {
                  e.close(s, function (e) {
                    if (o) o(t || e)
                  })
                })
              })
            }
            e.lutimesSync = function (t, r, a) {
              var o = e.openSync(t, s.O_SYMLINK)
              var u
              var c = true
              try {
                u = e.futimesSync(o, r, a)
                c = false
              } finally {
                if (c) {
                  try {
                    e.closeSync(o)
                  } catch (e) {}
                } else {
                  e.closeSync(o)
                }
              }
              return u
            }
          } else if (e.futimes) {
            e.lutimes = function (e, t, r, s) {
              if (s) process.nextTick(s)
            }
            e.lutimesSync = function () {}
          }
        }
        function chmodFix(t) {
          if (!t) return t
          return function (r, s, a) {
            return t.call(e, r, s, function (e) {
              if (chownErOk(e)) e = null
              if (a) a.apply(this, arguments)
            })
          }
        }
        function chmodFixSync(t) {
          if (!t) return t
          return function (r, s) {
            try {
              return t.call(e, r, s)
            } catch (e) {
              if (!chownErOk(e)) throw e
            }
          }
        }
        function chownFix(t) {
          if (!t) return t
          return function (r, s, a, o) {
            return t.call(e, r, s, a, function (e) {
              if (chownErOk(e)) e = null
              if (o) o.apply(this, arguments)
            })
          }
        }
        function chownFixSync(t) {
          if (!t) return t
          return function (r, s, a) {
            try {
              return t.call(e, r, s, a)
            } catch (e) {
              if (!chownErOk(e)) throw e
            }
          }
        }
        function statFix(t) {
          if (!t) return t
          return function (r, s, a) {
            if (typeof s === 'function') {
              a = s
              s = null
            }
            function callback(e, t) {
              if (t) {
                if (t.uid < 0) t.uid += 4294967296
                if (t.gid < 0) t.gid += 4294967296
              }
              if (a) a.apply(this, arguments)
            }
            return s ? t.call(e, r, s, callback) : t.call(e, r, callback)
          }
        }
        function statFixSync(t) {
          if (!t) return t
          return function (r, s) {
            var a = s ? t.call(e, r, s) : t.call(e, r)
            if (a) {
              if (a.uid < 0) a.uid += 4294967296
              if (a.gid < 0) a.gid += 4294967296
            }
            return a
          }
        }
        function chownErOk(e) {
          if (!e) return true
          if (e.code === 'ENOSYS') return true
          var t = !process.getuid || process.getuid() !== 0
          if (t) {
            if (e.code === 'EINVAL' || e.code === 'EPERM') return true
          }
          return false
        }
      }
    },
    5214: (e, t, r) => {
      'use strict'
      var s = r(2037)
      var a = (e.exports = function () {
        if (s.type() == 'Windows_NT') {
          return false
        }
        var e = /UTF-?8$/i
        var t = process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG
        return e.test(t)
      })
    },
    2842: (e, t, r) => {
      try {
        var s = r(3837)
        if (typeof s.inherits !== 'function') throw ''
        e.exports = s.inherits
      } catch (t) {
        e.exports = r(3782)
      }
    },
    3782: (e) => {
      if (typeof Object.create === 'function') {
        e.exports = function inherits(e, t) {
          if (t) {
            e.super_ = t
            e.prototype = Object.create(t.prototype, {
              constructor: {
                value: e,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            })
          }
        }
      } else {
        e.exports = function inherits(e, t) {
          if (t) {
            e.super_ = t
            var TempCtor = function () {}
            TempCtor.prototype = t.prototype
            e.prototype = new TempCtor()
            e.prototype.constructor = e
          }
        }
      }
    },
    3279: (e, t, r) => {
      'use strict'
      var s = r(3979)
      e.exports = function (e) {
        if (s(e)) {
          return false
        }
        if (
          e >= 4352 &&
          (e <= 4447 ||
            9001 === e ||
            9002 === e ||
            (11904 <= e && e <= 12871 && e !== 12351) ||
            (12880 <= e && e <= 19903) ||
            (19968 <= e && e <= 42182) ||
            (43360 <= e && e <= 43388) ||
            (44032 <= e && e <= 55203) ||
            (63744 <= e && e <= 64255) ||
            (65040 <= e && e <= 65049) ||
            (65072 <= e && e <= 65131) ||
            (65281 <= e && e <= 65376) ||
            (65504 <= e && e <= 65510) ||
            (110592 <= e && e <= 110593) ||
            (127488 <= e && e <= 127569) ||
            (131072 <= e && e <= 262141))
        ) {
          return true
        }
        return false
      }
    },
    8502: (e) => {
      'use strict'
      const isFullwidthCodePoint = (e) => {
        if (Number.isNaN(e)) {
          return false
        }
        if (
          e >= 4352 &&
          (e <= 4447 ||
            e === 9001 ||
            e === 9002 ||
            (11904 <= e && e <= 12871 && e !== 12351) ||
            (12880 <= e && e <= 19903) ||
            (19968 <= e && e <= 42182) ||
            (43360 <= e && e <= 43388) ||
            (44032 <= e && e <= 55203) ||
            (63744 <= e && e <= 64255) ||
            (65040 <= e && e <= 65049) ||
            (65072 <= e && e <= 65131) ||
            (65281 <= e && e <= 65376) ||
            (65504 <= e && e <= 65510) ||
            (110592 <= e && e <= 110593) ||
            (127488 <= e && e <= 127569) ||
            (131072 <= e && e <= 262141))
        ) {
          return true
        }
        return false
      }
      e.exports = isFullwidthCodePoint
      e.exports['default'] = isFullwidthCodePoint
    },
    3357: (e) => {
      'use strict'
      /*!
       * is-number <https://github.com/jonschlinkert/is-number>
       *
       * Copyright (c) 2014-present, Jon Schlinkert.
       * Released under the MIT License.
       */ e.exports = function (e) {
        if (typeof e === 'number') {
          return e - e === 0
        }
        if (typeof e === 'string' && e.trim() !== '') {
          return Number.isFinite ? Number.isFinite(+e) : isFinite(+e)
        }
        return false
      }
    },
    1551: (e) => {
      var t = {}.toString
      e.exports =
        Array.isArray ||
        function (e) {
          return t.call(e) == '[object Array]'
        }
    },
    1065: (e, t, r) => {
      'use strict'
      const s = r(3837)
      const a = r(8333)
      const o = r(9990)
      const u = r(5502)
      const isEmptyString = (e) => e === '' || e === './'
      const micromatch = (e, t, r) => {
        t = [].concat(t)
        e = [].concat(e)
        let s = new Set()
        let a = new Set()
        let u = new Set()
        let c = 0
        let onResult = (e) => {
          u.add(e.output)
          if (r && r.onResult) {
            r.onResult(e)
          }
        }
        for (let u = 0; u < t.length; u++) {
          let f = o(String(t[u]), { ...r, onResult: onResult }, true)
          let d = f.state.negated || f.state.negatedExtglob
          if (d) c++
          for (let t of e) {
            let e = f(t, true)
            let r = d ? !e.isMatch : e.isMatch
            if (!r) continue
            if (d) {
              s.add(e.output)
            } else {
              s.delete(e.output)
              a.add(e.output)
            }
          }
        }
        let f = c === t.length ? [...u] : [...a]
        let d = f.filter((e) => !s.has(e))
        if (r && d.length === 0) {
          if (r.failglob === true) {
            throw new Error(`No matches found for "${t.join(', ')}"`)
          }
          if (r.nonull === true || r.nullglob === true) {
            return r.unescape ? t.map((e) => e.replace(/\\/g, '')) : t
          }
        }
        return d
      }
      micromatch.match = micromatch
      micromatch.matcher = (e, t) => o(e, t)
      micromatch.isMatch = (e, t, r) => o(t, r)(e)
      micromatch.any = micromatch.isMatch
      micromatch.not = (e, t, r = {}) => {
        t = [].concat(t).map(String)
        let s = new Set()
        let a = []
        let onResult = (e) => {
          if (r.onResult) r.onResult(e)
          a.push(e.output)
        }
        let o = new Set(micromatch(e, t, { ...r, onResult: onResult }))
        for (let e of a) {
          if (!o.has(e)) {
            s.add(e)
          }
        }
        return [...s]
      }
      micromatch.contains = (e, t, r) => {
        if (typeof e !== 'string') {
          throw new TypeError(`Expected a string: "${s.inspect(e)}"`)
        }
        if (Array.isArray(t)) {
          return t.some((t) => micromatch.contains(e, t, r))
        }
        if (typeof t === 'string') {
          if (isEmptyString(e) || isEmptyString(t)) {
            return false
          }
          if (e.includes(t) || (e.startsWith('./') && e.slice(2).includes(t))) {
            return true
          }
        }
        return micromatch.isMatch(e, t, { ...r, contains: true })
      }
      micromatch.matchKeys = (e, t, r) => {
        if (!u.isObject(e)) {
          throw new TypeError('Expected the first argument to be an object')
        }
        let s = micromatch(Object.keys(e), t, r)
        let a = {}
        for (let t of s) a[t] = e[t]
        return a
      }
      micromatch.some = (e, t, r) => {
        let s = [].concat(e)
        for (let e of [].concat(t)) {
          let t = o(String(e), r)
          if (s.some((e) => t(e))) {
            return true
          }
        }
        return false
      }
      micromatch.every = (e, t, r) => {
        let s = [].concat(e)
        for (let e of [].concat(t)) {
          let t = o(String(e), r)
          if (!s.every((e) => t(e))) {
            return false
          }
        }
        return true
      }
      micromatch.all = (e, t, r) => {
        if (typeof e !== 'string') {
          throw new TypeError(`Expected a string: "${s.inspect(e)}"`)
        }
        return [].concat(t).every((t) => o(t, r)(e))
      }
      micromatch.capture = (e, t, r) => {
        let s = u.isWindows(r)
        let a = o.makeRe(String(e), { ...r, capture: true })
        let c = a.exec(s ? u.toPosixSlashes(t) : t)
        if (c) {
          return c.slice(1).map((e) => (e === void 0 ? '' : e))
        }
      }
      micromatch.makeRe = (...e) => o.makeRe(...e)
      micromatch.scan = (...e) => o.scan(...e)
      micromatch.parse = (e, t) => {
        let r = []
        for (let s of [].concat(e || [])) {
          for (let e of a(String(s), t)) {
            r.push(o.parse(e, t))
          }
        }
        return r
      }
      micromatch.braces = (e, t) => {
        if (typeof e !== 'string') throw new TypeError('Expected a string')
        if ((t && t.nobrace === true) || !/\{.*\}/.test(e)) {
          return [e]
        }
        return a(e, t)
      }
      micromatch.braceExpand = (e, t) => {
        if (typeof e !== 'string') throw new TypeError('Expected a string')
        return micromatch.braces(e, { ...t, expand: true })
      }
      e.exports = micromatch
    },
    9042: (e, t, r) => {
      if (typeof process.addon === 'function') {
        e.exports = process.addon.bind(process)
      } else {
        e.exports = r(5850)
      }
    },
    5850: (module, __unused_webpack_exports, __nccwpck_require__) => {
      var fs = __nccwpck_require__(7147)
      var path = __nccwpck_require__(1017)
      var os = __nccwpck_require__(2037)
      var runtimeRequire = true ? eval('require') : 0
      var vars = (process.config && process.config.variables) || {}
      var prebuildsOnly = !!process.env.PREBUILDS_ONLY
      var abi = process.versions.modules
      var runtime = isElectron()
        ? 'electron'
        : isNwjs()
        ? 'node-webkit'
        : 'node'
      var arch = process.env.npm_config_arch || os.arch()
      var platform = process.env.npm_config_platform || os.platform()
      var libc = process.env.LIBC || (isAlpine(platform) ? 'musl' : 'glibc')
      var armv =
        process.env.ARM_VERSION ||
        (arch === 'arm64' ? '8' : vars.arm_version) ||
        ''
      var uv = (process.versions.uv || '').split('.')[0]
      module.exports = load
      function load(e) {
        return runtimeRequire(load.resolve(e))
      }
      load.resolve = load.path = function (e) {
        e = path.resolve(e || '.')
        try {
          var t = runtimeRequire(path.join(e, 'package.json'))
            .name.toUpperCase()
            .replace(/-/g, '_')
          if (process.env[t + '_PREBUILD']) e = process.env[t + '_PREBUILD']
        } catch (e) {}
        if (!prebuildsOnly) {
          var r = getFirst(path.join(e, 'build/Release'), matchBuild)
          if (r) return r
          var s = getFirst(path.join(e, 'build/Debug'), matchBuild)
          if (s) return s
        }
        var a = resolve(e)
        if (a) return a
        var o = resolve(path.dirname(process.execPath))
        if (o) return o
        var u = [
          'platform=' + platform,
          'arch=' + arch,
          'runtime=' + runtime,
          'abi=' + abi,
          'uv=' + uv,
          armv ? 'armv=' + armv : '',
          'libc=' + libc,
          'node=' + process.versions.node,
          process.versions.electron
            ? 'electron=' + process.versions.electron
            : '',
          true ? 'webpack=true' : 0,
        ]
          .filter(Boolean)
          .join(' ')
        throw new Error(
          'No native build was found for ' +
            u +
            '\n    loaded from: ' +
            e +
            '\n'
        )
        function resolve(e) {
          var t = readdirSync(path.join(e, 'prebuilds')).map(parseTuple)
          var r = t.filter(matchTuple(platform, arch)).sort(compareTuples)[0]
          if (!r) return
          var s = path.join(e, 'prebuilds', r.name)
          var a = readdirSync(s).map(parseTags)
          var o = a.filter(matchTags(runtime, abi))
          var u = o.sort(compareTags(runtime))[0]
          if (u) return path.join(s, u.file)
        }
      }
      function readdirSync(e) {
        try {
          return fs.readdirSync(e)
        } catch (e) {
          return []
        }
      }
      function getFirst(e, t) {
        var r = readdirSync(e).filter(t)
        return r[0] && path.join(e, r[0])
      }
      function matchBuild(e) {
        return /\.node$/.test(e)
      }
      function parseTuple(e) {
        var t = e.split('-')
        if (t.length !== 2) return
        var r = t[0]
        var s = t[1].split('+')
        if (!r) return
        if (!s.length) return
        if (!s.every(Boolean)) return
        return { name: e, platform: r, architectures: s }
      }
      function matchTuple(e, t) {
        return function (r) {
          if (r == null) return false
          if (r.platform !== e) return false
          return r.architectures.includes(t)
        }
      }
      function compareTuples(e, t) {
        return e.architectures.length - t.architectures.length
      }
      function parseTags(e) {
        var t = e.split('.')
        var r = t.pop()
        var s = { file: e, specificity: 0 }
        if (r !== 'node') return
        for (var a = 0; a < t.length; a++) {
          var o = t[a]
          if (o === 'node' || o === 'electron' || o === 'node-webkit') {
            s.runtime = o
          } else if (o === 'napi') {
            s.napi = true
          } else if (o.slice(0, 3) === 'abi') {
            s.abi = o.slice(3)
          } else if (o.slice(0, 2) === 'uv') {
            s.uv = o.slice(2)
          } else if (o.slice(0, 4) === 'armv') {
            s.armv = o.slice(4)
          } else if (o === 'glibc' || o === 'musl') {
            s.libc = o
          } else {
            continue
          }
          s.specificity++
        }
        return s
      }
      function matchTags(e, t) {
        return function (r) {
          if (r == null) return false
          if (r.runtime !== e && !runtimeAgnostic(r)) return false
          if (r.abi !== t && !r.napi) return false
          if (r.uv && r.uv !== uv) return false
          if (r.armv && r.armv !== armv) return false
          if (r.libc && r.libc !== libc) return false
          return true
        }
      }
      function runtimeAgnostic(e) {
        return e.runtime === 'node' && e.napi
      }
      function compareTags(e) {
        return function (t, r) {
          if (t.runtime !== r.runtime) {
            return t.runtime === e ? -1 : 1
          } else if (t.abi !== r.abi) {
            return t.abi ? -1 : 1
          } else if (t.specificity !== r.specificity) {
            return t.specificity > r.specificity ? -1 : 1
          } else {
            return 0
          }
        }
      }
      function isNwjs() {
        return !!(process.versions && process.versions.nw)
      }
      function isElectron() {
        if (process.versions && process.versions.electron) return true
        if (process.env.ELECTRON_RUN_AS_NODE) return true
        return (
          typeof window !== 'undefined' &&
          window.process &&
          window.process.type === 'renderer'
        )
      }
      function isAlpine(e) {
        return e === 'linux' && fs.existsSync('/etc/alpine-release')
      }
      load.parseTags = parseTags
      load.matchTags = matchTags
      load.compareTags = compareTags
      load.parseTuple = parseTuple
      load.matchTuple = matchTuple
      load.compareTuples = compareTuples
    },
    1758: (e, t, r) => {
      var s =
        process.env.DEBUG_NOPT || process.env.NOPT_DEBUG
          ? function () {
              console.error.apply(console, arguments)
            }
          : function () {}
      var a = r(7310),
        o = r(1017),
        u = r(2781).Stream,
        c = r(351),
        f = r(2037)
      e.exports = t = nopt
      t.clean = clean
      t.typeDefs = {
        String: { type: String, validate: validateString },
        Boolean: { type: Boolean, validate: validateBoolean },
        url: { type: a, validate: validateUrl },
        Number: { type: Number, validate: validateNumber },
        path: { type: o, validate: validatePath },
        Stream: { type: u, validate: validateStream },
        Date: { type: Date, validate: validateDate },
      }
      function nopt(e, r, a, o) {
        a = a || process.argv
        e = e || {}
        r = r || {}
        if (typeof o !== 'number') o = 2
        s(e, r, a, o)
        a = a.slice(o)
        var u = {},
          c,
          f = { remain: [], cooked: a, original: a.slice(0) }
        parse(a, u, f.remain, e, r)
        clean(u, e, t.typeDefs)
        u.argv = f
        Object.defineProperty(u.argv, 'toString', {
          value: function () {
            return this.original.map(JSON.stringify).join(' ')
          },
          enumerable: false,
        })
        return u
      }
      function clean(e, r, a) {
        a = a || t.typeDefs
        var o = {},
          u = [false, true, null, String, Array]
        Object.keys(e).forEach(function (c) {
          if (c === 'argv') return
          var f = e[c],
            d = Array.isArray(f),
            p = r[c]
          if (!d) f = [f]
          if (!p) p = u
          if (p === Array) p = u.concat(Array)
          if (!Array.isArray(p)) p = [p]
          s('val=%j', f)
          s('types=', p)
          f = f
            .map(function (u) {
              if (typeof u === 'string') {
                s('string %j', u)
                u = u.trim()
                if (
                  (u === 'null' && ~p.indexOf(null)) ||
                  (u === 'true' && (~p.indexOf(true) || ~p.indexOf(Boolean))) ||
                  (u === 'false' && (~p.indexOf(false) || ~p.indexOf(Boolean)))
                ) {
                  u = JSON.parse(u)
                  s('jsonable %j', u)
                } else if (~p.indexOf(Number) && !isNaN(u)) {
                  s('convert to number', u)
                  u = +u
                } else if (~p.indexOf(Date) && !isNaN(Date.parse(u))) {
                  s('convert to date', u)
                  u = new Date(u)
                }
              }
              if (!r.hasOwnProperty(c)) {
                return u
              }
              if (
                u === false &&
                ~p.indexOf(null) &&
                !(~p.indexOf(false) || ~p.indexOf(Boolean))
              ) {
                u = null
              }
              var f = {}
              f[c] = u
              s('prevalidated val', f, u, r[c])
              if (!validate(f, c, u, r[c], a)) {
                if (t.invalidHandler) {
                  t.invalidHandler(c, u, r[c], e)
                } else if (t.invalidHandler !== false) {
                  s('invalid: ' + c + '=' + u, r[c])
                }
                return o
              }
              s('validated val', f, u, r[c])
              return f[c]
            })
            .filter(function (e) {
              return e !== o
            })
          if (!f.length && p.indexOf(Array) === -1) {
            s('VAL HAS NO LENGTH, DELETE IT', f, c, p.indexOf(Array))
            delete e[c]
          } else if (d) {
            s(d, e[c], f)
            e[c] = f
          } else e[c] = f[0]
          s('k=%s val=%j', c, f, e[c])
        })
      }
      function validateString(e, t, r) {
        e[t] = String(r)
      }
      function validatePath(e, t, r) {
        if (r === true) return false
        if (r === null) return true
        r = String(r)
        var s = process.platform === 'win32',
          a = s ? /^~(\/|\\)/ : /^~\//,
          u = f.homedir()
        if (u && r.match(a)) {
          e[t] = o.resolve(u, r.substr(2))
        } else {
          e[t] = o.resolve(r)
        }
        return true
      }
      function validateNumber(e, t, r) {
        s('validate Number %j %j %j', t, r, isNaN(r))
        if (isNaN(r)) return false
        e[t] = +r
      }
      function validateDate(e, t, r) {
        var a = Date.parse(r)
        s('validate Date %j %j %j', t, r, a)
        if (isNaN(a)) return false
        e[t] = new Date(r)
      }
      function validateBoolean(e, t, r) {
        if (r instanceof Boolean) r = r.valueOf()
        else if (typeof r === 'string') {
          if (!isNaN(r)) r = !!+r
          else if (r === 'null' || r === 'false') r = false
          else r = true
        } else r = !!r
        e[t] = r
      }
      function validateUrl(e, t, r) {
        r = a.parse(String(r))
        if (!r.host) return false
        e[t] = r.href
      }
      function validateStream(e, t, r) {
        if (!(r instanceof u)) return false
        e[t] = r
      }
      function validate(e, t, r, a, o) {
        if (Array.isArray(a)) {
          for (var u = 0, c = a.length; u < c; u++) {
            if (a[u] === Array) continue
            if (validate(e, t, r, a[u], o)) return true
          }
          delete e[t]
          return false
        }
        if (a === Array) return true
        if (a !== a) {
          s('Poison NaN', t, r, a)
          delete e[t]
          return false
        }
        if (r === a) {
          s('Explicitly allowed %j', r)
          e[t] = r
          return true
        }
        var f = false,
          d = Object.keys(o)
        for (var u = 0, c = d.length; u < c; u++) {
          s('test type %j %j %j', t, r, d[u])
          var p = o[d[u]]
          if (
            p &&
            (a && a.name && p.type && p.type.name
              ? a.name === p.type.name
              : a === p.type)
          ) {
            var h = {}
            f = false !== p.validate(h, t, r)
            r = h[t]
            if (f) {
              e[t] = r
              break
            }
          }
        }
        s('OK? %j (%j %j %j)', f, t, r, d[u])
        if (!f) delete e[t]
        return f
      }
      function parse(e, t, r, a, o) {
        s('parse', e, t, r)
        var u = null,
          f = c(Object.keys(a)),
          d = c(Object.keys(o))
        for (var p = 0; p < e.length; p++) {
          var h = e[p]
          s('arg', h)
          if (h.match(/^-{2,}$/)) {
            r.push.apply(r, e.slice(p + 1))
            e[p] = '--'
            break
          }
          var v = false
          if (h.charAt(0) === '-' && h.length > 1) {
            var g = h.indexOf('=')
            if (g > -1) {
              v = true
              var D = h.substr(g + 1)
              h = h.substr(0, g)
              e.splice(p, 1, h, D)
            }
            var y = resolveShort(h, o, d, f)
            s('arg=%j shRes=%j', h, y)
            if (y) {
              s(h, y)
              e.splice.apply(e, [p, 1].concat(y))
              if (h !== y[0]) {
                p--
                continue
              }
            }
            h = h.replace(/^-+/, '')
            var m = null
            while (h.toLowerCase().indexOf('no-') === 0) {
              m = !m
              h = h.substr(3)
            }
            if (f[h]) h = f[h]
            var _ = a[h]
            var E = Array.isArray(_)
            if (E && _.length === 1) {
              E = false
              _ = _[0]
            }
            var w = _ === Array || (E && _.indexOf(Array) !== -1)
            if (!a.hasOwnProperty(h) && t.hasOwnProperty(h)) {
              if (!Array.isArray(t[h])) t[h] = [t[h]]
              w = true
            }
            var x,
              C = e[p + 1]
            var F =
              typeof m === 'boolean' ||
              _ === Boolean ||
              (E && _.indexOf(Boolean) !== -1) ||
              (typeof _ === 'undefined' && !v) ||
              (C === 'false' && (_ === null || (E && ~_.indexOf(null))))
            if (F) {
              x = !m
              if (C === 'true' || C === 'false') {
                x = JSON.parse(C)
                C = null
                if (m) x = !x
                p++
              }
              if (E && C) {
                if (~_.indexOf(C)) {
                  x = C
                  p++
                } else if (C === 'null' && ~_.indexOf(null)) {
                  x = null
                  p++
                } else if (
                  !C.match(/^-{2,}[^-]/) &&
                  !isNaN(C) &&
                  ~_.indexOf(Number)
                ) {
                  x = +C
                  p++
                } else if (!C.match(/^-[^-]/) && ~_.indexOf(String)) {
                  x = C
                  p++
                }
              }
              if (w) (t[h] = t[h] || []).push(x)
              else t[h] = x
              continue
            }
            if (_ === String) {
              if (C === undefined) {
                C = ''
              } else if (C.match(/^-{1,2}[^-]+/)) {
                C = ''
                p--
              }
            }
            if (C && C.match(/^-{2,}$/)) {
              C = undefined
              p--
            }
            x = C === undefined ? true : C
            if (w) (t[h] = t[h] || []).push(x)
            else t[h] = x
            p++
            continue
          }
          r.push(h)
        }
      }
      function resolveShort(e, t, r, a) {
        e = e.replace(/^-+/, '')
        if (a[e] === e) return null
        if (t[e]) {
          if (t[e] && !Array.isArray(t[e])) t[e] = t[e].split(/\s+/)
          return t[e]
        }
        var o = t.___singles
        if (!o) {
          o = Object.keys(t)
            .filter(function (e) {
              return e.length === 1
            })
            .reduce(function (e, t) {
              e[t] = true
              return e
            }, {})
          t.___singles = o
          s('shorthand singles', o)
        }
        var u = e.split('').filter(function (e) {
          return o[e]
        })
        if (u.join('') === e)
          return u
            .map(function (e) {
              return t[e]
            })
            .reduce(function (e, t) {
              return e.concat(t)
            }, [])
        if (a[e] && !t[e]) return null
        if (r[e]) e = r[e]
        if (t[e] && !Array.isArray(t[e])) t[e] = t[e].split(/\s+/)
        return t[e]
      }
    },
    9544: (e, t, r) => {
      'use strict'
      var s = r(4906)
      var a = r(287)
      var o = r(2361).EventEmitter
      var u = (t = e.exports = new o())
      var c = r(3837)
      var f = r(2656)
      var d = r(3844)
      f(true)
      var p = process.stderr
      Object.defineProperty(u, 'stream', {
        set: function (e) {
          p = e
          if (this.gauge) this.gauge.setWriteTo(p, p)
        },
        get: function () {
          return p
        },
      })
      var h
      u.useColor = function () {
        return h != null ? h : p.isTTY
      }
      u.enableColor = function () {
        h = true
        this.gauge.setTheme({ hasColor: h, hasUnicode: v })
      }
      u.disableColor = function () {
        h = false
        this.gauge.setTheme({ hasColor: h, hasUnicode: v })
      }
      u.level = 'info'
      u.gauge = new a(p, {
        enabled: false,
        theme: { hasColor: u.useColor() },
        template: [
          { type: 'progressbar', length: 20 },
          { type: 'activityIndicator', kerning: 1, length: 1 },
          { type: 'section', default: '' },
          ':',
          { type: 'logline', kerning: 1, default: '' },
        ],
      })
      u.tracker = new s.TrackerGroup()
      u.progressEnabled = u.gauge.isEnabled()
      var v
      u.enableUnicode = function () {
        v = true
        this.gauge.setTheme({ hasColor: this.useColor(), hasUnicode: v })
      }
      u.disableUnicode = function () {
        v = false
        this.gauge.setTheme({ hasColor: this.useColor(), hasUnicode: v })
      }
      u.setGaugeThemeset = function (e) {
        this.gauge.setThemeset(e)
      }
      u.setGaugeTemplate = function (e) {
        this.gauge.setTemplate(e)
      }
      u.enableProgress = function () {
        if (this.progressEnabled) return
        this.progressEnabled = true
        this.tracker.on('change', this.showProgress)
        if (this._pause) return
        this.gauge.enable()
      }
      u.disableProgress = function () {
        if (!this.progressEnabled) return
        this.progressEnabled = false
        this.tracker.removeListener('change', this.showProgress)
        this.gauge.disable()
      }
      var g = ['newGroup', 'newItem', 'newStream']
      var mixinLog = function (e) {
        Object.keys(u).forEach(function (t) {
          if (t[0] === '_') return
          if (
            g.filter(function (e) {
              return e === t
            }).length
          )
            return
          if (e[t]) return
          if (typeof u[t] !== 'function') return
          var r = u[t]
          e[t] = function () {
            return r.apply(u, arguments)
          }
        })
        if (e instanceof s.TrackerGroup) {
          g.forEach(function (t) {
            var r = e[t]
            e[t] = function () {
              return mixinLog(r.apply(e, arguments))
            }
          })
        }
        return e
      }
      g.forEach(function (e) {
        u[e] = function () {
          return mixinLog(this.tracker[e].apply(this.tracker, arguments))
        }
      })
      u.clearProgress = function (e) {
        if (!this.progressEnabled) return e && process.nextTick(e)
        this.gauge.hide(e)
      }
      u.showProgress = function (e, t) {
        if (!this.progressEnabled) return
        var r = {}
        if (e) r.section = e
        var s = u.record[u.record.length - 1]
        if (s) {
          r.subsection = s.prefix
          var a = u.disp[s.level] || s.level
          var o = this._format(a, u.style[s.level])
          if (s.prefix) o += ' ' + this._format(s.prefix, this.prefixStyle)
          o += ' ' + s.message.split(/\r?\n/)[0]
          r.logline = o
        }
        r.completed = t || this.tracker.completed()
        this.gauge.show(r)
      }.bind(u)
      u.pause = function () {
        this._paused = true
        if (this.progressEnabled) this.gauge.disable()
      }
      u.resume = function () {
        if (!this._paused) return
        this._paused = false
        var e = this._buffer
        this._buffer = []
        e.forEach(function (e) {
          this.emitLog(e)
        }, this)
        if (this.progressEnabled) this.gauge.enable()
      }
      u._buffer = []
      var D = 0
      u.record = []
      u.maxRecordSize = 1e4
      u.log = function (e, t, r) {
        var s = this.levels[e]
        if (s === undefined) {
          return this.emit(
            'error',
            new Error(c.format('Undefined log level: %j', e))
          )
        }
        var a = new Array(arguments.length - 2)
        var o = null
        for (var u = 2; u < arguments.length; u++) {
          var f = (a[u - 2] = arguments[u])
          if (typeof f === 'object' && f && f instanceof Error && f.stack) {
            Object.defineProperty(f, 'stack', {
              value: (o = f.stack + ''),
              enumerable: true,
              writable: true,
            })
          }
        }
        if (o) a.unshift(o + '\n')
        r = c.format.apply(c, a)
        var d = {
          id: D++,
          level: e,
          prefix: String(t || ''),
          message: r,
          messageRaw: a,
        }
        this.emit('log', d)
        this.emit('log.' + e, d)
        if (d.prefix) this.emit(d.prefix, d)
        this.record.push(d)
        var p = this.maxRecordSize
        var h = this.record.length - p
        if (h > p / 10) {
          var v = Math.floor(p * 0.9)
          this.record = this.record.slice(-1 * v)
        }
        this.emitLog(d)
      }.bind(u)
      u.emitLog = function (e) {
        if (this._paused) {
          this._buffer.push(e)
          return
        }
        if (this.progressEnabled) this.gauge.pulse(e.prefix)
        var t = this.levels[e.level]
        if (t === undefined) return
        if (t < this.levels[this.level]) return
        if (t > 0 && !isFinite(t)) return
        var r = u.disp[e.level] != null ? u.disp[e.level] : e.level
        this.clearProgress()
        e.message.split(/\r?\n/).forEach(function (t) {
          if (this.heading) {
            this.write(this.heading, this.headingStyle)
            this.write(' ')
          }
          this.write(r, u.style[e.level])
          var s = e.prefix || ''
          if (s) this.write(' ')
          this.write(s, this.prefixStyle)
          this.write(' ' + t + '\n')
        }, this)
        this.showProgress()
      }
      u._format = function (e, t) {
        if (!p) return
        var r = ''
        if (this.useColor()) {
          t = t || {}
          var s = []
          if (t.fg) s.push(t.fg)
          if (t.bg) s.push('bg' + t.bg[0].toUpperCase() + t.bg.slice(1))
          if (t.bold) s.push('bold')
          if (t.underline) s.push('underline')
          if (t.inverse) s.push('inverse')
          if (s.length) r += d.color(s)
          if (t.beep) r += d.beep()
        }
        r += e
        if (this.useColor()) {
          r += d.color('reset')
        }
        return r
      }
      u.write = function (e, t) {
        if (!p) return
        p.write(this._format(e, t))
      }
      u.addLevel = function (e, t, r, s) {
        if (s == null) s = e
        this.levels[e] = t
        this.style[e] = r
        if (!this[e]) {
          this[e] = function () {
            var t = new Array(arguments.length + 1)
            t[0] = e
            for (var r = 0; r < arguments.length; r++) {
              t[r + 1] = arguments[r]
            }
            return this.log.apply(this, t)
          }.bind(this)
        }
        this.disp[e] = s
      }
      u.prefixStyle = { fg: 'magenta' }
      u.headingStyle = { fg: 'white', bg: 'black' }
      u.style = {}
      u.levels = {}
      u.disp = {}
      u.addLevel('silly', -Infinity, { inverse: true }, 'sill')
      u.addLevel('verbose', 1e3, { fg: 'blue', bg: 'black' }, 'verb')
      u.addLevel('info', 2e3, { fg: 'green' })
      u.addLevel('timing', 2500, { fg: 'green', bg: 'black' })
      u.addLevel('http', 3e3, { fg: 'green', bg: 'black' })
      u.addLevel('notice', 3500, { fg: 'blue', bg: 'black' })
      u.addLevel('warn', 4e3, { fg: 'black', bg: 'yellow' }, 'WARN')
      u.addLevel('error', 5e3, { fg: 'red', bg: 'black' }, 'ERR!')
      u.addLevel('silent', Infinity)
      u.on('error', function () {})
    },
    3979: (e) => {
      'use strict'
      e.exports =
        Number.isNaN ||
        function (e) {
          return e !== e
        }
    },
    3540: (e) => {
      'use strict'
      /*
object-assign
(c) Sindre Sorhus
@license MIT
*/ var t = Object.getOwnPropertySymbols
      var r = Object.prototype.hasOwnProperty
      var s = Object.prototype.propertyIsEnumerable
      function toObject(e) {
        if (e === null || e === undefined) {
          throw new TypeError(
            'Object.assign cannot be called with null or undefined'
          )
        }
        return Object(e)
      }
      function shouldUseNative() {
        try {
          if (!Object.assign) {
            return false
          }
          var e = new String('abc')
          e[5] = 'de'
          if (Object.getOwnPropertyNames(e)[0] === '5') {
            return false
          }
          var t = {}
          for (var r = 0; r < 10; r++) {
            t['_' + String.fromCharCode(r)] = r
          }
          var s = Object.getOwnPropertyNames(t).map(function (e) {
            return t[e]
          })
          if (s.join('') !== '0123456789') {
            return false
          }
          var a = {}
          'abcdefghijklmnopqrst'.split('').forEach(function (e) {
            a[e] = e
          })
          if (
            Object.keys(Object.assign({}, a)).join('') !==
            'abcdefghijklmnopqrst'
          ) {
            return false
          }
          return true
        } catch (e) {
          return false
        }
      }
      e.exports = shouldUseNative()
        ? Object.assign
        : function (e, a) {
            var o
            var u = toObject(e)
            var c
            for (var f = 1; f < arguments.length; f++) {
              o = Object(arguments[f])
              for (var d in o) {
                if (r.call(o, d)) {
                  u[d] = o[d]
                }
              }
              if (t) {
                c = t(o)
                for (var p = 0; p < c.length; p++) {
                  if (s.call(o, c[p])) {
                    u[c[p]] = o[c[p]]
                  }
                }
              }
            }
            return u
          }
    },
    7798: (e, t, r) => {
      'use strict'
      const s = r(1017)
      const a = '\\\\/'
      const o = `[^${a}]`
      const u = '\\.'
      const c = '\\+'
      const f = '\\?'
      const d = '\\/'
      const p = '(?=.)'
      const h = '[^/]'
      const v = `(?:${d}|$)`
      const g = `(?:^|${d})`
      const D = `${u}{1,2}${v}`
      const y = `(?!${u})`
      const m = `(?!${g}${D})`
      const _ = `(?!${u}{0,1}${v})`
      const E = `(?!${D})`
      const w = `[^.${d}]`
      const x = `${h}*?`
      const C = {
        DOT_LITERAL: u,
        PLUS_LITERAL: c,
        QMARK_LITERAL: f,
        SLASH_LITERAL: d,
        ONE_CHAR: p,
        QMARK: h,
        END_ANCHOR: v,
        DOTS_SLASH: D,
        NO_DOT: y,
        NO_DOTS: m,
        NO_DOT_SLASH: _,
        NO_DOTS_SLASH: E,
        QMARK_NO_DOT: w,
        STAR: x,
        START_ANCHOR: g,
      }
      const F = {
        ...C,
        SLASH_LITERAL: `[${a}]`,
        QMARK: o,
        STAR: `${o}*?`,
        DOTS_SLASH: `${u}{1,2}(?:[${a}]|$)`,
        NO_DOT: `(?!${u})`,
        NO_DOTS: `(?!(?:^|[${a}])${u}{1,2}(?:[${a}]|$))`,
        NO_DOT_SLASH: `(?!${u}{0,1}(?:[${a}]|$))`,
        NO_DOTS_SLASH: `(?!${u}{1,2}(?:[${a}]|$))`,
        QMARK_NO_DOT: `[^.${a}]`,
        START_ANCHOR: `(?:^|[${a}])`,
        END_ANCHOR: `(?:[${a}]|$)`,
      }
      const S = {
        alnum: 'a-zA-Z0-9',
        alpha: 'a-zA-Z',
        ascii: '\\x00-\\x7F',
        blank: ' \\t',
        cntrl: '\\x00-\\x1F\\x7F',
        digit: '0-9',
        graph: '\\x21-\\x7E',
        lower: 'a-z',
        print: '\\x20-\\x7E ',
        punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
        space: ' \\t\\r\\n\\v\\f',
        upper: 'A-Z',
        word: 'A-Za-z0-9_',
        xdigit: 'A-Fa-f0-9',
      }
      e.exports = {
        MAX_LENGTH: 1024 * 64,
        POSIX_REGEX_SOURCE: S,
        REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
        REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
        REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
        REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
        REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
        REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
        REPLACEMENTS: { '***': '*', '**/**': '**', '**/**/**': '**' },
        CHAR_0: 48,
        CHAR_9: 57,
        CHAR_UPPERCASE_A: 65,
        CHAR_LOWERCASE_A: 97,
        CHAR_UPPERCASE_Z: 90,
        CHAR_LOWERCASE_Z: 122,
        CHAR_LEFT_PARENTHESES: 40,
        CHAR_RIGHT_PARENTHESES: 41,
        CHAR_ASTERISK: 42,
        CHAR_AMPERSAND: 38,
        CHAR_AT: 64,
        CHAR_BACKWARD_SLASH: 92,
        CHAR_CARRIAGE_RETURN: 13,
        CHAR_CIRCUMFLEX_ACCENT: 94,
        CHAR_COLON: 58,
        CHAR_COMMA: 44,
        CHAR_DOT: 46,
        CHAR_DOUBLE_QUOTE: 34,
        CHAR_EQUAL: 61,
        CHAR_EXCLAMATION_MARK: 33,
        CHAR_FORM_FEED: 12,
        CHAR_FORWARD_SLASH: 47,
        CHAR_GRAVE_ACCENT: 96,
        CHAR_HASH: 35,
        CHAR_HYPHEN_MINUS: 45,
        CHAR_LEFT_ANGLE_BRACKET: 60,
        CHAR_LEFT_CURLY_BRACE: 123,
        CHAR_LEFT_SQUARE_BRACKET: 91,
        CHAR_LINE_FEED: 10,
        CHAR_NO_BREAK_SPACE: 160,
        CHAR_PERCENT: 37,
        CHAR_PLUS: 43,
        CHAR_QUESTION_MARK: 63,
        CHAR_RIGHT_ANGLE_BRACKET: 62,
        CHAR_RIGHT_CURLY_BRACE: 125,
        CHAR_RIGHT_SQUARE_BRACKET: 93,
        CHAR_SEMICOLON: 59,
        CHAR_SINGLE_QUOTE: 39,
        CHAR_SPACE: 32,
        CHAR_TAB: 9,
        CHAR_UNDERSCORE: 95,
        CHAR_VERTICAL_LINE: 124,
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
        SEP: s.sep,
        extglobChars(e) {
          return {
            '!': { type: 'negate', open: '(?:(?!(?:', close: `))${e.STAR})` },
            '?': { type: 'qmark', open: '(?:', close: ')?' },
            '+': { type: 'plus', open: '(?:', close: ')+' },
            '*': { type: 'star', open: '(?:', close: ')*' },
            '@': { type: 'at', open: '(?:', close: ')' },
          }
        },
        globChars(e) {
          return e === true ? F : C
        },
      }
    },
    5502: (e, t, r) => {
      'use strict'
      const s = r(1017)
      const a = process.platform === 'win32'
      const {
        REGEX_BACKSLASH: o,
        REGEX_REMOVE_BACKSLASH: u,
        REGEX_SPECIAL_CHARS: c,
        REGEX_SPECIAL_CHARS_GLOBAL: f,
      } = r(7798)
      t.isObject = (e) =>
        e !== null && typeof e === 'object' && !Array.isArray(e)
      t.hasRegexChars = (e) => c.test(e)
      t.isRegexChar = (e) => e.length === 1 && t.hasRegexChars(e)
      t.escapeRegex = (e) => e.replace(f, '\\$1')
      t.toPosixSlashes = (e) => e.replace(o, '/')
      t.removeBackslashes = (e) => e.replace(u, (e) => (e === '\\' ? '' : e))
      t.supportsLookbehinds = () => {
        const e = process.version.slice(1).split('.').map(Number)
        if ((e.length === 3 && e[0] >= 9) || (e[0] === 8 && e[1] >= 10)) {
          return true
        }
        return false
      }
      t.isWindows = (e) => {
        if (e && typeof e.windows === 'boolean') {
          return e.windows
        }
        return a === true || s.sep === '\\'
      }
      t.escapeLast = (e, r, s) => {
        const a = e.lastIndexOf(r, s)
        if (a === -1) return e
        if (e[a - 1] === '\\') return t.escapeLast(e, r, a - 1)
        return `${e.slice(0, a)}\\${e.slice(a)}`
      }
      t.removePrefix = (e, t = {}) => {
        let r = e
        if (r.startsWith('./')) {
          r = r.slice(2)
          t.prefix = './'
        }
        return r
      }
      t.wrapOutput = (e, t = {}, r = {}) => {
        const s = r.contains ? '' : '^'
        const a = r.contains ? '' : '$'
        let o = `${s}(?:${e})${a}`
        if (t.negated === true) {
          o = `(?:^(?!${o}).*$)`
        }
        return o
      }
    },
    9182: (e) => {
      'use strict'
      if (
        typeof process === 'undefined' ||
        !process.version ||
        process.version.indexOf('v0.') === 0 ||
        (process.version.indexOf('v1.') === 0 &&
          process.version.indexOf('v1.8.') !== 0)
      ) {
        e.exports = { nextTick: nextTick }
      } else {
        e.exports = process
      }
      function nextTick(e, t, r, s) {
        if (typeof e !== 'function') {
          throw new TypeError('"callback" argument must be a function')
        }
        var a = arguments.length
        var o, u
        switch (a) {
          case 0:
          case 1:
            return process.nextTick(e)
          case 2:
            return process.nextTick(function afterTickOne() {
              e.call(null, t)
            })
          case 3:
            return process.nextTick(function afterTickTwo() {
              e.call(null, t, r)
            })
          case 4:
            return process.nextTick(function afterTickThree() {
              e.call(null, t, r, s)
            })
          default:
            o = new Array(a - 1)
            u = 0
            while (u < o.length) {
              o[u++] = arguments[u]
            }
            return process.nextTick(function afterTick() {
              e.apply(null, o)
            })
        }
      }
    },
    4928: (e, t, r) => {
      'use strict'
      var s = r(9182)
      var a =
        Object.keys ||
        function (e) {
          var t = []
          for (var r in e) {
            t.push(r)
          }
          return t
        }
      e.exports = Duplex
      var o = Object.create(r(1504))
      o.inherits = r(2842)
      var u = r(7355)
      var c = r(3517)
      o.inherits(Duplex, u)
      {
        var f = a(c.prototype)
        for (var d = 0; d < f.length; d++) {
          var p = f[d]
          if (!Duplex.prototype[p]) Duplex.prototype[p] = c.prototype[p]
        }
      }
      function Duplex(e) {
        if (!(this instanceof Duplex)) return new Duplex(e)
        u.call(this, e)
        c.call(this, e)
        if (e && e.readable === false) this.readable = false
        if (e && e.writable === false) this.writable = false
        this.allowHalfOpen = true
        if (e && e.allowHalfOpen === false) this.allowHalfOpen = false
        this.once('end', onend)
      }
      Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
        enumerable: false,
        get: function () {
          return this._writableState.highWaterMark
        },
      })
      function onend() {
        if (this.allowHalfOpen || this._writableState.ended) return
        s.nextTick(onEndNT, this)
      }
      function onEndNT(e) {
        e.end()
      }
      Object.defineProperty(Duplex.prototype, 'destroyed', {
        get: function () {
          if (
            this._readableState === undefined ||
            this._writableState === undefined
          ) {
            return false
          }
          return this._readableState.destroyed && this._writableState.destroyed
        },
        set: function (e) {
          if (
            this._readableState === undefined ||
            this._writableState === undefined
          ) {
            return
          }
          this._readableState.destroyed = e
          this._writableState.destroyed = e
        },
      })
      Duplex.prototype._destroy = function (e, t) {
        this.push(null)
        this.end()
        s.nextTick(t, e)
      }
    },
    9924: (e, t, r) => {
      'use strict'
      e.exports = PassThrough
      var s = r(2162)
      var a = Object.create(r(1504))
      a.inherits = r(2842)
      a.inherits(PassThrough, s)
      function PassThrough(e) {
        if (!(this instanceof PassThrough)) return new PassThrough(e)
        s.call(this, e)
      }
      PassThrough.prototype._transform = function (e, t, r) {
        r(null, e)
      }
    },
    7355: (e, t, r) => {
      'use strict'
      var s = r(9182)
      e.exports = Readable
      var a = r(1551)
      var o
      Readable.ReadableState = ReadableState
      var u = r(2361).EventEmitter
      var EElistenerCount = function (e, t) {
        return e.listeners(t).length
      }
      var c = r(2641)
      var f = r(291).Buffer
      var d = global.Uint8Array || function () {}
      function _uint8ArrayToBuffer(e) {
        return f.from(e)
      }
      function _isUint8Array(e) {
        return f.isBuffer(e) || e instanceof d
      }
      var p = Object.create(r(1504))
      p.inherits = r(2842)
      var h = r(3837)
      var v = void 0
      if (h && h.debuglog) {
        v = h.debuglog('stream')
      } else {
        v = function () {}
      }
      var g = r(4865)
      var D = r(2604)
      var y
      p.inherits(Readable, c)
      var m = ['error', 'close', 'destroy', 'pause', 'resume']
      function prependListener(e, t, r) {
        if (typeof e.prependListener === 'function')
          return e.prependListener(t, r)
        if (!e._events || !e._events[t]) e.on(t, r)
        else if (a(e._events[t])) e._events[t].unshift(r)
        else e._events[t] = [r, e._events[t]]
      }
      function ReadableState(e, t) {
        o = o || r(4928)
        e = e || {}
        var s = t instanceof o
        this.objectMode = !!e.objectMode
        if (s) this.objectMode = this.objectMode || !!e.readableObjectMode
        var a = e.highWaterMark
        var u = e.readableHighWaterMark
        var c = this.objectMode ? 16 : 16 * 1024
        if (a || a === 0) this.highWaterMark = a
        else if (s && (u || u === 0)) this.highWaterMark = u
        else this.highWaterMark = c
        this.highWaterMark = Math.floor(this.highWaterMark)
        this.buffer = new g()
        this.length = 0
        this.pipes = null
        this.pipesCount = 0
        this.flowing = null
        this.ended = false
        this.endEmitted = false
        this.reading = false
        this.sync = true
        this.needReadable = false
        this.emittedReadable = false
        this.readableListening = false
        this.resumeScheduled = false
        this.destroyed = false
        this.defaultEncoding = e.defaultEncoding || 'utf8'
        this.awaitDrain = 0
        this.readingMore = false
        this.decoder = null
        this.encoding = null
        if (e.encoding) {
          if (!y) y = r(4426).s
          this.decoder = new y(e.encoding)
          this.encoding = e.encoding
        }
      }
      function Readable(e) {
        o = o || r(4928)
        if (!(this instanceof Readable)) return new Readable(e)
        this._readableState = new ReadableState(e, this)
        this.readable = true
        if (e) {
          if (typeof e.read === 'function') this._read = e.read
          if (typeof e.destroy === 'function') this._destroy = e.destroy
        }
        c.call(this)
      }
      Object.defineProperty(Readable.prototype, 'destroyed', {
        get: function () {
          if (this._readableState === undefined) {
            return false
          }
          return this._readableState.destroyed
        },
        set: function (e) {
          if (!this._readableState) {
            return
          }
          this._readableState.destroyed = e
        },
      })
      Readable.prototype.destroy = D.destroy
      Readable.prototype._undestroy = D.undestroy
      Readable.prototype._destroy = function (e, t) {
        this.push(null)
        t(e)
      }
      Readable.prototype.push = function (e, t) {
        var r = this._readableState
        var s
        if (!r.objectMode) {
          if (typeof e === 'string') {
            t = t || r.defaultEncoding
            if (t !== r.encoding) {
              e = f.from(e, t)
              t = ''
            }
            s = true
          }
        } else {
          s = true
        }
        return readableAddChunk(this, e, t, false, s)
      }
      Readable.prototype.unshift = function (e) {
        return readableAddChunk(this, e, null, true, false)
      }
      function readableAddChunk(e, t, r, s, a) {
        var o = e._readableState
        if (t === null) {
          o.reading = false
          onEofChunk(e, o)
        } else {
          var u
          if (!a) u = chunkInvalid(o, t)
          if (u) {
            e.emit('error', u)
          } else if (o.objectMode || (t && t.length > 0)) {
            if (
              typeof t !== 'string' &&
              !o.objectMode &&
              Object.getPrototypeOf(t) !== f.prototype
            ) {
              t = _uint8ArrayToBuffer(t)
            }
            if (s) {
              if (o.endEmitted)
                e.emit('error', new Error('stream.unshift() after end event'))
              else addChunk(e, o, t, true)
            } else if (o.ended) {
              e.emit('error', new Error('stream.push() after EOF'))
            } else {
              o.reading = false
              if (o.decoder && !r) {
                t = o.decoder.write(t)
                if (o.objectMode || t.length !== 0) addChunk(e, o, t, false)
                else maybeReadMore(e, o)
              } else {
                addChunk(e, o, t, false)
              }
            }
          } else if (!s) {
            o.reading = false
          }
        }
        return needMoreData(o)
      }
      function addChunk(e, t, r, s) {
        if (t.flowing && t.length === 0 && !t.sync) {
          e.emit('data', r)
          e.read(0)
        } else {
          t.length += t.objectMode ? 1 : r.length
          if (s) t.buffer.unshift(r)
          else t.buffer.push(r)
          if (t.needReadable) emitReadable(e)
        }
        maybeReadMore(e, t)
      }
      function chunkInvalid(e, t) {
        var r
        if (
          !_isUint8Array(t) &&
          typeof t !== 'string' &&
          t !== undefined &&
          !e.objectMode
        ) {
          r = new TypeError('Invalid non-string/buffer chunk')
        }
        return r
      }
      function needMoreData(e) {
        return (
          !e.ended &&
          (e.needReadable || e.length < e.highWaterMark || e.length === 0)
        )
      }
      Readable.prototype.isPaused = function () {
        return this._readableState.flowing === false
      }
      Readable.prototype.setEncoding = function (e) {
        if (!y) y = r(4426).s
        this._readableState.decoder = new y(e)
        this._readableState.encoding = e
        return this
      }
      var _ = 8388608
      function computeNewHighWaterMark(e) {
        if (e >= _) {
          e = _
        } else {
          e--
          e |= e >>> 1
          e |= e >>> 2
          e |= e >>> 4
          e |= e >>> 8
          e |= e >>> 16
          e++
        }
        return e
      }
      function howMuchToRead(e, t) {
        if (e <= 0 || (t.length === 0 && t.ended)) return 0
        if (t.objectMode) return 1
        if (e !== e) {
          if (t.flowing && t.length) return t.buffer.head.data.length
          else return t.length
        }
        if (e > t.highWaterMark) t.highWaterMark = computeNewHighWaterMark(e)
        if (e <= t.length) return e
        if (!t.ended) {
          t.needReadable = true
          return 0
        }
        return t.length
      }
      Readable.prototype.read = function (e) {
        v('read', e)
        e = parseInt(e, 10)
        var t = this._readableState
        var r = e
        if (e !== 0) t.emittedReadable = false
        if (
          e === 0 &&
          t.needReadable &&
          (t.length >= t.highWaterMark || t.ended)
        ) {
          v('read: emitReadable', t.length, t.ended)
          if (t.length === 0 && t.ended) endReadable(this)
          else emitReadable(this)
          return null
        }
        e = howMuchToRead(e, t)
        if (e === 0 && t.ended) {
          if (t.length === 0) endReadable(this)
          return null
        }
        var s = t.needReadable
        v('need readable', s)
        if (t.length === 0 || t.length - e < t.highWaterMark) {
          s = true
          v('length less than watermark', s)
        }
        if (t.ended || t.reading) {
          s = false
          v('reading or ended', s)
        } else if (s) {
          v('do read')
          t.reading = true
          t.sync = true
          if (t.length === 0) t.needReadable = true
          this._read(t.highWaterMark)
          t.sync = false
          if (!t.reading) e = howMuchToRead(r, t)
        }
        var a
        if (e > 0) a = fromList(e, t)
        else a = null
        if (a === null) {
          t.needReadable = true
          e = 0
        } else {
          t.length -= e
        }
        if (t.length === 0) {
          if (!t.ended) t.needReadable = true
          if (r !== e && t.ended) endReadable(this)
        }
        if (a !== null) this.emit('data', a)
        return a
      }
      function onEofChunk(e, t) {
        if (t.ended) return
        if (t.decoder) {
          var r = t.decoder.end()
          if (r && r.length) {
            t.buffer.push(r)
            t.length += t.objectMode ? 1 : r.length
          }
        }
        t.ended = true
        emitReadable(e)
      }
      function emitReadable(e) {
        var t = e._readableState
        t.needReadable = false
        if (!t.emittedReadable) {
          v('emitReadable', t.flowing)
          t.emittedReadable = true
          if (t.sync) s.nextTick(emitReadable_, e)
          else emitReadable_(e)
        }
      }
      function emitReadable_(e) {
        v('emit readable')
        e.emit('readable')
        flow(e)
      }
      function maybeReadMore(e, t) {
        if (!t.readingMore) {
          t.readingMore = true
          s.nextTick(maybeReadMore_, e, t)
        }
      }
      function maybeReadMore_(e, t) {
        var r = t.length
        while (
          !t.reading &&
          !t.flowing &&
          !t.ended &&
          t.length < t.highWaterMark
        ) {
          v('maybeReadMore read 0')
          e.read(0)
          if (r === t.length) break
          else r = t.length
        }
        t.readingMore = false
      }
      Readable.prototype._read = function (e) {
        this.emit('error', new Error('_read() is not implemented'))
      }
      Readable.prototype.pipe = function (e, t) {
        var r = this
        var a = this._readableState
        switch (a.pipesCount) {
          case 0:
            a.pipes = e
            break
          case 1:
            a.pipes = [a.pipes, e]
            break
          default:
            a.pipes.push(e)
            break
        }
        a.pipesCount += 1
        v('pipe count=%d opts=%j', a.pipesCount, t)
        var o =
          (!t || t.end !== false) &&
          e !== process.stdout &&
          e !== process.stderr
        var u = o ? onend : unpipe
        if (a.endEmitted) s.nextTick(u)
        else r.once('end', u)
        e.on('unpipe', onunpipe)
        function onunpipe(e, t) {
          v('onunpipe')
          if (e === r) {
            if (t && t.hasUnpiped === false) {
              t.hasUnpiped = true
              cleanup()
            }
          }
        }
        function onend() {
          v('onend')
          e.end()
        }
        var c = pipeOnDrain(r)
        e.on('drain', c)
        var f = false
        function cleanup() {
          v('cleanup')
          e.removeListener('close', onclose)
          e.removeListener('finish', onfinish)
          e.removeListener('drain', c)
          e.removeListener('error', onerror)
          e.removeListener('unpipe', onunpipe)
          r.removeListener('end', onend)
          r.removeListener('end', unpipe)
          r.removeListener('data', ondata)
          f = true
          if (a.awaitDrain && (!e._writableState || e._writableState.needDrain))
            c()
        }
        var d = false
        r.on('data', ondata)
        function ondata(t) {
          v('ondata')
          d = false
          var s = e.write(t)
          if (false === s && !d) {
            if (
              ((a.pipesCount === 1 && a.pipes === e) ||
                (a.pipesCount > 1 && indexOf(a.pipes, e) !== -1)) &&
              !f
            ) {
              v('false write response, pause', r._readableState.awaitDrain)
              r._readableState.awaitDrain++
              d = true
            }
            r.pause()
          }
        }
        function onerror(t) {
          v('onerror', t)
          unpipe()
          e.removeListener('error', onerror)
          if (EElistenerCount(e, 'error') === 0) e.emit('error', t)
        }
        prependListener(e, 'error', onerror)
        function onclose() {
          e.removeListener('finish', onfinish)
          unpipe()
        }
        e.once('close', onclose)
        function onfinish() {
          v('onfinish')
          e.removeListener('close', onclose)
          unpipe()
        }
        e.once('finish', onfinish)
        function unpipe() {
          v('unpipe')
          r.unpipe(e)
        }
        e.emit('pipe', r)
        if (!a.flowing) {
          v('pipe resume')
          r.resume()
        }
        return e
      }
      function pipeOnDrain(e) {
        return function () {
          var t = e._readableState
          v('pipeOnDrain', t.awaitDrain)
          if (t.awaitDrain) t.awaitDrain--
          if (t.awaitDrain === 0 && EElistenerCount(e, 'data')) {
            t.flowing = true
            flow(e)
          }
        }
      }
      Readable.prototype.unpipe = function (e) {
        var t = this._readableState
        var r = { hasUnpiped: false }
        if (t.pipesCount === 0) return this
        if (t.pipesCount === 1) {
          if (e && e !== t.pipes) return this
          if (!e) e = t.pipes
          t.pipes = null
          t.pipesCount = 0
          t.flowing = false
          if (e) e.emit('unpipe', this, r)
          return this
        }
        if (!e) {
          var s = t.pipes
          var a = t.pipesCount
          t.pipes = null
          t.pipesCount = 0
          t.flowing = false
          for (var o = 0; o < a; o++) {
            s[o].emit('unpipe', this, r)
          }
          return this
        }
        var u = indexOf(t.pipes, e)
        if (u === -1) return this
        t.pipes.splice(u, 1)
        t.pipesCount -= 1
        if (t.pipesCount === 1) t.pipes = t.pipes[0]
        e.emit('unpipe', this, r)
        return this
      }
      Readable.prototype.on = function (e, t) {
        var r = c.prototype.on.call(this, e, t)
        if (e === 'data') {
          if (this._readableState.flowing !== false) this.resume()
        } else if (e === 'readable') {
          var a = this._readableState
          if (!a.endEmitted && !a.readableListening) {
            a.readableListening = a.needReadable = true
            a.emittedReadable = false
            if (!a.reading) {
              s.nextTick(nReadingNextTick, this)
            } else if (a.length) {
              emitReadable(this)
            }
          }
        }
        return r
      }
      Readable.prototype.addListener = Readable.prototype.on
      function nReadingNextTick(e) {
        v('readable nexttick read 0')
        e.read(0)
      }
      Readable.prototype.resume = function () {
        var e = this._readableState
        if (!e.flowing) {
          v('resume')
          e.flowing = true
          resume(this, e)
        }
        return this
      }
      function resume(e, t) {
        if (!t.resumeScheduled) {
          t.resumeScheduled = true
          s.nextTick(resume_, e, t)
        }
      }
      function resume_(e, t) {
        if (!t.reading) {
          v('resume read 0')
          e.read(0)
        }
        t.resumeScheduled = false
        t.awaitDrain = 0
        e.emit('resume')
        flow(e)
        if (t.flowing && !t.reading) e.read(0)
      }
      Readable.prototype.pause = function () {
        v('call pause flowing=%j', this._readableState.flowing)
        if (false !== this._readableState.flowing) {
          v('pause')
          this._readableState.flowing = false
          this.emit('pause')
        }
        return this
      }
      function flow(e) {
        var t = e._readableState
        v('flow', t.flowing)
        while (t.flowing && e.read() !== null) {}
      }
      Readable.prototype.wrap = function (e) {
        var t = this
        var r = this._readableState
        var s = false
        e.on('end', function () {
          v('wrapped end')
          if (r.decoder && !r.ended) {
            var e = r.decoder.end()
            if (e && e.length) t.push(e)
          }
          t.push(null)
        })
        e.on('data', function (a) {
          v('wrapped data')
          if (r.decoder) a = r.decoder.write(a)
          if (r.objectMode && (a === null || a === undefined)) return
          else if (!r.objectMode && (!a || !a.length)) return
          var o = t.push(a)
          if (!o) {
            s = true
            e.pause()
          }
        })
        for (var a in e) {
          if (this[a] === undefined && typeof e[a] === 'function') {
            this[a] = (function (t) {
              return function () {
                return e[t].apply(e, arguments)
              }
            })(a)
          }
        }
        for (var o = 0; o < m.length; o++) {
          e.on(m[o], this.emit.bind(this, m[o]))
        }
        this._read = function (t) {
          v('wrapped _read', t)
          if (s) {
            s = false
            e.resume()
          }
        }
        return this
      }
      Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
        enumerable: false,
        get: function () {
          return this._readableState.highWaterMark
        },
      })
      Readable._fromList = fromList
      function fromList(e, t) {
        if (t.length === 0) return null
        var r
        if (t.objectMode) r = t.buffer.shift()
        else if (!e || e >= t.length) {
          if (t.decoder) r = t.buffer.join('')
          else if (t.buffer.length === 1) r = t.buffer.head.data
          else r = t.buffer.concat(t.length)
          t.buffer.clear()
        } else {
          r = fromListPartial(e, t.buffer, t.decoder)
        }
        return r
      }
      function fromListPartial(e, t, r) {
        var s
        if (e < t.head.data.length) {
          s = t.head.data.slice(0, e)
          t.head.data = t.head.data.slice(e)
        } else if (e === t.head.data.length) {
          s = t.shift()
        } else {
          s = r ? copyFromBufferString(e, t) : copyFromBuffer(e, t)
        }
        return s
      }
      function copyFromBufferString(e, t) {
        var r = t.head
        var s = 1
        var a = r.data
        e -= a.length
        while ((r = r.next)) {
          var o = r.data
          var u = e > o.length ? o.length : e
          if (u === o.length) a += o
          else a += o.slice(0, e)
          e -= u
          if (e === 0) {
            if (u === o.length) {
              ++s
              if (r.next) t.head = r.next
              else t.head = t.tail = null
            } else {
              t.head = r
              r.data = o.slice(u)
            }
            break
          }
          ++s
        }
        t.length -= s
        return a
      }
      function copyFromBuffer(e, t) {
        var r = f.allocUnsafe(e)
        var s = t.head
        var a = 1
        s.data.copy(r)
        e -= s.data.length
        while ((s = s.next)) {
          var o = s.data
          var u = e > o.length ? o.length : e
          o.copy(r, r.length - e, 0, u)
          e -= u
          if (e === 0) {
            if (u === o.length) {
              ++a
              if (s.next) t.head = s.next
              else t.head = t.tail = null
            } else {
              t.head = s
              s.data = o.slice(u)
            }
            break
          }
          ++a
        }
        t.length -= a
        return r
      }
      function endReadable(e) {
        var t = e._readableState
        if (t.length > 0)
          throw new Error('"endReadable()" called on non-empty stream')
        if (!t.endEmitted) {
          t.ended = true
          s.nextTick(endReadableNT, t, e)
        }
      }
      function endReadableNT(e, t) {
        if (!e.endEmitted && e.length === 0) {
          e.endEmitted = true
          t.readable = false
          t.emit('end')
        }
      }
      function indexOf(e, t) {
        for (var r = 0, s = e.length; r < s; r++) {
          if (e[r] === t) return r
        }
        return -1
      }
    },
    2162: (e, t, r) => {
      'use strict'
      e.exports = Transform
      var s = r(4928)
      var a = Object.create(r(1504))
      a.inherits = r(2842)
      a.inherits(Transform, s)
      function afterTransform(e, t) {
        var r = this._transformState
        r.transforming = false
        var s = r.writecb
        if (!s) {
          return this.emit(
            'error',
            new Error('write callback called multiple times')
          )
        }
        r.writechunk = null
        r.writecb = null
        if (t != null) this.push(t)
        s(e)
        var a = this._readableState
        a.reading = false
        if (a.needReadable || a.length < a.highWaterMark) {
          this._read(a.highWaterMark)
        }
      }
      function Transform(e) {
        if (!(this instanceof Transform)) return new Transform(e)
        s.call(this, e)
        this._transformState = {
          afterTransform: afterTransform.bind(this),
          needTransform: false,
          transforming: false,
          writecb: null,
          writechunk: null,
          writeencoding: null,
        }
        this._readableState.needReadable = true
        this._readableState.sync = false
        if (e) {
          if (typeof e.transform === 'function') this._transform = e.transform
          if (typeof e.flush === 'function') this._flush = e.flush
        }
        this.on('prefinish', prefinish)
      }
      function prefinish() {
        var e = this
        if (typeof this._flush === 'function') {
          this._flush(function (t, r) {
            done(e, t, r)
          })
        } else {
          done(this, null, null)
        }
      }
      Transform.prototype.push = function (e, t) {
        this._transformState.needTransform = false
        return s.prototype.push.call(this, e, t)
      }
      Transform.prototype._transform = function (e, t, r) {
        throw new Error('_transform() is not implemented')
      }
      Transform.prototype._write = function (e, t, r) {
        var s = this._transformState
        s.writecb = r
        s.writechunk = e
        s.writeencoding = t
        if (!s.transforming) {
          var a = this._readableState
          if (s.needTransform || a.needReadable || a.length < a.highWaterMark)
            this._read(a.highWaterMark)
        }
      }
      Transform.prototype._read = function (e) {
        var t = this._transformState
        if (t.writechunk !== null && t.writecb && !t.transforming) {
          t.transforming = true
          this._transform(t.writechunk, t.writeencoding, t.afterTransform)
        } else {
          t.needTransform = true
        }
      }
      Transform.prototype._destroy = function (e, t) {
        var r = this
        s.prototype._destroy.call(this, e, function (e) {
          t(e)
          r.emit('close')
        })
      }
      function done(e, t, r) {
        if (t) return e.emit('error', t)
        if (r != null) e.push(r)
        if (e._writableState.length)
          throw new Error('Calling transform done when ws.length != 0')
        if (e._transformState.transforming)
          throw new Error('Calling transform done when still transforming')
        return e.push(null)
      }
    },
    3517: (e, t, r) => {
      'use strict'
      var s = r(9182)
      e.exports = Writable
      function WriteReq(e, t, r) {
        this.chunk = e
        this.encoding = t
        this.callback = r
        this.next = null
      }
      function CorkedRequest(e) {
        var t = this
        this.next = null
        this.entry = null
        this.finish = function () {
          onCorkedFinish(t, e)
        }
      }
      var a =
        !process.browser &&
        ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1
          ? setImmediate
          : s.nextTick
      var o
      Writable.WritableState = WritableState
      var u = Object.create(r(1504))
      u.inherits = r(2842)
      var c = { deprecate: r(6124) }
      var f = r(2641)
      var d = r(291).Buffer
      var p = global.Uint8Array || function () {}
      function _uint8ArrayToBuffer(e) {
        return d.from(e)
      }
      function _isUint8Array(e) {
        return d.isBuffer(e) || e instanceof p
      }
      var h = r(2604)
      u.inherits(Writable, f)
      function nop() {}
      function WritableState(e, t) {
        o = o || r(4928)
        e = e || {}
        var s = t instanceof o
        this.objectMode = !!e.objectMode
        if (s) this.objectMode = this.objectMode || !!e.writableObjectMode
        var a = e.highWaterMark
        var u = e.writableHighWaterMark
        var c = this.objectMode ? 16 : 16 * 1024
        if (a || a === 0) this.highWaterMark = a
        else if (s && (u || u === 0)) this.highWaterMark = u
        else this.highWaterMark = c
        this.highWaterMark = Math.floor(this.highWaterMark)
        this.finalCalled = false
        this.needDrain = false
        this.ending = false
        this.ended = false
        this.finished = false
        this.destroyed = false
        var f = e.decodeStrings === false
        this.decodeStrings = !f
        this.defaultEncoding = e.defaultEncoding || 'utf8'
        this.length = 0
        this.writing = false
        this.corked = 0
        this.sync = true
        this.bufferProcessing = false
        this.onwrite = function (e) {
          onwrite(t, e)
        }
        this.writecb = null
        this.writelen = 0
        this.bufferedRequest = null
        this.lastBufferedRequest = null
        this.pendingcb = 0
        this.prefinished = false
        this.errorEmitted = false
        this.bufferedRequestCount = 0
        this.corkedRequestsFree = new CorkedRequest(this)
      }
      WritableState.prototype.getBuffer = function getBuffer() {
        var e = this.bufferedRequest
        var t = []
        while (e) {
          t.push(e)
          e = e.next
        }
        return t
      }
      ;(function () {
        try {
          Object.defineProperty(WritableState.prototype, 'buffer', {
            get: c.deprecate(
              function () {
                return this.getBuffer()
              },
              '_writableState.buffer is deprecated. Use _writableState.getBuffer ' +
                'instead.',
              'DEP0003'
            ),
          })
        } catch (e) {}
      })()
      var v
      if (
        typeof Symbol === 'function' &&
        Symbol.hasInstance &&
        typeof Function.prototype[Symbol.hasInstance] === 'function'
      ) {
        v = Function.prototype[Symbol.hasInstance]
        Object.defineProperty(Writable, Symbol.hasInstance, {
          value: function (e) {
            if (v.call(this, e)) return true
            if (this !== Writable) return false
            return e && e._writableState instanceof WritableState
          },
        })
      } else {
        v = function (e) {
          return e instanceof this
        }
      }
      function Writable(e) {
        o = o || r(4928)
        if (!v.call(Writable, this) && !(this instanceof o)) {
          return new Writable(e)
        }
        this._writableState = new WritableState(e, this)
        this.writable = true
        if (e) {
          if (typeof e.write === 'function') this._write = e.write
          if (typeof e.writev === 'function') this._writev = e.writev
          if (typeof e.destroy === 'function') this._destroy = e.destroy
          if (typeof e.final === 'function') this._final = e.final
        }
        f.call(this)
      }
      Writable.prototype.pipe = function () {
        this.emit('error', new Error('Cannot pipe, not readable'))
      }
      function writeAfterEnd(e, t) {
        var r = new Error('write after end')
        e.emit('error', r)
        s.nextTick(t, r)
      }
      function validChunk(e, t, r, a) {
        var o = true
        var u = false
        if (r === null) {
          u = new TypeError('May not write null values to stream')
        } else if (typeof r !== 'string' && r !== undefined && !t.objectMode) {
          u = new TypeError('Invalid non-string/buffer chunk')
        }
        if (u) {
          e.emit('error', u)
          s.nextTick(a, u)
          o = false
        }
        return o
      }
      Writable.prototype.write = function (e, t, r) {
        var s = this._writableState
        var a = false
        var o = !s.objectMode && _isUint8Array(e)
        if (o && !d.isBuffer(e)) {
          e = _uint8ArrayToBuffer(e)
        }
        if (typeof t === 'function') {
          r = t
          t = null
        }
        if (o) t = 'buffer'
        else if (!t) t = s.defaultEncoding
        if (typeof r !== 'function') r = nop
        if (s.ended) writeAfterEnd(this, r)
        else if (o || validChunk(this, s, e, r)) {
          s.pendingcb++
          a = writeOrBuffer(this, s, o, e, t, r)
        }
        return a
      }
      Writable.prototype.cork = function () {
        var e = this._writableState
        e.corked++
      }
      Writable.prototype.uncork = function () {
        var e = this._writableState
        if (e.corked) {
          e.corked--
          if (
            !e.writing &&
            !e.corked &&
            !e.finished &&
            !e.bufferProcessing &&
            e.bufferedRequest
          )
            clearBuffer(this, e)
        }
      }
      Writable.prototype.setDefaultEncoding = function setDefaultEncoding(e) {
        if (typeof e === 'string') e = e.toLowerCase()
        if (
          !(
            [
              'hex',
              'utf8',
              'utf-8',
              'ascii',
              'binary',
              'base64',
              'ucs2',
              'ucs-2',
              'utf16le',
              'utf-16le',
              'raw',
            ].indexOf((e + '').toLowerCase()) > -1
          )
        )
          throw new TypeError('Unknown encoding: ' + e)
        this._writableState.defaultEncoding = e
        return this
      }
      function decodeChunk(e, t, r) {
        if (
          !e.objectMode &&
          e.decodeStrings !== false &&
          typeof t === 'string'
        ) {
          t = d.from(t, r)
        }
        return t
      }
      Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
        enumerable: false,
        get: function () {
          return this._writableState.highWaterMark
        },
      })
      function writeOrBuffer(e, t, r, s, a, o) {
        if (!r) {
          var u = decodeChunk(t, s, a)
          if (s !== u) {
            r = true
            a = 'buffer'
            s = u
          }
        }
        var c = t.objectMode ? 1 : s.length
        t.length += c
        var f = t.length < t.highWaterMark
        if (!f) t.needDrain = true
        if (t.writing || t.corked) {
          var d = t.lastBufferedRequest
          t.lastBufferedRequest = {
            chunk: s,
            encoding: a,
            isBuf: r,
            callback: o,
            next: null,
          }
          if (d) {
            d.next = t.lastBufferedRequest
          } else {
            t.bufferedRequest = t.lastBufferedRequest
          }
          t.bufferedRequestCount += 1
        } else {
          doWrite(e, t, false, c, s, a, o)
        }
        return f
      }
      function doWrite(e, t, r, s, a, o, u) {
        t.writelen = s
        t.writecb = u
        t.writing = true
        t.sync = true
        if (r) e._writev(a, t.onwrite)
        else e._write(a, o, t.onwrite)
        t.sync = false
      }
      function onwriteError(e, t, r, a, o) {
        --t.pendingcb
        if (r) {
          s.nextTick(o, a)
          s.nextTick(finishMaybe, e, t)
          e._writableState.errorEmitted = true
          e.emit('error', a)
        } else {
          o(a)
          e._writableState.errorEmitted = true
          e.emit('error', a)
          finishMaybe(e, t)
        }
      }
      function onwriteStateUpdate(e) {
        e.writing = false
        e.writecb = null
        e.length -= e.writelen
        e.writelen = 0
      }
      function onwrite(e, t) {
        var r = e._writableState
        var s = r.sync
        var o = r.writecb
        onwriteStateUpdate(r)
        if (t) onwriteError(e, r, s, t, o)
        else {
          var u = needFinish(r)
          if (!u && !r.corked && !r.bufferProcessing && r.bufferedRequest) {
            clearBuffer(e, r)
          }
          if (s) {
            a(afterWrite, e, r, u, o)
          } else {
            afterWrite(e, r, u, o)
          }
        }
      }
      function afterWrite(e, t, r, s) {
        if (!r) onwriteDrain(e, t)
        t.pendingcb--
        s()
        finishMaybe(e, t)
      }
      function onwriteDrain(e, t) {
        if (t.length === 0 && t.needDrain) {
          t.needDrain = false
          e.emit('drain')
        }
      }
      function clearBuffer(e, t) {
        t.bufferProcessing = true
        var r = t.bufferedRequest
        if (e._writev && r && r.next) {
          var s = t.bufferedRequestCount
          var a = new Array(s)
          var o = t.corkedRequestsFree
          o.entry = r
          var u = 0
          var c = true
          while (r) {
            a[u] = r
            if (!r.isBuf) c = false
            r = r.next
            u += 1
          }
          a.allBuffers = c
          doWrite(e, t, true, t.length, a, '', o.finish)
          t.pendingcb++
          t.lastBufferedRequest = null
          if (o.next) {
            t.corkedRequestsFree = o.next
            o.next = null
          } else {
            t.corkedRequestsFree = new CorkedRequest(t)
          }
          t.bufferedRequestCount = 0
        } else {
          while (r) {
            var f = r.chunk
            var d = r.encoding
            var p = r.callback
            var h = t.objectMode ? 1 : f.length
            doWrite(e, t, false, h, f, d, p)
            r = r.next
            t.bufferedRequestCount--
            if (t.writing) {
              break
            }
          }
          if (r === null) t.lastBufferedRequest = null
        }
        t.bufferedRequest = r
        t.bufferProcessing = false
      }
      Writable.prototype._write = function (e, t, r) {
        r(new Error('_write() is not implemented'))
      }
      Writable.prototype._writev = null
      Writable.prototype.end = function (e, t, r) {
        var s = this._writableState
        if (typeof e === 'function') {
          r = e
          e = null
          t = null
        } else if (typeof t === 'function') {
          r = t
          t = null
        }
        if (e !== null && e !== undefined) this.write(e, t)
        if (s.corked) {
          s.corked = 1
          this.uncork()
        }
        if (!s.ending && !s.finished) endWritable(this, s, r)
      }
      function needFinish(e) {
        return (
          e.ending &&
          e.length === 0 &&
          e.bufferedRequest === null &&
          !e.finished &&
          !e.writing
        )
      }
      function callFinal(e, t) {
        e._final(function (r) {
          t.pendingcb--
          if (r) {
            e.emit('error', r)
          }
          t.prefinished = true
          e.emit('prefinish')
          finishMaybe(e, t)
        })
      }
      function prefinish(e, t) {
        if (!t.prefinished && !t.finalCalled) {
          if (typeof e._final === 'function') {
            t.pendingcb++
            t.finalCalled = true
            s.nextTick(callFinal, e, t)
          } else {
            t.prefinished = true
            e.emit('prefinish')
          }
        }
      }
      function finishMaybe(e, t) {
        var r = needFinish(t)
        if (r) {
          prefinish(e, t)
          if (t.pendingcb === 0) {
            t.finished = true
            e.emit('finish')
          }
        }
        return r
      }
      function endWritable(e, t, r) {
        t.ending = true
        finishMaybe(e, t)
        if (r) {
          if (t.finished) s.nextTick(r)
          else e.once('finish', r)
        }
        t.ended = true
        e.writable = false
      }
      function onCorkedFinish(e, t, r) {
        var s = e.entry
        e.entry = null
        while (s) {
          var a = s.callback
          t.pendingcb--
          a(r)
          s = s.next
        }
        if (t.corkedRequestsFree) {
          t.corkedRequestsFree.next = e
        } else {
          t.corkedRequestsFree = e
        }
      }
      Object.defineProperty(Writable.prototype, 'destroyed', {
        get: function () {
          if (this._writableState === undefined) {
            return false
          }
          return this._writableState.destroyed
        },
        set: function (e) {
          if (!this._writableState) {
            return
          }
          this._writableState.destroyed = e
        },
      })
      Writable.prototype.destroy = h.destroy
      Writable.prototype._undestroy = h.undestroy
      Writable.prototype._destroy = function (e, t) {
        this.end()
        t(e)
      }
    },
    4865: (e, t, r) => {
      'use strict'
      function _classCallCheck(e, t) {
        if (!(e instanceof t)) {
          throw new TypeError('Cannot call a class as a function')
        }
      }
      var s = r(291).Buffer
      var a = r(3837)
      function copyBuffer(e, t, r) {
        e.copy(t, r)
      }
      e.exports = (function () {
        function BufferList() {
          _classCallCheck(this, BufferList)
          this.head = null
          this.tail = null
          this.length = 0
        }
        BufferList.prototype.push = function push(e) {
          var t = { data: e, next: null }
          if (this.length > 0) this.tail.next = t
          else this.head = t
          this.tail = t
          ++this.length
        }
        BufferList.prototype.unshift = function unshift(e) {
          var t = { data: e, next: this.head }
          if (this.length === 0) this.tail = t
          this.head = t
          ++this.length
        }
        BufferList.prototype.shift = function shift() {
          if (this.length === 0) return
          var e = this.head.data
          if (this.length === 1) this.head = this.tail = null
          else this.head = this.head.next
          --this.length
          return e
        }
        BufferList.prototype.clear = function clear() {
          this.head = this.tail = null
          this.length = 0
        }
        BufferList.prototype.join = function join(e) {
          if (this.length === 0) return ''
          var t = this.head
          var r = '' + t.data
          while ((t = t.next)) {
            r += e + t.data
          }
          return r
        }
        BufferList.prototype.concat = function concat(e) {
          if (this.length === 0) return s.alloc(0)
          if (this.length === 1) return this.head.data
          var t = s.allocUnsafe(e >>> 0)
          var r = this.head
          var a = 0
          while (r) {
            copyBuffer(r.data, t, a)
            a += r.data.length
            r = r.next
          }
          return t
        }
        return BufferList
      })()
      if (a && a.inspect && a.inspect.custom) {
        e.exports.prototype[a.inspect.custom] = function () {
          var e = a.inspect({ length: this.length })
          return this.constructor.name + ' ' + e
        }
      }
    },
    2604: (e, t, r) => {
      'use strict'
      var s = r(9182)
      function destroy(e, t) {
        var r = this
        var a = this._readableState && this._readableState.destroyed
        var o = this._writableState && this._writableState.destroyed
        if (a || o) {
          if (t) {
            t(e)
          } else if (
            e &&
            (!this._writableState || !this._writableState.errorEmitted)
          ) {
            s.nextTick(emitErrorNT, this, e)
          }
          return this
        }
        if (this._readableState) {
          this._readableState.destroyed = true
        }
        if (this._writableState) {
          this._writableState.destroyed = true
        }
        this._destroy(e || null, function (e) {
          if (!t && e) {
            s.nextTick(emitErrorNT, r, e)
            if (r._writableState) {
              r._writableState.errorEmitted = true
            }
          } else if (t) {
            t(e)
          }
        })
        return this
      }
      function undestroy() {
        if (this._readableState) {
          this._readableState.destroyed = false
          this._readableState.reading = false
          this._readableState.ended = false
          this._readableState.endEmitted = false
        }
        if (this._writableState) {
          this._writableState.destroyed = false
          this._writableState.ended = false
          this._writableState.ending = false
          this._writableState.finished = false
          this._writableState.errorEmitted = false
        }
      }
      function emitErrorNT(e, t) {
        e.emit('error', t)
      }
      e.exports = { destroy: destroy, undestroy: undestroy }
    },
    2641: (e, t, r) => {
      e.exports = r(2781)
    },
    8511: (e, t, r) => {
      var s = r(2781)
      if (process.env.READABLE_STREAM === 'disable' && s) {
        e.exports = s
        t = e.exports = s.Readable
        t.Readable = s.Readable
        t.Writable = s.Writable
        t.Duplex = s.Duplex
        t.Transform = s.Transform
        t.PassThrough = s.PassThrough
        t.Stream = s
      } else {
        t = e.exports = r(7355)
        t.Stream = s || t
        t.Readable = t
        t.Writable = r(3517)
        t.Duplex = r(4928)
        t.Transform = r(2162)
        t.PassThrough = r(9924)
      }
    },
    2382: (e, t, r) => {
      'use strict'
      const s = r(1017)
      const a = r(8188)
      const o = r(7147)
      const resolveFrom = (e, t, r) => {
        if (typeof e !== 'string') {
          throw new TypeError(
            `Expected \`fromDir\` to be of type \`string\`, got \`${typeof e}\``
          )
        }
        if (typeof t !== 'string') {
          throw new TypeError(
            `Expected \`moduleId\` to be of type \`string\`, got \`${typeof t}\``
          )
        }
        try {
          e = o.realpathSync(e)
        } catch (t) {
          if (t.code === 'ENOENT') {
            e = s.resolve(e)
          } else if (r) {
            return
          } else {
            throw t
          }
        }
        const u = s.join(e, 'noop.js')
        const resolveFileName = () =>
          a._resolveFilename(t, {
            id: u,
            filename: u,
            paths: a._nodeModulePaths(e),
          })
        if (r) {
          try {
            return resolveFileName()
          } catch (e) {
            return
          }
        }
        return resolveFileName()
      }
      e.exports = (e, t) => resolveFrom(e, t)
      e.exports.silent = (e, t) => resolveFrom(e, t, true)
    },
    4700: (e, t, r) => {
      const s = r(9491)
      const a = r(1017)
      const o = r(7147)
      let u = undefined
      try {
        u = r(567)
      } catch (e) {}
      const c = { nosort: true, silent: true }
      let f = 0
      const d = process.platform === 'win32'
      const defaults = (e) => {
        const t = ['unlink', 'chmod', 'stat', 'lstat', 'rmdir', 'readdir']
        t.forEach((t) => {
          e[t] = e[t] || o[t]
          t = t + 'Sync'
          e[t] = e[t] || o[t]
        })
        e.maxBusyTries = e.maxBusyTries || 3
        e.emfileWait = e.emfileWait || 1e3
        if (e.glob === false) {
          e.disableGlob = true
        }
        if (e.disableGlob !== true && u === undefined) {
          throw Error(
            'glob dependency not found, set `options.disableGlob = true` if intentional'
          )
        }
        e.disableGlob = e.disableGlob || false
        e.glob = e.glob || c
      }
      const rimraf = (e, t, r) => {
        if (typeof t === 'function') {
          r = t
          t = {}
        }
        s(e, 'rimraf: missing path')
        s.equal(typeof e, 'string', 'rimraf: path should be a string')
        s.equal(typeof r, 'function', 'rimraf: callback function required')
        s(t, 'rimraf: invalid options argument provided')
        s.equal(typeof t, 'object', 'rimraf: options should be object')
        defaults(t)
        let a = 0
        let o = null
        let c = 0
        const next = (e) => {
          o = o || e
          if (--c === 0) r(o)
        }
        const afterGlob = (e, s) => {
          if (e) return r(e)
          c = s.length
          if (c === 0) return r()
          s.forEach((e) => {
            const CB = (r) => {
              if (r) {
                if (
                  (r.code === 'EBUSY' ||
                    r.code === 'ENOTEMPTY' ||
                    r.code === 'EPERM') &&
                  a < t.maxBusyTries
                ) {
                  a++
                  return setTimeout(() => rimraf_(e, t, CB), a * 100)
                }
                if (r.code === 'EMFILE' && f < t.emfileWait) {
                  return setTimeout(() => rimraf_(e, t, CB), f++)
                }
                if (r.code === 'ENOENT') r = null
              }
              f = 0
              next(r)
            }
            rimraf_(e, t, CB)
          })
        }
        if (t.disableGlob || !u.hasMagic(e)) return afterGlob(null, [e])
        t.lstat(e, (r, s) => {
          if (!r) return afterGlob(null, [e])
          u(e, t.glob, afterGlob)
        })
      }
      const rimraf_ = (e, t, r) => {
        s(e)
        s(t)
        s(typeof r === 'function')
        t.lstat(e, (s, a) => {
          if (s && s.code === 'ENOENT') return r(null)
          if (s && s.code === 'EPERM' && d) fixWinEPERM(e, t, s, r)
          if (a && a.isDirectory()) return rmdir(e, t, s, r)
          t.unlink(e, (s) => {
            if (s) {
              if (s.code === 'ENOENT') return r(null)
              if (s.code === 'EPERM')
                return d ? fixWinEPERM(e, t, s, r) : rmdir(e, t, s, r)
              if (s.code === 'EISDIR') return rmdir(e, t, s, r)
            }
            return r(s)
          })
        })
      }
      const fixWinEPERM = (e, t, r, a) => {
        s(e)
        s(t)
        s(typeof a === 'function')
        t.chmod(e, 438, (s) => {
          if (s) a(s.code === 'ENOENT' ? null : r)
          else
            t.stat(e, (s, o) => {
              if (s) a(s.code === 'ENOENT' ? null : r)
              else if (o.isDirectory()) rmdir(e, t, r, a)
              else t.unlink(e, a)
            })
        })
      }
      const fixWinEPERMSync = (e, t, r) => {
        s(e)
        s(t)
        try {
          t.chmodSync(e, 438)
        } catch (e) {
          if (e.code === 'ENOENT') return
          else throw r
        }
        let a
        try {
          a = t.statSync(e)
        } catch (e) {
          if (e.code === 'ENOENT') return
          else throw r
        }
        if (a.isDirectory()) rmdirSync(e, t, r)
        else t.unlinkSync(e)
      }
      const rmdir = (e, t, r, a) => {
        s(e)
        s(t)
        s(typeof a === 'function')
        t.rmdir(e, (s) => {
          if (
            s &&
            (s.code === 'ENOTEMPTY' ||
              s.code === 'EEXIST' ||
              s.code === 'EPERM')
          )
            rmkids(e, t, a)
          else if (s && s.code === 'ENOTDIR') a(r)
          else a(s)
        })
      }
      const rmkids = (e, t, r) => {
        s(e)
        s(t)
        s(typeof r === 'function')
        t.readdir(e, (s, o) => {
          if (s) return r(s)
          let u = o.length
          if (u === 0) return t.rmdir(e, r)
          let c
          o.forEach((s) => {
            rimraf(a.join(e, s), t, (s) => {
              if (c) return
              if (s) return r((c = s))
              if (--u === 0) t.rmdir(e, r)
            })
          })
        })
      }
      const rimrafSync = (e, t) => {
        t = t || {}
        defaults(t)
        s(e, 'rimraf: missing path')
        s.equal(typeof e, 'string', 'rimraf: path should be a string')
        s(t, 'rimraf: missing options')
        s.equal(typeof t, 'object', 'rimraf: options should be object')
        let r
        if (t.disableGlob || !u.hasMagic(e)) {
          r = [e]
        } else {
          try {
            t.lstatSync(e)
            r = [e]
          } catch (s) {
            r = u.sync(e, t.glob)
          }
        }
        if (!r.length) return
        for (let e = 0; e < r.length; e++) {
          const s = r[e]
          let a
          try {
            a = t.lstatSync(s)
          } catch (e) {
            if (e.code === 'ENOENT') return
            if (e.code === 'EPERM' && d) fixWinEPERMSync(s, t, e)
          }
          try {
            if (a && a.isDirectory()) rmdirSync(s, t, null)
            else t.unlinkSync(s)
          } catch (e) {
            if (e.code === 'ENOENT') return
            if (e.code === 'EPERM')
              return d ? fixWinEPERMSync(s, t, e) : rmdirSync(s, t, e)
            if (e.code !== 'EISDIR') throw e
            rmdirSync(s, t, e)
          }
        }
      }
      const rmdirSync = (e, t, r) => {
        s(e)
        s(t)
        try {
          t.rmdirSync(e)
        } catch (s) {
          if (s.code === 'ENOENT') return
          if (s.code === 'ENOTDIR') throw r
          if (
            s.code === 'ENOTEMPTY' ||
            s.code === 'EEXIST' ||
            s.code === 'EPERM'
          )
            rmkidsSync(e, t)
        }
      }
      const rmkidsSync = (e, t) => {
        s(e)
        s(t)
        t.readdirSync(e).forEach((r) => rimrafSync(a.join(e, r), t))
        const r = d ? 100 : 1
        let o = 0
        do {
          let s = true
          try {
            const a = t.rmdirSync(e, t)
            s = false
            return a
          } finally {
            if (++o < r && s) continue
          }
        } while (true)
      }
      e.exports = rimraf
      rimraf.sync = rimrafSync
    },
    291: (e, t, r) => {
      var s = r(4300)
      var a = s.Buffer
      function copyProps(e, t) {
        for (var r in e) {
          t[r] = e[r]
        }
      }
      if (a.from && a.alloc && a.allocUnsafe && a.allocUnsafeSlow) {
        e.exports = s
      } else {
        copyProps(s, t)
        t.Buffer = SafeBuffer
      }
      function SafeBuffer(e, t, r) {
        return a(e, t, r)
      }
      copyProps(a, SafeBuffer)
      SafeBuffer.from = function (e, t, r) {
        if (typeof e === 'number') {
          throw new TypeError('Argument must not be a number')
        }
        return a(e, t, r)
      }
      SafeBuffer.alloc = function (e, t, r) {
        if (typeof e !== 'number') {
          throw new TypeError('Argument must be a number')
        }
        var s = a(e)
        if (t !== undefined) {
          if (typeof r === 'string') {
            s.fill(t, r)
          } else {
            s.fill(t)
          }
        } else {
          s.fill(0)
        }
        return s
      }
      SafeBuffer.allocUnsafe = function (e) {
        if (typeof e !== 'number') {
          throw new TypeError('Argument must be a number')
        }
        return a(e)
      }
      SafeBuffer.allocUnsafeSlow = function (e) {
        if (typeof e !== 'number') {
          throw new TypeError('Argument must be a number')
        }
        return s.SlowBuffer(e)
      }
    },
    2656: (e) => {
      e.exports = function (e) {
        ;[process.stdout, process.stderr].forEach(function (t) {
          if (
            t._handle &&
            t.isTTY &&
            typeof t._handle.setBlocking === 'function'
          ) {
            t._handle.setBlocking(e)
          }
        })
      }
    },
    7234: (e, t, r) => {
      var s = global.process
      const processOk = function (e) {
        return (
          e &&
          typeof e === 'object' &&
          typeof e.removeListener === 'function' &&
          typeof e.emit === 'function' &&
          typeof e.reallyExit === 'function' &&
          typeof e.listeners === 'function' &&
          typeof e.kill === 'function' &&
          typeof e.pid === 'number' &&
          typeof e.on === 'function'
        )
      }
      if (!processOk(s)) {
        e.exports = function () {
          return function () {}
        }
      } else {
        var a = r(9491)
        var o = r(8986)
        var u = /^win/i.test(s.platform)
        var c = r(2361)
        if (typeof c !== 'function') {
          c = c.EventEmitter
        }
        var f
        if (s.__signal_exit_emitter__) {
          f = s.__signal_exit_emitter__
        } else {
          f = s.__signal_exit_emitter__ = new c()
          f.count = 0
          f.emitted = {}
        }
        if (!f.infinite) {
          f.setMaxListeners(Infinity)
          f.infinite = true
        }
        e.exports = function (e, t) {
          if (!processOk(global.process)) {
            return function () {}
          }
          a.equal(
            typeof e,
            'function',
            'a callback must be provided for exit handler'
          )
          if (v === false) {
            g()
          }
          var r = 'exit'
          if (t && t.alwaysLast) {
            r = 'afterexit'
          }
          var remove = function () {
            f.removeListener(r, e)
            if (
              f.listeners('exit').length === 0 &&
              f.listeners('afterexit').length === 0
            ) {
              d()
            }
          }
          f.on(r, e)
          return remove
        }
        var d = function unload() {
          if (!v || !processOk(global.process)) {
            return
          }
          v = false
          o.forEach(function (e) {
            try {
              s.removeListener(e, h[e])
            } catch (e) {}
          })
          s.emit = m
          s.reallyExit = D
          f.count -= 1
        }
        e.exports.unload = d
        var p = function emit(e, t, r) {
          if (f.emitted[e]) {
            return
          }
          f.emitted[e] = true
          f.emit(e, t, r)
        }
        var h = {}
        o.forEach(function (e) {
          h[e] = function listener() {
            if (!processOk(global.process)) {
              return
            }
            var t = s.listeners(e)
            if (t.length === f.count) {
              d()
              p('exit', null, e)
              p('afterexit', null, e)
              if (u && e === 'SIGHUP') {
                e = 'SIGINT'
              }
              s.kill(s.pid, e)
            }
          }
        })
        e.exports.signals = function () {
          return o
        }
        var v = false
        var g = function load() {
          if (v || !processOk(global.process)) {
            return
          }
          v = true
          f.count += 1
          o = o.filter(function (e) {
            try {
              s.on(e, h[e])
              return true
            } catch (e) {
              return false
            }
          })
          s.emit = _
          s.reallyExit = y
        }
        e.exports.load = g
        var D = s.reallyExit
        var y = function processReallyExit(e) {
          if (!processOk(global.process)) {
            return
          }
          s.exitCode = e || 0
          p('exit', s.exitCode, null)
          p('afterexit', s.exitCode, null)
          D.call(s, s.exitCode)
        }
        var m = s.emit
        var _ = function processEmit(e, t) {
          if (e === 'exit' && processOk(global.process)) {
            if (t !== undefined) {
              s.exitCode = t
            }
            var r = m.apply(this, arguments)
            p('exit', s.exitCode, null)
            p('afterexit', s.exitCode, null)
            return r
          } else {
            return m.apply(this, arguments)
          }
        }
      }
    },
    8986: (e) => {
      e.exports = ['SIGABRT', 'SIGALRM', 'SIGHUP', 'SIGINT', 'SIGTERM']
      if (process.platform !== 'win32') {
        e.exports.push(
          'SIGVTALRM',
          'SIGXCPU',
          'SIGXFSZ',
          'SIGUSR2',
          'SIGTRAP',
          'SIGSYS',
          'SIGQUIT',
          'SIGIOT'
        )
      }
      if (process.platform === 'linux') {
        e.exports.push('SIGIO', 'SIGPOLL', 'SIGPWR', 'SIGSTKFLT', 'SIGUNUSED')
      }
    },
    8321: (e, t, r) => {
      'use strict'
      var s = r(3484)
      var a = r(8589)
      var o = r(3279)
      e.exports = function (e) {
        if (typeof e !== 'string' || e.length === 0) {
          return 0
        }
        var t = 0
        e = s(e)
        for (var r = 0; r < e.length; r++) {
          var u = a(e, r)
          if (u <= 31 || (u >= 127 && u <= 159)) {
            continue
          }
          if (u >= 65536) {
            r++
          }
          if (o(u)) {
            t += 2
          } else {
            t++
          }
        }
        return t
      }
    },
    5663: (e, t, r) => {
      'use strict'
      const s = r(3484)
      const a = r(8502)
      const o = r(3876)
      const stringWidth = (e) => {
        if (typeof e !== 'string' || e.length === 0) {
          return 0
        }
        e = s(e)
        if (e.length === 0) {
          return 0
        }
        e = e.replace(o(), '  ')
        let t = 0
        for (let r = 0; r < e.length; r++) {
          const s = e.codePointAt(r)
          if (s <= 31 || (s >= 127 && s <= 159)) {
            continue
          }
          if (s >= 768 && s <= 879) {
            continue
          }
          if (s > 65535) {
            r++
          }
          t += a(s) ? 2 : 1
        }
        return t
      }
      e.exports = stringWidth
      e.exports['default'] = stringWidth
    },
    4426: (e, t, r) => {
      'use strict'
      var s = r(291).Buffer
      var a =
        s.isEncoding ||
        function (e) {
          e = '' + e
          switch (e && e.toLowerCase()) {
            case 'hex':
            case 'utf8':
            case 'utf-8':
            case 'ascii':
            case 'binary':
            case 'base64':
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
            case 'raw':
              return true
            default:
              return false
          }
        }
      function _normalizeEncoding(e) {
        if (!e) return 'utf8'
        var t
        while (true) {
          switch (e) {
            case 'utf8':
            case 'utf-8':
              return 'utf8'
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return 'utf16le'
            case 'latin1':
            case 'binary':
              return 'latin1'
            case 'base64':
            case 'ascii':
            case 'hex':
              return e
            default:
              if (t) return
              e = ('' + e).toLowerCase()
              t = true
          }
        }
      }
      function normalizeEncoding(e) {
        var t = _normalizeEncoding(e)
        if (typeof t !== 'string' && (s.isEncoding === a || !a(e)))
          throw new Error('Unknown encoding: ' + e)
        return t || e
      }
      t.s = StringDecoder
      function StringDecoder(e) {
        this.encoding = normalizeEncoding(e)
        var t
        switch (this.encoding) {
          case 'utf16le':
            this.text = utf16Text
            this.end = utf16End
            t = 4
            break
          case 'utf8':
            this.fillLast = utf8FillLast
            t = 4
            break
          case 'base64':
            this.text = base64Text
            this.end = base64End
            t = 3
            break
          default:
            this.write = simpleWrite
            this.end = simpleEnd
            return
        }
        this.lastNeed = 0
        this.lastTotal = 0
        this.lastChar = s.allocUnsafe(t)
      }
      StringDecoder.prototype.write = function (e) {
        if (e.length === 0) return ''
        var t
        var r
        if (this.lastNeed) {
          t = this.fillLast(e)
          if (t === undefined) return ''
          r = this.lastNeed
          this.lastNeed = 0
        } else {
          r = 0
        }
        if (r < e.length) return t ? t + this.text(e, r) : this.text(e, r)
        return t || ''
      }
      StringDecoder.prototype.end = utf8End
      StringDecoder.prototype.text = utf8Text
      StringDecoder.prototype.fillLast = function (e) {
        if (this.lastNeed <= e.length) {
          e.copy(
            this.lastChar,
            this.lastTotal - this.lastNeed,
            0,
            this.lastNeed
          )
          return this.lastChar.toString(this.encoding, 0, this.lastTotal)
        }
        e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length)
        this.lastNeed -= e.length
      }
      function utf8CheckByte(e) {
        if (e <= 127) return 0
        else if (e >> 5 === 6) return 2
        else if (e >> 4 === 14) return 3
        else if (e >> 3 === 30) return 4
        return e >> 6 === 2 ? -1 : -2
      }
      function utf8CheckIncomplete(e, t, r) {
        var s = t.length - 1
        if (s < r) return 0
        var a = utf8CheckByte(t[s])
        if (a >= 0) {
          if (a > 0) e.lastNeed = a - 1
          return a
        }
        if (--s < r || a === -2) return 0
        a = utf8CheckByte(t[s])
        if (a >= 0) {
          if (a > 0) e.lastNeed = a - 2
          return a
        }
        if (--s < r || a === -2) return 0
        a = utf8CheckByte(t[s])
        if (a >= 0) {
          if (a > 0) {
            if (a === 2) a = 0
            else e.lastNeed = a - 3
          }
          return a
        }
        return 0
      }
      function utf8CheckExtraBytes(e, t, r) {
        if ((t[0] & 192) !== 128) {
          e.lastNeed = 0
          return '�'
        }
        if (e.lastNeed > 1 && t.length > 1) {
          if ((t[1] & 192) !== 128) {
            e.lastNeed = 1
            return '�'
          }
          if (e.lastNeed > 2 && t.length > 2) {
            if ((t[2] & 192) !== 128) {
              e.lastNeed = 2
              return '�'
            }
          }
        }
      }
      function utf8FillLast(e) {
        var t = this.lastTotal - this.lastNeed
        var r = utf8CheckExtraBytes(this, e, t)
        if (r !== undefined) return r
        if (this.lastNeed <= e.length) {
          e.copy(this.lastChar, t, 0, this.lastNeed)
          return this.lastChar.toString(this.encoding, 0, this.lastTotal)
        }
        e.copy(this.lastChar, t, 0, e.length)
        this.lastNeed -= e.length
      }
      function utf8Text(e, t) {
        var r = utf8CheckIncomplete(this, e, t)
        if (!this.lastNeed) return e.toString('utf8', t)
        this.lastTotal = r
        var s = e.length - (r - this.lastNeed)
        e.copy(this.lastChar, 0, s)
        return e.toString('utf8', t, s)
      }
      function utf8End(e) {
        var t = e && e.length ? this.write(e) : ''
        if (this.lastNeed) return t + '�'
        return t
      }
      function utf16Text(e, t) {
        if ((e.length - t) % 2 === 0) {
          var r = e.toString('utf16le', t)
          if (r) {
            var s = r.charCodeAt(r.length - 1)
            if (s >= 55296 && s <= 56319) {
              this.lastNeed = 2
              this.lastTotal = 4
              this.lastChar[0] = e[e.length - 2]
              this.lastChar[1] = e[e.length - 1]
              return r.slice(0, -1)
            }
          }
          return r
        }
        this.lastNeed = 1
        this.lastTotal = 2
        this.lastChar[0] = e[e.length - 1]
        return e.toString('utf16le', t, e.length - 1)
      }
      function utf16End(e) {
        var t = e && e.length ? this.write(e) : ''
        if (this.lastNeed) {
          var r = this.lastTotal - this.lastNeed
          return t + this.lastChar.toString('utf16le', 0, r)
        }
        return t
      }
      function base64Text(e, t) {
        var r = (e.length - t) % 3
        if (r === 0) return e.toString('base64', t)
        this.lastNeed = 3 - r
        this.lastTotal = 3
        if (r === 1) {
          this.lastChar[0] = e[e.length - 1]
        } else {
          this.lastChar[0] = e[e.length - 2]
          this.lastChar[1] = e[e.length - 1]
        }
        return e.toString('base64', t, e.length - r)
      }
      function base64End(e) {
        var t = e && e.length ? this.write(e) : ''
        if (this.lastNeed)
          return t + this.lastChar.toString('base64', 0, 3 - this.lastNeed)
        return t
      }
      function simpleWrite(e) {
        return e.toString(this.encoding)
      }
      function simpleEnd(e) {
        return e && e.length ? this.write(e) : ''
      }
    },
    492: (e, t, r) => {
      'use strict'
      /*!
       * to-regex-range <https://github.com/micromatch/to-regex-range>
       *
       * Copyright (c) 2015-present, Jon Schlinkert.
       * Released under the MIT License.
       */ const s = r(3357)
      const toRegexRange = (e, t, r) => {
        if (s(e) === false) {
          throw new TypeError(
            'toRegexRange: expected the first argument to be a number'
          )
        }
        if (t === void 0 || e === t) {
          return String(e)
        }
        if (s(t) === false) {
          throw new TypeError(
            'toRegexRange: expected the second argument to be a number.'
          )
        }
        let a = { relaxZeros: true, ...r }
        if (typeof a.strictZeros === 'boolean') {
          a.relaxZeros = a.strictZeros === false
        }
        let o = String(a.relaxZeros)
        let u = String(a.shorthand)
        let c = String(a.capture)
        let f = String(a.wrap)
        let d = e + ':' + t + '=' + o + u + c + f
        if (toRegexRange.cache.hasOwnProperty(d)) {
          return toRegexRange.cache[d].result
        }
        let p = Math.min(e, t)
        let h = Math.max(e, t)
        if (Math.abs(p - h) === 1) {
          let r = e + '|' + t
          if (a.capture) {
            return `(${r})`
          }
          if (a.wrap === false) {
            return r
          }
          return `(?:${r})`
        }
        let v = hasPadding(e) || hasPadding(t)
        let g = { min: e, max: t, a: p, b: h }
        let D = []
        let y = []
        if (v) {
          g.isPadded = v
          g.maxLen = String(g.max).length
        }
        if (p < 0) {
          let e = h < 0 ? Math.abs(h) : 1
          y = splitToPatterns(e, Math.abs(p), g, a)
          p = g.a = 0
        }
        if (h >= 0) {
          D = splitToPatterns(p, h, g, a)
        }
        g.negatives = y
        g.positives = D
        g.result = collatePatterns(y, D, a)
        if (a.capture === true) {
          g.result = `(${g.result})`
        } else if (a.wrap !== false && D.length + y.length > 1) {
          g.result = `(?:${g.result})`
        }
        toRegexRange.cache[d] = g
        return g.result
      }
      function collatePatterns(e, t, r) {
        let s = filterPatterns(e, t, '-', false, r) || []
        let a = filterPatterns(t, e, '', false, r) || []
        let o = filterPatterns(e, t, '-?', true, r) || []
        let u = s.concat(o).concat(a)
        return u.join('|')
      }
      function splitToRanges(e, t) {
        let r = 1
        let s = 1
        let a = countNines(e, r)
        let o = new Set([t])
        while (e <= a && a <= t) {
          o.add(a)
          r += 1
          a = countNines(e, r)
        }
        a = countZeros(t + 1, s) - 1
        while (e < a && a <= t) {
          o.add(a)
          s += 1
          a = countZeros(t + 1, s) - 1
        }
        o = [...o]
        o.sort(compare)
        return o
      }
      function rangeToPattern(e, t, r) {
        if (e === t) {
          return { pattern: e, count: [], digits: 0 }
        }
        let s = zip(e, t)
        let a = s.length
        let o = ''
        let u = 0
        for (let e = 0; e < a; e++) {
          let [t, a] = s[e]
          if (t === a) {
            o += t
          } else if (t !== '0' || a !== '9') {
            o += toCharacterClass(t, a, r)
          } else {
            u++
          }
        }
        if (u) {
          o += r.shorthand === true ? '\\d' : '[0-9]'
        }
        return { pattern: o, count: [u], digits: a }
      }
      function splitToPatterns(e, t, r, s) {
        let a = splitToRanges(e, t)
        let o = []
        let u = e
        let c
        for (let e = 0; e < a.length; e++) {
          let t = a[e]
          let f = rangeToPattern(String(u), String(t), s)
          let d = ''
          if (!r.isPadded && c && c.pattern === f.pattern) {
            if (c.count.length > 1) {
              c.count.pop()
            }
            c.count.push(f.count[0])
            c.string = c.pattern + toQuantifier(c.count)
            u = t + 1
            continue
          }
          if (r.isPadded) {
            d = padZeros(t, r, s)
          }
          f.string = d + f.pattern + toQuantifier(f.count)
          o.push(f)
          u = t + 1
          c = f
        }
        return o
      }
      function filterPatterns(e, t, r, s, a) {
        let o = []
        for (let a of e) {
          let { string: e } = a
          if (!s && !contains(t, 'string', e)) {
            o.push(r + e)
          }
          if (s && contains(t, 'string', e)) {
            o.push(r + e)
          }
        }
        return o
      }
      function zip(e, t) {
        let r = []
        for (let s = 0; s < e.length; s++) r.push([e[s], t[s]])
        return r
      }
      function compare(e, t) {
        return e > t ? 1 : t > e ? -1 : 0
      }
      function contains(e, t, r) {
        return e.some((e) => e[t] === r)
      }
      function countNines(e, t) {
        return Number(String(e).slice(0, -t) + '9'.repeat(t))
      }
      function countZeros(e, t) {
        return e - (e % Math.pow(10, t))
      }
      function toQuantifier(e) {
        let [t = 0, r = ''] = e
        if (r || t > 1) {
          return `{${t + (r ? ',' + r : '')}}`
        }
        return ''
      }
      function toCharacterClass(e, t, r) {
        return `[${e}${t - e === 1 ? '' : '-'}${t}]`
      }
      function hasPadding(e) {
        return /^-?(0+)\d/.test(e)
      }
      function padZeros(e, t, r) {
        if (!t.isPadded) {
          return e
        }
        let s = Math.abs(t.maxLen - String(e).length)
        let a = r.relaxZeros !== false
        switch (s) {
          case 0:
            return ''
          case 1:
            return a ? '0?' : '0'
          case 2:
            return a ? '0{0,2}' : '00'
          default: {
            return a ? `0{0,${s}}` : `0{${s}}`
          }
        }
      }
      toRegexRange.cache = {}
      toRegexRange.clearCache = () => (toRegexRange.cache = {})
      e.exports = toRegexRange
    },
    6124: (e, t, r) => {
      e.exports = r(3837).deprecate
    },
    1365: (e, t, r) => {
      'use strict'
      var s = r(5663)
      t.center = alignCenter
      t.left = alignLeft
      t.right = alignRight
      function createPadding(e) {
        var t = ''
        var r = ' '
        var s = e
        do {
          if (s % 2) {
            t += r
          }
          s = Math.floor(s / 2)
          r += r
        } while (s)
        return t
      }
      function alignLeft(e, t) {
        var r = e.trimRight()
        if (r.length === 0 && e.length >= t) return e
        var a = ''
        var o = s(r)
        if (o < t) {
          a = createPadding(t - o)
        }
        return r + a
      }
      function alignRight(e, t) {
        var r = e.trimLeft()
        if (r.length === 0 && e.length >= t) return e
        var a = ''
        var o = s(r)
        if (o < t) {
          a = createPadding(t - o)
        }
        return a + r
      }
      function alignCenter(e, t) {
        var r = e.trim()
        if (r.length === 0 && e.length >= t) return e
        var a = ''
        var o = ''
        var u = s(r)
        if (u < t) {
          var c = parseInt((t - u) / 2, 10)
          a = createPadding(c)
          o = createPadding(t - (u + c))
        }
        return a + r + o
      }
    },
    2355: (module) => {
      module.exports = eval('require')('aws-sdk')
    },
    3930: (module) => {
      module.exports = eval('require')('mock-aws-s3')
    },
    4997: (module) => {
      module.exports = eval('require')('nock')
    },
    6414: (e) => {
      'use strict'
      e.exports = require('../../acorn')
    },
    7574: (e) => {
      'use strict'
      e.exports = require('../../async-sema')
    },
    567: (e) => {
      'use strict'
      e.exports = require('../../glob')
    },
    9990: (e) => {
      'use strict'
      e.exports = require('../../picomatch')
    },
    8353: (e) => {
      'use strict'
      e.exports = require('../../semver')
    },
    3484: (e) => {
      'use strict'
      e.exports = require('../../strip-ansi')
    },
    9491: (e) => {
      'use strict'
      e.exports = require('assert')
    },
    4300: (e) => {
      'use strict'
      e.exports = require('buffer')
    },
    2081: (e) => {
      'use strict'
      e.exports = require('child_process')
    },
    2057: (e) => {
      'use strict'
      e.exports = require('constants')
    },
    2361: (e) => {
      'use strict'
      e.exports = require('events')
    },
    7147: (e) => {
      'use strict'
      e.exports = require('fs')
    },
    8188: (e) => {
      'use strict'
      e.exports = require('module')
    },
    2037: (e) => {
      'use strict'
      e.exports = require('os')
    },
    1017: (e) => {
      'use strict'
      e.exports = require('path')
    },
    2781: (e) => {
      'use strict'
      e.exports = require('stream')
    },
    7310: (e) => {
      'use strict'
      e.exports = require('url')
    },
    3837: (e) => {
      'use strict'
      e.exports = require('util')
    },
    9663: (e, t, r) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: true })
      var s = r(1017)
      var a = r(9990)
      function _interopDefaultLegacy(e) {
        return e && typeof e === 'object' && 'default' in e ? e : { default: e }
      }
      var o = _interopDefaultLegacy(a)
      const u = function addExtension(e, t = '.js') {
        let r = `${e}`
        if (!s.extname(e)) r += t
        return r
      }
      class WalkerBase {
        constructor() {
          WalkerBase.prototype.__init.call(this)
          WalkerBase.prototype.__init2.call(this)
          WalkerBase.prototype.__init3.call(this)
          WalkerBase.prototype.__init4.call(this)
        }
        __init() {
          this.should_skip = false
        }
        __init2() {
          this.should_remove = false
        }
        __init3() {
          this.replacement = null
        }
        __init4() {
          this.context = {
            skip: () => (this.should_skip = true),
            remove: () => (this.should_remove = true),
            replace: (e) => (this.replacement = e),
          }
        }
        replace(e, t, r, s) {
          if (e) {
            if (r !== null) {
              e[t][r] = s
            } else {
              e[t] = s
            }
          }
        }
        remove(e, t, r) {
          if (e) {
            if (r !== null) {
              e[t].splice(r, 1)
            } else {
              delete e[t]
            }
          }
        }
      }
      class SyncWalkerClass extends WalkerBase {
        constructor(e) {
          super()
          this.enter = e.enter
          this.leave = e.leave
        }
        visit(e, t, r, s, a, o) {
          if (e) {
            if (r) {
              const s = this.should_skip
              const u = this.should_remove
              const c = this.replacement
              this.should_skip = false
              this.should_remove = false
              this.replacement = null
              r.call(this.context, e, t, a, o)
              if (this.replacement) {
                e = this.replacement
                this.replace(t, a, o, e)
              }
              if (this.should_remove) {
                this.remove(t, a, o)
              }
              const f = this.should_skip
              const d = this.should_remove
              this.should_skip = s
              this.should_remove = u
              this.replacement = c
              if (f) return e
              if (d) return null
            }
            for (const t in e) {
              const a = e[t]
              if (typeof a !== 'object') {
                continue
              } else if (Array.isArray(a)) {
                for (let o = 0; o < a.length; o += 1) {
                  if (a[o] !== null && typeof a[o].type === 'string') {
                    if (!this.visit(a[o], e, r, s, t, o)) {
                      o--
                    }
                  }
                }
              } else if (a !== null && typeof a.type === 'string') {
                this.visit(a, e, r, s, t, null)
              }
            }
            if (s) {
              const r = this.replacement
              const u = this.should_remove
              this.replacement = null
              this.should_remove = false
              s.call(this.context, e, t, a, o)
              if (this.replacement) {
                e = this.replacement
                this.replace(t, a, o, e)
              }
              if (this.should_remove) {
                this.remove(t, a, o)
              }
              const c = this.should_remove
              this.replacement = r
              this.should_remove = u
              if (c) return null
            }
          }
          return e
        }
      }
      function walk(e, t) {
        const r = new SyncWalkerClass(t)
        return r.visit(e, null, t.enter, t.leave)
      }
      const c = {
        ArrayPattern(e, t) {
          for (const r of t.elements) {
            if (r) c[r.type](e, r)
          }
        },
        AssignmentPattern(e, t) {
          c[t.left.type](e, t.left)
        },
        Identifier(e, t) {
          e.push(t.name)
        },
        MemberExpression() {},
        ObjectPattern(e, t) {
          for (const r of t.properties) {
            if (r.type === 'RestElement') {
              c.RestElement(e, r)
            } else {
              c[r.value.type](e, r.value)
            }
          }
        },
        RestElement(e, t) {
          c[t.argument.type](e, t.argument)
        },
      }
      const f = function extractAssignedNames(e) {
        const t = []
        c[e.type](t, e)
        return t
      }
      const d = { const: true, let: true }
      class Scope {
        constructor(e = {}) {
          this.parent = e.parent
          this.isBlockScope = !!e.block
          this.declarations = Object.create(null)
          if (e.params) {
            e.params.forEach((e) => {
              f(e).forEach((e) => {
                this.declarations[e] = true
              })
            })
          }
        }
        addDeclaration(e, t, r) {
          if (!t && this.isBlockScope) {
            this.parent.addDeclaration(e, t, r)
          } else if (e.id) {
            f(e.id).forEach((e) => {
              this.declarations[e] = true
            })
          }
        }
        contains(e) {
          return (
            this.declarations[e] ||
            (this.parent ? this.parent.contains(e) : false)
          )
        }
      }
      const p = function attachScopes(e, t = 'scope') {
        let r = new Scope()
        walk(e, {
          enter(e, s) {
            const a = e
            if (/(Function|Class)Declaration/.test(a.type)) {
              r.addDeclaration(a, false, false)
            }
            if (a.type === 'VariableDeclaration') {
              const { kind: e } = a
              const t = d[e]
              a.declarations.forEach((e) => {
                r.addDeclaration(e, t, true)
              })
            }
            let o
            if (/Function/.test(a.type)) {
              const e = a
              o = new Scope({ parent: r, block: false, params: e.params })
              if (e.type === 'FunctionExpression' && e.id) {
                o.addDeclaration(e, false, false)
              }
            }
            if (/For(In|Of)?Statement/.test(a.type)) {
              o = new Scope({ parent: r, block: true })
            }
            if (a.type === 'BlockStatement' && !/Function/.test(s.type)) {
              o = new Scope({ parent: r, block: true })
            }
            if (a.type === 'CatchClause') {
              o = new Scope({
                parent: r,
                params: a.param ? [a.param] : [],
                block: true,
              })
            }
            if (o) {
              Object.defineProperty(a, t, { value: o, configurable: true })
              r = o
            }
          },
          leave(e) {
            const s = e
            if (s[t]) r = r.parent
          },
        })
        return r
      }
      function isArray(e) {
        return Array.isArray(e)
      }
      function ensureArray(e) {
        if (isArray(e)) return e
        if (e == null) return []
        return [e]
      }
      const h = function normalizePath(e) {
        return e.split(s.win32.sep).join(s.posix.sep)
      }
      function getMatcherString(e, t) {
        if (t === false || s.isAbsolute(e) || e.startsWith('*')) {
          return h(e)
        }
        const r = h(s.resolve(t || '')).replace(/[-^$*+?.()|[\]{}]/g, '\\$&')
        return s.posix.join(r, h(e))
      }
      const v = function createFilter(e, t, r) {
        const s = r && r.resolve
        const getMatcher = (e) =>
          e instanceof RegExp
            ? e
            : {
                test: (t) => {
                  const r = getMatcherString(e, s)
                  const a = o['default'](r, { dot: true })
                  const u = a(t)
                  return u
                },
              }
        const a = ensureArray(e).map(getMatcher)
        const u = ensureArray(t).map(getMatcher)
        return function result(e) {
          if (typeof e !== 'string') return false
          if (/\0/.test(e)) return false
          const t = h(e)
          for (let e = 0; e < u.length; ++e) {
            const r = u[e]
            if (r.test(t)) return false
          }
          for (let e = 0; e < a.length; ++e) {
            const r = a[e]
            if (r.test(t)) return true
          }
          return !a.length
        }
      }
      const g =
        'break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public'
      const D =
        'arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl'
      const y = new Set(`${g} ${D}`.split(' '))
      y.add('')
      const m = function makeLegalIdentifier(e) {
        let t = e
          .replace(/-(\w)/g, (e, t) => t.toUpperCase())
          .replace(/[^$_a-zA-Z0-9]/g, '_')
        if (/\d/.test(t[0]) || y.has(t)) {
          t = `_${t}`
        }
        return t || '_'
      }
      function stringify(e) {
        return (JSON.stringify(e) || 'undefined').replace(
          /[\u2028\u2029]/g,
          (e) => `\\u${`000${e.charCodeAt(0).toString(16)}`.slice(-4)}`
        )
      }
      function serializeArray(e, t, r) {
        let s = '['
        const a = t ? `\n${r}${t}` : ''
        for (let o = 0; o < e.length; o++) {
          const u = e[o]
          s += `${o > 0 ? ',' : ''}${a}${serialize(u, t, r + t)}`
        }
        return `${s}${t ? `\n${r}` : ''}]`
      }
      function serializeObject(e, t, r) {
        let s = '{'
        const a = t ? `\n${r}${t}` : ''
        const o = Object.entries(e)
        for (let e = 0; e < o.length; e++) {
          const [u, c] = o[e]
          const f = m(u) === u ? u : stringify(u)
          s += `${e > 0 ? ',' : ''}${a}${f}:${t ? ' ' : ''}${serialize(
            c,
            t,
            r + t
          )}`
        }
        return `${s}${t ? `\n${r}` : ''}}`
      }
      function serialize(e, t, r) {
        if (typeof e === 'object' && e !== null) {
          if (Array.isArray(e)) return serializeArray(e, t, r)
          if (e instanceof Date) return `new Date(${e.getTime()})`
          if (e instanceof RegExp) return e.toString()
          return serializeObject(e, t, r)
        }
        if (typeof e === 'number') {
          if (e === Infinity) return 'Infinity'
          if (e === -Infinity) return '-Infinity'
          if (e === 0) return 1 / e === Infinity ? '0' : '-0'
          if (e !== e) return 'NaN'
        }
        if (typeof e === 'symbol') {
          const t = Symbol.keyFor(e)
          if (t !== undefined) return `Symbol.for(${stringify(t)})`
        }
        if (typeof e === 'bigint') return `${e}n`
        return stringify(e)
      }
      const _ = function dataToEsm(e, t = {}) {
        const r = t.compact ? '' : 'indent' in t ? t.indent : '\t'
        const s = t.compact ? '' : ' '
        const a = t.compact ? '' : '\n'
        const o = t.preferConst ? 'const' : 'var'
        if (
          t.namedExports === false ||
          typeof e !== 'object' ||
          Array.isArray(e) ||
          e instanceof Date ||
          e instanceof RegExp ||
          e === null
        ) {
          const a = serialize(e, t.compact ? null : r, '')
          const o = s || (/^[{[\-\/]/.test(a) ? '' : ' ')
          return `export default${o}${a};`
        }
        let u = ''
        const c = []
        for (const [f, d] of Object.entries(e)) {
          if (f === m(f)) {
            if (t.objectShorthand) c.push(f)
            else c.push(`${f}:${s}${f}`)
            u += `export ${o} ${f}${s}=${s}${serialize(
              d,
              t.compact ? null : r,
              ''
            )};${a}`
          } else {
            c.push(
              `${stringify(f)}:${s}${serialize(d, t.compact ? null : r, '')}`
            )
          }
        }
        return `${u}export default${s}{${a}${r}${c.join(`,${a}${r}`)}${a}};${a}`
      }
      var E = {
        addExtension: u,
        attachScopes: p,
        createFilter: v,
        dataToEsm: _,
        extractAssignedNames: f,
        makeLegalIdentifier: m,
        normalizePath: h,
      }
      t.addExtension = u
      t.attachScopes = p
      t.createFilter = v
      t.dataToEsm = _
      t['default'] = E
      t.extractAssignedNames = f
      t.makeLegalIdentifier = m
      t.normalizePath = h
    },
    3982: function (e, t) {
      ;(function (e, r) {
        true ? r(t) : 0
      })(this, function (e) {
        'use strict'
        class WalkerBase {
          constructor() {
            this.should_skip = false
            this.should_remove = false
            this.replacement = null
            this.context = {
              skip: () => (this.should_skip = true),
              remove: () => (this.should_remove = true),
              replace: (e) => (this.replacement = e),
            }
          }
          replace(e, t, r, s) {
            if (e) {
              if (r !== null) {
                e[t][r] = s
              } else {
                e[t] = s
              }
            }
          }
          remove(e, t, r) {
            if (e) {
              if (r !== null) {
                e[t].splice(r, 1)
              } else {
                delete e[t]
              }
            }
          }
        }
        class SyncWalker extends WalkerBase {
          constructor(e, t) {
            super()
            this.enter = e
            this.leave = t
          }
          visit(e, t, r, s) {
            if (e) {
              if (this.enter) {
                const a = this.should_skip
                const o = this.should_remove
                const u = this.replacement
                this.should_skip = false
                this.should_remove = false
                this.replacement = null
                this.enter.call(this.context, e, t, r, s)
                if (this.replacement) {
                  e = this.replacement
                  this.replace(t, r, s, e)
                }
                if (this.should_remove) {
                  this.remove(t, r, s)
                }
                const c = this.should_skip
                const f = this.should_remove
                this.should_skip = a
                this.should_remove = o
                this.replacement = u
                if (c) return e
                if (f) return null
              }
              for (const t in e) {
                const r = e[t]
                if (typeof r !== 'object') {
                  continue
                } else if (Array.isArray(r)) {
                  for (let s = 0; s < r.length; s += 1) {
                    if (r[s] !== null && typeof r[s].type === 'string') {
                      if (!this.visit(r[s], e, t, s)) {
                        s--
                      }
                    }
                  }
                } else if (r !== null && typeof r.type === 'string') {
                  this.visit(r, e, t, null)
                }
              }
              if (this.leave) {
                const a = this.replacement
                const o = this.should_remove
                this.replacement = null
                this.should_remove = false
                this.leave.call(this.context, e, t, r, s)
                if (this.replacement) {
                  e = this.replacement
                  this.replace(t, r, s, e)
                }
                if (this.should_remove) {
                  this.remove(t, r, s)
                }
                const u = this.should_remove
                this.replacement = a
                this.should_remove = o
                if (u) return null
              }
            }
            return e
          }
        }
        class AsyncWalker extends WalkerBase {
          constructor(e, t) {
            super()
            this.enter = e
            this.leave = t
          }
          async visit(e, t, r, s) {
            if (e) {
              if (this.enter) {
                const a = this.should_skip
                const o = this.should_remove
                const u = this.replacement
                this.should_skip = false
                this.should_remove = false
                this.replacement = null
                await this.enter.call(this.context, e, t, r, s)
                if (this.replacement) {
                  e = this.replacement
                  this.replace(t, r, s, e)
                }
                if (this.should_remove) {
                  this.remove(t, r, s)
                }
                const c = this.should_skip
                const f = this.should_remove
                this.should_skip = a
                this.should_remove = o
                this.replacement = u
                if (c) return e
                if (f) return null
              }
              for (const t in e) {
                const r = e[t]
                if (typeof r !== 'object') {
                  continue
                } else if (Array.isArray(r)) {
                  for (let s = 0; s < r.length; s += 1) {
                    if (r[s] !== null && typeof r[s].type === 'string') {
                      if (!(await this.visit(r[s], e, t, s))) {
                        s--
                      }
                    }
                  }
                } else if (r !== null && typeof r.type === 'string') {
                  await this.visit(r, e, t, null)
                }
              }
              if (this.leave) {
                const a = this.replacement
                const o = this.should_remove
                this.replacement = null
                this.should_remove = false
                await this.leave.call(this.context, e, t, r, s)
                if (this.replacement) {
                  e = this.replacement
                  this.replace(t, r, s, e)
                }
                if (this.should_remove) {
                  this.remove(t, r, s)
                }
                const u = this.should_remove
                this.replacement = a
                this.should_remove = o
                if (u) return null
              }
            }
            return e
          }
        }
        function walk(e, { enter: t, leave: r }) {
          const s = new SyncWalker(t, r)
          return s.visit(e, null)
        }
        async function asyncWalk(e, { enter: t, leave: r }) {
          const s = new AsyncWalker(t, r)
          return await s.visit(e, null)
        }
        e.asyncWalk = asyncWalk
        e.walk = walk
        Object.defineProperty(e, '__esModule', { value: true })
      })
    },
    9448: (e) => {
      'use strict'
      e.exports = JSON.parse(
        '{"0.1.14":{"node_abi":null,"v8":"1.3"},"0.1.15":{"node_abi":null,"v8":"1.3"},"0.1.16":{"node_abi":null,"v8":"1.3"},"0.1.17":{"node_abi":null,"v8":"1.3"},"0.1.18":{"node_abi":null,"v8":"1.3"},"0.1.19":{"node_abi":null,"v8":"2.0"},"0.1.20":{"node_abi":null,"v8":"2.0"},"0.1.21":{"node_abi":null,"v8":"2.0"},"0.1.22":{"node_abi":null,"v8":"2.0"},"0.1.23":{"node_abi":null,"v8":"2.0"},"0.1.24":{"node_abi":null,"v8":"2.0"},"0.1.25":{"node_abi":null,"v8":"2.0"},"0.1.26":{"node_abi":null,"v8":"2.0"},"0.1.27":{"node_abi":null,"v8":"2.1"},"0.1.28":{"node_abi":null,"v8":"2.1"},"0.1.29":{"node_abi":null,"v8":"2.1"},"0.1.30":{"node_abi":null,"v8":"2.1"},"0.1.31":{"node_abi":null,"v8":"2.1"},"0.1.32":{"node_abi":null,"v8":"2.1"},"0.1.33":{"node_abi":null,"v8":"2.1"},"0.1.90":{"node_abi":null,"v8":"2.2"},"0.1.91":{"node_abi":null,"v8":"2.2"},"0.1.92":{"node_abi":null,"v8":"2.2"},"0.1.93":{"node_abi":null,"v8":"2.2"},"0.1.94":{"node_abi":null,"v8":"2.2"},"0.1.95":{"node_abi":null,"v8":"2.2"},"0.1.96":{"node_abi":null,"v8":"2.2"},"0.1.97":{"node_abi":null,"v8":"2.2"},"0.1.98":{"node_abi":null,"v8":"2.2"},"0.1.99":{"node_abi":null,"v8":"2.2"},"0.1.100":{"node_abi":null,"v8":"2.2"},"0.1.101":{"node_abi":null,"v8":"2.3"},"0.1.102":{"node_abi":null,"v8":"2.3"},"0.1.103":{"node_abi":null,"v8":"2.3"},"0.1.104":{"node_abi":null,"v8":"2.3"},"0.2.0":{"node_abi":1,"v8":"2.3"},"0.2.1":{"node_abi":1,"v8":"2.3"},"0.2.2":{"node_abi":1,"v8":"2.3"},"0.2.3":{"node_abi":1,"v8":"2.3"},"0.2.4":{"node_abi":1,"v8":"2.3"},"0.2.5":{"node_abi":1,"v8":"2.3"},"0.2.6":{"node_abi":1,"v8":"2.3"},"0.3.0":{"node_abi":1,"v8":"2.5"},"0.3.1":{"node_abi":1,"v8":"2.5"},"0.3.2":{"node_abi":1,"v8":"3.0"},"0.3.3":{"node_abi":1,"v8":"3.0"},"0.3.4":{"node_abi":1,"v8":"3.0"},"0.3.5":{"node_abi":1,"v8":"3.0"},"0.3.6":{"node_abi":1,"v8":"3.0"},"0.3.7":{"node_abi":1,"v8":"3.0"},"0.3.8":{"node_abi":1,"v8":"3.1"},"0.4.0":{"node_abi":1,"v8":"3.1"},"0.4.1":{"node_abi":1,"v8":"3.1"},"0.4.2":{"node_abi":1,"v8":"3.1"},"0.4.3":{"node_abi":1,"v8":"3.1"},"0.4.4":{"node_abi":1,"v8":"3.1"},"0.4.5":{"node_abi":1,"v8":"3.1"},"0.4.6":{"node_abi":1,"v8":"3.1"},"0.4.7":{"node_abi":1,"v8":"3.1"},"0.4.8":{"node_abi":1,"v8":"3.1"},"0.4.9":{"node_abi":1,"v8":"3.1"},"0.4.10":{"node_abi":1,"v8":"3.1"},"0.4.11":{"node_abi":1,"v8":"3.1"},"0.4.12":{"node_abi":1,"v8":"3.1"},"0.5.0":{"node_abi":1,"v8":"3.1"},"0.5.1":{"node_abi":1,"v8":"3.4"},"0.5.2":{"node_abi":1,"v8":"3.4"},"0.5.3":{"node_abi":1,"v8":"3.4"},"0.5.4":{"node_abi":1,"v8":"3.5"},"0.5.5":{"node_abi":1,"v8":"3.5"},"0.5.6":{"node_abi":1,"v8":"3.6"},"0.5.7":{"node_abi":1,"v8":"3.6"},"0.5.8":{"node_abi":1,"v8":"3.6"},"0.5.9":{"node_abi":1,"v8":"3.6"},"0.5.10":{"node_abi":1,"v8":"3.7"},"0.6.0":{"node_abi":1,"v8":"3.6"},"0.6.1":{"node_abi":1,"v8":"3.6"},"0.6.2":{"node_abi":1,"v8":"3.6"},"0.6.3":{"node_abi":1,"v8":"3.6"},"0.6.4":{"node_abi":1,"v8":"3.6"},"0.6.5":{"node_abi":1,"v8":"3.6"},"0.6.6":{"node_abi":1,"v8":"3.6"},"0.6.7":{"node_abi":1,"v8":"3.6"},"0.6.8":{"node_abi":1,"v8":"3.6"},"0.6.9":{"node_abi":1,"v8":"3.6"},"0.6.10":{"node_abi":1,"v8":"3.6"},"0.6.11":{"node_abi":1,"v8":"3.6"},"0.6.12":{"node_abi":1,"v8":"3.6"},"0.6.13":{"node_abi":1,"v8":"3.6"},"0.6.14":{"node_abi":1,"v8":"3.6"},"0.6.15":{"node_abi":1,"v8":"3.6"},"0.6.16":{"node_abi":1,"v8":"3.6"},"0.6.17":{"node_abi":1,"v8":"3.6"},"0.6.18":{"node_abi":1,"v8":"3.6"},"0.6.19":{"node_abi":1,"v8":"3.6"},"0.6.20":{"node_abi":1,"v8":"3.6"},"0.6.21":{"node_abi":1,"v8":"3.6"},"0.7.0":{"node_abi":1,"v8":"3.8"},"0.7.1":{"node_abi":1,"v8":"3.8"},"0.7.2":{"node_abi":1,"v8":"3.8"},"0.7.3":{"node_abi":1,"v8":"3.9"},"0.7.4":{"node_abi":1,"v8":"3.9"},"0.7.5":{"node_abi":1,"v8":"3.9"},"0.7.6":{"node_abi":1,"v8":"3.9"},"0.7.7":{"node_abi":1,"v8":"3.9"},"0.7.8":{"node_abi":1,"v8":"3.9"},"0.7.9":{"node_abi":1,"v8":"3.11"},"0.7.10":{"node_abi":1,"v8":"3.9"},"0.7.11":{"node_abi":1,"v8":"3.11"},"0.7.12":{"node_abi":1,"v8":"3.11"},"0.8.0":{"node_abi":1,"v8":"3.11"},"0.8.1":{"node_abi":1,"v8":"3.11"},"0.8.2":{"node_abi":1,"v8":"3.11"},"0.8.3":{"node_abi":1,"v8":"3.11"},"0.8.4":{"node_abi":1,"v8":"3.11"},"0.8.5":{"node_abi":1,"v8":"3.11"},"0.8.6":{"node_abi":1,"v8":"3.11"},"0.8.7":{"node_abi":1,"v8":"3.11"},"0.8.8":{"node_abi":1,"v8":"3.11"},"0.8.9":{"node_abi":1,"v8":"3.11"},"0.8.10":{"node_abi":1,"v8":"3.11"},"0.8.11":{"node_abi":1,"v8":"3.11"},"0.8.12":{"node_abi":1,"v8":"3.11"},"0.8.13":{"node_abi":1,"v8":"3.11"},"0.8.14":{"node_abi":1,"v8":"3.11"},"0.8.15":{"node_abi":1,"v8":"3.11"},"0.8.16":{"node_abi":1,"v8":"3.11"},"0.8.17":{"node_abi":1,"v8":"3.11"},"0.8.18":{"node_abi":1,"v8":"3.11"},"0.8.19":{"node_abi":1,"v8":"3.11"},"0.8.20":{"node_abi":1,"v8":"3.11"},"0.8.21":{"node_abi":1,"v8":"3.11"},"0.8.22":{"node_abi":1,"v8":"3.11"},"0.8.23":{"node_abi":1,"v8":"3.11"},"0.8.24":{"node_abi":1,"v8":"3.11"},"0.8.25":{"node_abi":1,"v8":"3.11"},"0.8.26":{"node_abi":1,"v8":"3.11"},"0.8.27":{"node_abi":1,"v8":"3.11"},"0.8.28":{"node_abi":1,"v8":"3.11"},"0.9.0":{"node_abi":1,"v8":"3.11"},"0.9.1":{"node_abi":10,"v8":"3.11"},"0.9.2":{"node_abi":10,"v8":"3.11"},"0.9.3":{"node_abi":10,"v8":"3.13"},"0.9.4":{"node_abi":10,"v8":"3.13"},"0.9.5":{"node_abi":10,"v8":"3.13"},"0.9.6":{"node_abi":10,"v8":"3.15"},"0.9.7":{"node_abi":10,"v8":"3.15"},"0.9.8":{"node_abi":10,"v8":"3.15"},"0.9.9":{"node_abi":11,"v8":"3.15"},"0.9.10":{"node_abi":11,"v8":"3.15"},"0.9.11":{"node_abi":11,"v8":"3.14"},"0.9.12":{"node_abi":11,"v8":"3.14"},"0.10.0":{"node_abi":11,"v8":"3.14"},"0.10.1":{"node_abi":11,"v8":"3.14"},"0.10.2":{"node_abi":11,"v8":"3.14"},"0.10.3":{"node_abi":11,"v8":"3.14"},"0.10.4":{"node_abi":11,"v8":"3.14"},"0.10.5":{"node_abi":11,"v8":"3.14"},"0.10.6":{"node_abi":11,"v8":"3.14"},"0.10.7":{"node_abi":11,"v8":"3.14"},"0.10.8":{"node_abi":11,"v8":"3.14"},"0.10.9":{"node_abi":11,"v8":"3.14"},"0.10.10":{"node_abi":11,"v8":"3.14"},"0.10.11":{"node_abi":11,"v8":"3.14"},"0.10.12":{"node_abi":11,"v8":"3.14"},"0.10.13":{"node_abi":11,"v8":"3.14"},"0.10.14":{"node_abi":11,"v8":"3.14"},"0.10.15":{"node_abi":11,"v8":"3.14"},"0.10.16":{"node_abi":11,"v8":"3.14"},"0.10.17":{"node_abi":11,"v8":"3.14"},"0.10.18":{"node_abi":11,"v8":"3.14"},"0.10.19":{"node_abi":11,"v8":"3.14"},"0.10.20":{"node_abi":11,"v8":"3.14"},"0.10.21":{"node_abi":11,"v8":"3.14"},"0.10.22":{"node_abi":11,"v8":"3.14"},"0.10.23":{"node_abi":11,"v8":"3.14"},"0.10.24":{"node_abi":11,"v8":"3.14"},"0.10.25":{"node_abi":11,"v8":"3.14"},"0.10.26":{"node_abi":11,"v8":"3.14"},"0.10.27":{"node_abi":11,"v8":"3.14"},"0.10.28":{"node_abi":11,"v8":"3.14"},"0.10.29":{"node_abi":11,"v8":"3.14"},"0.10.30":{"node_abi":11,"v8":"3.14"},"0.10.31":{"node_abi":11,"v8":"3.14"},"0.10.32":{"node_abi":11,"v8":"3.14"},"0.10.33":{"node_abi":11,"v8":"3.14"},"0.10.34":{"node_abi":11,"v8":"3.14"},"0.10.35":{"node_abi":11,"v8":"3.14"},"0.10.36":{"node_abi":11,"v8":"3.14"},"0.10.37":{"node_abi":11,"v8":"3.14"},"0.10.38":{"node_abi":11,"v8":"3.14"},"0.10.39":{"node_abi":11,"v8":"3.14"},"0.10.40":{"node_abi":11,"v8":"3.14"},"0.10.41":{"node_abi":11,"v8":"3.14"},"0.10.42":{"node_abi":11,"v8":"3.14"},"0.10.43":{"node_abi":11,"v8":"3.14"},"0.10.44":{"node_abi":11,"v8":"3.14"},"0.10.45":{"node_abi":11,"v8":"3.14"},"0.10.46":{"node_abi":11,"v8":"3.14"},"0.10.47":{"node_abi":11,"v8":"3.14"},"0.10.48":{"node_abi":11,"v8":"3.14"},"0.11.0":{"node_abi":12,"v8":"3.17"},"0.11.1":{"node_abi":12,"v8":"3.18"},"0.11.2":{"node_abi":12,"v8":"3.19"},"0.11.3":{"node_abi":12,"v8":"3.19"},"0.11.4":{"node_abi":12,"v8":"3.20"},"0.11.5":{"node_abi":12,"v8":"3.20"},"0.11.6":{"node_abi":12,"v8":"3.20"},"0.11.7":{"node_abi":12,"v8":"3.20"},"0.11.8":{"node_abi":13,"v8":"3.21"},"0.11.9":{"node_abi":13,"v8":"3.22"},"0.11.10":{"node_abi":13,"v8":"3.22"},"0.11.11":{"node_abi":14,"v8":"3.22"},"0.11.12":{"node_abi":14,"v8":"3.22"},"0.11.13":{"node_abi":14,"v8":"3.25"},"0.11.14":{"node_abi":14,"v8":"3.26"},"0.11.15":{"node_abi":14,"v8":"3.28"},"0.11.16":{"node_abi":14,"v8":"3.28"},"0.12.0":{"node_abi":14,"v8":"3.28"},"0.12.1":{"node_abi":14,"v8":"3.28"},"0.12.2":{"node_abi":14,"v8":"3.28"},"0.12.3":{"node_abi":14,"v8":"3.28"},"0.12.4":{"node_abi":14,"v8":"3.28"},"0.12.5":{"node_abi":14,"v8":"3.28"},"0.12.6":{"node_abi":14,"v8":"3.28"},"0.12.7":{"node_abi":14,"v8":"3.28"},"0.12.8":{"node_abi":14,"v8":"3.28"},"0.12.9":{"node_abi":14,"v8":"3.28"},"0.12.10":{"node_abi":14,"v8":"3.28"},"0.12.11":{"node_abi":14,"v8":"3.28"},"0.12.12":{"node_abi":14,"v8":"3.28"},"0.12.13":{"node_abi":14,"v8":"3.28"},"0.12.14":{"node_abi":14,"v8":"3.28"},"0.12.15":{"node_abi":14,"v8":"3.28"},"0.12.16":{"node_abi":14,"v8":"3.28"},"0.12.17":{"node_abi":14,"v8":"3.28"},"0.12.18":{"node_abi":14,"v8":"3.28"},"1.0.0":{"node_abi":42,"v8":"3.31"},"1.0.1":{"node_abi":42,"v8":"3.31"},"1.0.2":{"node_abi":42,"v8":"3.31"},"1.0.3":{"node_abi":42,"v8":"4.1"},"1.0.4":{"node_abi":42,"v8":"4.1"},"1.1.0":{"node_abi":43,"v8":"4.1"},"1.2.0":{"node_abi":43,"v8":"4.1"},"1.3.0":{"node_abi":43,"v8":"4.1"},"1.4.1":{"node_abi":43,"v8":"4.1"},"1.4.2":{"node_abi":43,"v8":"4.1"},"1.4.3":{"node_abi":43,"v8":"4.1"},"1.5.0":{"node_abi":43,"v8":"4.1"},"1.5.1":{"node_abi":43,"v8":"4.1"},"1.6.0":{"node_abi":43,"v8":"4.1"},"1.6.1":{"node_abi":43,"v8":"4.1"},"1.6.2":{"node_abi":43,"v8":"4.1"},"1.6.3":{"node_abi":43,"v8":"4.1"},"1.6.4":{"node_abi":43,"v8":"4.1"},"1.7.1":{"node_abi":43,"v8":"4.1"},"1.8.1":{"node_abi":43,"v8":"4.1"},"1.8.2":{"node_abi":43,"v8":"4.1"},"1.8.3":{"node_abi":43,"v8":"4.1"},"1.8.4":{"node_abi":43,"v8":"4.1"},"2.0.0":{"node_abi":44,"v8":"4.2"},"2.0.1":{"node_abi":44,"v8":"4.2"},"2.0.2":{"node_abi":44,"v8":"4.2"},"2.1.0":{"node_abi":44,"v8":"4.2"},"2.2.0":{"node_abi":44,"v8":"4.2"},"2.2.1":{"node_abi":44,"v8":"4.2"},"2.3.0":{"node_abi":44,"v8":"4.2"},"2.3.1":{"node_abi":44,"v8":"4.2"},"2.3.2":{"node_abi":44,"v8":"4.2"},"2.3.3":{"node_abi":44,"v8":"4.2"},"2.3.4":{"node_abi":44,"v8":"4.2"},"2.4.0":{"node_abi":44,"v8":"4.2"},"2.5.0":{"node_abi":44,"v8":"4.2"},"3.0.0":{"node_abi":45,"v8":"4.4"},"3.1.0":{"node_abi":45,"v8":"4.4"},"3.2.0":{"node_abi":45,"v8":"4.4"},"3.3.0":{"node_abi":45,"v8":"4.4"},"3.3.1":{"node_abi":45,"v8":"4.4"},"4.0.0":{"node_abi":46,"v8":"4.5"},"4.1.0":{"node_abi":46,"v8":"4.5"},"4.1.1":{"node_abi":46,"v8":"4.5"},"4.1.2":{"node_abi":46,"v8":"4.5"},"4.2.0":{"node_abi":46,"v8":"4.5"},"4.2.1":{"node_abi":46,"v8":"4.5"},"4.2.2":{"node_abi":46,"v8":"4.5"},"4.2.3":{"node_abi":46,"v8":"4.5"},"4.2.4":{"node_abi":46,"v8":"4.5"},"4.2.5":{"node_abi":46,"v8":"4.5"},"4.2.6":{"node_abi":46,"v8":"4.5"},"4.3.0":{"node_abi":46,"v8":"4.5"},"4.3.1":{"node_abi":46,"v8":"4.5"},"4.3.2":{"node_abi":46,"v8":"4.5"},"4.4.0":{"node_abi":46,"v8":"4.5"},"4.4.1":{"node_abi":46,"v8":"4.5"},"4.4.2":{"node_abi":46,"v8":"4.5"},"4.4.3":{"node_abi":46,"v8":"4.5"},"4.4.4":{"node_abi":46,"v8":"4.5"},"4.4.5":{"node_abi":46,"v8":"4.5"},"4.4.6":{"node_abi":46,"v8":"4.5"},"4.4.7":{"node_abi":46,"v8":"4.5"},"4.5.0":{"node_abi":46,"v8":"4.5"},"4.6.0":{"node_abi":46,"v8":"4.5"},"4.6.1":{"node_abi":46,"v8":"4.5"},"4.6.2":{"node_abi":46,"v8":"4.5"},"4.7.0":{"node_abi":46,"v8":"4.5"},"4.7.1":{"node_abi":46,"v8":"4.5"},"4.7.2":{"node_abi":46,"v8":"4.5"},"4.7.3":{"node_abi":46,"v8":"4.5"},"4.8.0":{"node_abi":46,"v8":"4.5"},"4.8.1":{"node_abi":46,"v8":"4.5"},"4.8.2":{"node_abi":46,"v8":"4.5"},"4.8.3":{"node_abi":46,"v8":"4.5"},"4.8.4":{"node_abi":46,"v8":"4.5"},"4.8.5":{"node_abi":46,"v8":"4.5"},"4.8.6":{"node_abi":46,"v8":"4.5"},"4.8.7":{"node_abi":46,"v8":"4.5"},"4.9.0":{"node_abi":46,"v8":"4.5"},"4.9.1":{"node_abi":46,"v8":"4.5"},"5.0.0":{"node_abi":47,"v8":"4.6"},"5.1.0":{"node_abi":47,"v8":"4.6"},"5.1.1":{"node_abi":47,"v8":"4.6"},"5.2.0":{"node_abi":47,"v8":"4.6"},"5.3.0":{"node_abi":47,"v8":"4.6"},"5.4.0":{"node_abi":47,"v8":"4.6"},"5.4.1":{"node_abi":47,"v8":"4.6"},"5.5.0":{"node_abi":47,"v8":"4.6"},"5.6.0":{"node_abi":47,"v8":"4.6"},"5.7.0":{"node_abi":47,"v8":"4.6"},"5.7.1":{"node_abi":47,"v8":"4.6"},"5.8.0":{"node_abi":47,"v8":"4.6"},"5.9.0":{"node_abi":47,"v8":"4.6"},"5.9.1":{"node_abi":47,"v8":"4.6"},"5.10.0":{"node_abi":47,"v8":"4.6"},"5.10.1":{"node_abi":47,"v8":"4.6"},"5.11.0":{"node_abi":47,"v8":"4.6"},"5.11.1":{"node_abi":47,"v8":"4.6"},"5.12.0":{"node_abi":47,"v8":"4.6"},"6.0.0":{"node_abi":48,"v8":"5.0"},"6.1.0":{"node_abi":48,"v8":"5.0"},"6.2.0":{"node_abi":48,"v8":"5.0"},"6.2.1":{"node_abi":48,"v8":"5.0"},"6.2.2":{"node_abi":48,"v8":"5.0"},"6.3.0":{"node_abi":48,"v8":"5.0"},"6.3.1":{"node_abi":48,"v8":"5.0"},"6.4.0":{"node_abi":48,"v8":"5.0"},"6.5.0":{"node_abi":48,"v8":"5.1"},"6.6.0":{"node_abi":48,"v8":"5.1"},"6.7.0":{"node_abi":48,"v8":"5.1"},"6.8.0":{"node_abi":48,"v8":"5.1"},"6.8.1":{"node_abi":48,"v8":"5.1"},"6.9.0":{"node_abi":48,"v8":"5.1"},"6.9.1":{"node_abi":48,"v8":"5.1"},"6.9.2":{"node_abi":48,"v8":"5.1"},"6.9.3":{"node_abi":48,"v8":"5.1"},"6.9.4":{"node_abi":48,"v8":"5.1"},"6.9.5":{"node_abi":48,"v8":"5.1"},"6.10.0":{"node_abi":48,"v8":"5.1"},"6.10.1":{"node_abi":48,"v8":"5.1"},"6.10.2":{"node_abi":48,"v8":"5.1"},"6.10.3":{"node_abi":48,"v8":"5.1"},"6.11.0":{"node_abi":48,"v8":"5.1"},"6.11.1":{"node_abi":48,"v8":"5.1"},"6.11.2":{"node_abi":48,"v8":"5.1"},"6.11.3":{"node_abi":48,"v8":"5.1"},"6.11.4":{"node_abi":48,"v8":"5.1"},"6.11.5":{"node_abi":48,"v8":"5.1"},"6.12.0":{"node_abi":48,"v8":"5.1"},"6.12.1":{"node_abi":48,"v8":"5.1"},"6.12.2":{"node_abi":48,"v8":"5.1"},"6.12.3":{"node_abi":48,"v8":"5.1"},"6.13.0":{"node_abi":48,"v8":"5.1"},"6.13.1":{"node_abi":48,"v8":"5.1"},"6.14.0":{"node_abi":48,"v8":"5.1"},"6.14.1":{"node_abi":48,"v8":"5.1"},"6.14.2":{"node_abi":48,"v8":"5.1"},"6.14.3":{"node_abi":48,"v8":"5.1"},"6.14.4":{"node_abi":48,"v8":"5.1"},"6.15.0":{"node_abi":48,"v8":"5.1"},"6.15.1":{"node_abi":48,"v8":"5.1"},"6.16.0":{"node_abi":48,"v8":"5.1"},"6.17.0":{"node_abi":48,"v8":"5.1"},"6.17.1":{"node_abi":48,"v8":"5.1"},"7.0.0":{"node_abi":51,"v8":"5.4"},"7.1.0":{"node_abi":51,"v8":"5.4"},"7.2.0":{"node_abi":51,"v8":"5.4"},"7.2.1":{"node_abi":51,"v8":"5.4"},"7.3.0":{"node_abi":51,"v8":"5.4"},"7.4.0":{"node_abi":51,"v8":"5.4"},"7.5.0":{"node_abi":51,"v8":"5.4"},"7.6.0":{"node_abi":51,"v8":"5.5"},"7.7.0":{"node_abi":51,"v8":"5.5"},"7.7.1":{"node_abi":51,"v8":"5.5"},"7.7.2":{"node_abi":51,"v8":"5.5"},"7.7.3":{"node_abi":51,"v8":"5.5"},"7.7.4":{"node_abi":51,"v8":"5.5"},"7.8.0":{"node_abi":51,"v8":"5.5"},"7.9.0":{"node_abi":51,"v8":"5.5"},"7.10.0":{"node_abi":51,"v8":"5.5"},"7.10.1":{"node_abi":51,"v8":"5.5"},"8.0.0":{"node_abi":57,"v8":"5.8"},"8.1.0":{"node_abi":57,"v8":"5.8"},"8.1.1":{"node_abi":57,"v8":"5.8"},"8.1.2":{"node_abi":57,"v8":"5.8"},"8.1.3":{"node_abi":57,"v8":"5.8"},"8.1.4":{"node_abi":57,"v8":"5.8"},"8.2.0":{"node_abi":57,"v8":"5.8"},"8.2.1":{"node_abi":57,"v8":"5.8"},"8.3.0":{"node_abi":57,"v8":"6.0"},"8.4.0":{"node_abi":57,"v8":"6.0"},"8.5.0":{"node_abi":57,"v8":"6.0"},"8.6.0":{"node_abi":57,"v8":"6.0"},"8.7.0":{"node_abi":57,"v8":"6.1"},"8.8.0":{"node_abi":57,"v8":"6.1"},"8.8.1":{"node_abi":57,"v8":"6.1"},"8.9.0":{"node_abi":57,"v8":"6.1"},"8.9.1":{"node_abi":57,"v8":"6.1"},"8.9.2":{"node_abi":57,"v8":"6.1"},"8.9.3":{"node_abi":57,"v8":"6.1"},"8.9.4":{"node_abi":57,"v8":"6.1"},"8.10.0":{"node_abi":57,"v8":"6.2"},"8.11.0":{"node_abi":57,"v8":"6.2"},"8.11.1":{"node_abi":57,"v8":"6.2"},"8.11.2":{"node_abi":57,"v8":"6.2"},"8.11.3":{"node_abi":57,"v8":"6.2"},"8.11.4":{"node_abi":57,"v8":"6.2"},"8.12.0":{"node_abi":57,"v8":"6.2"},"8.13.0":{"node_abi":57,"v8":"6.2"},"8.14.0":{"node_abi":57,"v8":"6.2"},"8.14.1":{"node_abi":57,"v8":"6.2"},"8.15.0":{"node_abi":57,"v8":"6.2"},"8.15.1":{"node_abi":57,"v8":"6.2"},"8.16.0":{"node_abi":57,"v8":"6.2"},"8.16.1":{"node_abi":57,"v8":"6.2"},"8.16.2":{"node_abi":57,"v8":"6.2"},"8.17.0":{"node_abi":57,"v8":"6.2"},"9.0.0":{"node_abi":59,"v8":"6.2"},"9.1.0":{"node_abi":59,"v8":"6.2"},"9.2.0":{"node_abi":59,"v8":"6.2"},"9.2.1":{"node_abi":59,"v8":"6.2"},"9.3.0":{"node_abi":59,"v8":"6.2"},"9.4.0":{"node_abi":59,"v8":"6.2"},"9.5.0":{"node_abi":59,"v8":"6.2"},"9.6.0":{"node_abi":59,"v8":"6.2"},"9.6.1":{"node_abi":59,"v8":"6.2"},"9.7.0":{"node_abi":59,"v8":"6.2"},"9.7.1":{"node_abi":59,"v8":"6.2"},"9.8.0":{"node_abi":59,"v8":"6.2"},"9.9.0":{"node_abi":59,"v8":"6.2"},"9.10.0":{"node_abi":59,"v8":"6.2"},"9.10.1":{"node_abi":59,"v8":"6.2"},"9.11.0":{"node_abi":59,"v8":"6.2"},"9.11.1":{"node_abi":59,"v8":"6.2"},"9.11.2":{"node_abi":59,"v8":"6.2"},"10.0.0":{"node_abi":64,"v8":"6.6"},"10.1.0":{"node_abi":64,"v8":"6.6"},"10.2.0":{"node_abi":64,"v8":"6.6"},"10.2.1":{"node_abi":64,"v8":"6.6"},"10.3.0":{"node_abi":64,"v8":"6.6"},"10.4.0":{"node_abi":64,"v8":"6.7"},"10.4.1":{"node_abi":64,"v8":"6.7"},"10.5.0":{"node_abi":64,"v8":"6.7"},"10.6.0":{"node_abi":64,"v8":"6.7"},"10.7.0":{"node_abi":64,"v8":"6.7"},"10.8.0":{"node_abi":64,"v8":"6.7"},"10.9.0":{"node_abi":64,"v8":"6.8"},"10.10.0":{"node_abi":64,"v8":"6.8"},"10.11.0":{"node_abi":64,"v8":"6.8"},"10.12.0":{"node_abi":64,"v8":"6.8"},"10.13.0":{"node_abi":64,"v8":"6.8"},"10.14.0":{"node_abi":64,"v8":"6.8"},"10.14.1":{"node_abi":64,"v8":"6.8"},"10.14.2":{"node_abi":64,"v8":"6.8"},"10.15.0":{"node_abi":64,"v8":"6.8"},"10.15.1":{"node_abi":64,"v8":"6.8"},"10.15.2":{"node_abi":64,"v8":"6.8"},"10.15.3":{"node_abi":64,"v8":"6.8"},"10.16.0":{"node_abi":64,"v8":"6.8"},"10.16.1":{"node_abi":64,"v8":"6.8"},"10.16.2":{"node_abi":64,"v8":"6.8"},"10.16.3":{"node_abi":64,"v8":"6.8"},"10.17.0":{"node_abi":64,"v8":"6.8"},"10.18.0":{"node_abi":64,"v8":"6.8"},"10.18.1":{"node_abi":64,"v8":"6.8"},"10.19.0":{"node_abi":64,"v8":"6.8"},"10.20.0":{"node_abi":64,"v8":"6.8"},"10.20.1":{"node_abi":64,"v8":"6.8"},"10.21.0":{"node_abi":64,"v8":"6.8"},"10.22.0":{"node_abi":64,"v8":"6.8"},"10.22.1":{"node_abi":64,"v8":"6.8"},"10.23.0":{"node_abi":64,"v8":"6.8"},"10.23.1":{"node_abi":64,"v8":"6.8"},"10.23.2":{"node_abi":64,"v8":"6.8"},"10.23.3":{"node_abi":64,"v8":"6.8"},"10.24.0":{"node_abi":64,"v8":"6.8"},"10.24.1":{"node_abi":64,"v8":"6.8"},"11.0.0":{"node_abi":67,"v8":"7.0"},"11.1.0":{"node_abi":67,"v8":"7.0"},"11.2.0":{"node_abi":67,"v8":"7.0"},"11.3.0":{"node_abi":67,"v8":"7.0"},"11.4.0":{"node_abi":67,"v8":"7.0"},"11.5.0":{"node_abi":67,"v8":"7.0"},"11.6.0":{"node_abi":67,"v8":"7.0"},"11.7.0":{"node_abi":67,"v8":"7.0"},"11.8.0":{"node_abi":67,"v8":"7.0"},"11.9.0":{"node_abi":67,"v8":"7.0"},"11.10.0":{"node_abi":67,"v8":"7.0"},"11.10.1":{"node_abi":67,"v8":"7.0"},"11.11.0":{"node_abi":67,"v8":"7.0"},"11.12.0":{"node_abi":67,"v8":"7.0"},"11.13.0":{"node_abi":67,"v8":"7.0"},"11.14.0":{"node_abi":67,"v8":"7.0"},"11.15.0":{"node_abi":67,"v8":"7.0"},"12.0.0":{"node_abi":72,"v8":"7.4"},"12.1.0":{"node_abi":72,"v8":"7.4"},"12.2.0":{"node_abi":72,"v8":"7.4"},"12.3.0":{"node_abi":72,"v8":"7.4"},"12.3.1":{"node_abi":72,"v8":"7.4"},"12.4.0":{"node_abi":72,"v8":"7.4"},"12.5.0":{"node_abi":72,"v8":"7.5"},"12.6.0":{"node_abi":72,"v8":"7.5"},"12.7.0":{"node_abi":72,"v8":"7.5"},"12.8.0":{"node_abi":72,"v8":"7.5"},"12.8.1":{"node_abi":72,"v8":"7.5"},"12.9.0":{"node_abi":72,"v8":"7.6"},"12.9.1":{"node_abi":72,"v8":"7.6"},"12.10.0":{"node_abi":72,"v8":"7.6"},"12.11.0":{"node_abi":72,"v8":"7.7"},"12.11.1":{"node_abi":72,"v8":"7.7"},"12.12.0":{"node_abi":72,"v8":"7.7"},"12.13.0":{"node_abi":72,"v8":"7.7"},"12.13.1":{"node_abi":72,"v8":"7.7"},"12.14.0":{"node_abi":72,"v8":"7.7"},"12.14.1":{"node_abi":72,"v8":"7.7"},"12.15.0":{"node_abi":72,"v8":"7.7"},"12.16.0":{"node_abi":72,"v8":"7.8"},"12.16.1":{"node_abi":72,"v8":"7.8"},"12.16.2":{"node_abi":72,"v8":"7.8"},"12.16.3":{"node_abi":72,"v8":"7.8"},"12.17.0":{"node_abi":72,"v8":"7.8"},"12.18.0":{"node_abi":72,"v8":"7.8"},"12.18.1":{"node_abi":72,"v8":"7.8"},"12.18.2":{"node_abi":72,"v8":"7.8"},"12.18.3":{"node_abi":72,"v8":"7.8"},"12.18.4":{"node_abi":72,"v8":"7.8"},"12.19.0":{"node_abi":72,"v8":"7.8"},"12.19.1":{"node_abi":72,"v8":"7.8"},"12.20.0":{"node_abi":72,"v8":"7.8"},"12.20.1":{"node_abi":72,"v8":"7.8"},"12.20.2":{"node_abi":72,"v8":"7.8"},"12.21.0":{"node_abi":72,"v8":"7.8"},"12.22.0":{"node_abi":72,"v8":"7.8"},"12.22.1":{"node_abi":72,"v8":"7.8"},"13.0.0":{"node_abi":79,"v8":"7.8"},"13.0.1":{"node_abi":79,"v8":"7.8"},"13.1.0":{"node_abi":79,"v8":"7.8"},"13.2.0":{"node_abi":79,"v8":"7.9"},"13.3.0":{"node_abi":79,"v8":"7.9"},"13.4.0":{"node_abi":79,"v8":"7.9"},"13.5.0":{"node_abi":79,"v8":"7.9"},"13.6.0":{"node_abi":79,"v8":"7.9"},"13.7.0":{"node_abi":79,"v8":"7.9"},"13.8.0":{"node_abi":79,"v8":"7.9"},"13.9.0":{"node_abi":79,"v8":"7.9"},"13.10.0":{"node_abi":79,"v8":"7.9"},"13.10.1":{"node_abi":79,"v8":"7.9"},"13.11.0":{"node_abi":79,"v8":"7.9"},"13.12.0":{"node_abi":79,"v8":"7.9"},"13.13.0":{"node_abi":79,"v8":"7.9"},"13.14.0":{"node_abi":79,"v8":"7.9"},"14.0.0":{"node_abi":83,"v8":"8.1"},"14.1.0":{"node_abi":83,"v8":"8.1"},"14.2.0":{"node_abi":83,"v8":"8.1"},"14.3.0":{"node_abi":83,"v8":"8.1"},"14.4.0":{"node_abi":83,"v8":"8.1"},"14.5.0":{"node_abi":83,"v8":"8.3"},"14.6.0":{"node_abi":83,"v8":"8.4"},"14.7.0":{"node_abi":83,"v8":"8.4"},"14.8.0":{"node_abi":83,"v8":"8.4"},"14.9.0":{"node_abi":83,"v8":"8.4"},"14.10.0":{"node_abi":83,"v8":"8.4"},"14.10.1":{"node_abi":83,"v8":"8.4"},"14.11.0":{"node_abi":83,"v8":"8.4"},"14.12.0":{"node_abi":83,"v8":"8.4"},"14.13.0":{"node_abi":83,"v8":"8.4"},"14.13.1":{"node_abi":83,"v8":"8.4"},"14.14.0":{"node_abi":83,"v8":"8.4"},"14.15.0":{"node_abi":83,"v8":"8.4"},"14.15.1":{"node_abi":83,"v8":"8.4"},"14.15.2":{"node_abi":83,"v8":"8.4"},"14.15.3":{"node_abi":83,"v8":"8.4"},"14.15.4":{"node_abi":83,"v8":"8.4"},"14.15.5":{"node_abi":83,"v8":"8.4"},"14.16.0":{"node_abi":83,"v8":"8.4"},"14.16.1":{"node_abi":83,"v8":"8.4"},"15.0.0":{"node_abi":88,"v8":"8.6"},"15.0.1":{"node_abi":88,"v8":"8.6"},"15.1.0":{"node_abi":88,"v8":"8.6"},"15.2.0":{"node_abi":88,"v8":"8.6"},"15.2.1":{"node_abi":88,"v8":"8.6"},"15.3.0":{"node_abi":88,"v8":"8.6"},"15.4.0":{"node_abi":88,"v8":"8.6"},"15.5.0":{"node_abi":88,"v8":"8.6"},"15.5.1":{"node_abi":88,"v8":"8.6"},"15.6.0":{"node_abi":88,"v8":"8.6"},"15.7.0":{"node_abi":88,"v8":"8.6"},"15.8.0":{"node_abi":88,"v8":"8.6"},"15.9.0":{"node_abi":88,"v8":"8.6"},"15.10.0":{"node_abi":88,"v8":"8.6"},"15.11.0":{"node_abi":88,"v8":"8.6"},"15.12.0":{"node_abi":88,"v8":"8.6"},"15.13.0":{"node_abi":88,"v8":"8.6"},"15.14.0":{"node_abi":88,"v8":"8.6"},"16.0.0":{"node_abi":93,"v8":"9.0"}}'
      )
    },
    7399: (e) => {
      'use strict'
      e.exports = JSON.parse(
        '{"name":"@mapbox/node-pre-gyp","description":"Node.js native addon binary install tool","version":"1.0.5","keywords":["native","addon","module","c","c++","bindings","binary"],"license":"BSD-3-Clause","author":"Dane Springmeyer <dane@mapbox.com>","repository":{"type":"git","url":"git://github.com/mapbox/node-pre-gyp.git"},"bin":"./bin/node-pre-gyp","main":"./lib/node-pre-gyp.js","dependencies":{"detect-libc":"^1.0.3","https-proxy-agent":"^5.0.0","make-dir":"^3.1.0","node-fetch":"^2.6.1","nopt":"^5.0.0","npmlog":"^4.1.2","rimraf":"^3.0.2","semver":"^7.3.4","tar":"^6.1.0"},"devDependencies":{"@mapbox/cloudfriend":"^4.6.0","@mapbox/eslint-config-mapbox":"^3.0.0","action-walk":"^2.2.0","aws-sdk":"^2.840.0","codecov":"^3.8.1","eslint":"^7.18.0","eslint-plugin-node":"^11.1.0","mock-aws-s3":"^4.0.1","nock":"^12.0.3","node-addon-api":"^3.1.0","nyc":"^15.1.0","tape":"^5.2.2","tar-fs":"^2.1.1"},"nyc":{"all":true,"skip-full":false,"exclude":["test/**"]},"scripts":{"coverage":"nyc --all --include index.js --include lib/ npm test","upload-coverage":"nyc report --reporter json && codecov --clear --flags=unit --file=./coverage/coverage-final.json","lint":"eslint bin/node-pre-gyp lib/*js lib/util/*js test/*js scripts/*js","fix":"npm run lint -- --fix","update-crosswalk":"node scripts/abi_crosswalk.js","test":"tape test/*test.js"}}'
      )
    },
  }
  var __webpack_module_cache__ = {}
  function __nccwpck_require__(e) {
    var t = __webpack_module_cache__[e]
    if (t !== undefined) {
      return t.exports
    }
    var r = (__webpack_module_cache__[e] = { exports: {} })
    var s = true
    try {
      __webpack_modules__[e].call(r.exports, r, r.exports, __nccwpck_require__)
      s = false
    } finally {
      if (s) delete __webpack_module_cache__[e]
    }
    return r.exports
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/'
  var __webpack_exports__ = __nccwpck_require__(4871)
  module.exports = __webpack_exports__
})()
