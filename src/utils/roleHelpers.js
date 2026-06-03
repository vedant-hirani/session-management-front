import { ROLES } from './constants'

export const isCreator = (user) => {
  return user?.role === ROLES.CREATOR
}

export const isUser = (user) => {
  return user?.role === ROLES.USER
}

export const canCreateSession = (user) => {
  return isCreator(user)
}

export const canBookSession = (user) => {
  return isUser(user) || user?.role === ROLES.USER
}

export const getRoleDisplay = (role) => {
  return role === ROLES.CREATOR ? 'Creator' : 'User'
}
