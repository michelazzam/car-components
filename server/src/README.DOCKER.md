How to run docker image ?
1-Build: `nmp run build`
2-Packaging: `pkg ./dist/main.js --targets node18-linux-x64 --output compiled/main`
3-Build the docker container: `docker build -t car-server .`
4-Start the docker image with .env : `docker run --env-file .env -p 8000:8000 car-server`
