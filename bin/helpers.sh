echo "#  Loading helper functions ..."


function updateNpm
{
  echo ""
  echo ""
  echo "###############################"
  echo "###  Update dependencies    ..."
  cd $1 && npm install --ignore-script
}
function updateYarn
{
  echo ""
  echo ""
  echo "###############################"
  echo "###  Update dependencies    ..."
  cd $1 && yarn install
}


function checkVar 
{ 
  var=$1
  content=${!var}
  # echo "$var: ($content) (${content+x})"
  if [[ -z ${content} ]]; then 
    echo "$var is not set";
    exit 1;
  # else 
  #  echo "$var is set :)"; 
  fi
}

function putS3
{
  path=$1
  aws_path=$2
  bucket=$3
  filepath=$4
  filename=$5
  date=$(date +"%a, %d %b %Y %T %z")
  acl="x-amz-acl:public-read"
  content_type='application/x-compressed-tar'
  string="PUT\n\n$content_type\n$date\n$acl\n/$bucket$aws_path$filename"
  uri="https://$bucket.s3.eu-central-1.amazonaws.com$aws_path$filename"
  signature=$(echo -en "${string}" | openssl sha1 -hmac "${S3SECRET}" -binary | base64)
  curl -X PUT -T $filepath$filename \
    -H "Host: $bucket.s3.eu-central-1.amazonaws.com" \
    -H "Date: $date" \
    -H "Content-Type: $content_type" \
    -H "$acl" \
    -H "Authorization: AWS ${S3KEY}:$signature" \
    "https://$bucket.s3.eu-central-1.amazonaws.com$aws_path$filename"
}

function buildAndUploadSnippet
{
  echo ""
  echo ""
  echo "##############################################################"
  echo "#  Building ${SNIPPETNAME} ${PVERSION} ${DEPLOY_ENV} ${MYPATH}"
  cd $MYPATH/$SNIPPETNAME && yarn build-$DEPLOY_ENV


  # S3BUCKET="open-cdn"
  if [[ -z ${S3BUCKET} ]];
  then
    echo ""
    echo "##############################################################"
    echo ""
    echo "S3BUCKET not set - so we can't deploy - set it in settings.sh "
    exit 1
  else
    echo "#  Deploy to S3BUCKET:${S3BUCKET}"
  fi

  SNIPPET_PATH=$MYPATH/$SNIPPETNAME/dist/script/
  TARGET_PATH=script


  AWS_DEFAULT_REGION=$(aws s3api get-bucket-location --bucket $S3BUCKET --output text)
  # CDNURL="d32frxd94chzw3.cloudfront.net"
  # CDNURL="open-cdn.s3.eu-central-1.amazonaws.com"

  echo "#  Remove sourcemap line from $SNIPPET_PATH$FILENAME.js"
  cd $MYPATH/$SNIPPETNAME && sed -i.bak -e '/\/\/# sourceMappingURL=/ { d; }' $SNIPPET_PATH$FILENAME.js

  echo "#  fix sourcemap version in $SNIPPET_PATH$FILENAME.map"
  #cd $MYPATH/$SNIPPETNAME && sed -i.bak -e 's/"dhlsnippet.prod.[0-9].[0-9].[0-9].js"/"dhlsnippet.js"/g' $SNIPPET_PATH$FILENAME.map
  cd $MYPATH/$SNIPPETNAME && sed -i.bak -e "s/\"${FILENAME}.js\"/\"${BASEFILENAME}.js\"/g" $SNIPPET_PATH$FILENAME.js.map

  echo "#  AWS Upload - AWS_DEFAULT_REGION: $AWS_DEFAULT_REGION"
  aws s3 cp $SNIPPET_PATH$FILENAME.js s3://$S3BUCKET/$TARGET_PATH/$FILENAME.js --region $AWS_DEFAULT_REGION
  gzip < $SNIPPET_PATH$FILENAME.js > $SNIPPET_PATH$FILENAME.js.gz | aws s3 cp $SNIPPET_PATH$FILENAME.js.gz s3://$S3BUCKET/$TARGET_PATH/$FILENAME.js.gz --region $AWS_DEFAULT_REGION
  aws s3 cp $SNIPPET_PATH$FILENAME.css s3://$S3BUCKET/$TARGET_PATH/$FILENAME.css --region $AWS_DEFAULT_REGION

# REMOVE the /assets
  # https://rollbar.com/docs/source-maps/
  echo "#  Upload sourcemap: "
  echo "     $POST_SERVER_ITEM_ACCESS_TOKEN"
  echo "     https://dynamichost/assets/$BASEFILENAME.js"
  echo "     @$SNIPPET_PATH$FILENAME.js.map"
  curl https://api.rollbar.com/api/1/sourcemap \
    -F access_token=$POST_SERVER_ITEM_ACCESS_TOKEN \
    -F version=$PVERSION \
    -F minified_url=https://dynamichost/assets/$BASEFILENAME.js \
    -F source_map=@$SNIPPET_PATH$FILENAME.js.map

  echo "#  Done!"

}