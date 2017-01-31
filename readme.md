This is a website template that runs on node (heroku). It uses Express for routing on the server and webpack for packaging and bundling assets on the client. Handlebars is used for templating. The templates are shared by the server and the client.

#### Usage:

`npm install` <span>(installs all dependencies for client and server. ie: express, handlebars, babel, less etc.)</span>  
`npm run **express**` <span>(runs local server with file watch)</span>  
`npm run **dev**` <span>(webpack, watches client js/less/hbs assets with name and builds to tmp folder)</span>  
`npm run **build**` <span>(webpack, builds client js/less/hbs assets with name and version to public css/js folders)</span>  
`git push` <span>(push to bitbucket [depending on which git is set up])</span>  
`git push heroku master` <span>(push to heroku git, triggers production build on heroku server)</span>
