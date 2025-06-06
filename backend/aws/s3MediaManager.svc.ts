import { svc } from 'green_dot'
import { _ } from 'green_dot'
import type { Service, InferTypeRead, InferTypeWrite } from 'green_dot'

// Define the input and output types explicitly
type UploadMediasToS3Input = {
  // Add your input properties here
}

type UploadMediasToS3Output = {
  // Add your output properties here
}

const stringValidator = _.string()

// Use the validator types directly
export const uploadMediasToS3 = svc({
  input: _.string(),
  output: _.string(),
  main: async (ctx, input) => {
    // Implement your service logic here
    return input
  }
})