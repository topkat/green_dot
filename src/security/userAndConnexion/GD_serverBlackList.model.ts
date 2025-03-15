import { _ } from 'good-cop'

// TODO initialize that if user is not using custom blacklist
export const GD_serverBlacklistModel = _.mongoModel(['creationDate', 'lastUpdateDate'], {
  /** Discriminator is the IP or userId if the user is connected */
  discriminator: _.string().required().unique(),
  lockUntil: _.date(),
  nbWarning: _.number().default(1),
  nbBan: _.number().default(0),
})