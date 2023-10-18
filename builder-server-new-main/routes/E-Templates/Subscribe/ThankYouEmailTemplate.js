const ejs = require('ejs');
const path = require('path');

// Function to render the thank you email template
const renderThankYouEmailTemplate = async (data) => {
  // Define the path to your email template file
  const templatePath = path.resolve(__dirname, 'ThankyouEmailTemplate.ejs');

  try {
    // Render the email template using EJS
    const htmlContent = await ejs.renderFile(templatePath, data);
    return htmlContent;
  } catch (err) {
    console.log('EJS Render Error!', err);
    throw err;  // you can decide to throw the error or handle it differently
  }
};

module.exports = { renderThankYouEmailTemplate };
