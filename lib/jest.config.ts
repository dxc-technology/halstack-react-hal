/* eslint-disable */
export default {
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  displayName: "halstack-react-hal",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../coverage/halstack-react-hal",
  testEnvironment: "jsdom",
};
