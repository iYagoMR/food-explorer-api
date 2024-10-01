#!/bin/bash

# Define your Lambda function name and region
FUNCTION_NAME="food_exp_api"
ZIP_FILE="lambda-func.zip"
REGION="us-east-1"

# Remove old zip package if it exists
if [ -f $ZIP_FILE ]; then
  echo "Removing existing zip package..."
  rm $ZIP_FILE
fi

# Zip the current directory (change as needed for your Lambda structure)
echo "Zipping the Lambda function code..."
zip -r $ZIP_FILE .

# Update the Lambda function
echo "Updating Lambda function: $FUNCTION_NAME"
aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://$ZIP_FILE \
    --region $REGION

echo "Deployment complete!"