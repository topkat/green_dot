import { Definition } from 'good-cop/backend'
import { models } from './databases/models'

// you can extend definition class here with you own definitions

export const _ = new Definition<Record<string, Record<string, any>>>(models.validation).init() // still able to use model validation but no ts