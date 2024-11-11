run:
    cd calling/client; npm run build;
    cd calling; node --env-file=.env ./voice_assist_server.js

install:
    cd calling; npm install;
    cd calling/client; npm install;


