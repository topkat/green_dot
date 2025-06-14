### v0.0.65
- Added modulePathIgnorePatterns to jest configuration to exclude dist directory.
- Updated package.json to support new plugin export structure for managedLogin.
- Refactored getNewTokenService import path to align with new plugin structure.
- Enhanced userAdditionalFields and user authentication services to utilize plugin configurations.
- Removed deprecated getNewTokenService file to streamline codebase.
- Improved type definitions in appConfig.types.ts and mainConfig.types.ts to support plugin instantiation.

### v0.0.63
- Added default configuration handling for managedLogin and secureAuth plugins.
- Refactored plugin system to return default configurations when plugins are not registered.
- Updated managedLogin plugin to include new configuration options and validation logic.
- Modified secureAuth plugin to export its default configuration.
- Adjusted cookie service and token generation logic to utilize plugin configurations for improved flexibility.

### v0.0.61
- Updated package.json to include new plugin export path.
- Refactored index.ts to streamline user authentication and connection service imports.
- Simplified type definitions in index.generated.ts for better maintainability.
- Improved CLI test suite generation logic for better user experience.
- Enhanced API endpoint role handling in getApiEndpointsPerRolesFromDao.ts.
- Adjusted token generation logic in userAuthenticationTokenService to include cookie management.
- Updated userAdditionalFields to support dynamic configuration and improved error handling in userPasswordService.
- Removed deprecated secureAuth.ts file to clean up the codebase.

### v0.0.59
- Updated index.ts to include imports for user management services.
- Modified generateFilesForCachedDb.ts to improve user permission fields handling.
- Added UserAdditionalFields for better user data management in userAdditionalFields.ts.
- Enhanced user lock service to utilize new user lock reasons and permissions.
- Updated global types to incorporate default permissions and roles for better type safety.

### v0.0.57
- Updated userPasswordService to improve password attempt handling and user locking logic.
- Refactored userAdditionalFields to separate read and write types for better clarity.
- Modified index.ts to include new imports for user authentication and connection services.
- Removed deprecated on-login-hook.ts file to streamline project structure.

### v0.0.55
- Added new dependencies: crypto-js and jsonwebtoken for improved security.
- Updated userAdditionalFields to include dynamic configuration from mainConfig.
- Refactored user authentication token service to utilize maxRefreshTokenPerRole from mainConfig.
- Enhanced type definitions in mainConfig.types.ts to support new configuration options for user management.
- Improved user model to incorporate additional fields for better data handling.

### v0.0.53
- Updated error handling in `decryptValidationTokens.ts`, `userAuthenticationTokenService.ts`, and `getNewTokenService.ts` to include function names and user IDs for better debugging.
- Refactored `startDevServer.command.ts` to improve clarity in the control flow.
- Rearranged imports in `index.generated.ts` for consistency and organization.
- Cleaned up unnecessary whitespace in `onLogin.ts` for improved readability.
- Ensured type definitions in `GDmanagedLogin.ts` are correctly typed as constants.
- Rearranged import statements in `index.generated.ts` for better organization.
- Updated type definitions in `ModelsWithDbNamesAndReadWrite` and `DbIds` to ensure consistency.
- Modified file extension handling in `generateSdkFolderFromTemplates.ts` to use regex for improved accuracy.
- Removed deprecated `api.service.template.d.ts` file to clean up the codebase.
- Updated `package.json` to ensure proper formatting and compliance.
- Rearranged import statements in `index.generated.ts` for better organization and clarity.
- Modified CLI entry points to suppress warnings during execution.
- Implemented `notImplementedWarning` in `cliGenerateApp.ts` and `cliGenerateDatabase.ts` to indicate incomplete functionality.
- Adjusted SDK generation logic to correctly handle file extensions and improve output consistency.
- Updated TypeScript compiler configurations to align with module resolution standards.
- Revised template files to reflect changes in module exports and file extensions for better ESM compatibility.
- Upgraded `good-cop` dependency from version 1.3.11 to 1.4.5 for improved functionality and bug fixes.
- Refactored import statements across multiple files to utilize the new `index-backend.js` structure, enhancing code clarity and maintainability.
- Removed deprecated files and cleaned up unused imports to streamline the codebase.
- Updated type definitions and improved error handling in various modules to ensure better type safety and consistency.
- Updated `index.js`, `index.ts`, and various other files to include `.js` extensions in export statements, ensuring compatibility with ECMAScript modules.
- Enhanced type definitions in `core.types.ts` and `daoGeneric.types.ts` to improve clarity and maintainability.
- Cleaned up imports across multiple files to align with the new module structure and improve overall code quality.
- Added `"type": "module"` to `package.json` to enable ECMAScript module support.
- Updated module settings in `tsconfig.json` to use `ESNext` and `bundler` for better compatibility with ESM.
- Replaced `command-line-application` with `commander` for improved command handling in the CLI.
- Modified CLI entry points to use `node --loader ts-node/esm` for ESM compatibility.
- Updated various import statements to use `.js` extensions where necessary for ESM compliance.
- Enhanced `greenDotCliIntro` calls to await asynchronous execution for better flow control.

### v0.0.51
- Upgraded `send-teams-message` package from version 1.0.4 to 1.0.5 for improved functionality.
- Updated `axios` dependency from version 1.7.4 to 1.9.0 to leverage new features and fixes.
- Refined type definitions in `index.generated.ts` to improve type safety and clarity for database models.
- Streamlined the structure of model types to ensure better maintainability and usability across the codebase.
- Upgraded `send-teams-message` package from version 1.0.3 to 1.0.4 for enhanced functionality.
- Refactored database service functions to consistently use `mainDb` instead of `main`, improving type safety and clarity in the codebase.
- Updated related tests in `maskService.spec.ts` and `populateService.spec.ts` to reflect the new database naming conventions.
- Cleaned up unused imports and streamlined type definitions in `index.generated.ts` for better maintainability.
- Refactored email handling in the GDmanagedLogin plugin to replace `EmailTypes` with `GDmanagedLoginEmailTypes`, enhancing type safety for email-related functions.
- Updated various services and API endpoints to utilize the new email type definitions, ensuring consistency across the plugin.
- Cleaned up imports and removed deprecated code, including the deletion of the unused `apiKeys.ts` file.
- Enhanced the README with clearer contribution guidelines and improved formatting for better readability.
- Updated `maskService` to utilize `MainDbName` for database operations, enhancing type safety and consistency across masking functions.
- Adjusted tests in `maskService.spec.ts` to reflect changes in database name handling.
- Enhanced `GDmanagedLogin` plugin to support cookie domain configuration for improved security.
- Cleaned up code and imports for better maintainability and readability.
- Updated `index.generated.ts` to improve type safety for database models, incorporating user permissions and additional fields.
- Refactored CLI project generation to include clearer output and structured steps for generating and building projects.
- Improved cookie handling in `GDmanagedLogin` plugin to utilize configuration for production domains and enhance security.
- Cleaned up unused imports and streamlined code for better readability and maintainability.
- Added bcrypt package to package.json for password hashing.
- Updated appConfig.types.ts to rename connexionFn to onLoginCallback for clarity.
- Modified mainConfig.types.ts to include lockDurationMinutes for user management.
- Adjusted green_dot.app.config.ts to reflect the new onLoginCallback import and usage.

### v0.0.48
- Updated `send-teams-message` package version from 1.0.1 to 1.0.3.
- Refactored CLI intro to support dynamic titles and subtitles.
- Replaced `cliIntro` calls with `greenDotCliIntro` for consistency across CLI commands.
- Added version and imports from GreenDot to project generation templates.

### v0.0.47
- Added CLI helper functions: cliIntro, clearCli, cliBadge.
- Updated cliGenerateProject to utilize templater for project name input.
- Refactored app configuration to include dynamic project name in server CLI intro.
- Removed deprecated index.generated.ts file and adjusted related imports.
- Cleaned up project configuration files and improved type definitions.

### v0.0.45
- Added a detailed file structure section to the README for better project navigation.
- Updated error message in db.ts to reference gd.config.ts instead of green_dot.config.ts for accuracy.
- Exported initClientApp from green_dot.config.ts to enhance module usability.
- Updated README to clarify framework capabilities, including front-end and back-end type safety, shared models, and SDK generation.
- Improved project generation CLI prompts for better user experience, including role and platform handling.
- Enhanced SDK configuration in green_dot.config.ts to dynamically use roles and platforms.
- Refined type definitions for default permission restrictions in GreenDotConfig for better clarity and type safety.

### v0.0.44
- Streamlined type definitions in index.generated.ts by removing unnecessary complexity and consolidating types.
- Updated the green_dot dependency version in package.json from 0.0.41 to 0.0.44 for improved functionality.
- Renamed exportFolderInSdk to injectFolderInSdk for clarity in SDK configuration.
- Updated related logic in generateSdkFiles and generateSdkFolderFromTemplates to reflect the new naming.
- Added yarn build command execution in cliGenerateProject to ensure project builds after generation.
- Cleaned up .gitignore and green_dot.config.ts by removing outdated entries and security feature flags.
- Streamlined package.json by removing unnecessary scripts to enhance clarity.
- Updated cliGenerateProject to improve user prompts and project root path handling.
- Added execWaitForOutput to run yarn commands in the generated project directory.
- Refined user role input instructions for clarity.
- Introduced default application configuration in getGreenDotConfigs for better initialization.
- Updated rate limiter logic to utilize active application configuration.
- Enhanced DAO and model templates for better snippet autocompletion and documentation.
- Removed outdated template files to streamline project structure.
- Changed 'permissions' to 'permission' in various type definitions for consistency and improved type safety.
- Updated related logic in GDapiKeyAuthentication and GDmanagedLogin to reflect the new type structure.

### v0.0.43
- Added JWTdata export to GDmanagedLogin plugin for enhanced functionality.
- Updated import paths in generateIndexForDbTypeFiles to conditionally reference user additional fields based on cache output.
- Refined platform type definition in global types for improved type safety.
- Ensured consistent export structure in index.ts files for better module organization.
- Added getSendValidationEmailService to GDmanagedLogin for improved user email validation functionality.
- Updated service composition in GDmanagedLogin to include the new email validation service, enhancing user communication and security.
- Removed the displayIntroTimeout configuration from the test command to streamline the initialization process.
- Updated the parseDaos function to ensure default values for DAOs include a fallback for type, enhancing robustness.
- Cleaned up the test runner by eliminating unnecessary timeout logic for improved clarity.
- Updated the GreenDotApiTestsConfig interface to reflect changes in configuration options.
- Removed unused user permission fields logic from db.ts and centralized it in getProjectModelsAndDaos.ts.
- Updated import paths for getUserPermissionFields to reflect the new location.
- Cleaned up the initDbs function by removing unnecessary checks and comments related to default database handling.
- Enhanced clarity and maintainability of the database initialization process.
- Added new email sending functions to GDmanagedLogin for improved user communication.
- Updated main application configuration to include environment handling and refined plugin settings.
- Cleaned up unused variables and improved type safety in the configuration files.
- Added global type augmentation for apiKeys in GDapiKeyAuthentication to enhance type safety.
- Updated GDmanagedLogin configuration to include jwtSecret in the instantiation process for improved security.
- Modified token expiration logic in userAuthenticationTokenService to default to 48 hours for better consistency across platforms.
- Introduced role input during project generation to define user interfaces for the application.
- Updated plugin instantiation to support new configuration options, including dynamic imports and global type augmentation.
- Refactored the project generation logic to utilize new helper functions for better plugin variable handling.
- Enhanced templates to incorporate new variables for improved configuration management.
- Added new JWT configuration options to PluginUserConfig, including jwtSecret, jwtExpirationMs, and refresh token expiration settings for web and mobile.
- Refactored various services to utilize the updated PluginUserConfig for improved token management and security.
- Updated import paths to ensure consistency and clarity across the plugin files.
- Modified the server initialization to register a more comprehensive configuration object, including terminal color settings and production environment flags.
- Updated the GreenDotAppConfig type to include optional properties for terminal colors and a flag to disable terminal colors.
- Cleaned up the main application configuration by removing hardcoded SMTP settings and adding a placeholder for future configuration.
- Enhanced the data validation configuration to support custom types and improved clarity in the application setup.
- Updated GDmanagedLogin to include new email sending functions for improved user communication.
- Enhanced GDdoubleAuthentication with detailed documentation outlining its features, configuration, and security mechanisms.
- Refactored type definitions in both plugins to improve clarity and maintainability.
- Added support for user device registration in GDmanagedLogin, integrating with the new GD_deviceModel for better device management.
- Improved safeImport function to handle path adjustments based on the environment.
- Added getRegisterUserDeviceService to support user device registration within the GDmanagedLogin plugin.
- Updated GDmanagedLogin to include a new sendValidationEmail method for improved email validation processes.
- Enhanced configuration to allow for user sign-up options and additional fields in the login process.
- Introduced GD_deviceModel to the database structure for improved device management.
- Updated Dbs type to include GD_deviceModel for better integration.
- Enhanced GDmanagedLogin by adding userLogin and password comparison functionalities for improved user authentication processes.
- Added getUpdateEmailService to support email updates within the GDmanagedLogin plugin.
- Enhanced PluginUserConfig to include a new callback for email update confirmation.
- Updated userLogin function to streamline token handling and improve clarity.
- Modified credential management services to allow for broader access permissions.
- Added getUpdatePasswordService to enhance password management capabilities within the GDmanagedLogin plugin.
- Updated service registration to include the new password update functionality for improved user experience.
- Introduced onBeforeLogin and onAfterLogin hooks in GDmanagedLogin for better control over the login flow.
- Integrated getLoginServices to streamline login service management.
- Updated userLogin function to utilize additional checks and hooks for improved validation and error handling.
- Enhanced type definitions in PluginUserConfig to support new login-related parameters.
- Exported ErrorObject type for better error management in plugins.
- Added userLocked error handling to improve user authentication flow.
- Refactored GDmanagedLogin to utilize new error handling structure and removed deprecated sendValidationEmail service.
- Updated user login and token validation services to streamline email validation process.
- Enhanced type definitions for PluginUserConfig to support additional parameters in email sending functions.
- Introduced a new code snippet for creating functions in VSCode.
- Added user login return validator to improve validation of user login data.
- Refactored decryptValidationToken function parameters for clarity.
- Updated GDmanagedLogin to include new API services for token validation and logout functionality.
- Updated getActiveAppServices to merge services from plugins using getAllPluginServices.
- Changed serviceToRegister in GDplugin to use a Record type for better structure.
- Refactored service registration in GDmanagedLogin to return services as an object.
- Enhanced service definitions in getCheckTokenIsValidService, getNewTokenService, and getSendValidationEmail for improved clarity and maintainability.
- Updated import path for getNewTokenService to reflect new directory structure.
- Removed the obsolete getNewTokenService file to streamline the codebase.
- Enhanced GDmanagedLogin plugin to include additional API services for token validation and email sending.
- Updated ModelsWithDbNamesAndReadWrite to include detailed type mappings for admin, bangk, and website models.
- Refactored DbIds and AllDbIds for improved type safety and clarity.
- Enhanced ModelTypes to provide better access to read and write types for models.
- Improved GDdoubleAuthentication and GDmanagedLogin plugins by integrating new user additional fields and refining type definitions.
- Adjusted getGreenDotConfigs to ensure safe plugin initialization.
- Cleaned up imports in getProjectPaths for better organization.
- Adjusted TypeScript types path in package.json for better module resolution.
- Introduced typesVersions to enhance plugin type definitions.
- Updated cliEntryPoint to set RUN_FROM_DIST environment variable for improved runtime context.
- Refactored getGreenDotConfigs to streamline cache initialization logic.
- Modified getProjectPaths to utilize RUN_FROM_DIST for determining build context.
- Enhanced GDmanagedLogin plugin to utilize allRoles from configuration for better role management.
- Removed deprecated cookie and user authentication token services to streamline the codebase.
- Updated GDmanagedLogin and GDdoubleAuthentication plugins to include addUserAdditionalFields method for enhanced user data handling.
- Refactored userAdditionalFields to support dynamic configuration and improved type safety.
- Adjusted package.json to remove unnecessary src export paths and improve plugin accessibility.
- Enhanced type definitions in userAdditionalFields for better clarity and maintainability.
- Corrected sorting logic in event registration to prioritize lower numbers.
- Updated import paths for managedLogin and GDmanagedLogin plugins to reflect new directory structure.
- Removed deprecated loginHookDefault and related services to streamline the codebase.
- Enhanced type definitions for clarity and maintainability across various modules.
- Added GDapiKey export to index.ts for improved plugin accessibility.
- Updated userPasswordService import path to reflect new structure.
- Modified apiKeys type in GreenDotApiTestsConfig to use GDapiKey for better type safety.
- Adjusted import of encryptPassword in userAdditionalFields to align with plugin organization.
- Changed `_user` field to `user` in global context type for clarity.
- Refactored plugin exports in index.ts to streamline plugin management.
- Updated loginHookDefault to use `publicUserId` for user ID assignment.
- Enhanced GDplugin class to include handlers for plugin events.
- Removed deprecated cookie and user authentication token services to clean up the codebase.
- Improved type definitions in appConfig.types.ts for better clarity and maintainability.
- Updated package.json to support TypeScript exports for plugins and core types.
- Refactored getGreenDotConfigs to improve cache initialization logic.
- Enhanced plugin registration to conditionally add plugins based on their configuration.
- Modified encryption error handling to check NODE_ENV for production.
- Improved type definitions in userAdditionalFields for better type safety.
- Updated tsconfig.json to use Node16 module resolution and exclude coverage directory.

### v0.0.42