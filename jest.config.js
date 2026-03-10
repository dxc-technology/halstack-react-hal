module.exports = {
  collectCoverage: true,
  coverageDirectory: "./coverage",
  coverageReporters: ["lcov", "html", "text"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!react-data-grid)"],
};
