const ranges = require("./ranges");
const settings = require("./settings");

module.exports = {
    title: 'Beat my box',
    description: `Design music box partitions`,
    keyWords: ['gatsbyjs', 'react', 'design'],
    authorName: 'Cédric COULIOU',
    author: `@sinsedrix`,
    siteUrl: 'https://design.tool2team.org/beat-my-box',
    pathPrefix: 'beat-my-box',
    rootUrl: 'https://tool2team.org/',
    siteCover: './images/cover.jpeg',
    googleAnalyticsId: 'UA-000000000-1',
    background_color: '#eeffff',
    theme_color: '#25303B',
    display: 'minimal-ui',
    icon: 'src/assets/logo-w.png',
    ranges: ranges,
    settings: settings,
}