import { MongoDao } from 'green_dot'
import userModel from './user.model'

const dao = {
    type: 'mongo',
    modelConfig: {},
    expose: [
        // use gd_dao:expose for snippet autocompletion
    ],
    filter: [{
        for: 'ALL',
        on: 'ALL',
        filter: (ctx, filter) => {
            // /!\ actually the user can only access his own user and no other users
            filter._id = ctx._id
        }
    }],
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