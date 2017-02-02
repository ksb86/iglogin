This is a website template that runs on node (heroku). It uses Express for routing on the server and webpack for packaging and bundling assets on the client. Handlebars is used for templating. The templates are shared by the server and the client.

#### Usage:

`npm install`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(installs all dependencies for client and server. ie: express, handlebars, babel, less etc.)  
`npm run **express**`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(runs local server with file watch)  
`npm run **dev**`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(webpack, watches client js/less/hbs assets with name and builds to tmp folder)  
`npm run **build**`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(webpack, builds client js/less/hbs assets with name and version to public css/js folders)  
`git push`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(push to bitbucket [depending on which git is set up])  
`git push heroku **master**`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(push to heroku git, triggers production build on heroku server)
`git push heroku **<branch>:master**`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(push <branch> to master on heroku git, triggers production build on heroku server)
