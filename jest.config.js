 
module.exports = {
  
  coverageProvider: "v8",
 
  moduleFileExtensions: [
    "js",
    "json", 
    "ts", 
  ],
  
  testEnvironment: "jsdom",
 
  testMatch: [
    // "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
 
  testPathIgnorePatterns: [
    "\\\\node_modules\\\\"
  ],

  preset: 'ts-jest',

  globals: {
    'ts-jest': {
      
    }
  }

 
};
