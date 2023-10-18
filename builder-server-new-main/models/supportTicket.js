const mongoose = require('mongoose');
const Joi = require('joi');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 5
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'closed'],
        default: 'open'
    },
    url: {
        type: String,
        required: true
    },
    issueType: {
        type: String,
        enum: ['bug', 'feature_request', 'technical_issue', 'other'],
        required: true
    },
    attachments: [{
        file: {
            type: String,
            required: false
        }
    }],
    email: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    companyName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

const validateTicket = (ticket) => {
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(5).required(),
        status: Joi.string().valid('open', 'in_progress', 'closed'),
        url: Joi.string().uri().allow(''),
        issueType: Joi.string().valid('bug', 'feature_request', 'technical_issue', 'other').allow(''),
        attachments: Joi.array().items(Joi.object({ file: Joi.string().uri() })).allow(''),
        email: Joi.string().email().required(),
        name: Joi.string().min(2).max(50).required(),
        companyName: Joi.string().min(2).max(50).required()
    });

    return schema.validate(ticket);
}

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = { Ticket, validateTicket };
