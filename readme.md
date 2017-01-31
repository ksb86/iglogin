<p>
    This is a website template that runs on node (heroku). It uses Express for routing on the server and webpack for packaging and bundling assets on the client. Handlebars is used for templating. The templates are shared by the server and the client.
</p>
<br>
<br>
<h4>Usage:</h4>
<br>
<code>
    npm install
</code>
<span>(installs all dependencies for client and server. ie: express, handlebars, babel, less etc.)</span>
<br>
<code>
npm run <strong>express</strong>
    </code>
<span>(runs local server with file watch)</span>
<br>
<code>
npm run <strong>dev</strong>
    </code>
<span>(webpack, watches client js/less/hbs assets with name and builds to tmp folder)</span>
<br>
<code>
npm run <strong>build</strong>
    </code>
<span>(webpack, builds client js/less/hbs assets with name and version to public css/js folders)</span>
<br>
<code>
git push
    </code>
<span>(push to bitbucket [depending on which git is set up])</span>
<br>
<code>
git push heroku master
    </code>
<span>(push to heroku git, triggers production build on heroku server)</span>
