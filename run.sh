(docker network create --attachable image_server_network || true ) &&

(docker container rm image-server -f || true ) &&


docker build --rm -f "Dockerfile" -t image-server:latest .
docker run -p 3000:3000 --name=image-server --network=image_server_network image-server:latest