import { MongoDao } from 'green_dot'
import userModel from './user.model'

const dao = {
    type: 'mongo',
    modelConfig: {},
    expose: [

    ],
    filter: [{
        on: 'ALL',
        filter: (ctx, filter) => {
            if (ctx.role === 'bangkAdmin' && ctx.method !== 'getOne') return
            else filter._id = ctx._id
            filter.isDeleted = { $ne: true }
        }
    },],
    mask: [{
        // masked in READ AND WRITE situation
        mask: () => ({
            refreshTokens: true,
            password: true,
            validationTokens: true,
            devices: true,
            pinCode: true,
            _2FAcode: true,
            biometricAuthToken: true,
        }),
    }, {
        notFor: 'bangkAdmin',
        // masked in READ AND WRITE situation
        mask: () => ({
            kycReferences: true, // frontend don't need those informations, backend will compute all status and store it on user.kycStatus
        }),
    }, {
        on: ['write'],
        select: () => ({
            countryIsoCode: true,
            address: true,
            currency: true,
            lang: true,
            nationality: true,
            birthDate: true,
            company: true,
            favoriteCryptos: true,
            referralPageLastView: true,
            hasSubscribedToBangkNewsletter: true,
            hasSubscribedToBangkOpportunitiesNewsletter: true,
            hasSubscribedToUserResearchNewsletter: true,
            contactPhoneNumber: true,
            contactPhoneNumberPrefix: true
            //!\ Only authorized fields goes there
        }),
    }],
    populate: [],
} satisfies MongoDao<typeof userModel.tsType>

export default dao