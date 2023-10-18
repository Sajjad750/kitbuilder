const ejs = require('ejs');
const path = require('path');

// Function to render the email template
const renderEmailTemplate = (data, recipientType) => {
  const templatePath = path.resolve(__dirname, 'emailTemplate.ejs');
  const htmlContent = ejs.renderFile(templatePath, { ...data, recipientType });
  return htmlContent;
};


module.exports = { renderEmailTemplate };
