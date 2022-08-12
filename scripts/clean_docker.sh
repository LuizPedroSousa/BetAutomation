#!/bin/sh

rm -rf ./temp_docker.sh

echo "#!/bin/sh" > ./temp_docker.sh

chmod +x ./temp_docker.sh

containers="docker rm --force \
  $(docker ps -a -q --format '{{.ID}} \');
"
echo "${containers%???} ;" >> ./temp_docker.sh

images="docker image rm --force \
  $(docker image ls -a -q --format '{{.ID}} \');
"

echo "${images%???} ;" >> ./temp_docker.sh

volumes="docker volume rm --force \
  $(docker volume ls -q --format '{{.Name}} \');
"

echo "${volumes%???} ;" >> ./temp_docker.sh


./temp_docker.sh

rm -rf temp_docker.sh

