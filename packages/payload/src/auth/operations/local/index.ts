import { enforceCallDepth } from '../../../utilities/enforceCallDepth.js'
import { auth } from './auth.js'
import forgotPassword from './forgotPassword.js'
import login from './login.js'
import resetPassword from './resetPassword.js'
import unlock from './unlock.js'
import verifyEmail from './verifyEmail.js'

const local = {
  auth,
  forgotPassword,
  login,
  resetPassword,
  unlock,
  verifyEmail,
}

for (const operation in local) {
  local[operation] = enforceCallDepth(local[operation])
}

export default local
