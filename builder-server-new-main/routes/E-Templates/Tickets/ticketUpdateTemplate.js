const ejs = require('ejs');
const path = require('path');

// Function to render the ticketing email template
const renderTicketUpdateTemplate = async (data) => {
  // Define the path to your email template file
  const templatePath = path.resolve(__dirname, 'ticketUpdateTemplate.ejs');
  try {
    // Render the email template using EJS
    const htmlContent = await ejs.renderFile(templatePath, data);
    return htmlContent;
  } catch (err) {
    console.log('EJS Render Error!', err);
    throw err;  // You can decide to throw the error or handle it differently
  }
};

module.exports = { renderTicketUpdateTemplate };
