#!/bin/bash -x
if ([ $TRAVIS_BRANCH == "master" ]); then npm run semantic-release; fi
yes Y | docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t settlemint/lockedtokens-dapp:${TRAVIS_BRANCH} .
docker push settlemint/lockedtokens-dapp
