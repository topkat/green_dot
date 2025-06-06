import { _ } from '../../lib/good-cop/src/index.js'

export const GD_deviceModel = _.mongoModel([], {
  user: _.ref('user'),
  deviceName: _.string().required(),
  deviceType: _.enum(['desktop', 'mobile', 'tablet', 'unknown']).required(),
  os: _.enum(['ios', 'macos', 'linux', 'windows', 'android', 'other']),
  browser: _.enum(['firefox', 'chrome', 'safari', 'other', 'opera', 'edge', 'internetExplorer']),
  pixelHeight: _.number(),
  pixelWidth: _.number(),
  language: _.string(),
  deviceInfos: _.object(),
})