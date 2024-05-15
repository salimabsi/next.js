;(() => {
  var e = {
    858: (e) => {
      const createImports = (e, r, t = 'rule') =>
        Object.keys(e).map((s) => {
          const o = e[s]
          const a = Object.keys(o).map((e) =>
            r.decl({ prop: e, value: o[e], raws: { before: '\n  ' } })
          )
          const n = a.length > 0
          const c =
            t === 'rule'
              ? r.rule({
                  selector: `:import('${s}')`,
                  raws: { after: n ? '\n' : '' },
                })
              : r.atRule({
                  name: 'icss-import',
                  params: `'${s}'`,
                  raws: { after: n ? '\n' : '' },
                })
          if (n) {
            c.append(a)
          }
          return c
        })
      const createExports = (e, r, t = 'rule') => {
        const s = Object.keys(e).map((t) =>
          r.decl({ prop: t, value: e[t], raws: { before: '\n  ' } })
        )
        if (s.length === 0) {
          return []
        }
        const o =
          t === 'rule'
            ? r.rule({ selector: `:export`, raws: { after: '\n' } })
            : r.atRule({ name: 'icss-export', raws: { after: '\n' } })
        o.append(s)
        return [o]
      }
      const createICSSRules = (e, r, t, s) => [
        ...createImports(e, t, s),
        ...createExports(r, t, s),
      ]
      e.exports = createICSSRules
    },
    233: (e) => {
      const r = /^:import\(("[^"]*"|'[^']*'|[^"']+)\)$/
      const t = /^("[^"]*"|'[^']*'|[^"']+)$/
      const getDeclsObject = (e) => {
        const r = {}
        e.walkDecls((e) => {
          const t = e.raws.before ? e.raws.before.trim() : ''
          r[t + e.prop] = e.value
        })
        return r
      }
      const extractICSS = (e, s = true, o = 'auto') => {
        const a = {}
        const n = {}
        function addImports(e, r) {
          const t = r.replace(/'|"/g, '')
          a[t] = Object.assign(a[t] || {}, getDeclsObject(e))
          if (s) {
            e.remove()
          }
        }
        function addExports(e) {
          Object.assign(n, getDeclsObject(e))
          if (s) {
            e.remove()
          }
        }
        e.each((e) => {
          if (e.type === 'rule' && o !== 'at-rule') {
            if (e.selector.slice(0, 7) === ':import') {
              const t = r.exec(e.selector)
              if (t) {
                addImports(e, t[1])
              }
            }
            if (e.selector === ':export') {
              addExports(e)
            }
          }
          if (e.type === 'atrule' && o !== 'rule') {
            if (e.name === 'icss-import') {
              const r = t.exec(e.params)
              if (r) {
                addImports(e, r[1])
              }
            }
            if (e.name === 'icss-export') {
              addExports(e)
            }
          }
        })
        return { icssImports: a, icssExports: n }
      }
      e.exports = extractICSS
    },
    48: (e, r, t) => {
      const s = t(63)
      const o = t(849)
      const a = t(233)
      const n = t(858)
      e.exports = {
        replaceValueSymbols: s,
        replaceSymbols: o,
        extractICSS: a,
        createICSSRules: n,
      }
    },
    849: (e, r, t) => {
      const s = t(63)
      const replaceSymbols = (e, r) => {
        e.walk((e) => {
          if (e.type === 'decl' && e.value) {
            e.value = s(e.value.toString(), r)
          } else if (e.type === 'rule' && e.selector) {
            e.selector = s(e.selector.toString(), r)
          } else if (e.type === 'atrule' && e.params) {
            e.params = s(e.params.toString(), r)
          }
        })
      }
      e.exports = replaceSymbols
    },
    63: (e) => {
      const r = /[$]?[\w-]+/g
      const replaceValueSymbols = (e, t) => {
        let s
        while ((s = r.exec(e))) {
          const o = t[s[0]]
          if (o) {
            e = e.slice(0, s.index) + o + e.slice(r.lastIndex)
            r.lastIndex -= s[0].length - o.length
          }
        }
        return e
      }
      e.exports = replaceValueSymbols
    },
    400: (e, r, t) => {
      'use strict'
      const s = t(48)
      const o = /^(.+?|\([\s\S]+?\))\s+from\s+("[^"]*"|'[^']*'|[\w-]+)$/
      const a = /(?:\s+|^)([\w-]+):?(.*?)$/
      const n = /^([\w-]+)(?:\s+as\s+([\w-]+))?/
      e.exports = (e) => {
        let r = 0
        const t =
          (e && e.createImportedName) ||
          ((e) => `i__const_${e.replace(/\W/g, '_')}_${r++}`)
        return {
          postcssPlugin: 'postcss-modules-values',
          prepare(e) {
            const r = []
            const c = {}
            return {
              Once(p, l) {
                p.walkAtRules(/value/i, (p) => {
                  const l = p.params.match(o)
                  if (l) {
                    let [, e, s] = l
                    if (c[s]) {
                      s = c[s]
                    }
                    const o = e
                      .replace(/^\(\s*([\s\S]+)\s*\)$/, '$1')
                      .split(/\s*,\s*/)
                      .map((e) => {
                        const r = n.exec(e)
                        if (r) {
                          const [, e, s = e] = r
                          const o = t(s)
                          c[s] = o
                          return { theirName: e, importedName: o }
                        } else {
                          throw new Error(
                            `@import statement "${e}" is invalid!`
                          )
                        }
                      })
                    r.push({ path: s, imports: o })
                    p.remove()
                    return
                  }
                  if (p.params.indexOf('@value') !== -1) {
                    e.warn('Invalid value definition: ' + p.params)
                  }
                  let [, i, u] = `${p.params}${p.raws.between}`.match(a)
                  const m = u.replace(/\/\*((?!\*\/).*?)\*\//g, '')
                  if (m.length === 0) {
                    e.warn('Invalid value definition: ' + p.params)
                    p.remove()
                    return
                  }
                  let f = /^\s+$/.test(m)
                  if (!f) {
                    u = u.trim()
                  }
                  c[i] = s.replaceValueSymbols(u, c)
                  p.remove()
                })
                if (!Object.keys(c).length) {
                  return
                }
                s.replaceSymbols(p, c)
                const i = Object.keys(c).map((e) =>
                  l.decl({ value: c[e], prop: e, raws: { before: '\n  ' } })
                )
                if (i.length > 0) {
                  const e = l.rule({
                    selector: ':export',
                    raws: { after: '\n' },
                  })
                  e.append(i)
                  p.prepend(e)
                }
                r.reverse().forEach(({ path: e, imports: r }) => {
                  const t = l.rule({
                    selector: `:import(${e})`,
                    raws: { after: '\n' },
                  })
                  r.forEach(({ theirName: e, importedName: r }) => {
                    t.append({ value: e, prop: r, raws: { before: '\n  ' } })
                  })
                  p.prepend(t)
                })
              },
            }
          },
        }
      }
      e.exports.postcss = true
    },
  }
  var r = {}
  function __nccwpck_require__(t) {
    var s = r[t]
    if (s !== undefined) {
      return s.exports
    }
    var o = (r[t] = { exports: {} })
    var a = true
    try {
      e[t](o, o.exports, __nccwpck_require__)
      a = false
    } finally {
      if (a) delete r[t]
    }
    return o.exports
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/'
  var t = __nccwpck_require__(400)
  module.exports = t
})()
