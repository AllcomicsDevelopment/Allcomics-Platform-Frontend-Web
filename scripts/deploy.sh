#!/bin/bash

APP_NAME=allcomics-front-end
STAGE_BUCKET_NAME=allcomics-web-dev
PROD_BUCKET_NAME=allcomics-web-www
IS_GITHUB=false
if [[ "$1" != "" ]]; then
    DEPLOY="$1"
else
    echo 'ERROR: Failed to supply environment name'
    exit 1
fi

if [[ "$2" != "" ]]; then
    IS_GITHUB=true
fi

# delete origin js, css files
while IFS= read -r file; do rm ${file}; done < <(find dist/${APP_NAME}/ -type f -name "*.{js|css}")
# rename gzip files to remove .gz extension
while IFS= read -r file; do mv $file ${file%.gz}; done < <(find dist/${APP_NAME}/ -type f -name "*.gz")

if [ "$IS_GITHUB" = true ] ; then
    echo 'deploy on github'
    if [ "$DEPLOY" = "stage" ] ; then
        # PROD or STAGE...
        # sync data to AWS S3
        aws s3 sync dist/${APP_NAME} s3://${STAGE_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "index.html" --exclude "*.css" --exclude "*.js" || { echo 'ERROR: s3 sync failed' ; exit 1; }
        aws s3 sync dist/${APP_NAME} s3://${STAGE_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --include "*.css" --include "*.js" --content-encoding gzip || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 cp dist/${APP_NAME}/index.html s3://${STAGE_BUCKET_NAME}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read || { echo 'ERROR: s3 cp index failed' ; exit 1; }
    else
        aws s3 sync dist/${APP_NAME} s3://${PROD_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "index.html" --exclude "*.css" --exclude "*.js" || { echo 'ERROR: s3 sync failed' ; exit 1; }
        aws s3 sync dist/${APP_NAME} s3://${PROD_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --include "*.css" --include "*.js" --content-encoding gzip || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 cp dist/${APP_NAME}/index.html s3://${PROD_BUCKET_NAME}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read || { echo 'ERROR: s3 cp index failed' ; exit 1; }
    fi
else
    echo 'deploy on local'
    if [ "$DEPLOY" = "stage" ] ; then
        # PROD or STAGE...
        # sync data to AWS S3
        aws s3 --profile comics sync dist/${APP_NAME} s3://${STAGE_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "index.html" --exclude "*.css" --exclude "*.js" || { echo 'ERROR: s3 sync failed' ; exit 1; }
        aws s3 --profile comics sync dist/${APP_NAME} s3://${STAGE_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --include "*.css" --include "*.js" --content-encoding gzip || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 --profile comics cp dist/${APP_NAME}/index.html s3://${STAGE_BUCKET_NAME}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read || { echo 'ERROR: s3 cp index failed' ; exit 1; }
    else
        aws s3 --profile comics sync dist/${APP_NAME} s3://${PROD_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "index.html" --exclude "*.css" --exclude "*.js" || { echo 'ERROR: s3 sync failed' ; exit 1; }
        aws s3 --profile comics sync dist/${APP_NAME} s3://${PROD_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --include "*.css" --include "*.js" --content-encoding gzip || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 --profile comics cp dist/${APP_NAME}/index.html s3://${PROD_BUCKET_NAME}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read || { echo 'ERROR: s3 cp index failed' ; exit 1; }
    fi
fi
