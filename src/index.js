/* eslint-disable no-unused-vars */
/* eslint-disable one-var */
import wepy from 'wepy'
let CATCHEPAGES = [], TIMER = null, ROUTER = null
const ROUTERTYPE = ['switchTab', 'navigateTo', 'reLaunch', 'redirectTo', 'navigateBack']
const indentUperCase = (str) => {
  return str.substr(0, 1).toUpperCase() + str.substr(1)
}
const getPathName = (path) => {
  return path.replace(/(?:\w+\/)*(?:(\w+))/, (str, $1) => {
    return indentUperCase($1)
  })
}
const getPages = (pages = [], root = '', type = 1) => {
  const firstName = root ? getPathName(root) : ''
  return pages.map((p) => {
    const path = root ? `/${root}/${p}` : `/${p}`
    const lastName = getPathName(p)
    return {
      path,
      name: firstName + lastName,
      type
    }
  })
}
const getSubPackages = (subPackages = []) => {
  if (subPackages.length === 0) return []
  return subPackages.reduce((result, pagesInfo) => {
    const {
      root,
      pages
    } = pagesInfo
    const pagesArr = getPages(pages, root)
    result.push(...pagesArr)
    return result
  }, [])
}
const tabBarValidate = (pages = [], tabPages = []) => {
  return pages.map(page => {
    const pagePath = page.path
    const isTab = tabPages.some(tabPage => {
      const tabPath = `/${tabPage.pagePath}`
      return tabPath === pagePath
    })
    if (isTab) page.type = 0
    return page
  })
}
const findRoutesIndex = (arr, value, key) => {
  return arr.findIndex(page => page[key] === value)
}
const judgeNullObj = obj => {
  if (obj === null) return true
  if (Object.prototype.toString.call(obj) !== '[object Object]') throw TypeError('query is not a object')
  return (JSON.stringify(obj) === '{}')
}
const littleJudgeObjEqual = (a, b) => {  // 判断两个未知的变量是否相等
  if (a === null || b === null) return a === b
  const typeA = Object.prototype.toString.call(a),
    typeB = Object.prototype.toString.call(b)
  if (typeA !== typeB) return false
  if (typeof a !== 'object') return a === b
  const aProps = Object.getOwnPropertyNames(a),
    bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length) {
    return false
  }
  return aProps.every((prop) => {
    if (bProps.indexOf(prop) === -1) return false
    return littleJudgeObjEqual(a[prop], b[prop])
  })
}
const dataToQuery = (data = {}) => {
  const objArr = Object.entries(data)
  return objArr.reduce((result, [key, val], index) => {
    val = JSON.stringify(val)
    const p = index === objArr.length - 1 ? `${key}=${val}` : `${key}=${val}&`
    result += p
    return result
  }, '?').replace(/"/g, '')
}
const getCatchePages = (cat = [], cur = []) => {
  return cur.reduce((r, v) => {
    let i = r.findIndex(ite => littleJudgeObjEqual(ite, v))
    if (i !== -1) r.splice(i, 1)
    r.push(v)
    return r
  }, cat)
}
const setCatchePages = () => {
  clearTimeout(TIMER)
  TIMER = setTimeout(() => {
    // eslint-disable-next-line no-undef
    const catchePages = getCurrentPages().map(page => {
      return {
        options: page.options,
        route: page.route
      }
    })
    global.a = CATCHEPAGES = getCatchePages(CATCHEPAGES, catchePages)
    // console.log(CATCHEPAGES)
  }, 1000)
}
export default class Router {
  constructor(config = {}) {
    const {
      pages = [],
        subPackages = [],
        tabBar = {}
    } = config
    const routes = [...getPages(pages), ...getSubPackages(subPackages)]
    const tabBarPages = tabBar.list || []
    this.$routes = tabBarValidate(routes, tabBarPages)
    this._init()
  }
  _init = () => {
    Router.$wepy = wepy
    wepy.$router = ROUTER = this
    setCatchePages()
  }
  push(urlInfo, query = {}, reLaunch = false) {
    return new Promise((resolve, reject) => {
      let path, name, type = 1
      if (Object.prototype.toString.call(urlInfo) === '[object Object]') {
        path = urlInfo.path || ''
        query = urlInfo.query || {}
        name = urlInfo.name || ''
        reLaunch = urlInfo.reLaunch ? Boolean(urlInfo.reLaunch) : false
      }
      if (typeof urlInfo === 'string') {
        path = urlInfo
      }
      if (path) {
        const i = findRoutesIndex(this.$routes, path, 'path')
        if (i !== -1) type = this.$routes[i].type
      }
      if (!path && name) {
        const i = findRoutesIndex(this.$routes, name, 'name')
        if (i !== -1) {
          type = this.$routes[i].type
          path = this.$routes[i].path
        }
      }
      if (reLaunch) type = 2
      Router._routerTo(type, path, query, resolve, reject)
    })
  }
  go(num = 0, query = {}) {
    if (typeof (+num) !== 'number') throw Error('param must be a number')
    return new Promise((resolve, reject) => {
      if (num < 0 && num % 1 === 0) {
        Router._routerTo(4, Math.abs(num), {}, resolve, reject)
      }
      if (num > 0 && num % 1 === 0) {
        // eslint-disable-next-line no-undef
        const from = getCurrentPages().reverse()[0],
          fromIndex = CATCHEPAGES.findIndex(item => item.route === from.route)
        const sum = fromIndex + num,
          toIndex = sum > CATCHEPAGES.length - -1 ? CATCHEPAGES.length - 1 : sum,
          to = CATCHEPAGES[toIndex]
        if (judgeNullObj(query)) {
          query = Object.keys(to.options).reduce((o, key) => {
            o[key] = JSON.parse(to.options[key])
            return o
          }, {})
        }
        const url = `/${to.route}`
        this.push(url, query).then(resolve).catch(reject)
      }
    })
  }
  static async _routerTo(type, url, query, resolve, reject) {
    let key = 'url'
    if (type === 1) {
      // eslint-disable-next-line no-undef
      const currentPages = getCurrentPages()
      if (currentPages.length > 9) {
        type = await new Promise(resolve => {
          Router.$wepy.showModal({
            title: '提示',
            content: '因小程序页面栈层级限制，点击确定关闭当前页跳转到下一页？',
            success: (res) => {
              if(res.confirm) resolve(3)
            }
          })
        })
      }
    }
    if (!judgeNullObj(query) && type !== 4 && type !== 0) {
      url += dataToQuery(query)
    }
    if (type === 4) {
      key = 'delta'
      url = url || 0
    }
    const routerHandler = ROUTERTYPE[type]
    Router.$wepy[routerHandler]({
      [key]: url,
      success: (e) => {
        if (type !== 4)setCatchePages()
        resolve(e)
      },
      fail: reject
    })
  }
}

class routerMinx extends wepy.mixin {
  onLoad() {
    // console.log(ROUTER)
    if (ROUTER) this.$router = ROUTER
  }
}

const withRouter = target => {
  // console.log(ROUTER)
  if (ROUTER) target.$router = ROUTER
}

export {
  routerMinx,
  withRouter
}
