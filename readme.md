This is a website template that runs on node (heroku). It uses Express for routing on the server and webpack for packaging and bundling assets on the client. Handlebars is used for templating. The templates are shared by the server and the client.

#### Usage:

<code>
    npm install
</code>
<div>(installs all dependencies for client and server. ie: express, handlebars, babel, less etc.)</div>
<br>
<code>
    npm run <strong>dev</strong>
</code>
<div>(runs local server with server file watch)</div>
<br>
<code>
    npm run <strong>watch</strong>
</code>
<div>(webpack, watches client js/less/hbs assets and builds with name (no version) to tmp folder)</div>
<br>
<code>
    npm run <strong>build</strong>
</code>
<div>(webpack, builds client js/less/hbs assets with name and version to public css/js folders)</div>
<br>
<code>
    git push heroku <strong>master</strong>
</code>
<div>(push master to master on heroku git, triggers production build on heroku server)</div>
<br>
<code>
    git push heroku <strong>&lt;branch&gt;:master</strong>
</code>
<div>(push &lt;branch&gt; to master on heroku git, triggers production build on heroku server)</div>
