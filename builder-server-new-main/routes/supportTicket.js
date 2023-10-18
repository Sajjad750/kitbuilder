const express = require('express');
const router = express.Router();
const { Ticket, validateTicket } = require('../models/supportTicket');
const { renderTicketEmailTemplate } = require('./E-Templates/Tickets/emailTemplate');
const { renderTicketUpdateTemplate } = require('./E-Templates/Tickets/ticketUpdateTemplate');
const nodemailer = require('nodemailer');

// Get a single ticket
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).send('Ticket not found.');
        res.send(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get all tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort('createdAt');
        res.send(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Create a new ticket
router.post('/', async (req, res) => {
    const { error } = validateTicket(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let ticket = new Ticket(req.body);
        ticket = await ticket.save();
        // Email Feature
        const htmlOutput = await renderTicketEmailTemplate({
            firstName: req.body.name,
            ticketTitle: req.body.title,
            ticketId: ticket._id,
            ticketDescription: req.body.description,
            ticketStatus: 'Open',
            companyName: 'Kit-builder'
          });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kitbuildert101@gmail.com',
                pass: 'juyyjeupnuvsinoa',
            },
        });
        await transporter.sendMail({
            from: 'BaronTech-KitBuilder',
            to: req.body.email,
            subject: 'Ticket Created - Support System',
            html: htmlOutput,
        });

        res.send(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update a ticket
router.put('/:id', async (req, res) => {
    const { error } = validateTicket(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        // get the ticket before update
        const oldTicket = await Ticket.findById(req.params.id);
        if (!oldTicket) return res.status(404).send('Ticket not found.');
        // update the ticket
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // compare the old and new status
        if (oldTicket.status !== ticket.status) {
            // call the email function
          // Email Feature
          const htmlOutput = await renderTicketUpdateTemplate({
            firstName: req.body.name,
            ticketTitle: req.body.title,
            ticketId: ticket._id,
            ticketDescription: req.body.description,
            ticketStatus: ticket.status,
            companyName: 'Kit-builder'
          });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kitbuildert101@gmail.com',
                pass: 'juyyjeupnuvsinoa',
            },
        });
        await transporter.sendMail({
            from: 'BaronTech-KitBuilder',
            to: req.body.email,
            subject: 'Ticket Status Updated - Support System',
            html: htmlOutput,
        });
        }

        res.send(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// Delete a ticket
router.delete('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndRemove(req.params.id);
        if (!ticket) return res.status(404).send('Ticket not found.');
        res.send(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
