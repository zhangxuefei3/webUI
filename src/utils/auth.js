import Ajax from './ajax'
import md5 from 'js-md5'
import { Base64 } from 'js-base64'

function setSession(session) {
  window.sessionStorage.setItem('maomo_session', Base64.encode(JSON.stringify(session)))
}

function getSession() {
  try {
    const s = window.sessionStorage.getItem('maomo_session')
    if (!s) {
      return {}
    }
    const str = Base64.decode(s)
    if (!str) {
      return {}
    }
    const so = JSON.parse(str)
    const now = (new Date()) / 1000
    if (now - so.activeTime > 600) {
      return {}
    }
    return so
  } catch (e) {
    console.log('getSession: ', e)
    return {}
  }
}

function clearSession(session) {
  window.sessionStorage.setItem('maomo_session', '')
}

function activeSession(s) {
  if (s && s.activeTime) {
    s.activeTime = (new Date()) / 1000
    setSession(s)
  }
}

async function getUserInfo() {
  const session = getSession()
  if (!session.userInfo) {
    session.userInfo = {}
  }
  keepLogin()
  return session.userInfo
}

async function keepLogin() {
  console.log('keepLogin')
  const session = getSession()
  if (!session.password) {
    console.log('no pass')
    return
  }
  const now = (new Date()) / 1000
  if (session.expires - now < 600) {
    const rSalt = await Ajax.get('/server/auth/login', {
      params: {
        username: session.userInfo.name,
        type: 'salt'
      }
    })
    if (!rSalt || rSalt.code !== 0) {
      console.log('keepLogin get salt fail.')
      return
    }
    const pass = md5(session.password + rSalt.salt2).toUpperCase()
    const r = await Ajax.get('/server/auth/login', {
      params: {
        username: session.userInfo.name,
        password: pass
      }
    })
    if (!r || r.code !== 0) {
      console.log('keepLogin login fail.')
      return
    }
    session.token = r.userInfo.token
    session.expires = r.userInfo.expires
  }
  activeSession()
  setTimeout(keepLogin, 60 * 1000)
}

async function login(username, password) {
  const rSalt = await Ajax.get('/server/auth/login', {
    params: {
      username,
      type: 'salt'
    }
  })
  if (!rSalt) {
    return '网络错误'
  }
  if (rSalt.code !== 0) {
    return `${rSalt.msg}`
  }
  console.log('salt:', rSalt)
  const passwordMd51 = md5(password + rSalt.salt1).toUpperCase()
  console.log('p1:', passwordMd51)
  const passwordMd52 = md5(passwordMd51 + rSalt.salt2).toUpperCase()
  const r = await Ajax.get('/server/auth/login', {
    params: {
      username,
      password: passwordMd52
    }
  })
  if (!r) {
    return '网络错误'
  }
  if (r.code !== 0) {
    return `${r.msg}`
  }
  console.log('login ret:', r)
  const session = {}
  session.password = passwordMd51
  session.token = r.userInfo.token
  session.expires = r.userInfo.expires
  session.userInfo = r.userInfo
  session.activeTime = (new Date()) / 1000
  delete session.userInfo.token
  delete session.userInfo.expires
  setSession(session)
  keepLogin()
  return session.userInfo
}

function logout() {
  clearSession()
  window.g_app.userInfo = {}
  window.g_app.$router.go('/')
}

async function register(username, password) {
  return '用户名已存在'
}

export default {
  getUserInfo,
  login,
  logout,
  register
}
